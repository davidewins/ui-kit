import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Card, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { CopyButton } from "@/components/ui/actions/CopyButton";
import { StepTracker } from "@/components/ui/feedback/StepTracker";
import { BrandMark } from "@/components/ui/primitives/BrandMark";
import { IconTile } from "@/components/ui/primitives/IconTile";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { MapPin, Phone, ReceiptText } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { CUSTOMER, IN_TRANSIT, ITEMS, STEPS, TRACKING, eur, itemCount, lineDetail, subtotal, total, vatIn } from "./data";
import { GUTTER, Money, Row, Thumb } from "./parts";

const TIMELINE_HREF = "/screens/orders/track-timeline";
const ROW = 48;

// The whole order on one docket, nothing below the fold: VOID's order screen.
// Status and steps at the top, the two numbers you copy, what is in it, what
// it cost, how it was paid and where it is going. One card, hairlines between
// its parts, 48pt rows.
export default function Compact() {
  const colors = useThemeColors();
  const hues = useHues();
  const order = IN_TRANSIT;
  const sum = total(order);
  const rule = <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />;

  return (
    <>
      <ActionMenu
        accessibilityLabel="Order actions"
        title={`Order ${order.number}`}
        buttons={[{ label: "Call DPD", systemImage: "phone", icon: Phone, onPress: () => Toast.info("Calling DPD") }]}
        actions={[
          { label: "Change delivery", systemImage: "calendar", onPress: () => Toast.info("Opening DPD Predict") },
          { label: "Get help", systemImage: "questionmark.circle", onPress: () => Toast.info("Chat with Runlab") },
        ]}
      />
      <DemoScreen footer={<InsetFooter primaryCta={{ label: "See every scan", onPress: () => router.push(TIMELINE_HREF) }} />}>
        <View style={{ marginHorizontal: GUTTER }}>
          <Card raised className="p-0">
            <View style={{ padding: 16, rowGap: 14 }}>
              <View style={{ rowGap: 2 }}>
                <Text weight="semibold" accessibilityRole="header" style={TYPE.title}>Arriving today</Text>
                <Text weight="medium" style={[TYPE.body, TABULAR, { color: colors.muted }]}>13:00 to 14:00, on the van since 08:02</Text>
              </View>
              <StepTracker steps={STEPS} current={2} tone={hues.blue} />
            </View>
            {rule}
            <View style={{ paddingVertical: 4 }}>
              <Row
                height={ROW}
                leading={<BrandMark brand={TRACKING.courier} size={28} />}
                title={TRACKING.number}
                sub={`${TRACKING.service}, ${TRACKING.parcel}`}
                trailing={<CopyButton value={TRACKING.number.replace(/\s/g, "")} label="tracking number" />}
              />
              <Row
                height={ROW}
                leading={<IconTile Icon={ReceiptText} color={hues.gray} size={40} />}
                title={order.number}
                sub={`Order placed ${order.placed}`}
                trailing={<CopyButton value={order.number} label="order number" />}
              />
            </View>
            {rule}
            <View style={{ paddingVertical: 4 }}>
              {order.lines.map((l) => {
                const item = ITEMS[l.item];
                return (
                  <Row
                    key={l.item}
                    height={ROW}
                    leading={<Thumb source={item.photo} size={40} />}
                    title={item.name}
                    sub={[lineDetail(l), l.qty > 1 ? `${l.qty} at ${eur(item.price)}` : null].filter(Boolean).join(", ")}
                    figure={eur(item.price * l.qty)}
                  />
                );
              })}
            </View>
            {rule}
            <View style={{ paddingVertical: 14 }}>
              <Money
                lines={[
                  { label: `Subtotal, ${itemCount(order)} items`, value: eur(subtotal(order)) },
                  { label: order.delivery.method, value: order.delivery.fee ? eur(order.delivery.fee) : "Free", good: !order.delivery.fee },
                ]}
                total={eur(sum)}
                vat={eur(vatIn(sum))}
                paid={{ mark: <BrandMark brand={order.paidWith.brand} size={16} />, label: order.paidWith.label }}
              />
            </View>
            {rule}
            <View style={{ paddingVertical: 4 }}>
              <Row height={ROW} leading={<IconTile Icon={MapPin} color={hues.red} size={40} />} title={`${CUSTOMER.name}, ${CUSTOMER.street}`} sub={`${CUSTOMER.area}. ${CUSTOMER.note}`} />
            </View>
          </Card>
        </View>
      </DemoScreen>
    </>
  );
}
