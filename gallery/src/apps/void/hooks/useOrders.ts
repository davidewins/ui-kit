import { API_URL } from "@/apps/void/constants/keys";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { supabase } from "@/lib/supabase";
import { fetchWithTimeout } from "@/apps/void/lib/utils/fetchWithTimeout";
import { isTerminalStatus } from "@/apps/void/lib/utils/orderHelpers";

export interface OrderListItem {
  id: string;
  status: string;
  /** The parent order's own status, before /api/orders swapped the store's in
   * (see resolveOrderStatus). The two disagree more often than not. */
  parent_status?: string;
  fulfillment_type: string;
  created_at: string;
  vendor_orders: {
    id: string;
    display_id: string;
    status: string;
    subtotal: number;
    vendor_storefronts: {
      name: string;
      logo_path: string | null;
    };
    vendor_locations: {
      address: string;
      city: string;
    };
    order_items: {
      product_name: string;
      quantity: number;
    }[];
  }[];
}

// "refunded" and "stalled" are both orders that are over and that the
// customer may well want again, so both offer a reorder.
export const REORDERABLE_STATUSES = new Set([
  "delivered",
  "completed",
  "picked_up",
  "cancelled",
  "vendor_declined",
  "refunded",
  "stalled",
]);

type StatusFields = Pick<
  OrderListItem,
  "status" | "parent_status" | "fulfillment_type" | "created_at"
>;

/**
 * Nothing is still in flight the next day. Twelve hours clears the longest
 * real delivery, including one placed late and prepared the next morning,
 * without letting a week-old order keep claiming a rider is on the way.
 */
const STALE_AFTER_MS = 12 * 60 * 60 * 1000;

/**
 * /api/orders returns the store's own status as `status` and the parent
 * order's as `parent_status`, because the store's row leads through the live
 * part of an order. That row stops being written once the rider takes over,
 * so a parent that has reached an outcome outranks it. Without this, every
 * refunded order reads "Delivered" and an order the rider completed reads
 * "Out for Delivery" for ever.
 */
function preferFinalParentStatus(order: StatusFields): string {
  const parent = order.parent_status;
  if (!parent || parent === order.status) return order.status;
  if (!isTerminalStatus(parent, order.fulfillment_type)) return order.status;
  // "vendor_declined" is the parent's "cancelled" said precisely, not a
  // contradiction of it, so the store's word stands.
  if (parent === "cancelled" && order.status === "vendor_declined") {
    return order.status;
  }
  return parent;
}

/**
 * The status the app shows for an order: the reconciled one, unless it is
 * still an in-flight status long after the order was placed. An order that
 * stopped moving days ago is not out for delivery, and saying so is a lie to
 * the customer whichever side dropped it.
 */
export function resolveOrderStatus(
  order: StatusFields,
  now: number = Date.now(),
): string {
  const status = preferFinalParentStatus(order);
  if (isTerminalStatus(status, order.fulfillment_type)) return status;
  const placedAt = new Date(order.created_at).getTime();
  return now - placedAt > STALE_AFTER_MS ? "stalled" : status;
}

export const useOrders = () =>
  useSafeQuery({
    name: "ordersList",
    queryKey: ["orders"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      const response = await fetchWithTimeout(
        `${API_URL}/api/orders`,
        { headers: { Authorization: `Bearer ${session.access_token}` } },
        10000,
      );

      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      const orders = (data.orders ?? []) as OrderListItem[];
      // Resolved once, here, so every screen reading this list agrees.
      return orders.map((order) => ({
        ...order,
        status: resolveOrderStatus(order),
      }));
    },
    requiresAuth: true,
  });
