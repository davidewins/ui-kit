import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { CopyButton } from "@/components/ui/actions/CopyButton";
import { ShareLink } from "@/components/ui/actions/ShareLink";
import { StepTracker } from "@/components/ui/feedback/StepTracker";
import { Timeline } from "@/components/ui/feedback/Timeline";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { Popover } from "@/components/ui/overlays/Popover";
import { BrandMark } from "@/components/ui/primitives/BrandMark";
import { IconTile } from "@/components/ui/primitives/IconTile";
import { TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { MapPin, ReceiptText } from "lucide-react-native";
import { CUSTOMER, IN_TRANSIT, ITEMS, SCANS, STEPS, TRACKING, eur, itemCount, lineDetail, subtotal, total, vatIn } from "./data";
import { LEAD, Money, Row, RowPanel, Thumb, copyText, timeFirst } from "./parts";

const PRODUCT_HREF = "/screens/orders/product-gallery";
const TRACKING_URL = `https://runlab.example/track/${IN_TRANSIT.number}`;
/** Panels that follow one another with no header between them. */
const NEXT = { marginTop: 12 };

// A courier order in transit, the way Apple Store and Shop show one: where it
// is as the headline with the four steps, then every scan DPD has
// made, newest first, the numbers people copy each on one row with a copy
// button, what is in the parcel, and where and how it was paid. Each block is
// its own panel; long press a number or an item for its actions.
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
        <Panel style={{ marginTop: 4 }}>
          <Text weight="semibold" accessibilityRole="header" style={TYPE.display}>Arriving today</Text>
          <Text weight="medium" style={[TYPE.body, { color: colors.muted, marginTop: 4 }]}>Between 13:00 and 14:00, 6 stops away</Text>
          <View style={{ marginTop: 18 }}>
            <StepTracker steps={STEPS} current={2} tone={hues.blue} />
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
            <ShareLink url={TRACKING_URL} label="Share tracking" message={`Track Runlab order ${order.number}:`} />
            <Popover label="About the window" systemImage="info.circle">
              <View style={{ width: 280, padding: 16, rowGap: 8 }}>
                <Text weight="medium" style={TYPE.body}>DPD Predict sets a one hour window once your parcel is on the van.</Text>
                <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>Marek has 6 stops before yours, so it can still move a little earlier.</Text>
              </View>
            </Popover>
          </View>
        </Panel>

        <Panel style={NEXT}>
          <Timeline events={timeFirst(SCANS)} tone={hues.blue} />
        </Panel>

        <RowPanel style={NEXT}>
          <ContextMenu
            actions={[
              { label: "Copy tracking number", systemImage: "doc.on.doc", onPress: () => copyText(TRACKING.number.replace(/\s/g, ""), "Tracking number copied") },
              { label: "Open in DPD", systemImage: "arrow.up.forward.app", onPress: () => Toast.info("Opening DPD") },
            ]}
          >
            <Row
              leading={<BrandMark brand={TRACKING.courier} size={28} />}
              title={TRACKING.number}
              sub={`${TRACKING.service}, ${TRACKING.parcel}`}
              trailing={<CopyButton value={TRACKING.number.replace(/\s/g, "")} label="tracking number" />}
            />
          </ContextMenu>
          <ContextMenu
            actions={[
              { label: "Copy order number", systemImage: "doc.on.doc", onPress: () => copyText(order.number, "Order number copied") },
              { label: "Get help with this order", systemImage: "questionmark.circle", onPress: () => Toast.info("Chat with Runlab") },
            ]}
          >
            <Row
              leading={<IconTile Icon={ReceiptText} color={hues.gray} size={LEAD} />}
              title={order.number}
              sub={`Order placed ${order.placed}`}
              trailing={<CopyButton value={order.number} label="order number" />}
            />
          </ContextMenu>
        </RowPanel>

        <SectionHeader title={`${itemCount(order)} items in the parcel`} />
        <RowPanel>
          {order.lines.map((l) => {
            const item = ITEMS[l.item];
            return (
              <ContextMenu
                key={l.item}
                actions={[
                  { label: "View product", systemImage: "bag", onPress: () => router.push(PRODUCT_HREF) },
                  { label: "Buy again", systemImage: "bag.badge.plus", onPress: () => Toast.success(`${item.name} added to your bag`) },
                ]}
              >
                <Row
                  leading={<Thumb source={item.photo} />}
                  title={item.name}
                  sub={[lineDetail(l), l.qty > 1 ? `${l.qty} at ${eur(item.price)}` : null].filter(Boolean).join(", ")}
                  figure={eur(item.price * l.qty)}
                  onPress={() => router.push(PRODUCT_HREF)}
                />
              </ContextMenu>
            );
          })}
        </RowPanel>

        <SectionHeader title="Delivery and payment" />
        <RowPanel>
          <ContextMenu
            actions={[
              { label: "Copy address", systemImage: "doc.on.doc", onPress: () => copyText(`${CUSTOMER.name}, ${CUSTOMER.street}, ${CUSTOMER.area}`, "Address copied") },
              { label: "Change delivery", systemImage: "calendar.badge.clock", onPress: () => Toast.info("Opening DPD Predict") },
            ]}
          >
            <Row leading={<IconTile Icon={MapPin} color={hues.red} size={LEAD} />} title={CUSTOMER.name} sub={`${CUSTOMER.street}, ${CUSTOMER.area}\n${CUSTOMER.note}`} lines={3} />
          </ContextMenu>
          <Row leading={<BrandMark brand={order.paidWith.brand} size={28} />} title={order.paidWith.label} sub={`Charged ${order.placed}`} />
        </RowPanel>
        <Panel style={NEXT}>
          <Money
            inset={0}
            lines={[
              { label: `Subtotal, ${itemCount(order)} items`, value: eur(subtotal(order)) },
              { label: order.delivery.method, value: order.delivery.fee ? eur(order.delivery.fee) : "Free", good: !order.delivery.fee },
            ]}
            total={eur(sum)}
            vat={eur(vatIn(sum))}
          />
        </Panel>
      </DemoScreen>
    </>
  );
}
