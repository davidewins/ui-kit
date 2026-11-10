import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { QuickActions } from "@/components/ui/actions/QuickActions";
import { ProgressBar } from "@/components/ui/feedback/ProgressBar";
import { Timeline } from "@/components/ui/feedback/Timeline";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { ThumbStack } from "@/components/ui/lists/ThumbStack";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { Popover } from "@/components/ui/overlays/Popover";
import { IconTile } from "@/components/ui/primitives/IconTile";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { Tile } from "@/components/ui/surfaces/Tile";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { MapPin, MessageCircle, Phone, Share2, ShoppingBag, Star } from "lucide-react-native";
import { useState } from "react";
import { CUSTOMER, LIVE, LIVE_EVENTS, LIVE_TRIP, RIDER, SHOP, eur, itemCount, itemNames, photosOf, total } from "./data";
import { LEAD, Row, RowPanel, copyText, timeFirst } from "./parts";

const RECEIPT_HREF = "/screens/orders/receipt";
/** Panels that follow one another with no header between them. */
const NEXT = { marginTop: 12 };

// A same-day order minutes from the door, the way Uber Eats and Deliveroo
// show one: how long and how far on the glass panel at the top, who is
// carrying it and how to reach them, the code they will ask for, then the
// order and the address as two rows. What was ordered is one row, because
// nobody reads their basket while watching for a bike.
export default function TrackLive() {
  const colors = useThemeColors();
  const hues = useHues();
  const first = RIDER.name.split(" ")[0];
  const left = Math.round((LIVE_TRIP.of - LIVE_TRIP.done) * 1000);
  const [cancelling, setCancelling] = useState(false);

  return (
    <>
      <ActionMenu
        accessibilityLabel="Order actions"
        title={`Order ${LIVE.number}`}
        actions={[
          { label: "Change drop-off note", systemImage: "square.and.pencil", onPress: () => Toast.info("Edit your note") },
          { label: "Get help", systemImage: "questionmark.circle", onPress: () => Toast.info("Chat with Runlab") },
          { label: "Cancel order", systemImage: "xmark.circle", destructive: true, onPress: () => setCancelling(true) },
        ]}
      />
      <DemoScreen>
        <Panel glass style={{ marginTop: 4 }}>
          <Text weight="semibold" accessibilityRole="header" style={[TYPE.numeral, TABULAR]}>{`${LIVE_TRIP.minutes} min away`}</Text>
          <Text weight="medium" style={[TYPE.body, TABULAR, { color: colors.muted, marginTop: 4 }]}>{`${first} is ${LIVE_TRIP.where}, due at ${LIVE_TRIP.eta}`}</Text>
          <View style={{ marginTop: 18, rowGap: 8 }}>
            <ProgressBar value={LIVE_TRIP.done / LIVE_TRIP.of} color={colors.success} accessibilityLabel="Distance covered" />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text weight="medium" style={[TYPE.caption, { color: colors.muted }]}>{`${SHOP.name}, ${SHOP.street}`}</Text>
              <Text weight="medium" style={[TYPE.caption, TABULAR, { color: colors.muted }]}>{`${left} m of ${LIVE_TRIP.of} km to go`}</Text>
            </View>
          </View>
        </Panel>

        <Panel style={NEXT}>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, marginBottom: 16 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: hues.teal, alignItems: "center", justifyContent: "center" }}>
              <Text weight="semibold" style={[TYPE.headline, { color: colors.onVariant }]}>{RIDER.name.split(" ").map((w) => w[0]).join("")}</Text>
            </View>
            <View style={{ flex: 1, rowGap: 2 }}>
              <Text weight="semibold" numberOfLines={1} style={TYPE.headline}>{RIDER.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", columnGap: 4 }}>
                <Star size={12} color={hues.yellow} fill={hues.yellow} />
                <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { flex: 1, color: colors.muted }]}>
                  {`${RIDER.rating} from ${RIDER.trips}, ${RIDER.vehicle.toLowerCase()}`}
                </Text>
              </View>
            </View>
          </View>
          <QuickActions
            actions={[
              { icon: Phone, label: "Call", onPress: () => Toast.info(`Calling ${first}`) },
              { icon: MessageCircle, label: "Message", onPress: () => Toast.info(`Message ${first}`) },
              { icon: Share2, label: "Share arrival", onPress: () => Toast.info("Live link ready to share") },
            ]}
          />
        </Panel>

        <Panel style={NEXT}>
          <View accessible accessibilityLabel={`Handover code ${LIVE_TRIP.code.split("").join(" ")}`} style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
            <View style={{ flex: 1, rowGap: 2 }}>
              <Text weight="semibold" style={TYPE.headline}>Handover code</Text>
              <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>{`${first} asks for it at the door`}</Text>
            </View>
            <View style={{ flexDirection: "row", columnGap: 6 }}>
              {LIVE_TRIP.code.split("").map((d, i) => (
                <Tile key={i} style={{ width: 38, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center", padding: 0, backgroundColor: colors.surfaceElevated }}>
                  <Text weight="semibold" style={[TYPE.title, TABULAR]}>{d}</Text>
                </Tile>
              ))}
            </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: 14 }}>
            <Popover label="Why a code" systemImage="info.circle">
              <View style={{ width: 280, padding: 16, rowGap: 8 }}>
                <Text weight="medium" style={TYPE.body}>{`${first} can only complete the delivery by entering your code.`}</Text>
                <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>It keeps your order from being handed to the wrong door. Give it to nobody but the rider in front of you.</Text>
              </View>
            </Popover>
          </View>
        </Panel>

        <RowPanel style={NEXT}>
          <ContextMenu
            actions={[
              { label: "View receipt", systemImage: "doc.text", onPress: () => router.push(RECEIPT_HREF) },
              { label: "Copy order number", systemImage: "doc.on.doc", onPress: () => copyText(LIVE.number, "Order number copied") },
            ]}
          >
            <Row
              leading={<IconTile Icon={ShoppingBag} color={hues.orange} size={LEAD} />}
              title={itemNames(LIVE)}
              sub={`${itemCount(LIVE)} items, ${eur(total(LIVE))} with ${LIVE.paidWith.label}`}
              trailing={<ThumbStack images={photosOf(LIVE)} size={36} ringColor={colors.card} label={`${itemCount(LIVE)} items`} />}
              onPress={() => router.push(RECEIPT_HREF)}
            />
          </ContextMenu>
          <ContextMenu
            actions={[
              { label: "Change drop-off note", systemImage: "square.and.pencil", onPress: () => Toast.info("Edit your note") },
              { label: "Copy address", systemImage: "doc.on.doc", onPress: () => copyText(`${CUSTOMER.street}, ${CUSTOMER.area}`, "Address copied") },
            ]}
          >
            <Row leading={<IconTile Icon={MapPin} color={hues.red} size={LEAD} />} title={CUSTOMER.street} sub={`${CUSTOMER.area}\n${CUSTOMER.note}`} lines={2} />
          </ContextMenu>
        </RowPanel>

        <SectionHeader title="So far" />
        <Panel>
          <Timeline events={timeFirst(LIVE_EVENTS)} tone={colors.success} />
        </Panel>
      </DemoScreen>
      <ConfirmDialog
        visible={cancelling}
        onClose={() => setCancelling(false)}
        title={`Cancel order ${LIVE.number}?`}
        message={`${first} is ${LIVE_TRIP.minutes} minutes away with it, so the ${eur(total(LIVE))} is not refunded. You cannot undo this.`}
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
        destructive
        onConfirm={() => Toast.success("Order cancelled")}
      />
    </>
  );
}
