// The one place an order's raw status turns into words.
//
// All three variants read from this, so they can look completely different and
// still say exactly the same thing. Nothing in here touches React or the
// network - it takes the order fields the screen already has and returns the
// title, the headline, the supporting line, the progress step and the one
// primary action for that state.
//
// Every status the API can return is handled explicitly, including the pickup
// flow (no rider, no route) and the three failure states.

export type StageTone = "pending" | "active" | "done" | "failed";

export type PrimaryKind =
  | "chat_store"
  | "chat_rider"
  | "directions"
  | "rate"
  | "help";

export interface OrderNarrativeInput {
  status: string;
  fulfillmentType: string;
  storeName?: string | null;
  riderName?: string | null;
  /** ISO string. May be absent, or already in the past - both are handled. */
  estimatedDeliveryAt?: string | null;
  deliveredAt?: string | null;
  prepTime?: number | null;
  /** Injected so the copy can be tested and so the screen can re-derive on a tick. */
  now?: number;
}

export interface OrderNarrative {
  /** Nav bar title. Never the display id: "#1" tells the customer nothing. */
  title: string;
  /** The one big line. */
  headline: string;
  /** One supporting sentence. Never repeats the headline. */
  detail: string;
  tone: StageTone;
  /** The four beats of the order, worded for pickup or delivery. */
  steps: string[];
  /** Which beat the order is on. -1 when the order failed or was cancelled. */
  stepIndex: number;
  primary: { kind: PrimaryKind; label: string };
  /** Still moving: worth a map, a live dot and a refresh. */
  isLive: boolean;
}

/** Statuses where the order has stopped moving. */
export const TERMINAL_STATUSES = new Set([
  "completed",
  "delivered",
  "cancelled",
  "vendor_declined",
  "payment_failed",
  "capture_failed",
]);

/** Statuses where a rider is carrying this order right now. */
export const LIVE_RIDER_STATUSES = new Set([
  "rider_assigned",
  "rider_accepted",
  "picked_up",
  "rider_picked_up",
  "rider_arrived",
]);

/** Rider has the food, rather than still being on the way to the store. */
export const RIDER_HAS_ORDER_STATUSES = new Set([
  "picked_up",
  "rider_picked_up",
  "rider_arrived",
]);

/** The one accent on the screen. Same shape as getStatusConfig's colour arg. */
export function toneColor(
  tone: StageTone,
  colors: { success: string; error: string; info: string; warning: string },
): string {
  switch (tone) {
    case "done":
      return colors.success;
    case "failed":
      return colors.error;
    case "pending":
      return colors.warning;
    default:
      return colors.info;
  }
}

const clock = (value: number | string | Date) =>
  new Date(value).toLocaleTimeString("en-IE", {
    hour: "2-digit",
    minute: "2-digit",
  });

const round5 = (ms: number) => Math.round(ms / 300_000) * 300_000;

/**
 * The arrival window, or null when there is no usable estimate.
 *
 * A real ETA goes stale constantly (the rider stops for fuel, the store is
 * late, the phone was in a pocket with no signal). An estimate that has passed
 * must never render as a window in the past, so anything inside three minutes
 * or already gone collapses to "any minute".
 */
export function arrivalWindow(
  iso: string | null | undefined,
  now: number = Date.now(),
): { label: string; imminent: boolean } | null {
  if (!iso) return null;
  const at = new Date(iso).getTime();
  if (!Number.isFinite(at)) return null;
  if (at - now < 3 * 60_000) return { label: "any minute", imminent: true };
  const lower = Math.max(round5(at - 5 * 60_000), now);
  const upper = lower + 10 * 60_000;
  return { label: `${clock(lower)} - ${clock(upper)}`, imminent: false };
}

