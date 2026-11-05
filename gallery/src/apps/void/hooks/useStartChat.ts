import { API_URL } from "@/apps/void/constants/keys";
import Logger from "@/lib/Logger";
import { supabase } from "@/lib/supabase";
import { fetchWithTimeout } from "@/apps/void/lib/utils/fetchWithTimeout";
import { useCallback, useState } from "react";

/**
 * Hook to start a chat with a storefront
 * 
 * Creates or retrieves an existing channel between the customer and the storefront.
 * Uses the backend API to create channels - does NOT require being inside ChatContext.
 * The storefront's Stream Chat user ID is `storefront_${storefrontId}`.
 */
export function useStartChat() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Start or continue a chat with a storefront
   * @param storefrontId - The storefront ID
   * @param storefrontName - The storefront name (used for channel name)
   * @param storefrontImage - The storefront logo URL (optional)
   * @returns The channel CID to navigate to
   */
  const startChatWithStorefront = useCallback(async (
    storefrontId: string,
    storefrontName: string,
    storefrontImage?: string
  ): Promise<string | null> => {
    setIsCreating(true);
    setError(null);

    try {
      // Get current user and session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!user || !session) {
        throw new Error("Not authenticated");
      }

      // The storefront's Stream Chat user ID
      const storefrontStreamId = `storefront_${storefrontId}`;

      // Create a deterministic channel ID so we always get the same channel
      // Sort IDs to ensure consistent ordering regardless of who initiates
      const sortedIds = [user.id, storefrontStreamId].sort();
      const channelId = `dm_${sortedIds[0]}_${sortedIds[1]}`.substring(0, 64);

      Logger.log(`[Chat] POST ${API_URL}/chat/channel`, { channelId, members: [user.id, storefrontStreamId], storefrontName });
      const response = await fetchWithTimeout(
        `${API_URL}/chat/channel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            channelId,
            members: [user.id, storefrontStreamId],
            name: storefrontName,
            storefrontImage,
          }),
        },
        10000,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        Logger.error(`[Chat] ${response.status} error:`, errorData);
        throw new Error(errorData.error || "Failed to create chat channel");
      }

      Logger.log(`[Chat] Channel ready: messaging:${channelId}`);
      return `messaging:${channelId}`;
    } catch (err) {
      Logger.error("Failed to start chat:", err);
      setError(err instanceof Error ? err.message : "Failed to start chat");
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  /**
   * Start or continue a chat for an order
   * Creates a channel between customer and the storefront from the order
   * @param orderId - The order ID
   * @param storefrontId - The storefront ID
   * @param storefrontName - The storefront name
   * @param storefrontImage - The storefront logo URL (optional)
   * @returns The channel CID to navigate to
   */
  const startChatForOrder = useCallback(async (
    orderId: string,
    storefrontId: string,
    storefrontName: string,
    storefrontImage?: string
  ): Promise<string | null> => {
    // For now, just use the same channel as regular storefront chat
    // Could be extended to include order context in the channel
    return startChatWithStorefront(storefrontId, storefrontName, storefrontImage);
  }, [startChatWithStorefront]);

  const startChatWithRider = useCallback(
    async (orderId: string): Promise<string | null> => {
      setIsCreating(true);
      setError(null);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        const response = await fetchWithTimeout(
          `${API_URL}/chat/rider-channel`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ orderId }),
          },
          10000,
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to create chat channel");
        }
        const data = (await response.json()) as { cid?: string };
        if (!data.cid) throw new Error("Chat channel response was invalid");
        return data.cid;
      } catch (err) {
        Logger.error("Failed to start rider chat:", err);
        setError(err instanceof Error ? err.message : "Failed to start chat");
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [],
  );

  return {
    startChatWithStorefront,
    startChatForOrder,
    startChatWithRider,
    isCreating,
    error,
  };
}
