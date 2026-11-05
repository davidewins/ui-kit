/**
 * Decode Google's encoded polyline into coordinate points
 */

import { Ionicons } from "@expo/vector-icons";

/**
 * Get the icon name for a travel mode
 */
export const getTravelModeIcon = (
  mode: string,
): keyof typeof Ionicons.glyphMap => {
  switch (mode) {
    case "walking":
      return "walk";
    case "bicycling":
      return "bicycle";
    case "twoWheeler":
      return "bicycle";
    default:
      return "car";
  }
};

/**
 * Get the display label for a travel mode
 */
export const getTravelModeLabel = (mode: string) => {
  switch (mode) {
    case "walking":
      return "Walking";
    case "bicycling":
      return "Cycling";
    case "twoWheeler":
      return "Scooter";
    default:
      return "Driving";
  }
};

/**
 * Statuses that mean the order is over, one way or another.
 *
 * `picked_up` is deliberately absent: on a delivery it means the rider is
 * still carrying the order, and only on a pickup order does it mean the
 * customer has it.
 */
const TERMINAL_STATUSES = new Set([
  "delivered",
  "completed",
  "cancelled",
  "vendor_declined",
  "refunded",
  "payment_failed",
  "capture_failed",
  "stalled",
]);

/** Whether an order has reached an outcome and is no longer in flight. */
export const isTerminalStatus = (
  status: string,
  fulfillmentType?: string,
): boolean =>
  TERMINAL_STATUSES.has(status) ||
  (status === "picked_up" && fulfillmentType === "pickup");

/**
 * Get status configuration (color, label, icon) for an order status.
 * Pass fulfillmentType for context-aware labels (e.g. "ready" means
 * different things for pickup vs delivery orders).
 */
export const getStatusConfig = (
  status: string,
  colors: { success: string; error: string; info: string; warning: string },
  fulfillmentType?: string,
) => {
  const isPickup = fulfillmentType === "pickup";
  const isVendorDelivery = fulfillmentType === "vendor_delivery";

  switch (status) {
    case "delivered":
    case "completed":
      return {
        color: colors.success,
        label: isPickup ? "Collected" : "Delivered",
        icon: "checkmark-circle" as const,
      };
    case "cancelled":
      return {
        color: colors.error,
        label: "Cancelled",
        icon: "close-circle" as const,
      };
    case "vendor_declined":
      return {
        color: colors.error,
        label: "Declined by Store",
        icon: "close-circle" as const,
      };
    case "refunded":
      return {
        color: colors.info,
        label: "Refunded",
        icon: "arrow-undo" as const,
      };
    case "payment_failed":
    case "capture_failed":
      return {
        color: colors.error,
        label: "Payment Failed",
        icon: "card" as const,
      };
    case "stalled":
      return {
        color: colors.warning,
        label: "Didn't complete",
        icon: "alert-circle" as const,
      };
    case "preparing":
    case "vendor_accepted":
      return {
        color: colors.info,
        label: "Preparing",
        icon: "restaurant" as const,
      };
    case "ready":
      return {
        color: colors.success,
        label: isPickup
          ? "Ready for Collection"
          : isVendorDelivery
            ? "Ready - Driver Dispatched"
            : "Ready - Awaiting Rider",
        icon: "bag-check" as const,
      };
    case "rider_assigned":
    case "rider_accepted":
      return {
        color: colors.info,
        label: "Rider Assigned",
        icon: "bicycle" as const,
      };
    case "picked_up":
    case "rider_picked_up":
      // On a pickup order this is the customer collecting it, not a rider
      // carrying it away.
      return isPickup
        ? {
            color: colors.success,
            label: "Collected",
            icon: "checkmark-circle" as const,
          }
        : {
            color: colors.info,
            label: "Out for Delivery",
            icon: "navigate" as const,
          };
    case "rider_arrived":
      return {
        color: colors.success,
        label: "Rider Arriving",
        icon: "location" as const,
      };
    case "order_placed":
    default:
      return {
        color: colors.warning,
        label: "Awaiting Confirmation",
        icon: "time" as const,
      };
  }
};

/**
 * Format time from 24-hour to 12-hour with am/pm
 */
export const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const hour12 = hours % 12 || 12;
  const ampm = hours >= 12 ? "pm" : "am";
  if (minutes === 0) {
    return `${hour12}${ampm}`;
  }
  return `${hour12}:${minutes.toString().padStart(2, "0")}${ampm}`;
};

/**
 * Format a date string for display
 */
export const formatOrderDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};
