import { Badge, Card, EmptyState, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { Menu } from "@/components/ui/actions/Menu";
import { PillButton } from "@/components/ui/actions/PillButton";
import { StepTracker } from "@/components/ui/feedback/StepTracker";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { ThumbStack } from "@/components/ui/lists/ThumbStack";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
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
import { IN_TRANSIT, ORDERS, STEPS, TRACKING, type Order, eur, itemCount, itemNames, photosOf, total } from "./data";
import { GUTTER, RowPanel, copyText } from "./parts";

const TRACK_HREF = "/screens/orders/track-timeline";
const RECEIPT_HREF = "/screens/orders/receipt";
const SHOP_HREF = "/screens/orders/product-gallery";
const STATES = ["Loaded", "Empty"] as const;
/** Width of two overlapping 40pt thumbnails: every row's text starts after it. */
const STACK = 68;
const BADGE = { Delivered: "success", Refunded: "error", Returned: "default", "On the way": "warning" } as const;
const FILTERS = ["All orders", "Delivered", "Refunded or returned"] as const;
type Filter = (typeof FILTERS)[number];
const shows = (o: Order, f: Filter) => f === "All orders" || (f === "Delivered" ? o.status === "Delivered" : o.status !== "Delivered");

// Orders, the way Shop and Apple Store list them: the one that is still
// moving lifted to the top with its steps, then everything else by month on
// a panel each, every row showing what was in it and a real button to buy it
// again. Long press a row or the card for the rest: copy the number, get
// help, hide.
export default function OrdersList() {
  const colors = useThemeColors();
  const hues = useHues();
  const { state } = useStates(STATES);
  const [filter, setFilter] = useState<Filter>("All orders");
  const [hidden, setHidden] = useState<string[]>([]);
  // The order the confirm is about stays set while the dialog closes, so its title does not blank.
  const [hiding, setHidingOrder] = useState<Order | null>(null);
  const [asking, setAsking] = useState(false);
  const setHiding = (o: Order) => {
    setHidingOrder(o);
    setAsking(true);
  };

  if (state === "Empty") {
    return (
      <DemoScreen scroll={false}>
        <EmptyState art={{ image: ART.box }} title="No orders yet" body="Orders and their tracking show up here" action={{ label: "Start shopping", onPress: () => router.push(SHOP_HREF) }} />
      </DemoScreen>
    );
  }

  const active = IN_TRANSIT;
  const past = ORDERS.filter((o) => o !== active && !hidden.includes(o.number) && shows(o, filter));
  const months = [...new Set(past.map((o) => o.month))];
  const track = () => router.push(TRACK_HREF);

  return (
    <>
      <ActionMenu
        accessibilityLabel="Orders actions"
        actions={[
          { label: "Search orders", systemImage: "magnifyingglass", onPress: () => Toast.info("Search orders") },
          { label: "Download invoices", systemImage: "arrow.down.doc", onPress: () => Toast.success("Invoices saved to Files") },
          { label: "Get help", systemImage: "questionmark.circle", onPress: () => Toast.info("Chat with Runlab") },
        ]}
      />
      <DemoScreen>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={`Order ${active.number}, ${active.outcome}`}
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            track();
          }}
          style={{ marginHorizontal: GUTTER, marginTop: 4 }}
        >
          <Card raised>
            <ContextMenu
              onPress={track}
              actions={[
                { label: "Track parcel", systemImage: "shippingbox", onPress: track },
                { label: "Copy tracking number", systemImage: "doc.on.doc", onPress: () => copyText(TRACKING.number.replace(/\s/g, ""), "Tracking number copied") },
                { label: "Change delivery", systemImage: "calendar.badge.clock", onPress: () => Toast.info("Opening DPD Predict") },
                { label: "Get help", systemImage: "questionmark.circle", onPress: () => Toast.info("Chat with Runlab") },
              ]}
            >
              <View>
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
                  <PillButton size="xs" onPress={track}>Track parcel</PillButton>
                </View>
              </View>
            </ContextMenu>
          </Card>
        </PressableScale>

        <View style={{ flexDirection: "row", paddingHorizontal: GUTTER, marginTop: 20 }}>
          <Menu label={filter} systemImage="line.3.horizontal.decrease" items={FILTERS.map((f) => ({ label: f, selected: f === filter, onPress: () => setFilter(f) }))} />
        </View>

        {months.map((month) => {
          const orders = past.filter((o) => o.month === month);
          return (
            <View key={month}>
              <SectionHeader title={`${month}, ${orders.length} ${orders.length === 1 ? "order" : "orders"}`} />
              <RowPanel inset={GUTTER + STACK + 12}>
                {orders.map((o) => (
                  <OrderRow key={o.number} order={o} onHide={() => setHiding(o)} />
                ))}
              </RowPanel>
            </View>
          );
        })}
      </DemoScreen>
      <ConfirmDialog
        visible={!!hiding && asking}
        onClose={() => setAsking(false)}
        title={hiding ? `Hide order ${hiding.number}?` : ""}
        message="It leaves this list for good. The receipt stays in your email."
        confirmLabel="Hide order"
        cancelLabel="Keep it"
        destructive
        onConfirm={() => {
          if (hiding) setHidden((h) => [...h, hiding.number]);
          Toast.success("Order hidden");
        }}
      />
    </>
  );
}

function OrderRow({ order, onHide }: { order: Order; onHide: () => void }) {
  const colors = useThemeColors();
  const [pressed, setPressed] = useState(false);
  const count = itemCount(order);
  const buyAgain = () => Toast.success(`${count} ${count === 1 ? "item" : "items"} added to your bag`);
  return (
    <ContextMenu
      actions={[
        { label: "Buy again", systemImage: "bag.badge.plus", onPress: buyAgain },
        { label: "View receipt", systemImage: "doc.text", onPress: () => router.push(RECEIPT_HREF) },
        { label: "Copy order number", systemImage: "doc.on.doc", onPress: () => copyText(order.number, "Order number copied") },
        { label: "Get help", systemImage: "questionmark.circle", onPress: () => Toast.info("Chat with Runlab") },
        { label: "Hide order", systemImage: "eye.slash", destructive: true, onPress: onHide },
      ]}
    >
      <Pressable
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          router.push(RECEIPT_HREF);
        }}
        accessibilityRole="button"
        accessibilityLabel={`${itemNames(order)}, ${order.outcome}, ${eur(total(order))}`}
        style={{ flexDirection: "row", alignItems: "center", minHeight: 68, paddingVertical: 12, paddingHorizontal: GUTTER, columnGap: 12, backgroundColor: pressed ? colors.border : "transparent" }}
      >
        <View style={{ width: STACK }}>
          <ThumbStack images={photosOf(order)} size={40} max={2} ringColor={colors.card} label={`${count} ${count === 1 ? "item" : "items"}`} />
        </View>
        <View style={{ flex: 1, rowGap: 4 }}>
          <Text weight="semibold" numberOfLines={1} style={TYPE.body}>{itemNames(order)}</Text>
          <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${eur(total(order))}, ${order.day}`}</Text>
          <View style={{ flexDirection: "row", marginTop: 2 }}>
            <Badge variant={BADGE[order.status]}>{order.status}</Badge>
          </View>
        </View>
        <PillButton size="xs" variant="outline" onPress={buyAgain}>Buy again</PillButton>
      </Pressable>
    </ContextMenu>
  );
}
