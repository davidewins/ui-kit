import { fetchWithTimeout } from "@/apps/riders/lib/utils/fetchWithTimeout";
import { API_URL } from "@/apps/riders/constants/keys";
import Logger from "@/lib/Logger";
import { supabase } from "@/lib/supabase";
import { useCallback, useState } from "react";

/**
 * Hook to start a chat with another platform user (customer, storefront, or
 * support). Ported from VOID - same backend endpoints (`/chat/channel`),
 * same deterministic-channel-id scheme, so channels started here interop
 * with the customer's VOID chat.
 *
 * A storefront isn't a real Supabase auth user, so its Stream user id is
 * prefixed `storefront_${id}` (matches hq-node's chatController). A real
 * user (customer, rider) uses their raw Supabase user id.
 */
export function useStartChat() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startChannel = useCallback(
    async (
      otherUserId: string,
      name: string,
      image?: string,
    ): Promise<string | null> => {
      setIsCreating(true);
      setError(null);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!user || !session) {
          throw new Error("Not authenticated");
        }

        const sortedIds = [user.id, otherUserId].sort();
        const channelId = `dm_${sortedIds[0]}_${sortedIds[1]}`.substring(0, 64);

        const response = await fetchWithTimeout(`${API_URL}/chat/channel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            channelId,
            members: [user.id, otherUserId],
            name,
            storefrontImage: image,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to create chat channel");
        }

        return `messaging:${channelId}`;
      } catch (err) {
        Logger.error("Failed to start chat:", err);
        setError(err instanceof Error ? err.message : "Failed to start chat");
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  const startChatWithCustomer = useCallback(
    (customerId: string, customerName: string) =>
      startChannel(customerId, customerName),
    [startChannel],
  );

  const startChatWithStorefront = useCallback(
    (storefrontId: string, storefrontName: string, storefrontImage?: string) =>
      startChannel(`storefront_${storefrontId}`, storefrontName, storefrontImage),
    [startChannel],
  );

  return {
    startChatWithCustomer,
    startChatWithStorefront,
    isCreating,
    error,
  };
}
