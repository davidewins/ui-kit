import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { CopyButton } from "@/components/ui/actions/CopyButton";
import { StepTracker } from "@/components/ui/feedback/StepTracker";
import { Timeline } from "@/components/ui/feedback/Timeline";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { BrandMark } from "@/components/ui/primitives/BrandMark";
import { IconTile } from "@/components/ui/primitives/IconTile";
import { TYPE } from "@/components/ui/primitives/type";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { MapPin, ReceiptText } from "lucide-react-native";
import { CUSTOMER, IN_TRANSIT, ITEMS, SCANS, STEPS, TRACKING, eur, itemCount, lineDetail, subtotal, total, vatIn } from "./data";
import { GUTTER, LEAD, Money, Row, TEXT_INSET, Thumb } from "./parts";

const PRODUCT_HREF = "/screens/orders/product-gallery";
/** A SectionHeader follows and brings its own gap. */
const FLUSH = { marginBottom: 0 };

// A courier order in transit, the way Apple Store and Shop show one: where it
// is as the headline, the four steps, then every scan DPD has made, newest
// first. The numbers people copy each sit on one row with a copy button.
export default function TrackTimeline() {
  const colors = useThemeColors();
  const hues = useHues();
  const order = IN_TRANSIT;
  const sum = total(order);

  return (
    <>
      <ActionMenu
        accessibilityLabel="Order actions"
        title={`Order ${order.number}`}
        actions={[
          { label: "Share tracking", systemImage: "square.and.arrow.up", onPress: () => Toast.info("Tracking link ready to share") },
          { label: "Get help", systemImage: "questionmark.circle", onPress: () => Toast.info("Chat with Runlab") },
        ]}
      />
      <DemoScreen footer={<InsetFooter primaryCta={{ label: "Change delivery", onPress: () => Toast.info("Opening DPD Predict") }} />}>
        <View style={{ paddingHorizontal: GUTTER, paddingTop: 4, rowGap: 4 }}>
          <Text weight="semibold" accessibilityRole="header" style={TYPE.display}>Arriving today</Text>
          <Text weight="medium" style={[TYPE.body, { color: colors.muted }]}>Between 13:00 and 14:00, 6 stops away</Text>
        </View>
        <View style={{ paddingHorizontal: GUTTER, marginTop: 18, marginBottom: 24 }}>
          <StepTracker steps={STEPS} current={2} tone={hues.blue} />
        </View>

        <View style={{ paddingHorizontal: GUTTER, marginBottom: 20 }}>
          <Timeline events={SCANS} tone={hues.blue} />
        </View>

        <SettingsGroup separatorInset={TEXT_INSET} style={FLUSH}>
          <Row
            leading={<BrandMark brand={TRACKING.courier} size={28} />}
            title={TRACKING.number}
            sub={`${TRACKING.service}, ${TRACKING.parcel}`}
            trailing={<CopyButton value={TRACKING.number.replace(/\s/g, "")} label="tracking number" />}
          />
          <Row
            leading={<IconTile Icon={ReceiptText} color={hues.gray} size={LEAD} />}
            title={order.number}
            sub={`Order placed ${order.placed}`}
            trailing={<CopyButton value={order.number} label="order number" />}
          />
        </SettingsGroup>

        <SectionHeader title="In the parcel" count={itemCount(order)} />
        <SettingsGroup separatorInset={TEXT_INSET} style={FLUSH}>
          {order.lines.map((l) => {
            const item = ITEMS[l.item];
            return (
              <Row
                key={l.item}
                leading={<Thumb source={item.photo} />}
                title={item.name}
                sub={[lineDetail(l), l.qty > 1 ? `${l.qty} at ${eur(item.price)}` : null].filter(Boolean).join(", ")}
                figure={eur(item.price * l.qty)}
                onPress={() => router.push(PRODUCT_HREF)}
              />
            );
          })}
        </SettingsGroup>

        <SectionHeader title="Delivery and payment" />
        <SettingsGroup separatorInset={TEXT_INSET} style={{ marginBottom: 12 }}>
          <Row leading={<IconTile Icon={MapPin} color={hues.red} size={LEAD} />} title={CUSTOMER.name} sub={`${CUSTOMER.street}, ${CUSTOMER.area}\n${CUSTOMER.note}`} lines={2} />
          <Row leading={<BrandMark brand={order.paidWith.brand} size={28} />} title={order.paidWith.label} sub={`Charged ${order.placed}`} />
        </SettingsGroup>
        <Money
          lines={[
            { label: `Subtotal, ${itemCount(order)} items`, value: eur(subtotal(order)) },
            { label: order.delivery.method, value: order.delivery.fee ? eur(order.delivery.fee) : "Free", good: !order.delivery.fee },
          ]}
          total={eur(sum)}
          vat={eur(vatIn(sum))}
        />
      </DemoScreen>
    </>
  );
}
