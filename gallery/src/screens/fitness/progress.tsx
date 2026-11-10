// Training progress over months: how often (heatmap), how much (weekly
// volume you can tap), how strong (estimated one-rep max per lift, picked
// from the list under the chart) and where the work went (ranking).
import { Sparkline } from "@/components/analytics/Sparkline";
import { Text, View } from "@/components/ui";
import { BarChart } from "@/components/ui/data/BarChart";
import { BarList } from "@/components/ui/data/BarList";
import { Heatmap } from "@/components/ui/data/Heatmap";
import { LineChart } from "@/components/ui/data/LineChart";
import { Trend } from "@/components/ui/data/Trend";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { DemoScreen, GUTTER } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable } from "react-native";
import { CONSISTENCY, LIFTS, MUSCLES, VOLUME_WEEKS } from "./data";

export default function FitnessProgress() {
  const colors = useThemeColors();
  const hues = useHues();
  const [week, setWeek] = useState(VOLUME_WEEKS.length - 1);
  const [lift, setLift] = useState(0);
  const liftColors = [hues.blue, hues.orange, hues.pink, hues.teal];
  const sessions = CONSISTENCY.flat().filter((v) => v > 0).length;
  const prev = VOLUME_WEEKS[Math.max(0, week - 1)].value;
  const change = Math.round(((VOLUME_WEEKS[week].value - prev) / prev) * 100);
  const selected = LIFTS[lift];
  const gain = selected.values[selected.values.length - 1] - selected.values[0];

  return (
    <DemoScreen>
      {/* How often. */}
      <View style={{ paddingHorizontal: GUTTER, paddingTop: 4 }}>
        <Text style={TABULAR}>
          <Text weight="semibold" style={TYPE.display}>{sessions}</Text>
          <Text weight="semibold" style={[TYPE.title, { color: colors.muted }]}> sessions</Text>
        </Text>
        <Text weight="medium" style={[TYPE.body, TABULAR, { color: colors.muted, marginTop: 2, marginBottom: 14 }]}>{`In 16 weeks, ${(sessions / 16).toFixed(1)} a week. One week missed, in October.`}</Text>
        <Heatmap columns={CONSISTENCY} color={hues.green} gap={4} rowLabels={["M", "", "W", "", "F", "", "S"]} columnLabels={["Aug", "Sep", "Oct", "Nov"]} accessibilityLabel="Training days over 16 weeks" />
      </View>

      <SectionHeader title="Weekly volume" />
      <View style={{ paddingHorizontal: GUTTER }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 10, marginBottom: 10 }}>
          <Text style={TABULAR}>
            <Text weight="semibold" style={TYPE.title}>{VOLUME_WEEKS[week].value.toFixed(1)}</Text>
            <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}> tonnes</Text>
          </Text>
          {week > 0 ? <Trend value={`${Math.abs(change)}%`} direction={change >= 0 ? "up" : "down"} note="on the week before" /> : null}
        </View>
        <BarChart data={VOLUME_WEEKS} selected={week} onSelect={setWeek} goal={12} format={(v) => `${v.toFixed(1)} t`} height={148} accessibilityLabel="Tonnes lifted per week" />
      </View>

      <SectionHeader title="Estimated one-rep max" />
      <View style={{ paddingHorizontal: GUTTER }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 10, marginBottom: 8 }}>
          <Text style={TABULAR}>
            <Text weight="semibold" style={[TYPE.title, { color: liftColors[lift] }]}>{selected.values[selected.values.length - 1]}</Text>
            <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>{` kg, ${selected.name.toLowerCase()}`}</Text>
          </Text>
          <Trend value={`${gain} kg`} direction="up" note="in 12 weeks" />
        </View>
        <LineChart series={[{ values: selected.values, color: liftColors[lift] }]} area height={140} labels={["Aug", "Sep", "Oct", "Nov"]} accessibilityLabel={`${selected.name} estimated one-rep max`} />
      </View>
      <View style={{ marginTop: 10 }}>
        {LIFTS.map((l, i) => {
          const on = i === lift;
          return (
            <Pressable
              key={l.name}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setLift(i);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${l.name}, best ${l.best}`}
              style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", columnGap: 12, height: 52, paddingHorizontal: GUTTER, backgroundColor: pressed ? colors.border : "transparent" })}
            >
              <View style={{ width: 4, height: 28, borderRadius: 2, backgroundColor: liftColors[i], opacity: on ? 1 : 0.3 }} />
              <View style={{ flex: 1 }}>
                <Text weight={on ? "semibold" : "medium"} style={TYPE.body}>{l.name}</Text>
                <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`Best ${l.best}, ${l.when}`}</Text>
              </View>
              <Sparkline values={l.values} width={64} height={26} color={on ? liftColors[i] : colors.muted} />
              <Text weight="semibold" style={[TYPE.body, TABULAR, { width: 58, textAlign: "right" }]}>{`${l.values[l.values.length - 1]} kg`}</Text>
            </Pressable>
          );
        })}
      </View>

      <SectionHeader title="Sets by muscle" count="4 weeks" />
      <View style={{ paddingHorizontal: GUTTER }}>
        <BarList items={MUSCLES} color={hues.orange} />
      </View>
    </DemoScreen>
  );
}