export function describeOrder(input: OrderNarrativeInput): OrderNarrative {
  const now = input.now ?? Date.now();
  const isPickup = input.fulfillmentType === "pickup";
  const isVendorDelivery = input.fulfillmentType === "vendor_delivery";
  const store = input.storeName?.trim() || "the store";
  const rider = input.riderName?.trim() || "Your rider";
  const window = arrivalWindow(input.estimatedDeliveryAt, now);
  const isLive = !TERMINAL_STATUSES.has(input.status);

  const steps = isPickup
    ? ["Placed", "Preparing", "Ready", "Collected"]
    : ["Placed", "Preparing", "On the way", "Delivered"];

  const chatStore = {
    kind: "chat_store" as const,
    label: `Message ${input.storeName?.trim() || "the store"}`,
  };
  const chatRider = {
    kind: "chat_rider" as const,
    label: `Message ${input.riderName?.trim() || "your rider"}`,
  };

  const arriving = (fallback: string) =>
    window ? `Arriving ${window.label}` : fallback;

  const base = { steps, isLive };

  switch (input.status) {
    case "order_placed":
      return {
        ...base,
        title: "Order placed",
        headline: `Waiting on ${store}`,
        detail: "They confirm the order in a couple of minutes.",
        tone: "pending",
        stepIndex: 0,
        primary: chatStore,
      };

    case "vendor_accepted":
    case "preparing":
      return {
        ...base,
        title: "Preparing",
        headline: isPickup
          ? input.prepTime
            ? `Ready in about ${input.prepTime} min`
            : "Being made now"
          : arriving("Being made now"),
        detail: isPickup
          ? `Collect from ${store} once it is ready.`
          : input.prepTime
            ? `${store} is making your order, about ${input.prepTime} min.`
            : `${store} is making your order.`,
        tone: "active",
        stepIndex: 1,
        primary: chatStore,
      };

    case "ready":
      if (isPickup) {
        return {
          ...base,
          title: "Ready",
          headline: "Ready to collect",
          detail: `Your order is bagged and waiting at ${store}.`,
          tone: "active",
          stepIndex: 2,
          primary: { kind: "directions", label: "Directions to the store" },
        };
      }
      return {
        ...base,
        title: "Ready",
        headline: arriving(isVendorDelivery ? "Heading out" : "Ready to go"),
        detail: isVendorDelivery
          ? `${store} is bringing it out to you.`
          : `Your order is packed. A rider is being matched to it now.`,
        tone: "active",
        stepIndex: 2,
        primary: chatStore,
      };

    // A rider is assigned but has not collected the order yet. This is the
    // state that used to read "Waiting for your rider's location": the app knew
    // the rider's name, the store and the door, and still apologised. It now
    // says what is actually happening, and the map draws the store-to-door leg
    // until the first ping lands.
    case "rider_assigned":
    case "rider_accepted":
      return {
        ...base,
        title: "On the way",
        headline: arriving("Rider on the way"),
        detail: `${rider} is collecting your order from ${store}.`,
        tone: "active",
        stepIndex: 2,
        primary: chatRider,
      };

    case "picked_up":
    case "rider_picked_up":
      return {
        ...base,
        title: "On the way",
        headline: arriving("On the way to you"),
        detail: `${rider} has your order and is heading to you.`,
        tone: "active",
        stepIndex: 2,
        primary: chatRider,
      };

    case "rider_arrived":
      return {
        ...base,
        title: "Arriving",
        headline: "Your rider is outside",
        detail: `${rider} is at the drop-off point now.`,
        tone: "active",
        stepIndex: 2,
        primary: chatRider,
      };

    case "delivered":
    case "completed":
      return {
        ...base,
        title: isPickup ? "Collected" : "Delivered",
        headline: isPickup ? "Collected" : "Delivered",
        detail: input.deliveredAt
          ? `${clock(input.deliveredAt)} from ${store}.`
          : `From ${store}.`,
        tone: "done",
        stepIndex: 3,
        primary: { kind: "rate", label: "Rate this order" },
      };

    case "cancelled":
      return {
        ...base,
        title: "Cancelled",
        headline: "Order cancelled",
        detail: "If you were charged, a full refund is on its way.",
        tone: "failed",
        stepIndex: -1,
        primary: { kind: "help", label: "Get help with this order" },
      };

    case "vendor_declined":
      return {
        ...base,
        title: "Declined",
        headline: `${store} could not take this order`,
        detail: "Nothing was made. We can sort the refund with you.",
        tone: "failed",
        stepIndex: -1,
        primary: { kind: "help", label: "Get help with this order" },
      };

    case "payment_failed":
    case "capture_failed":
      return {
        ...base,
        title: "Payment failed",
        headline: "Payment did not go through",
        detail: "The order was not placed. Get help and we will sort it.",
        tone: "failed",
        stepIndex: -1,
        primary: { kind: "help", label: "Get help with this order" },
      };

    // An unknown status from a newer backend must still render a sane screen
    // rather than a blank one.
    default:
      return {
        ...base,
        title: "Order",
        headline: `Waiting on ${store}`,
        detail: "We will update this the moment anything changes.",
        tone: "pending",
        stepIndex: 0,
        primary: chatStore,
      };
  }
}
