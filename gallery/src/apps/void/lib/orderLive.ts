import { API_URL } from "@/apps/void/constants/keys";
import { supabase } from "@/lib/supabase";
import { fetchWithTimeout } from "@/apps/void/lib/utils/fetchWithTimeout";

export type OrderLive = {
  orderId: string;
  status: string | null;
  storeName: string | null;
  estimatedDeliveryAt: string | null;
  readyAt: string | null;
  rider: {
    id: string;
    firstName: string | null;
    position: { lat: number; lng: number; updatedAt: string | null } | null;
  } | null;
  customer: { firstName: string | null };
};

/** The store, ETA and the rider's last known position for one of the
 * signed-in customer's orders (hq-node GET /video/order-live, TAK-1175). */
export async function fetchOrderLive(orderId: string): Promise<OrderLive> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("No auth token available");

  const response = await fetchWithTimeout(
    `${API_URL}/video/order-live/${orderId}`,
    { headers: { Authorization: `Bearer ${session.access_token}` } },
    10000,
  );
  if (!response.ok) throw new Error(`Order lookup failed: ${response.status}`);
  return response.json();
}
