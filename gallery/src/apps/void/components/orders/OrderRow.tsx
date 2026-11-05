import { Text, View } from "@/components/ui";
import { useOrderBadgeStore } from "@/apps/void/context/store/orderBadgeStore";
import { VendorLogo } from "@/apps/void/components/VendorLogo";
import { StageRail } from "@/apps/void/components/orders/variants/StageRail";
import { describeOrder, toneColor } from "@/apps/void/components/orders/variants/orderNarrative";
import { OrderListItem } from "@/apps/void/hooks/useOrders";
import { useThemeColors } from "@/hooks/useThemeColors";
import { formatMoney } from "@/apps/void/lib/utils/formatMoney";
import { getStatusConfig, isTerminalStatus } from "@/apps/void/lib/utils/orderHelpers";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { FC } from "react";
import { Pressable } from "react-native";

type Props = {
  item: OrderListItem;
  onReorder: (orderId: string) => void;
  isReordering?: boolean;
  /** Short list (a few orders): use the space, show the items. */
  expanded?: boolean;
};

const MAX_ITEM_LINES = 3;
/** Over, and not the way the customer wanted. */
const FAILED_STATUSES = new Set(["cancelled", "vendor_declined", "refunded"]);

export const OrderRow: FC<Props> = ({ item, expanded = false }) => {
  const colors = useThemeColors();
  // Unread update on this order (TAK-1179) - cleared when it's opened.
  const hasUpdate = useOrderBadgeStore((s) => s.orderIds.includes(item.id));
  const firstVendor = item.vendor_orders[0];
  const orderItems = item.vendor_orders.flatMap((vo) => vo.order_items);
  const totalItems = orderItems.reduce((s, i) => s + i.quantity, 0);
  const total = item.vendor_orders.reduce((sum, vo) => sum + vo.subtotal, 0);
  const statusCfg = getStatusConfig(item.status, colors, item.fulfillment_type);
  const dateLabel = new Date(item.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  // Still moving: the order screen's stage rail, no labels. Over: the status
  // word, quietly, no coloured dot.
  const live = !isTerminalStatus(item.status, item.fulfillment_type);
  const narrative = live
    ? describeOrder({ status: item.status, fulfillmentType: item.fulfillment_type })
    : null;
  const extraLines = Math.max(0, orderItems.length - MAX_ITEM_LINES);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/void/(protected)/orders/[id]",
          params: { id: item.id },
        })
      }
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      className="flex-row items-center gap-3 px-4 py-3"
      accessibilityRole="link"
      accessibilityLabel={`${firstVendor?.vendor_storefronts?.name || "Order"}, ${hasUpdate ? "unread update, " : ""}${statusCfg.label}, ${totalItems} item${totalItems !== 1 ? "s" : ""}, ${formatMoney(total)}, ${dateLabel}`}
      accessibilityHint="Opens order details"
    >
      <VendorLogo
        logoPath={firstVendor?.vendor_storefronts?.logo_path}
        name={firstVendor?.vendor_storefronts?.name}
        rounded={false}
        size={46}
      />

      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Text
            weight="semibold"
            numberOfLines={1}
            className="text-[15px] flex-shrink"
            style={{ letterSpacing: -0.2 }}
          >
            {firstVendor?.vendor_storefronts?.name || "Order"}
          </Text>
          {hasUpdate && (
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.error }}
              accessibilityLabel="Unread update"
            />
          )}
        </View>
        <Text
          weight="medium"
          className="text-[13px] text-muted"
          numberOfLines={1}
          style={{ marginTop: 1 }}
        >
          <Text
            weight="medium"
            className="text-[13px]"
            style={{ color: FAILED_STATUSES.has(item.status) ? colors.error : colors.muted }}
          >
            {statusCfg.label}
          </Text>
          {live ? "" : ` · ${dateLabel}`} · {totalItems} item
          {totalItems !== 1 ? "s" : ""} · {formatMoney(total)}
        </Text>

        {narrative ? (
          <View style={{ marginTop: 8, marginBottom: 2 }}>
            <StageRail
              steps={narrative.steps}
              index={narrative.stepIndex}
              toneColor={toneColor(narrative.tone, colors)}
              showLabels={false}
            />
          </View>
        ) : null}

        {expanded && orderItems.length > 0 ? (
          <View style={{ marginTop: 6, gap: 1 }}>
            {orderItems.slice(0, MAX_ITEM_LINES).map((line, i) => (
              <Text
                key={`${line.product_name}-${i}`}
                weight="medium"
                className="text-[13px]"
                numberOfLines={1}
              >
                <Text weight="semibold" className="text-[13px] text-muted">
                  {line.quantity}x{" "}
                </Text>
                {line.product_name}
              </Text>
            ))}
            {extraLines > 0 ? (
              <Text weight="medium" className="text-[13px] text-muted">
                +{extraLines} more
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      <ChevronRight size={18} color={colors.muted} />
    </Pressable>
  );
};
