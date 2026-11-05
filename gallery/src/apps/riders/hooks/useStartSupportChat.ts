import { fetchWithTimeout } from "@/apps/riders/lib/utils/fetchWithTimeout";
import { API_URL } from "@/apps/riders/constants/keys";
import Logger from "@/lib/Logger";
import { supabase } from "@/lib/supabase";
import { useCallback, useState } from "react";

type SupportCategory =
  | "order_issue"
  | "general"
  | "setup_help"
  | "bug_report"
  | "account";

/**
 * Opens a Stream support channel via hq-node (same endpoint VOID uses).
 * Navigates to `support:${channel_id}` - never WhatsApp, never a phone number.
 */
export function useStartSupportChat() {
  const [isStarting, setIsStarting] = useState(false);

  const startSupportChat = useCallback(
    async (opts?: {
      category?: SupportCategory;
      subject?: string;
      orderId?: string;
    }): Promise<string | null> => {
      setIsStarting(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) throw new Error("Not authenticated");

        const res = await fetchWithTimeout(`${API_URL}/support/conversations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            category: opts?.category ?? "general",
            subject: opts?.subject ?? "Support request",
            orderId: opts?.orderId,
            app: "rider",
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Support chat failed (${res.status})`);
        }

        const conversation = await res.json();
        if (!conversation?.channel_id) {
          throw new Error("No channel returned");
        }
        return `support:${conversation.channel_id}`;
      } catch (err) {
        Logger.error("[Support] Failed to start chat:", err);
        return null;
      } finally {
        setIsStarting(false);
      }
    },
    [],
  );

  return { startSupportChat, isStarting };
}
