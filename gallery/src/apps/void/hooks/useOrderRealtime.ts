import Logger from "@/lib/Logger";
import { supabase } from "@/lib/supabase";
import type { OrderResponse } from "@/apps/void/types/order";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Hook to subscribe to real-time order updates for a specific order
 * Updates the React Query cache when the order status changes
 */
export function useOrderRealtime(orderId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!orderId) return;

    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      // Subscribe to changes on the orders table for this specific order
      channel = supabase
        .channel(`order-updates-${orderId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `id=eq.${orderId}`,
          },
          (payload) => {
            Logger.log("📡 Order updated via realtime:", payload.new);

            // Patch the flat OrderResponse in the cache immediately so the UI
            // transitions (e.g. static card → RiderTrackingCard) without waiting
            // for the refetch. The invalidate below then fills in joined data.
            queryClient.setQueryData(["order", orderId], (oldData: OrderResponse | undefined) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                ...payload.new,
                // Preserve joined/computed fields not present in the raw DB row
                vendor_orders: oldData.vendor_orders ?? [],
                rider: oldData.rider,
                dropoff_location: oldData.dropoff_location,
              };
            });

            // Refetch to pull in complete joined data (rider name, etc.)
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "vendor_orders",
            filter: `parent_order_id=eq.${orderId}`,
          },
          (payload) => {
            Logger.log("📡 Vendor order updated via realtime:", payload.new);

            // Invalidate to fetch fresh data with updated vendor_order
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
          },
        )
        .subscribe((status) => {
          Logger.log(
            `📡 Realtime subscription status for order ${orderId}:`,
            status,
          );
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        Logger.log(
          `📡 Cleaning up realtime subscription for order ${orderId}`,
        );
        supabase.removeChannel(channel);
      }
    };
  }, [orderId, queryClient]);
}

/**
 * Hook to subscribe to real-time updates for all orders belonging to a user
 * Updates the React Query cache when any order status changes
 */
export function useOrdersListRealtime(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      channel = supabase
        .channel(`user-orders-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*", // Listen for INSERT, UPDATE, DELETE
            schema: "public",
            table: "orders",
            filter: `customer_id=eq.${userId}`,
          },
          (payload) => {
            Logger.log(
              "📡 Orders list updated via realtime:",
              payload.eventType,
              payload.new,
            );

            // Invalidate the orders list to trigger refetch
            queryClient.invalidateQueries({ queryKey: ["orders"] });

            // If it's an update to a specific order, also update that query
            if (payload.eventType === "UPDATE" && payload.new?.id) {
              queryClient.invalidateQueries({
                queryKey: ["order", payload.new.id],
              });
            }
          },
        )
        .subscribe((status) => {
          Logger.log(
            `📡 Realtime subscription status for user orders:`,
            status,
          );
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        Logger.log(`📡 Cleaning up realtime subscription for user orders`);
        supabase.removeChannel(channel);
      }
    };
  }, [userId, queryClient]);
}

/**
 * Hook to get the current user ID from Supabase session
 * Useful for setting up user-scoped realtime subscriptions
 */
export function useCurrentUserId(): string | undefined {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id);
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return userId;
}
