import { useThemeColors } from "@/hooks/useThemeColors";
import { basketTotalCents } from "@/apps/void/lib/utils/creditToApply";
import { formatMoney } from "@/apps/void/lib/utils/formatMoney";
import { Tag, TrendingUp } from "lucide-react-native";
import React from "react";
import { Text, View } from "@/components/ui";

type FulfillmentMode = "pickup" | "delivery";

type Props = {
  subtotal: number;
  serviceFee: number;
  tip?: number;
  deliveryFee: number;
  fulfillmentMode?: FulfillmentMode;
  freeDeliveryMessage?: string | null;
  promoCode?: string | null;
  discountAmountCents?: number;
  /** Store credit applied at checkout (TAK-1218). */
  creditApplied?: number;
  surgeMultiplier?: number;
  surgeReason?: string;
};

export function BasketSummary({
  subtotal,
  serviceFee,
  tip = 0,
  deliveryFee,
  fulfillmentMode = "pickup",
  freeDeliveryMessage,
  promoCode,
  discountAmountCents = 0,
  creditApplied = 0,
  surgeMultiplier,
  surgeReason,
}: Props) {
  const colors = useThemeColors();
  const total = basketTotalCents({
    subtotal,
    serviceFee,
    deliveryFee,
    tip,
    discountAmountCents,
    creditApplied,
  });

  // Determine delivery label and value
  const isPickup = fulfillmentMode === "pickup";
  const deliveryLabel = isPickup ? "Pickup:" : "Delivery Fee:";
  const deliveryValue = isPickup
    ? "Free"
    : deliveryFee === 0
    ? "Free"
    : formatMoney(deliveryFee);

  const isSurging = !isPickup && surgeMultiplier != null && surgeMultiplier > 1;

  return (
    <View className="mt-4">
      {/* Subtotal */}
      <View className="flex-row justify-between mb-[1px]">
        <Text weight="regular" className="tracking-tight">
          Subtotal:
        </Text>
        <Text weight="regular" className="tracking-tight">
          {formatMoney(subtotal)}
        </Text>
      </View>

      {/* Service Fee */}
      <View className="flex-row justify-between mb-[1px]">
        <Text>Service Fee:</Text>
        <Text>{formatMoney(serviceFee)}</Text>
      </View>

      {/* Surge pricing warning */}
      {isSurging && (
        <View className="flex-row items-center gap-2 mb-2 px-2 py-1.5 bg-warning/10 rounded-lg border border-warning/30">
          <TrendingUp size={13} color={colors.warning} />
          <Text className="text-xs text-warning flex-1" weight="medium">
            {surgeReason ?? "High demand - delivery fee is temporarily higher"}
            {" "}({surgeMultiplier!.toFixed(1)}×)
          </Text>
        </View>
      )}

      {/* Delivery Fee / Pickup */}
      <View className="flex-row justify-between mb-2">
        <Text>{deliveryLabel}</Text>
        <Text
          weight={deliveryValue === "Free" ? "medium" : "regular"}
          className={deliveryValue === "Free" ? "text-success" : "text-text"}
        >
          {deliveryValue}
        </Text>
      </View>

      {/* Free delivery hint message */}
      {freeDeliveryMessage && !isPickup && (
        <View className="mb-2 px-2 py-1.5 bg-tint/10 rounded-lg">
          <Text weight="medium" className="text-xs text-tint text-center">
            {freeDeliveryMessage}
          </Text>
        </View>
      )}

      {/* Promo discount */}
      {discountAmountCents > 0 && promoCode && (
        <View className="flex-row justify-between mb-[1px] items-center">
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <Tag size={11} color={colors.tint} />
            <Text className="text-tint text-sm">{promoCode}</Text>
          </View>
          <Text className="text-tint text-sm">-{formatMoney(discountAmountCents)}</Text>
        </View>
      )}

      {/* Store credit */}
      {creditApplied > 0 && (
        <View className="flex-row justify-between mb-[1px] items-center">
          <Text className="text-tint text-sm">Store credit:</Text>
          <Text className="text-tint text-sm">-{formatMoney(creditApplied)}</Text>
        </View>
      )}

      {/* Tip */}
      {tip > 0 && (
        <View className="flex-row justify-between mb-[1px]">
          <Text>Tip:</Text>
          <Text>{formatMoney(tip)}</Text>
        </View>
      )}

      {/* Divider */}
      <View
        className="w-full h-[0.5px] rounded-full mb-2 bg-border"
        // style={{
        //   width: "100%",
        //   height: 0.5,
        //   backgroundColor: colors.border,
        //   borderRadius: 999,
        //   marginBottom: 8,
        // }}
      />

      {/* Total */}
      <View className="flex-row justify-between mb-[1px]">
        <Text
          weight="semibold"
          className="tracking-tight text-[15px] text-text"
        >
          Order Total:
        </Text>
        <Text
          weight="semibold"
          className="tracking-tight text-[15px] text-text"
        >
          {formatMoney(total)}
        </Text>
      </View>
    </View>
  );
}
