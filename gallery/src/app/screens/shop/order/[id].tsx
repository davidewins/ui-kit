import { Card, Text, View } from "@/components/ui";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ProgressBar } from "@/components/ui/feedback/ProgressBar";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { BASKET, euro, productById } from "@/gallery/demo/data";
import { DemoScreen, MEDIA_INSET, MediaRow, Summary, useStates } from "@/gallery/demo/parts";
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
  const { state, bar } = useStates(STATES);
  const [cancelling, setCancelling] = useState(false);
  const reached = state === "Processing" ? 1 : state === "On the way" ? 3 : 4;
  const subtotal = BASKET.reduce((n, l) => n + productById(l.product).price * l.qty, 0);
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
        bar={bar}
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

        <SettingsGroup>
          {STEPS.map((s, i) => (
            <SettingsRow key={s.label} label={s.label} Icon={i < reached ? Check : Circle} trailing={i < reached ? s.at : "To come"} />
          ))}
        </SettingsGroup>

        <SectionTitle>Items</SectionTitle>
        <SettingsGroup separatorInset={MEDIA_INSET}>
          {BASKET.map((l) => {
            const p = productById(l.product);
            return <MediaRow key={l.product} image={p.photos[0]} title={p.name} subtitle={l.size ? `Size ${l.size}, ${l.qty} ×` : `${l.qty} ×`} trailing={euro(p.price * l.qty)} href={`/screens/shop/product/${p.id}`} />;
          })}
        </SettingsGroup>

        <SettingsGroup>
          <SettingsRow label="14 Clanbrassil Street, Dublin 8" Icon={MapPin} />
          <SettingsRow label="Message support" Icon={MessageCircle} navigates onPress={() => Toast.info("Chat with us")} />
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
