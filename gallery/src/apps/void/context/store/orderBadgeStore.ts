import { API_URL } from "@/apps/void/constants/keys";
import Logger from "@/lib/Logger";
import { supabase } from "@/lib/supabase";
import { fetchWithTimeout } from "@/apps/void/lib/utils/fetchWithTimeout";
import { create } from "zustand";

/** One unread chat that belongs to an order. */
export type OrderChatBadge = { cid: string; unread: number };

/** One order with something unread, as the server reports it. */
export type OrderBadge = {
  orderId: string;
  /** Unread order updates (status, ETA, payment). */
  updates: number;
  /** Unread chats about this order: the store chat, the rider chat, and any
   * support thread opened about it. */
  chats: OrderChatBadge[];
};

type OrderBadgeState = {
  /** Orders with anything unread. Drives the dot on each order row. */
  orderIds: string[];
  /** Every chat with unread messages, by Stream cid (order and support). */
  cids: string[];
  /** Header badge on the Orders button: how many orders have something
   * unread. The server works this out - it is the only side that can tell
   * which support threads belong to an order. */
  count: number;
  /** Per-order detail behind the two arrays above. */
  orders: OrderBadge[];
  /** Unread chats that belong to no order (general support threads). They
   * show on Profile, not on Orders. */
  looseCids: string[];
  refresh: () => Promise<void>;
  /** Called when the user opens an order: reads its updates and all of its
   * chats, here and on the server. */
  markOrderRead: (orderId: string) => Promise<void>;
  /** Called when the user opens a chat. */
  markChatRead: (cid: string) => Promise<void>;
  /** The unread chats of one order, support threads included. */
  chatsForOrder: (orderId: string) => OrderChatBadge[];
  /** Everything unread about one order: updates plus chat messages. */
  unreadForOrder: (orderId: string) => number;
  clear: () => void;
};

// Order chats are messaging:order_<id> (with the store) and
// messaging:order_rider_<id> (with the rider), see hq-node orderChatRetention.
const ORDER_CHAT = /^messaging:order_(?:rider_)?(.+)$/;

// Which order each support thread is about. A support cid carries no order
// (it is support:support_<hex>), and only the server knows the link -
// support_conversations.order_id. Rebuilt from every refresh so the plain
// orderIdOfCid below stays true for callers that only hold a cid.
let supportOrderByCid: Record<string, string> = {};

export const orderIdOfCid = (cid: string): string | null =>
  ORDER_CHAT.exec(cid)?.[1] ?? supportOrderByCid[cid] ?? null;

/** Support threads are support:support_<hex> (hq-node supportController). */
export const isSupportCid = (cid: string): boolean => cid.startsWith("support:");

type ServerPayload = {
  count?: number;
  orders?: OrderBadge[];
  looseCids?: string[];
  orderIds?: string[];
  cids?: string[];
};

type Snapshot = Pick<
  OrderBadgeState,
  "orderIds" | "cids" | "count" | "orders" | "looseCids"
>;

const EMPTY: Snapshot = {
  orderIds: [],
  cids: [],
  count: 0,
  orders: [],
  looseCids: [],
};

function snapshot(orders: OrderBadge[], looseCids: string[]): Snapshot {
  return {
    orders,
    looseCids,
    orderIds: orders.map((order) => order.orderId),
    cids: [
      ...orders.flatMap((order) => order.chats.map((chat) => chat.cid)),
      ...looseCids,
    ],
    count: orders.length,
  };
}

/**
 * An hq-node old enough to only send orderIds/cids (an OTA can reach a device
 * before the API deploys). Support threads stay loose until it catches up.
 */
function fromLegacy(orderIds: string[], cids: string[]): Snapshot {
  const byOrder = new Map<string, OrderBadge>();
  const order = (orderId: string) => {
    let found = byOrder.get(orderId);
    if (!found) {
      found = { orderId, updates: 0, chats: [] };
      byOrder.set(orderId, found);
    }
    return found;
  };
  for (const orderId of orderIds) order(orderId);
  const loose: string[] = [];
  for (const cid of cids) {
    const orderId = ORDER_CHAT.exec(cid)?.[1];
    if (!orderId) {
      loose.push(cid);
      continue;
    }
    order(orderId).chats.push({ cid, unread: 1 });
  }
  // The old shape never said how many updates an order had, only that it was
  // in the list. An order with no chats got there on an update.
  for (const found of byOrder.values()) {
    if (found.chats.length === 0) found.updates = 1;
  }
  return snapshot([...byOrder.values()], loose);
}

function fromServer(payload: ServerPayload): Snapshot {
  if (!Array.isArray(payload.orders)) {
    supportOrderByCid = {};
    return fromLegacy(payload.orderIds ?? [], payload.cids ?? []);
  }

  const orders: OrderBadge[] = payload.orders.map((order) => ({
    orderId: order.orderId,
    updates: order.updates ?? 0,
    chats: Array.isArray(order.chats) ? order.chats : [],
  }));

  const support: Record<string, string> = {};
  for (const order of orders) {
    for (const chat of order.chats) {
      if (isSupportCid(chat.cid)) support[chat.cid] = order.orderId;
    }
  }
  supportOrderByCid = support;

  const next = snapshot(orders, payload.looseCids ?? []);
  // The server counts orders; trust it over anything derived here.
  return { ...next, count: payload.count ?? next.count };
}

async function authHeaders(): Promise<Record<string, string> | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) return null;
  return { Authorization: `Bearer ${session.access_token}` };
}

async function post(body: { orderId: string } | { cid: string }) {
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
  } catch (err) {
    Logger.log("[OrderBadge] mark read failed", err);
  }
}

/**
 * Unread order updates, for the header badge and the dot on an order row
 * (TAK-1179). One store so opening an order clears both at once.
 */
export const useOrderBadgeStore = create<OrderBadgeState>((set, get) => ({
  ...EMPTY,

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
      set(fromServer((await res.json()) as ServerPayload));
    } catch (err) {
      Logger.log("[OrderBadge] refresh failed", err);
    }
  },

  markOrderRead: async (orderId) => {
    // Always tell the server, even when this screen shows nothing unread for
    // the order: on a cold launch from a push the badges have not loaded yet,
    // and the POST is the only thing that clears them. The server resolves
    // the order's chats itself, support threads included.
    const { orders, looseCids } = get();
    if (orders.some((order) => order.orderId === orderId)) {
      set(
        snapshot(
          orders.filter((order) => order.orderId !== orderId),
          looseCids,
        ),
      );
    }
    await post({ orderId });
    await get().refresh();
  },

  markChatRead: async (cid) => {
    const { orders, looseCids } = get();
    if (get().cids.includes(cid)) {
      const nextOrders = orders
        .map((order) => ({
          ...order,
          chats: order.chats.filter((chat) => chat.cid !== cid),
        }))
        .filter((order) => order.updates > 0 || order.chats.length > 0);
      set(
        snapshot(
          nextOrders,
          looseCids.filter((loose) => loose !== cid),
        ),
      );
    }
    await post({ cid });
    await get().refresh();
  },

  chatsForOrder: (orderId) =>
    get().orders.find((order) => order.orderId === orderId)?.chats ?? [],

  unreadForOrder: (orderId) => {
    const order = get().orders.find((o) => o.orderId === orderId);
    if (!order) return 0;
    return (
      order.updates +
      order.chats.reduce((total, chat) => total + chat.unread, 0)
    );
  },

  clear: () => {
    supportOrderByCid = {};
    set(EMPTY);
  },
}));

// Badges belong to one signed-in person. Left alone they would follow the
// next account into the header.
supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") useOrderBadgeStore.getState().clear();
});
