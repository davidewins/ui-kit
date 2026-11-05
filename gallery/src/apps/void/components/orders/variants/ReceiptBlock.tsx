// The receipt itself: the priced lines, the tear-off, the fare stub. This is
// the part of the current screen that works, so all three variants render this
// one component rather than three drifting copies of it.
//
// It renders as a fragment with no background of its own: the variant decides
// what paper it is printed on, and passes that colour in so the tear notches
// read as holes punched through it.
import { Text } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { formatMoney } from "@/apps/void/lib/utils/formatMoney";
import type { OrderItemResponse } from "@/apps/void/types/order";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { TearDivider } from "./TearDivider";

const NUM = { fontVariant: ["tabular-nums" as const] };

export interface ReceiptMoney {
  subtotal: number;
  delivery: number;
  service: number;
  tip: number;
  discount: number;
  total: number;
  promoCode: string | null;
}

const KV: FC<{ label: string; value: string; color?: string }> = ({
  label,
  value,
  color,
}) => {
  const colors = useThemeColors();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        // Basket's summary (BasketSummary mb-[1px]): lines at their own height, 1pt apart.
        marginBottom: 1,
      }}
    >
      <Text weight="medium" className="text-[13px]" style={{ color: color ?? colors.muted }}>
        {label}
      </Text>
      <Text
        weight="medium"
        className="text-[13px]"
        style={{ ...NUM, color: color ?? colors.muted }}
      >
        {value}
      </Text>
    </View>
  );
};

export const ReceiptBlock: FC<{
  items: OrderItemResponse[];
  money: ReceiptMoney;
  /** The colour behind the card. */
  pageColor: string;
}> = ({ items, money, pageColor }) => {
  const colors = useThemeColors();

  return (
    <>
      <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 4 }}>
        {items.length === 0 ? (
          <Text className="text-[13px]" style={{ color: colors.muted, paddingVertical: 8 }}>
            The item lines for this order are not available.
          </Text>
        ) : null}
        {items.map((item, i) => (
          <View key={item.id}>
            <View style={{ flexDirection: "row", alignItems: "flex-start", paddingVertical: 8 }}>
              <Text weight="bold" className="text-[14px]" style={[NUM, { width: 26 }]}>
                {item.quantity}x
              </Text>
              <Text weight="medium" className="flex-1 pr-2 text-[14px]">
                {item.product_name}
              </Text>
              <Text weight="medium" className="text-[14px]" style={NUM}>
                {formatMoney(item.subtotal)}
              </Text>
            </View>
            {i < items.length - 1 ? (
              <View
                style={{
                  height: StyleSheet.hairlineWidth,
                  backgroundColor: colors.border,
                  marginLeft: 26,
                }}
              />
            ) : null}
          </View>
        ))}
      </View>

      <TearDivider pageColor={pageColor} dashColor={colors.border} />

      <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 10 }}>
        <KV label="Subtotal" value={formatMoney(money.subtotal)} />
        {money.discount > 0 ? (
          <KV
            label={money.promoCode ?? "Discount"}
            value={`-${formatMoney(money.discount)}`}
            color={colors.successText}
          />
        ) : null}
        {money.delivery > 0 ? (
          <KV label="Delivery" value={formatMoney(money.delivery)} />
        ) : null}
        {money.service > 0 ? (
          <KV label="Service fee" value={formatMoney(money.service)} />
        ) : null}
        {money.tip > 0 ? (
          <KV label="Rider tip" value={formatMoney(money.tip)} />
        ) : null}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <Text weight="semibold" className="text-[15px]">
            Total
          </Text>
          <Text weight="bold" style={[NUM, { fontSize: 24, letterSpacing: -0.5 }]}>
            {formatMoney(money.total)}
          </Text>
        </View>
      </View>
    </>
  );
};
