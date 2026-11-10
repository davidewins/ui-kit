import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Card, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ProgressBar } from "@/components/ui/feedback/ProgressBar";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { BASKET, SHOP_ORDERS, euro, productById } from "@/gallery/demo/data";
import { DataTable, DemoScreen, MEDIA_INSET, MediaRow, MetricGrid, Summary, useStates } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { router, useLocalSearchParams } from "expo-router";
import { Check, Circle, MapPin, MessageCircle } from "lucide-react-native";
import { useState } from "react";

const STATES = ["Processing", "On the way", "Delivered"] as const;
const STEPS = [
  { label: "Order placed", at: "Today, 09:41" },
  { label: "Packed", at: "Today, 14:10" },
  { label: "With the courier", at: "Tomorrow" },
  { label: "Delivered", at: "Thursday" },
] as const;

// One order: where it is (headline, progress, steps), what's in it, the
// totals. Cancel lives in the header menu while it can still be cancelled.
export default function Order() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = SHOP_ORDERS.find((o) => o.id === id) ?? SHOP_ORDERS[0];
  // A refunded order was delivered first; its page reads as delivered.
  const { state } = useStates(STATES, order.status === "Refunded" ? "Delivered" : order.status);
  // #4821 is the bag from the Shop; the others are one of each item.
  const lines = order.id === "4821" ? BASKET : order.items.map((product) => ({ product, qty: 1, size: undefined as string | undefined }));
  const [cancelling, setCancelling] = useState(false);
  const reached = state === "Processing" ? 1 : state === "On the way" ? 3 : 4;
  const subtotal = order.total;
  const headline = state === "Processing" ? "Arriving Thursday" : state === "On the way" ? "Arriving today" : "Delivered";
  const sub = state === "Processing" ? "We're packing it now" : state === "On the way" ? "Between 13:00 and 15:00" : "Left with a neighbour at no. 16";

  return (
    <>
      <ActionMenu
        title={`Order #${id ?? "4821"}`}
        accessibilityLabel="Order actions"
        actions={[
          { label: "Get help", systemImage: "questionmark.circle", onPress: () => Toast.info("Chat with us") },
          ...(state === "Processing" ? [{ label: "Cancel order", systemImage: "xmark.circle", destructive: true, onPress: () => setCancelling(true) }] : []),
        ]}
      />
      <DemoScreen
        secondary={state === "Delivered"}
        footer={
          state === "On the way" ? (
            <InsetFooter primaryCta={{ label: "Track parcel", onPress: () => Toast.info("Opening tracking") }} />
          ) : state === "Delivered" ? (
            <InsetFooter primaryCta={{ label: "Buy again", onPress: () => router.push("/screens/shop/basket") }} secondaryCta={{ label: "Return an item", onPress: () => Toast.info("Returns") }} />
          ) : undefined
        }
      >
        <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
          <Card raised>
            <Text weight="medium" style={{ fontSize: 15, color: colors.muted }}>{`Order #${id ?? "4821"}`}</Text>
            <Text weight="semibold" style={{ fontSize: 28, letterSpacing: -0.6, marginTop: 2 }}>{headline}</Text>
            <Text weight="medium" style={{ fontSize: 15, color: colors.muted, marginTop: 2, marginBottom: 14 }}>{sub}</Text>
            <ProgressBar value={reached / STEPS.length} color={state === "Delivered" ? colors.success : undefined} accessibilityLabel="Delivery progress" />
          </Card>
        </View>

        <DataTable
          dense
          columns={[
            { key: "done", label: "", width: 18, align: "left" },
            { key: "step", label: "Tracking" },
            { key: "at", label: "", width: 100 },
          ]}
          rows={STEPS.map((st, i) => ({
            done: i < reached ? <Check size={14} color={colors.success} strokeWidth={2.5} /> : <Circle size={12} color={colors.muted} strokeWidth={2} />,
            step: st.label,
            at: i < reached ? st.at : "To come",
          }))}
          muted={STEPS.map((_, i) => i).filter((i) => i >= reached)}
          highlight={reached - 1}
        />

        <MetricGrid
          items={[
            { label: "Courier", value: "DPD" },
            { label: "Tracking", value: "15502 8841" },
            { label: "Parcels", value: `${state === "Processing" ? 0 : 1} of 1` },
            { label: "Paid with", value: "Visa", unit: "4242" },
            { label: "Placed", value: "09:41", unit: "today" },
            { label: "Return by", value: "10 Dec" },
          ]}
        />

        <SectionTitle>{`${lines.reduce((n, l) => n + l.qty, 0)} items`}</SectionTitle>
        <SettingsGroup separatorInset={MEDIA_INSET}>
          {lines.map((l) => {
            const p = productById(l.product);
            return (
              <MediaRow
                key={l.product}
                image={p.photos[0]}
                title={p.name}
                subtitle={[p.colour, l.size ? `size ${l.size}` : null, `${l.qty} × ${euro(p.price)}`].filter(Boolean).join(", ")}
                trailing={euro(p.price * l.qty)}
                href={`/screens/shop/product/${p.id}`}
              />
            );
          })}
        </SettingsGroup>

        <SettingsGroup>
          <SettingsRow label="14 Clanbrassil Street, Dublin 8" Icon={MapPin} trailing="Leave at door" />
          <SettingsRow label="Message support" Icon={MessageCircle} trailing="Replies in 5 min" navigates onPress={() => Toast.info("Chat with us")} />
        </SettingsGroup>

        <Summary lines={[["Subtotal", euro(subtotal)], ["Delivery", "Free"]]} total={["Paid", euro(subtotal)]} />
      </DemoScreen>
      <ConfirmDialog
        visible={cancelling}
        onClose={() => setCancelling(false)}
        title={`Cancel order #${id ?? "4821"}?`}
        message={`You get ${euro(subtotal)} back on your Visa in 3 to 5 days.`}
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
        destructive
        onConfirm={() => {
          Toast.success("Order cancelled");
          router.back();
        }}
      />
    </>
  );
}
