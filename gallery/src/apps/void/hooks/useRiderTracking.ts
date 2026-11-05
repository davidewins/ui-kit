import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";

export interface RiderLocation {
  lat: number;
  lng: number;
  heading: number | null;
  speed: number | null;
  accuracy: number | null;
  ts: number;
}

export interface EtaUpdate {
  etaSeconds: number;
  estimatedDeliveryAt: string;
  ts: number;
}

/**
 * Subscribe to live rider location via Supabase Realtime Broadcast.
 * Channel: rider-location:{riderId}
 *
 * Returns null until the first ping arrives. Automatically unsubscribes
 * when riderId becomes null (order status leaves rider_assigned/picked_up).
 */
export function useRiderLocation(
  riderId: string | null | undefined,
): RiderLocation | null {
  const [location, setLocation] = useState<RiderLocation | null>(null);

  useEffect(() => {
    if (!riderId) {
      setLocation(null);
      return;
    }

    const channel = supabase
      .channel(`rider-location:${riderId}`)
      .on("broadcast", { event: "location" }, ({ payload }) => {
        setLocation(payload as RiderLocation);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [riderId]);

  return location;
}

/**
 * Subscribe to ETA updates via Supabase Realtime Broadcast.
 * Channel: order-eta:{orderId}
 *
 * Server recalculates every 60s from the rider's current GPS position
 * and broadcasts when the ETA shifts by more than 2 minutes.
 *
 * Initialises from `initialEstimatedDeliveryAt` so there's always
 * something to display before the first broadcast arrives.
 */
export function useOrderEta(
  orderId: string | undefined,
  initialEstimatedDeliveryAt: string | null | undefined,
): {
  etaSeconds: number | null;
  estimatedDeliveryAt: string | null;
  etaMinutes: number | null;
  formattedEta: string | null;
} {
  const [etaState, setEtaState] = useState<{
    etaSeconds: number | null;
    estimatedDeliveryAt: string | null;
  }>(() => {
    if (!initialEstimatedDeliveryAt) return { etaSeconds: null, estimatedDeliveryAt: null };
    const secs = Math.max(0, Math.round((new Date(initialEstimatedDeliveryAt).getTime() - Date.now()) / 1000));
    return { etaSeconds: secs, estimatedDeliveryAt: initialEstimatedDeliveryAt };
  });

  // Sync initial value when the order data first loads
  useEffect(() => {
    if (!initialEstimatedDeliveryAt || etaState.estimatedDeliveryAt) return;
    const secs = Math.max(0, Math.round((new Date(initialEstimatedDeliveryAt).getTime() - Date.now()) / 1000));
    setEtaState({ etaSeconds: secs, estimatedDeliveryAt: initialEstimatedDeliveryAt });
  }, [initialEstimatedDeliveryAt]);

  // Subscribe to server-pushed ETA updates
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-eta:${orderId}`)
      .on("broadcast", { event: "eta_update" }, ({ payload }) => {
        const update = payload as EtaUpdate;
        setEtaState({
          etaSeconds: update.etaSeconds,
          estimatedDeliveryAt: update.estimatedDeliveryAt,
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const derived = useMemo(() => {
    if (!etaState.estimatedDeliveryAt) {
      return { etaMinutes: null, formattedEta: null };
    }

    const deliveryDate = new Date(etaState.estimatedDeliveryAt);
    const minutesRemaining = Math.max(
      0,
      Math.round((deliveryDate.getTime() - Date.now()) / 60_000),
    );

    const formattedEta = deliveryDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    return { etaMinutes: minutesRemaining, formattedEta };
  }, [etaState.estimatedDeliveryAt]);

  return {
    etaSeconds: etaState.etaSeconds,
    estimatedDeliveryAt: etaState.estimatedDeliveryAt,
    ...derived,
  };
}
