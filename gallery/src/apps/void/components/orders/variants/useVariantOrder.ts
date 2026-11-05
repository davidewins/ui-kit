// One data model for all three order-screen variants.
//
// This does NOT fork the data layer. It calls the same hooks the shipped order
// screen calls, with the same query name and the same query key, so React Query
// serves both screens from one cache entry and one realtime subscription: open
// a variant and it shows the same real order, the same items, the same rider.
//
// What it adds is the derivation the variants would otherwise each repeat:
// money, the chat list, the narrative, what the map can draw, and the one
// primary action for the current state.
import { API_URL, GOOGLE_MAPS_DIRECTIONS_BASE } from "@/apps/void/constants/keys";
import { useRiderCall } from "@/apps/void/context/VideoCallWrapper";
import { useLocation } from "@/apps/void/context/LocationProvider";
import { useOrderBadgeStore } from "@/apps/void/context/store/orderBadgeStore";
import { useOrderLive } from "@/apps/void/hooks/useOrderLive";
import { useOrderRealtime } from "@/apps/void/hooks/useOrderRealtime";
import { useOrderEta, useRiderLocation } from "@/apps/void/hooks/useRiderTracking";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { useStartChat } from "@/apps/void/hooks/useStartChat";
import { useUnreadChats } from "@/apps/void/hooks/useUnreadChats";
import { supabase } from "@/lib/supabase";
import { fetchWithTimeout } from "@/apps/void/lib/utils/fetchWithTimeout";
import { formatOrderDate } from "@/apps/void/lib/utils/orderHelpers";
import type { LatLng } from "@/apps/void/types/geo";
import type { OrderItemResponse, OrderResponse } from "@/apps/void/types/order";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import {
  describeOrder,
  LIVE_RIDER_STATUSES,
  RIDER_HAS_ORDER_STATUSES,
  TERMINAL_STATUSES,
  type OrderNarrative,
} from "./orderNarrative";

/** A rider ping older than this is history, not a live position. */
const STALE_LOCATION_MS = 3 * 60_000;
const CANCELLABLE_STATUSES = ["order_placed", "vendor_accepted", "preparing"];

export interface VariantChat {
  cid: string;
  label: string;
  unread: number;
}

export interface VariantPrintLine {
  label: string;
  /** Local time the beat actually happened, when the API records it. */
  time: string | null;
  state: "done" | "current" | "todo";
}

export interface VariantOrderModel {
  id: string;
  order: OrderResponse | null;
  isLoading: boolean;
  error: Error | null;
  isRefetching: boolean;
  refetch: () => void;

  displayId: string | null;
  storeName: string | null;
  storeAddress: string | null;
  placedAt: string;
  items: OrderItemResponse[];
  itemCount: number;
  money: {
    subtotal: number;
    delivery: number;
    service: number;
    tip: number;
    discount: number;
    total: number;
    promoCode: string | null;
  };

  narrative: OrderNarrative;
  printLines: VariantPrintLine[];
  isPickup: boolean;
  isDone: boolean;
  deliveryAddress: string | null;
  deliveryInstructions: string | null;
  riderName: string | null;

  /** Everything the map needs. `canShow` false means do not render a map at all. */
  map: {
    canShow: boolean;
    store: LatLng | null;
    dropoff: LatLng | null;
    user: LatLng | null;
    rider: LatLng | null;
    riderIsStale: boolean;
    /** [lng, lat] pairs to route through. Empty means draw pins only. */
    waypoints: [number, number][];
  };

  chats: VariantChat[];
  unreadTotal: number;

  primaryLabel: string;
  /** So a screen can tell when the primary duplicates a Conversations row. */
  primaryKind: string;
  runPrimary: () => void;
  primaryBusy: boolean;

  canCancel: boolean;
  cancelling: boolean;
  cancel: () => void;

  canCallRider: boolean;
  callingRider: boolean;
  callRider: () => void;

  canGetDirections: boolean;
  openDirections: () => void;
  openHelp: () => void;
  openChat: (cid: string) => void;
}

/** The store row has no deterministic cid; this marks it for the UI. */
export const STORE_CHAT_ROW = "store-chat";

