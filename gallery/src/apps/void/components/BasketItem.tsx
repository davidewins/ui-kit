import { GlassQtyStepper } from "@/apps/void/components/GlassQtyStepper";
import { Text, View } from "@/components/ui";
import useBasketStore from "@/apps/void/context/store/basketStore";
import { useProductActions } from "@/apps/void/hooks/useProductActions";
import { useThemeColors } from "@/hooks/useThemeColors";
import { formatMoney } from "@/apps/void/lib/utils/formatMoney";
import { BasketItemInterface } from "@/apps/void/types/basket";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet } from "react-native";

interface BasketItemProps {
  item: BasketItemInterface;
  isOutOfStock?: boolean;
  quantityTooHigh?: boolean;
  currentStock?: number;
  onUpdate: () => Promise<void>;
}

export default function BasketItem({
  item,
  isOutOfStock: propIsOutOfStock,
  quantityTooHigh: propQuantityTooHigh,
  currentStock,
  onUpdate,
}: BasketItemProps) {
  const colors = useThemeColors();
  const { updateItemQuantity } = useBasketStore();

  const { isAtStockLimit, isStockDepleted } = useProductActions({
    product: item,
    currentStock,
    onUpdate,
  });

  const isOutOfStock = propIsOutOfStock ?? isStockDepleted;
  const isButtonDisabled = isOutOfStock || isAtStockLimit || !!propQuantityTooHigh;
  const key = item.configKey ?? "";

  const changeQty = async (next: number) => {
    Haptics.selectionAsync();
    updateItemQuantity(item.productId, item.variantId, next, key);
    await onUpdate();
  };

  const modifierSummary = (item.selectedModifiers ?? [])
    .map((m) => m.option_name)
    .filter(Boolean)
    .join(", ");

  return (
    <View className="flex-row items-start px-2 py-2 mb-1 gap-2.5">
      {item.thumbnail ? (
        <Image
          source={{ uri: item.thumbnail }}
          style={[styles.thumb, { borderColor: colors.border }]}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.thumb,
            {
              borderColor: colors.border,
              backgroundColor: colors.secondaryBackground,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Text weight="semibold" className="text-muted text-base">
            {item.name?.trim()?.charAt(0)?.toUpperCase() ?? "?"}
          </Text>
        </View>
      )}

      {/* Text column - leaves room for stepper so desc never underlaps +/- */}
      <View className="flex-1 min-w-0 pr-1" style={{ paddingRight: 4 }}>
        <Text
          weight="semibold"
          className="text-[13px] text-text"
          numberOfLines={2}
        >
          {item.name}
        </Text>
        {modifierSummary.length > 0 ? (
          <Text className="text-[11px] text-muted mt-0.5" numberOfLines={3}>
            {modifierSummary}
          </Text>
        ) : null}
        <Text className="text-[12px] text-text mt-1">
          {formatMoney(item.price)}
        </Text>
      </View>

      <View style={{ flexShrink: 0, marginTop: 2 }}>
        <GlassQtyStepper
          quantity={item.quantity}
          onMinus={() => changeQty(item.quantity - 1)}
          onPlus={() => changeQty(item.quantity + 1)}
          plusDisabled={isButtonDisabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  thumb: {
    height: 54,
    width: 54,
    borderRadius: 10,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
});
