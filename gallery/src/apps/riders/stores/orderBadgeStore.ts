import { API_URL } from "@/apps/riders/constants/keys";
import Logger from "@/lib/Logger";
import { supabase } from "@/lib/supabase";
import { fetchWithTimeout } from "@/apps/riders/lib/utils/fetchWithTimeout";
import { create } from "zustand";

type OrderBadgeState = {
  /** Orders with unread updates. */
  orderIds: string[];
  /** Chats with unread messages, by Stream cid. */
  cids: string[];
  count: number;
  refresh: () => Promise<void>;
  /** Called when the user opens an order - clears its badge here and on the
   * server. */
  markOrderRead: (orderId: string) => Promise<void>;
  /** Called when the user opens a chat. */
  markChatRead: (cid: string) => Promise<void>;
  clear: () => void;
};

async function authHeaders(): Promise<Record<string, string> | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) return null;
  return { Authorization: `Bearer ${session.access_token}` };
}

async function post(
  body: { orderId: string } | { cid: string },
  refresh: () => Promise<void>,
) {
  try {
    const headers = await authHeaders();
    if (!headers) return;
    await fetchWithTimeout(
      `${API_URL}/api/notifications/read-order`,
      {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      8000,
    );
    await refresh();
  } catch (err) {
    Logger.log("[OrderBadge] mark read failed", err);
  }
}

/**
 * Unread updates about the rider's jobs, for the header badge (TAK-1179).
 * Cleared when the rider opens that job.
 */
export const useOrderBadgeStore = create<OrderBadgeState>((set, get) => ({
  orderIds: [],
  cids: [],
  count: 0,

  refresh: async () => {
    try {
      const headers = await authHeaders();
      if (!headers) return;
      const res = await fetchWithTimeout(
        `${API_URL}/api/notifications/unread-orders`,
        { headers },
        8000,
      );
      if (!res.ok) return;
      const data = (await res.json()) as {
        count: number;
        orderIds: string[];
        cids?: string[];
      };
      set({
        count: data.count ?? 0,
        orderIds: data.orderIds ?? [],
        cids: data.cids ?? [],
      });
    } catch (err) {
      Logger.log("[OrderBadge] refresh failed", err);
    }
  },

  markOrderRead: async (orderId) => {
    if (!get().orderIds.includes(orderId)) return;
    // Clear on screen first; the server call is the slow part.
    set({
      orderIds: get().orderIds.filter((id) => id !== orderId),
      count: Math.max(0, get().count - 1),
    });
    await post({ orderId }, get().refresh);
  },

  markChatRead: async (cid) => {
    if (!get().cids.includes(cid)) return;
    set({
      cids: get().cids.filter((c) => c !== cid),
      count: Math.max(0, get().count - 1),
    });
    await post({ cid }, get().refresh);
  },

  clear: () => set({ orderIds: [], cids: [], count: 0 }),
}));
