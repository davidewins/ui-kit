import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Card, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ShareLink } from "@/components/ui/actions/ShareLink";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { BASKET, SHOP_ORDERS, euro, productById } from "@/gallery/demo/data";
import { CardMark, CourierMark, copyText } from "@/gallery/demo/brands";
import { DemoScreen, GUTTER, MEDIA_INSET, MediaRow, useStates } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { Copy, Home, MessageCircle, Package, RotateCcw, Truck } from "lucide-react-native";
import { useState, type ReactNode } from "react";
import { Pressable, StyleSheet } from "react-native";

const STATES = ["Processing", "On the way", "Delivered"] as const;
const STEPS = [
  { label: "Placed", at: "09:41" },
  { label: "Packed", at: "14:10" },
  { label: "Courier", at: "Wed 08:02" },
  { label: "Delivered", at: "Wed 13:48" },
] as const;

// One order, the way Apple's and Shop's order pages read: where it is in
// colour, who has it (courier mark, tracking number you can copy), what's in
// it, how it was paid (card mark) and what it cost.
export default function Order() {
  const colors = useThemeColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = SHOP_ORDERS.find((o) => o.id === id) ?? SHOP_ORDERS[0];
  const number = `#${order.id}`;
  const { state } = useStates(STATES, order.status === "Refunded" ? "Delivered" : order.status);
  const lines = order.id === "4821" ? BASKET : order.items.map((product) => ({ product, qty: 1, size: undefined as string | undefined }));
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const [cancelling, setCancelling] = useState(false);
  const reached = state === "Processing" ? 2 : state === "On the way" ? 3 : 4;
  const tone = state === "Delivered" ? colors.success : state === "On the way" ? "#0A84FF" : colors.warning;
  const headline = state === "Processing" ? "Arriving Wednesday" : state === "On the way" ? "Arriving today" : "Delivered";
  const sub =
    state === "Processing" ? "Packed and waiting for DPD" : state === "On the way" ? "Between 13:00 and 14:00, 6 stops away" : "Wednesday at 13:48, left with no. 16";
  const Icon = state === "Delivered" ? Home : state === "On the way" ? Truck : Package;

  return (
    <>
      <ActionMenu
        title={`Order ${number}`}
        accessibilityLabel="Order actions"
        actions={[
          { label: "Copy order number", systemImage: "doc.on.doc", onPress: () => copyText(number, "Order number") },
          { label: "Get help", systemImage: "questionmark.circle", onPress: () => Toast.info("Chat with us") },
          ...(state === "Processing" ? [{ label: "Cancel order", systemImage: "xmark.circle", destructive: true, onPress: () => setCancelling(true) }] : []),
        ]}
      />
      <DemoScreen
        secondary={state === "Delivered"}
        footer={
          state === "On the way" ? (
            <InsetFooter primaryCta={{ label: "Track on the map", onPress: () => Toast.info("Opening DPD tracking") }} />
          ) : state === "Delivered" ? (
            <InsetFooter primaryCta={{ label: "Buy again", onPress: () => router.push("/screens/shop/basket") }} secondaryCta={{ label: "Return an item", onPress: () => Toast.info("Returns") }} />
          ) : undefined
        }
      >
        {/* Status: a card washed in the state's colour, the icon on glass. */}
        <View style={{ marginHorizontal: GUTTER, marginBottom: 20 }}>
          <Card raised className="p-0">
            <View style={{ borderRadius: 24, borderCurve: "continuous", overflow: "hidden" }}>
              <LinearGradient colors={[`${tone}33`, `${tone}08`]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={{ padding: 18, gap: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                  <Glass size={52} tint={tone}>
                    <Icon size={24} color="#fff" strokeWidth={2} />
                  </Glass>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text weight="semibold" style={{ fontSize: 24, letterSpacing: -0.5 }}>{headline}</Text>
                    <Text weight="medium" style={{ fontSize: 14, color: colors.muted }}>{sub}</Text>
                  </View>
                </View>
                <Tracker reached={reached} tone={tone} />
              </View>
            </View>
          </Card>
        </View>

        {/* Order number and courier: the two things people copy. */}
        <View style={{ marginHorizontal: GUTTER, marginBottom: 24, gap: 10 }}>
          <CopyLine label="Order number" value={number} leading={<Numeral>{order.id.slice(-2)}</Numeral>} />
          <CopyLine
            label={state === "Processing" ? "DPD Predict, label created" : "DPD Predict, 1 parcel"}
            value="15502 8841 2207"
            leading={<CourierMark courier="DPD" size={44} />}
            trailing={state === "On the way" ? <ShareLink url="https://track.dpd.ie/15502884122207" label="Share" message="My parcel" /> : undefined}
          />
        </View>

        <Heading>{`${count} ${count === 1 ? "item" : "items"}`}</Heading>
        <SettingsGroup separatorInset={MEDIA_INSET}>
          {lines.map((l) => {
            const p = productById(l.product);
            return (
              <MediaRow
                key={l.product}
                image={p.photos[0]}
                title={p.name}
                subtitle={[p.colour, l.size ? `size ${l.size}` : null, l.qty > 1 ? `${l.qty} × ${euro(p.price)}` : null].filter(Boolean).join(", ")}
                trailing={euro(p.price * l.qty)}
                href={`/screens/shop/product/${p.id}`}
              />
            );
          })}
        </SettingsGroup>

        <Heading>Delivery</Heading>
        <View style={{ marginHorizontal: GUTTER, marginBottom: 24, flexDirection: "row", gap: 14 }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: `${tone}22`, alignItems: "center", justifyContent: "center" }}>
            <Home size={20} color={tone} strokeWidth={2} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text weight="semibold" style={{ fontSize: 16 }}>Aoife Byrne</Text>
            <Text weight="medium" style={{ fontSize: 15 }}>14 Clanbrassil Street, Dublin 8, D08 X2C4</Text>
            <Text weight="medium" style={{ fontSize: 14, color: colors.muted }}>Leave at the door. Standard delivery, free over €100</Text>
          </View>
        </View>

        <Heading>Payment</Heading>
        <View style={{ marginHorizontal: GUTTER, marginBottom: 14, flexDirection: "row", alignItems: "center", gap: 14 }}>
          <CardMark brand="visa" size={44} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text weight="semibold" style={{ fontSize: 16 }}>Visa ending 4242</Text>
            <Text weight="medium" style={{ fontSize: 14, color: colors.muted }}>{`Charged ${order.placed.replace("Today, ", "today at ")}`}</Text>
          </View>
          <Text weight="semibold" style={{ fontSize: 17, fontVariant: ["tabular-nums"] }}>{euro(order.total)}</Text>
        </View>
        <View style={{ marginHorizontal: GUTTER, marginBottom: 24, paddingTop: 12, gap: 8, borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
          <Line label={`Items (${count})`} value={euro(order.total)} />
          <Line label="Delivery" value="Free" color={colors.success} />
          <Line label="VAT included" value={euro(Math.round((order.total * 23) / 123))} />
          {order.status === "Refunded" ? <Line label="Refunded to Visa" value={`−${euro(order.total)}`} color={colors.error} /> : null}
        </View>

        <View style={{ marginHorizontal: GUTTER, marginBottom: 24, flexDirection: "row", gap: 10 }}>
          <Pill icon={<MessageCircle size={17} color={colors.text} strokeWidth={2} />} label="Message us" onPress={() => Toast.info("Chat with us")} />
          <Pill icon={<RotateCcw size={17} color={colors.text} strokeWidth={2} />} label="Returns until 10 Dec" onPress={() => Toast.info("Returns")} />
        </View>
      </DemoScreen>
      <ConfirmDialog
        visible={cancelling}
        onClose={() => setCancelling(false)}
        title={`Cancel order ${number}?`}
        message={`You get ${euro(order.total)} back on your Visa in 3 to 5 days.`}
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

/** A tinted Liquid Glass disc (plain tinted disc before iOS 26). */
function Glass({ size, tint, children }: { size: number; tint: string; children: ReactNode }) {
  const shape = { width: size, height: size, borderRadius: size / 2, alignItems: "center" as const, justifyContent: "center" as const };
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView glassEffectStyle="regular" tintColor={tint} style={shape}>
        {children}
      </GlassView>
    );
  }
  return <View style={[shape, { backgroundColor: tint }]}>{children}</View>;
}

/** Four steps as one bar in the state's colour, time under each step. */
function Tracker({ reached, tone }: { reached: number; tone: string }) {
  const colors = useThemeColors();
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {STEPS.map((s, i) => (
          <View key={s.label} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i < reached ? tone : `${colors.muted}33` }} />
        ))}
      </View>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {STEPS.map((s, i) => (
          <View key={s.label} style={{ flex: 1, gap: 1 }}>
            <Text weight={i === reached - 1 ? "semibold" : "medium"} numberOfLines={1} style={{ fontSize: 13, color: i < reached ? colors.text : colors.muted }}>{s.label}</Text>
            <Text weight="medium" numberOfLines={1} style={{ fontSize: 12, color: colors.muted, fontVariant: ["tabular-nums"] }}>{i < reached ? s.at : "Soon"}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** A copyable value on a raised card: mark, label over value, copy pill. */
function CopyLine({ label, value, leading, trailing }: { label: string; value: string; leading: ReactNode; trailing?: ReactNode }) {
  const colors = useThemeColors();
  return (
    <Card raised className="px-3.5 py-3">
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {leading}
        <View style={{ flex: 1, gap: 1 }}>
          <Text weight="medium" numberOfLines={1} style={{ fontSize: 13, color: colors.muted }}>{label}</Text>
          <Text weight="semibold" selectable style={{ fontSize: 17, letterSpacing: 0.2, fontVariant: ["tabular-nums"] }}>{value}</Text>
        </View>
        {trailing}
        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            copyText(value.replace(/\s/g, ""), label.startsWith("Order") ? "Order number" : "Tracking number");
          }}
          accessibilityRole="button"
          accessibilityLabel={`Copy ${label}`}
          hitSlop={8}
          style={({ pressed }) => ({ width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? colors.border : "transparent", borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border })}
        >
          <Copy size={17} color={colors.text} strokeWidth={2} />
        </Pressable>
      </View>
    </Card>
  );
}

/** The last two digits of the order in a black disc: the receipt mark. */
function Numeral({ children }: { children: string }) {
  const colors = useThemeColors();
  return (
    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.text, alignItems: "center", justifyContent: "center" }}>
      <Text weight="bold" style={{ fontSize: 16, color: colors.background, fontVariant: ["tabular-nums"] }}>{children}</Text>
    </View>
  );
}

function Heading({ children }: { children: string }) {
  return (
    <Text weight="semibold" accessibilityRole="header" style={{ fontSize: 20, letterSpacing: -0.4, marginHorizontal: GUTTER, marginBottom: 10 }}>
      {children}
    </Text>
  );
}

function Line({ label, value, color }: { label: string; value: string; color?: string }) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text weight="medium" style={{ fontSize: 15, color: colors.muted }}>{label}</Text>
      <Text weight="semibold" style={{ fontSize: 15, color: color ?? colors.text, fontVariant: ["tabular-nums"] }}>{value}</Text>
    </View>
  );
}

function Pill({ icon, label, onPress }: { icon: ReactNode; label: string; onPress: () => void }) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({ flex: 1, height: 44, borderRadius: 22, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border, backgroundColor: pressed ? colors.border : "transparent" })}
    >
      {icon}
      <Text weight="semibold" numberOfLines={1} style={{ fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}
