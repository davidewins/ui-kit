import { Badge, Card, EmptyState, Text, View } from "@/components/ui";
import { PillButton } from "@/components/ui/actions/PillButton";
import { StepTracker } from "@/components/ui/feedback/StepTracker";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ThumbStack } from "@/components/ui/lists/ThumbStack";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { PressableScale } from "@/components/PressableScale";
import { ART } from "@/gallery/demo/data";
import { DemoScreen, useStates } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";
import { IN_TRANSIT, ORDERS, STEPS, type Order, eur, itemCount, itemNames, photosOf, total } from "./data";
import { GUTTER } from "./parts";

const TRACK_HREF = "/screens/orders/track-timeline";
const RECEIPT_HREF = "/screens/orders/receipt";
const SHOP_HREF = "/screens/orders/product-gallery";
const STATES = ["Loaded", "Empty"] as const;
/** Width of two overlapping 40pt thumbnails: every row's text starts after it. */
const STACK = 68;
const BADGE = { Delivered: "success", Refunded: "error", Returned: "default", "On the way": "warning" } as const;

// Orders, the way Shop and Apple Store list them: the one that is still
// moving lifted to the top with its steps, then everything else by month,
// each row showing what was in it and a real button to buy it again.
export default function OrdersList() {
  const colors = useThemeColors();
  const hues = useHues();
  const { state } = useStates(STATES);

  if (state === "Empty") {
    return (
      <DemoScreen scroll={false}>
        <EmptyState art={{ image: ART.box }} title="No orders yet" body="Orders and their tracking show up here" action={{ label: "Start shopping", onPress: () => router.push(SHOP_HREF) }} />
      </DemoScreen>
    );
  }

  const active = IN_TRANSIT;
  const past = ORDERS.filter((o) => o !== active);
  const months = [...new Set(past.map((o) => o.month))];

  return (
    <DemoScreen>
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={`Order ${active.number}, ${active.outcome}`}
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          router.push(TRACK_HREF);
        }}
        style={{ marginHorizontal: GUTTER, marginTop: 4 }}
      >
        <Card raised>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
            <View style={{ flex: 1, rowGap: 2 }}>
              <Text weight="semibold" style={TYPE.title}>Arriving today</Text>
              <Text weight="medium" style={[TYPE.body, TABULAR, { color: colors.muted }]}>13:00 to 14:00 with DPD</Text>
            </View>
            <ThumbStack images={photosOf(active)} size={44} max={3} ringColor={colors.card} label={`${itemCount(active)} items`} />
          </View>
          <View style={{ marginTop: 16, marginBottom: 14 }}>
            <StepTracker steps={STEPS} current={2} tone={hues.blue} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
            <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { flex: 1, color: colors.muted }]}>
              {`${active.number}, ${itemCount(active)} items, ${eur(total(active))}`}
            </Text>
            <PillButton size="xs" onPress={() => router.push(TRACK_HREF)}>Track parcel</PillButton>
          </View>
        </Card>
      </PressableScale>

      {months.map((month) => {
        const orders = past.filter((o) => o.month === month);
        return (
          <View key={month}>
            <SectionHeader title={month} count={orders.length} />
            <SettingsGroup separatorInset={GUTTER + STACK + 12}>
              {orders.map((o) => (
                <OrderRow key={o.number} order={o} />
              ))}
            </SettingsGroup>
          </View>
        );
      })}
    </DemoScreen>
  );
}

function OrderRow({ order }: { order: Order }) {
  const colors = useThemeColors();
  const [pressed, setPressed] = useState(false);
  const count = itemCount(order);
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        router.push(RECEIPT_HREF);
      }}
      accessibilityRole="button"
      accessibilityLabel={`${itemNames(order)}, ${order.outcome}, ${eur(total(order))}`}
      style={{ flexDirection: "row", alignItems: "center", minHeight: 68, paddingVertical: 10, paddingHorizontal: GUTTER, columnGap: 12, backgroundColor: pressed ? colors.border : "transparent" }}
    >
      <View style={{ width: STACK }}>
        <ThumbStack images={photosOf(order)} size={40} max={2} label={`${count} ${count === 1 ? "item" : "items"}`} />
      </View>
      <View style={{ flex: 1, rowGap: 4 }}>
        <Text weight="semibold" numberOfLines={1} style={TYPE.body}>{itemNames(order)}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
          <Badge variant={BADGE[order.status]}>{order.status}</Badge>
          <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { flex: 1, color: colors.muted }]}>{`${eur(total(order))}, ${order.day}`}</Text>
        </View>
      </View>
      <PillButton size="xs" variant="outline" onPress={() => Toast.success(`${count} ${count === 1 ? "item" : "items"} added to your bag`)}>Buy again</PillButton>
    </Pressable>
  );
}
