import { BasketItemInterface } from "@/apps/void/types/basket";
import React from "react";
import { GlassButton } from "@/components/ui/actions/GlassButton";

interface OrderButtonProps {
  handlePlaceOrder: () => void | Promise<void>;
  items: BasketItemInterface[];
  loading: boolean;
  disabled: boolean;
  payInStore?: boolean;
  storeStatus?: {
    isOpen: boolean;
    statusText: string;
    nextOpenTime?: string;
  };
}

export default function OrderButton({
  handlePlaceOrder,
  items,
  loading,
  disabled,
  payInStore = false,
  storeStatus,
}: OrderButtonProps) {
  const formatTo12HourTime = (time?: string) => {
    if (!time) return null;
    const [rawHours, rawMinutes] = time.split(":");
    const hours = Number(rawHours);
    const minutes = rawMinutes ?? "00";
    if (Number.isNaN(hours)) return null;

    const period = hours >= 12 ? "pm" : "am";
    const twelveHourValue = hours % 12 || 12;
    return `${twelveHourValue}:${minutes}${period}`;
  };

  const isStoreClosed = !!storeStatus && !storeStatus.isOpen;
  const closedUntilText = formatTo12HourTime(storeStatus?.nextOpenTime);

  const buttonText = isStoreClosed
    ? closedUntilText
      ? `Store closed till ${closedUntilText}`
      : "Store closed"
    : payInStore
      ? "Order for Collection"
      : "Place Order";

  return (
    <GlassButton
      label={buttonText}
      onPress={handlePlaceOrder}
      loading={loading}
      disabled={disabled || items.length === 0}
      tone={isStoreClosed ? "neutral" : "primary"}
      size="lg"
    />
  );
}
