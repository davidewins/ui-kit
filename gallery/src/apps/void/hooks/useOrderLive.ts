import Logger from "@/lib/Logger";
import { fetchOrderLive, type OrderLive } from "@/apps/void/lib/orderLive";
import { useEffect, useState } from "react";

/**
 * The server's view of a live order: store, ETA, and the rider's last known
 * position (TAK-1178). Realtime only carries pings from now on, so without
 * this a screen opened between pings has nothing to draw.
 */
export function useOrderLive(orderId: string | undefined): OrderLive | null {
  const [live, setLive] = useState<OrderLive | null>(null);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    fetchOrderLive(orderId)
      .then((data) => !cancelled && setLive(data))
      .catch((err) => Logger.log("[OrderLive] fetch failed", err));
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return live;
}
