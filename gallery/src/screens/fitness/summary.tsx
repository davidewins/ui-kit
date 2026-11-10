// A finished workout, the Strava / Apple Fitness way: what you did, your
// heart across the session, where the time went by zone, what you beat, and
// where the weight went. Each on its own surface.
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ShareLink } from "@/components/ui/actions/ShareLink";
import { BarList } from "@/components/ui/data/BarList";
import { LineChart } from "@/components/ui/data/LineChart";
import { SegmentBar } from "@/components/ui/data/SegmentBar";
import { Badge } from "@/components/ui/feedback/Badge";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { IconTile } from "@/components/ui/primitives/IconTile";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { Popover } from "@/components/ui/overlays/Popover";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Trophy } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { HEART_RATE, SUMMARY, ZONES } from "./data";

export default function FitnessSummary() {
  const colors = useThemeColors();
  const hues = useHues();
  const [at, setAt] = useState<number | undefined>(undefined);
  const zoneColors = [hues.gray, hues.cyan, hues.green, hues.orange, hues.red];
  const [deleting, setDeleting] = useState(false);
  const minute = at === undefined ? null : Math.round((at / (HEART_RATE.length - 1)) * SUMMARY.minutes);

  return (
    <>
    <ActionMenu
      title="Lower body power"
      accessibilityLabel="Workout actions"
      actions={[
        { label: "Edit sets", systemImage: "pencil", onPress: () => Toast.info("Editing sets") },
        { label: "Save as a routine", systemImage: "bookmark", onPress: () => Toast.success("Saved to your routines") },
        { label: "Delete workout", systemImage: "trash", destructive: true, onPress: () => setDeleting(true) },
      ]}
    />
    <DemoScreen footer={<InsetFooter primaryCta={{ label: "Done", onPress: () => Toast.info("Saved to your history") }} />}>
      <Panel glass>
        <Text weight="semibold" style={[TYPE.display, TABULAR]}>{`${SUMMARY.minutes} minutes`}</Text>
        <Text weight="medium" style={[TYPE.body, TABULAR, { marginTop: 4 }]}>
          {`${SUMMARY.kcal} kcal burned, ${SUMMARY.volume.toLocaleString("en-IE")} kg lifted across 14 sets`}
        </Text>
        <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, marginTop: 2 }]}>Thursday 12 November, 18:32 to 19:19</Text>
        <View style={{ flexDirection: "row", marginTop: 14 }}>
          <ShareLink url="https://zesty.example/w/lower-body-power-12-nov" label="Share workout" message="47 minutes, 6,840 kg lifted, two new bests" />
        </View>
      </Panel>

      <SectionHeader title="Heart rate" />
      <Panel>
        <Text weight="semibold" style={[TYPE.title, TABULAR, { color: hues.red }]}>
          {at === undefined ? `${SUMMARY.avgHeart} bpm average` : `${HEART_RATE[at]} bpm at minute ${minute}`}
        </Text>
        <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, marginBottom: 10 }]}>{`Peak ${SUMMARY.maxHeart} bpm. Drag the line to read any minute.`}</Text>
        <LineChart series={[{ values: HEART_RATE, color: hues.red }]} area height={132} selected={at} onSelect={setAt} labels={["18:32", "18:48", "19:04", "19:19"]} accessibilityLabel="Heart rate across the session" />
        <View style={{ height: 18 }} />
        <SegmentBar segments={ZONES.map((z, i) => ({ label: z.label, value: z.minutes, display: `${z.minutes} min`, color: zoneColors[i] }))} />
        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <Popover label="What the zones mean" systemImage="info.circle">
            <View style={{ width: 280, padding: 16, rowGap: 8 }}>
              <Text weight="medium" style={TYPE.body}>Zones are bands of your maximum heart rate, 187 bpm for you.</Text>
              <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>Zone 3, 131 to 149 bpm, is where most strength work sits. Zone 5 is above 168 and should be seconds, not minutes.</Text>
            </View>
          </Popover>
        </View>
      </Panel>

      <SectionHeader title="New bests" />
      <Panel flush>
        {SUMMARY.records.map((r, i) => (
          <View key={r.lift} style={{ flexDirection: "row", alignItems: "center", columnGap: 12, paddingVertical: 12, paddingHorizontal: 16, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}>
            <IconTile Icon={Trophy} color={hues.yellow} glyph="#000" round />
            <View style={{ flex: 1 }}>
              <Text weight="semibold" style={TYPE.body}>{r.lift}</Text>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${r.what}, was ${r.was}`}</Text>
            </View>
            <View><Badge variant="success">{r.figure}</Badge></View>
          </View>
        ))}
      </Panel>

      <SectionHeader title="Where the weight went" />
      <Panel>
        <BarList items={[...SUMMARY.byExercise].sort((a, b) => b.value - a.value)} color={hues.green} />
      </Panel>
    </DemoScreen>
    <ConfirmDialog
      visible={deleting}
      onClose={() => setDeleting(false)}
      title="Delete this workout?"
      message="Its 14 sets and both new bests come off your history. You cannot undo this."
      confirmLabel="Delete workout"
      destructive
      onConfirm={() => Toast.success("Workout deleted")}
    />
    </>
  );
}