export function useVariantOrder(id: string): VariantOrderModel {
  const markOrderRead = useOrderBadgeStore((s) => s.markOrderRead);
  useEffect(() => {
    if (id) markOrderRead(id);
  }, [id, markOrderRead]);

  const { location: userLocation } = useLocation();
  const unreadChats = useUnreadChats();
  const {
    startChatWithRider,
    startChatWithStorefront,
    isCreating: isChatCreating,
  } = useStartChat();
  const { startRiderCall, starting: isCallingRider } = useRiderCall();
  const [cancelling, setCancelling] = useState(false);

  // Identical to the shipped order screen: same name, same key, same fetch.
  const {
    data: order,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useSafeQuery({
    name: "orderDetails",
    queryKey: ["order", id],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      const response = await fetchWithTimeout(
        `${API_URL}/api/orders/${id}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } },
        10000,
      );

      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch order");
      const data = await response.json();
      return data.order as OrderResponse;
    },
    requiresAuth: true,
    enabled: !!id,
  });

  useOrderRealtime(id);

  const status = order?.status ?? "";
  const isPickup = order?.fulfillment_type === "pickup";
  const isDone = !!order && TERMINAL_STATUSES.has(status);
  const hasLiveRider =
    !!order?.rider_id &&
    order.fulfillment_type === "platform_delivery" &&
    LIVE_RIDER_STATUSES.has(status);

  // A live order re-derives its arrival window and its rider freshness on a
  // slow tick, so a stale ETA collapses to "any minute" without a new ping.
  // It keeps ticking through `delivered` as well, because the 30 minute window
  // in which the rider is still callable is read off this clock.
  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    if (!order || (isDone && status !== "delivered")) return;
    const timer = setInterval(() => setTick(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, [order, isDone, status]);

  // Live position: the realtime ping when one has landed, otherwise the
  // server's last known position so an order opened between pings still draws.
  const ping = useRiderLocation(hasLiveRider ? order?.rider_id : null);
  const live = useOrderLive(hasLiveRider ? order?.id : undefined);
  const { estimatedDeliveryAt: liveEta } = useOrderEta(
    !isDone && !isPickup ? order?.id : undefined,
    order?.estimated_delivery_at,
  );

  const vendorOrder = order?.vendor_orders?.[0];
  const vendorLocation = vendorOrder?.vendor_locations;
  const storefront = vendorOrder?.vendor_storefronts;

  const seeded = live?.rider?.position;
  const riderPing = ping
    ? { lat: ping.lat, lng: ping.lng, at: ping.ts }
    : seeded
      ? {
          lat: seeded.lat,
          lng: seeded.lng,
          at: seeded.updatedAt ? new Date(seeded.updatedAt).getTime() : null,
        }
      : null;
  const riderIsStale =
    !!riderPing?.at && tick - riderPing.at > STALE_LOCATION_MS;

  const vendorOrders = useMemo(() => order?.vendor_orders ?? [], [order]);
  const items = useMemo(
    () => vendorOrders.flatMap((vo) => vo.order_items ?? []),
    [vendorOrders],
  );
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const subtotal = useMemo(
    () => vendorOrders.reduce((sum, vo) => sum + (vo.subtotal ?? 0), 0),
    [vendorOrders],
  );

  // Platform delivery is charged on the order (the rider is ours); a vendor's
  // own delivery is charged on their vendor_order.
  const delivery =
    order?.fulfillment_type === "platform_delivery"
      ? (order?.delivery_fee ?? 0)
      : (vendorOrder?.vendor_delivery_fee ?? 0);
  const service = order?.service_fee ?? 0;
  const tip = order?.rider_tip ?? 0;
  const discount = order?.discount_amount_cents ?? 0;
  const total =
    order?.total_paid ?? subtotal + delivery + service + tip - discount;

  const narrative = useMemo(
    () =>
      describeOrder({
        status,
        fulfillmentType: order?.fulfillment_type ?? "",
        storeName: storefront?.name ?? null,
        riderName: order?.rider?.name ?? null,
        estimatedDeliveryAt: liveEta ?? order?.estimated_delivery_at ?? null,
        deliveredAt: order?.delivered_at ?? null,
        prepTime: vendorOrder?.prep_time ?? null,
        now: tick,
      }),
    [status, order, storefront, liveEta, vendorOrder, tick],
  );

  // The docket's print log. A beat only shows a time when the API actually
  // records one; the rest print as a beat with no time rather than a guess.
  const printLines = useMemo<VariantPrintLine[]>(() => {
    const times: (string | null)[] = [
      order?.created_at ?? null,
      vendorOrder?.accepted_at ?? null,
      null,
      order?.delivered_at ?? null,
    ];
    return narrative.steps.map((label, i) => {
      const state: VariantPrintLine["state"] =
        narrative.stepIndex < 0
          ? i === 0
            ? "done"
            : "todo"
          : i < narrative.stepIndex
            ? "done"
            : i === narrative.stepIndex
              ? "current"
              : "todo";
      const at = times[i];
      return {
        label,
        time:
          at && state !== "todo"
            ? new Date(at).toLocaleTimeString("en-IE", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null,
        state,
      };
    });
  }, [narrative, order, vendorOrder]);

  // Memoised because the map's route effect keys off these: a fresh object on
  // every render would re-derive the waypoints on every render too.
  const storeLat = vendorLocation?.latitude ?? null;
  const storeLng = vendorLocation?.longitude ?? null;
  const store = useMemo<LatLng | null>(
    () =>
      storeLat != null && storeLng != null
        ? { latitude: storeLat, longitude: storeLng }
        : null,
    [storeLat, storeLng],
  );
  const dropoff = order?.dropoff_location?.location ?? null;
  const riderLat = riderPing?.lat ?? null;
  const riderLng = riderPing?.lng ?? null;
  const rider = useMemo<LatLng | null>(
    () =>
      riderLat != null && riderLng != null
        ? { latitude: riderLat, longitude: riderLng }
        : null,
    [riderLat, riderLng],
  );

  // Pickup routes the customer to the store. Delivery routes the rider to the
  // door, through the store while the rider is still collecting. With no ping
  // yet, the store-to-door leg still draws, so the map is never one lonely dot.
  const waypoints = useMemo<[number, number][]>(() => {
    const pair = (p: LatLng): [number, number] => [p.longitude, p.latitude];
    if (isPickup) {
      return store && userLocation ? [pair(userLocation), pair(store)] : [];
    }
    if (!dropoff) return [];
    if (rider) {
      return RIDER_HAS_ORDER_STATUSES.has(status) || !store
        ? [pair(rider), pair(dropoff)]
        : [pair(rider), pair(store), pair(dropoff)];
    }
    return store ? [pair(store), pair(dropoff)] : [];
  }, [isPickup, store, dropoff, rider, userLocation, status]);

  // A finished order does not need directions or a live map; a pickup order
  // does as long as it is live. Delivery needs at least a door to point at.
  const mapCanShow = isPickup
    ? !isDone && !!store
    : !isDone && (!!dropoff || !!store);

  // Sentinel for the store row, which has no deterministic channel id.
  const unreadCids = useMemo(
    () => new Set(unreadChats.cidsForOrder(id ?? "")),
    [unreadChats, id],
  );
  const chats = useMemo<VariantChat[]>(() => {
    const rows: { cid: string; label: string }[] = [];
    if (order?.rider_id) {
      rows.push({
        cid: `messaging:order_rider_${id}`,
        label: `Message ${order.rider?.name ?? "your rider"}`,
      });
    }
    // No constructed cid: the store thread is a DM created on demand, so this
    // row routes through openStoreChat rather than a guessed channel id.
    rows.push({ cid: STORE_CHAT_ROW, label: "Message the store" });
    return rows.map((row) => ({
      ...row,
      unread: unreadCids.has(row.cid) ? 1 : 0,
    }));
  }, [order, id, unreadCids]);
  const unreadTotal = chats.reduce((sum, chat) => sum + chat.unread, 0);



  const openHelp = useCallback(() => {
    router.push(`/void/(protected)/orders/${id}/support` as never);
  }, [id]);

  const openDirections = useCallback(() => {
    if (!store) return;
    Linking.openURL(
      `${GOOGLE_MAPS_DIRECTIONS_BASE}${store.latitude},${store.longitude}`,
    );
  }, [store]);

  // Ask hq-node for the channel instead of guessing its id. There is no
  // per-order store thread: hq-node's createOrderChannel is dead code, so
  // pushing `messaging:order_<id>` opened a channel that never existed and the
  // screen said "conversation unavailable" on an order placed minutes earlier.
  const openStoreChat = useCallback(async () => {
    if (!storefront?.id) return;
    const cid = await startChatWithStorefront(
      storefront.id,
      storefront.name ?? "the store",
      (storefront as { logo_url?: string | null }).logo_url ?? undefined,
    );
    if (cid) router.push(`/chat/${cid}` as never);
    else
      Alert.alert(
        "Couldn't start chat",
        "Check your connection and try again.",
      );
  }, [storefront, startChatWithStorefront]);

  // The rider thread is created on demand by hq-node, so ask for it rather than
  // guessing the cid: a rider assigned seconds ago may not have a channel yet.
  const openRiderChat = useCallback(async () => {
    if (!order) return;
    const cid = await startChatWithRider(order.id);
    if (cid) router.push(`/chat/${cid}` as never);
    else Alert.alert("Couldn't start chat", "Check your connection and try again.");
  }, [order, startChatWithRider]);

  // The store row carries a sentinel rather than a channel id, because its
  // thread is created on demand. Everything else is a real cid.
  const openChat = useCallback(
    (cid: string) => {
      if (cid === STORE_CHAT_ROW) {
        void openStoreChat();
        return;
      }
      if (cid === `messaging:order_rider_${id}`) {
        void openRiderChat();
        return;
      }
      router.push(`/chat/${cid}` as never);
    },
    [id, openStoreChat, openRiderChat],
  );

  const runPrimary = useCallback(() => {
    switch (narrative.primary.kind) {
      case "chat_store":
        openStoreChat();
        return;
      case "chat_rider":
        openRiderChat();
        return;
      case "directions":
        openDirections();
        return;
      case "rate":
        router.push({ pathname: "/orders/[id]/rating", params: { id } });
        return;
      case "help":
        openHelp();
    }
  }, [narrative, openStoreChat, openRiderChat, openDirections, openHelp, id]);

  // Mirrors the server rule in hq-node cancelOrder. The five-minute window
  // protects someone who has started work; while the order sits at
  // order_placed with no rider, nobody has, so the button stays available.
  // Hiding it on the timer alone stranded an order that no rider could ever
  // be offered, with a card authorisation the customer could not release.
  const nobodyHasAcceptedYet = status === "order_placed" && !order?.rider_id;
  const canCancel = Boolean(
    CANCELLABLE_STATUSES.includes(status) &&
      (nobodyHasAcceptedYet ||
        (order?.cancellable_until &&
          new Date() < new Date(order.cancellable_until))),
  );

  const cancel = useCallback(() => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order? If payment was taken, you will receive a full refund.",
      [
        { text: "Keep Order", style: "cancel" },
        {
          text: "Cancel Order",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            try {
              const {
                data: { session },
              } = await supabase.auth.getSession();
              if (!session) return;
              const res = await fetchWithTimeout(
                `${API_URL}/api/orders/${id}/cancel`,
                {
                  method: "POST",
                  headers: { Authorization: `Bearer ${session.access_token}` },
                },
                10000,
              );
              if (!res.ok) {
                const err = await res.json().catch(() => ({}) as { message?: string });
                Alert.alert("Cannot Cancel", err.message || "Failed to cancel order");
                return;
              }
              Alert.alert("Order Cancelled", "Your order has been cancelled.", [
                { text: "OK", onPress: () => router.replace("/screens/ordering/orders") },
              ]);
            } catch {
              Alert.alert("Error", "Failed to cancel order. Please try again.");
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  }, [id]);

  // The rider stays callable for 30 min after delivery (TAK-1099).
  const canCallRider =
    !!order?.rider_id &&
    (hasLiveRider ||
      (status === "delivered" &&
        !!order.delivered_at &&
        tick - new Date(order.delivered_at).getTime() <= 30 * 60_000));

  const callRider = useCallback(() => {
    if (order) startRiderCall(order.id);
  }, [order, startRiderCall]);

  return {
    id,
    order: order ?? null,
    isLoading,
    error: error ?? null,
    isRefetching,
    refetch,

    displayId: vendorOrder?.display_id ?? null,
    storeName: storefront?.name ?? null,
    storeAddress: vendorLocation
      ? [vendorLocation.address, vendorLocation.city, vendorLocation.postcode]
          .filter(Boolean)
          .join(", ")
      : null,
    placedAt: order ? formatOrderDate(order.created_at) : "",
    items,
    itemCount,
    money: {
      subtotal,
      delivery,
      service,
      tip,
      discount,
      total,
      promoCode: order?.promo_code ?? null,
    },

    narrative,
    printLines,
    isPickup,
    isDone,
    deliveryAddress:
      order?.delivery_address || order?.dropoff_location?.address || null,
    deliveryInstructions: order?.delivery_instructions ?? null,
    riderName: order?.rider?.name ?? null,

    map: {
      canShow: mapCanShow,
      store,
      dropoff,
      user: userLocation ?? null,
      rider,
      riderIsStale,
      waypoints,
    },

    chats,
    unreadTotal,

    primaryLabel: narrative.primary.label,
    primaryKind: narrative.primary.kind,
    runPrimary,
    primaryBusy: isChatCreating,

    canCancel,
    cancelling,
    cancel,

    canCallRider,
    callingRider: isCallingRider,
    callRider,

    canGetDirections: !!store,
    openDirections,
    openHelp,
    openChat,
  };
}
