// A finished workout, the Strava / Apple Fitness way: what you did in one
// line, your heart across the session, where the time went by zone, what you
// beat, and where the weight went.
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { BarList } from "@/components/ui/data/BarList";
import { LineChart } from "@/components/ui/data/LineChart";
import { SegmentBar } from "@/components/ui/data/SegmentBar";
import { Badge } from "@/components/ui/feedback/Badge";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { DemoScreen, GUTTER } from "@/gallery/demo/parts";
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
  const minute = at === undefined ? null : Math.round((at / (HEART_RATE.length - 1)) * SUMMARY.minutes);

  return (
    <DemoScreen
      secondary
      footer={<InsetFooter primaryCta={{ label: "Done", onPress: () => Toast.info("Saved to your history") }} secondaryCta={{ label: "Share workout", onPress: () => Toast.info("Opening share") }} />}
    >
      <View style={{ paddingHorizontal: GUTTER, paddingTop: 4 }}>
        <Text weight="semibold" style={[TYPE.display, TABULAR]}>
          {SUMMARY.minutes}
          <Text weight="semibold" style={[TYPE.title, { color: colors.muted }]}> min</Text>
        </Text>
        <Text weight="medium" style={[TYPE.body, TABULAR, { marginTop: 4 }]}>
          {`${SUMMARY.kcal} kcal burned, ${SUMMARY.volume.toLocaleString("en-IE")} kg lifted across 14 sets`}
        </Text>
        <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, marginTop: 2 }]}>Thursday 12 November, 18:32 to 19:19</Text>
      </View>

      <SectionHeader title="Heart rate" />
      <View style={{ paddingHorizontal: GUTTER }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 16, marginBottom: 8 }}>
          <Text style={TABULAR}>
            <Text weight="semibold" style={[TYPE.title, { color: hues.red }]}>{at === undefined ? SUMMARY.avgHeart : HEART_RATE[at]}</Text>
            <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>{at === undefined ? " bpm average" : ` bpm at minute ${minute}`}</Text>
          </Text>
          <View style={{ flex: 1 }} />
          <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`Peak ${SUMMARY.maxHeart}`}</Text>
        </View>
        <LineChart series={[{ values: HEART_RATE, color: hues.red }]} area height={132} selected={at} onSelect={setAt} labels={["18:32", "18:48", "19:04", "19:19"]} accessibilityLabel="Heart rate across the session" />
        <View style={{ height: 18 }} />
        <SegmentBar segments={ZONES.map((z, i) => ({ label: z.label, value: z.minutes, display: `${z.minutes} min`, color: zoneColors[i] }))} />
      </View>

      <SectionHeader title="New bests" count={SUMMARY.records.length} />
      <View style={{ paddingHorizontal: GUTTER }}>
        {SUMMARY.records.map((r, i) => (
          <View key={r.lift} style={{ flexDirection: "row", alignItems: "center", columnGap: 12, paddingVertical: 10, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: hues.yellow, alignItems: "center", justifyContent: "center" }}>
              <Trophy size={19} color="#000" strokeWidth={2.2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text weight="semibold" style={TYPE.body}>{r.lift}</Text>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${r.what}, was ${r.was}`}</Text>
            </View>
            <View><Badge variant="success">{r.figure}</Badge></View>
          </View>
        ))}
      </View>

      <SectionHeader title="Where the weight went" />
      <View style={{ paddingHorizontal: GUTTER }}>
        <BarList items={[...SUMMARY.byExercise].sort((a, b) => b.value - a.value)} color={hues.green} />
      </View>
    </DemoScreen>
  );
}
