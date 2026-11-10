import { Card, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { QuickActions } from "@/components/ui/actions/QuickActions";
import { ProgressBar } from "@/components/ui/feedback/ProgressBar";
import { Timeline } from "@/components/ui/feedback/Timeline";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ThumbStack } from "@/components/ui/lists/ThumbStack";
import { IconTile } from "@/components/ui/primitives/IconTile";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Tile } from "@/components/ui/surfaces/Tile";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { MapPin, MessageCircle, Phone, Share2, ShoppingBag, Star } from "lucide-react-native";
import { CUSTOMER, LIVE, LIVE_EVENTS, LIVE_TRIP, RIDER, SHOP, eur, itemCount, itemNames, photosOf, total } from "./data";
import { GUTTER, LEAD, Row, TEXT_INSET } from "./parts";

const RECEIPT_HREF = "/screens/orders/receipt";

// A same-day order minutes from the door, the way Uber Eats and Deliveroo
// show one: how long, how far, who is carrying it and how to reach them, and
// the code they will ask for. What was ordered is one row, because nobody
// reads their basket while watching for a bike.
export default function TrackLive() {
  const colors = useThemeColors();
  const hues = useHues();
  const first = RIDER.name.split(" ")[0];
  const left = Math.round((LIVE_TRIP.of - LIVE_TRIP.done) * 1000);

  return (
    <>
      <ActionMenu
        accessibilityLabel="Order actions"
        title={`Order ${LIVE.number}`}
        actions={[
          { label: "Change drop-off note", systemImage: "square.and.pencil", onPress: () => Toast.info("Edit your note") },
          { label: "Get help", systemImage: "questionmark.circle", onPress: () => Toast.info("Chat with Runlab") },
        ]}
      />
      <DemoScreen>
        <View style={{ paddingHorizontal: GUTTER, paddingTop: 4, rowGap: 4 }}>
          <View accessible accessibilityRole="header" accessibilityLabel={`${LIVE_TRIP.minutes} minutes away`} style={{ flexDirection: "row", alignItems: "baseline", columnGap: 8 }}>
            <Text weight="semibold" style={[TYPE.numeral, TABULAR]}>{LIVE_TRIP.minutes}</Text>
            <Text weight="semibold" style={TYPE.title}>min away</Text>
          </View>
          <Text weight="medium" style={[TYPE.body, TABULAR, { color: colors.muted }]}>{`${first} is ${LIVE_TRIP.where}, due at ${LIVE_TRIP.eta}`}</Text>
        </View>
        <View style={{ paddingHorizontal: GUTTER, marginTop: 18, marginBottom: 24, rowGap: 8 }}>
          <ProgressBar value={LIVE_TRIP.done / LIVE_TRIP.of} color={colors.success} accessibilityLabel="Distance covered" />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text weight="medium" style={[TYPE.caption, { color: colors.muted }]}>{`${SHOP.name}, ${SHOP.street}`}</Text>
            <Text weight="semibold" style={[TYPE.caption, TABULAR]}>{`${left} m of ${LIVE_TRIP.of} km to go`}</Text>
          </View>
        </View>

        <View style={{ marginHorizontal: GUTTER, marginBottom: 24 }}>
          <Card raised>
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, marginBottom: 16 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: hues.teal, alignItems: "center", justifyContent: "center" }}>
                <Text weight="semibold" style={[TYPE.headline, { color: colors.onVariant }]}>{RIDER.name.split(" ").map((w) => w[0]).join("")}</Text>
              </View>
              <View style={{ flex: 1, rowGap: 2 }}>
                <Text weight="semibold" numberOfLines={1} style={TYPE.headline}>{RIDER.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", columnGap: 4 }}>
                  <Star size={12} color={hues.yellow} fill={hues.yellow} />
                  <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { flex: 1, color: colors.muted }]}>
                    <Text weight="semibold" style={{ color: colors.text }}>{RIDER.rating}</Text>
                    {` from ${RIDER.trips}, ${RIDER.vehicle.toLowerCase()}`}
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
          </Card>
        </View>

        <View accessible accessibilityLabel={`Handover code ${LIVE_TRIP.code.split("").join(" ")}`} style={{ flexDirection: "row", alignItems: "center", columnGap: 12, paddingHorizontal: GUTTER, marginBottom: 20 }}>
          <View style={{ flex: 1, rowGap: 2 }}>
            <Text weight="semibold" style={TYPE.headline}>Handover code</Text>
            <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>{`${first} asks for it at the door`}</Text>
          </View>
          <View style={{ flexDirection: "row", columnGap: 6 }}>
            {LIVE_TRIP.code.split("").map((d, i) => (
              <Tile key={i} style={{ width: 38, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center", padding: 0 }}>
                <Text weight="semibold" style={[TYPE.title, TABULAR]}>{d}</Text>
              </Tile>
            ))}
          </View>
        </View>

        <SettingsGroup separatorInset={TEXT_INSET} style={{ marginBottom: 0 }}>
          <Row
            leading={<IconTile Icon={ShoppingBag} color={hues.orange} size={LEAD} />}
            title={itemNames(LIVE)}
            sub={`${itemCount(LIVE)} items, ${eur(total(LIVE))} with ${LIVE.paidWith.label}`}
            trailing={<ThumbStack images={photosOf(LIVE)} size={36} label={`${itemCount(LIVE)} items`} />}
            onPress={() => router.push(RECEIPT_HREF)}
          />
          <Row leading={<IconTile Icon={MapPin} color={hues.red} size={LEAD} />} title={CUSTOMER.street} sub={`${CUSTOMER.area}\n${CUSTOMER.note}`} lines={2} />
        </SettingsGroup>

        <SectionHeader title="So far" />
        <View style={{ paddingHorizontal: GUTTER }}>
          <Timeline events={LIVE_EVENTS} tone={colors.success} />
        </View>
      </DemoScreen>
    </>
  );
}
