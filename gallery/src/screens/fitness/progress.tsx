// Training progress over months: how often (heatmap), how much (weekly
// volume you can tap), how strong (estimated one-rep max per lift, picked
// from the list under the chart) and where the work went (ranking).
import { Sparkline } from "@/components/analytics/Sparkline";
import { Text, View } from "@/components/ui";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { Menu } from "@/components/ui/actions/Menu";
import { BarChart } from "@/components/ui/data/BarChart";
import { BarList } from "@/components/ui/data/BarList";
import { Heatmap } from "@/components/ui/data/Heatmap";
import { LineChart } from "@/components/ui/data/LineChart";
import { Trend } from "@/components/ui/data/Trend";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { Popover } from "@/components/ui/overlays/Popover";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { CONSISTENCY, LIFTS, MUSCLES, VOLUME_WEEKS } from "./data";

export default function FitnessProgress() {
  const colors = useThemeColors();
  const hues = useHues();
  const [week, setWeek] = useState(VOLUME_WEEKS.length - 1);
  const [lift, setLift] = useState(0);
  const [range, setRange] = useState("16 weeks");
  const liftColors = [hues.blue, hues.orange, hues.pink, hues.teal];
  const sessions = CONSISTENCY.flat().filter((v) => v > 0).length;
  const prev = VOLUME_WEEKS[Math.max(0, week - 1)].value;
  const change = Math.round(((VOLUME_WEEKS[week].value - prev) / prev) * 100);
  const selected = LIFTS[lift];
  const gain = selected.values[selected.values.length - 1] - selected.values[0];

  return (
    <DemoScreen>
      {/* How often. */}
      <Panel glass>
        <Text weight="semibold" style={[TYPE.display, TABULAR]}>{`${sessions} sessions`}</Text>
        <Text weight="medium" style={[TYPE.body, TABULAR, { marginTop: 2, marginBottom: 14 }]}>{`In 16 weeks, ${(sessions / 16).toFixed(1)} a week. One week missed, in October.`}</Text>
        <Heatmap columns={CONSISTENCY} color={hues.green} gap={4} rowLabels={["M", "", "W", "", "F", "", "S"]} columnLabels={["Aug", "Sep", "Oct", "Nov"]} accessibilityLabel="Training days over 16 weeks" />
        <View style={{ flexDirection: "row", marginTop: 14 }}>
          <Menu label={range} systemImage="calendar" items={["4 weeks", "16 weeks", "1 year", "All time"].map((r) => ({ label: r, selected: r === range, onPress: () => setRange(r) }))} />
        </View>
      </Panel>

      <SectionHeader title="Weekly volume" />
      <Panel>
        <Text weight="semibold" style={[TYPE.title, TABULAR]}>{`${VOLUME_WEEKS[week].value.toFixed(1)} tonnes`}</Text>
        <View style={{ marginTop: 2, marginBottom: 12 }}>
          {week > 0 ? <Trend value={`${Math.abs(change)}%`} direction={change >= 0 ? "up" : "down"} note="on the week before" /> : <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>First week on record</Text>}
        </View>
        <BarChart data={VOLUME_WEEKS} selected={week} onSelect={setWeek} goal={12} format={(v) => `${v.toFixed(1)} t`} height={148} accessibilityLabel="Tonnes lifted per week" />
      </Panel>

      <SectionHeader title="Estimated one-rep max" />
      <Panel flush>
        <View style={{ padding: 16, paddingBottom: 8 }}>
          <Text weight="semibold" style={[TYPE.title, TABULAR, { color: liftColors[lift] }]}>{`${selected.values[selected.values.length - 1]} kg ${selected.name.toLowerCase()}`}</Text>
          <View style={{ marginTop: 2, marginBottom: 10 }}>
            <Trend value={`${gain} kg`} direction="up" note="in 12 weeks" />
          </View>
          <LineChart series={[{ values: selected.values, color: liftColors[lift] }]} area height={140} labels={["Aug", "Sep", "Oct", "Nov"]} accessibilityLabel={`${selected.name} estimated one-rep max`} />
          <View style={{ flexDirection: "row", marginTop: 12 }}>
            <Popover label="How this is worked out" systemImage="info.circle">
              <View style={{ width: 280, padding: 16, rowGap: 8 }}>
                <Text weight="medium" style={TYPE.body}>It is an estimate from your best set each week, not a lift you have done.</Text>
                <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>Weight × (1 + reps ÷ 30). Your 100 kg × 3 gives 110, smoothed over three weeks to 106.</Text>
              </View>
            </Popover>
          </View>
        </View>
        {LIFTS.map((l, i) => {
          const on = i === lift;
          return (
            <ContextMenu
              key={l.name}
              actions={[
                { label: "Open history", systemImage: "clock.arrow.circlepath", onPress: () => Toast.info(`${l.name} history`) },
                { label: "Set a target", systemImage: "target", onPress: () => Toast.info("Set a target") },
                { label: "Hide from progress", systemImage: "eye.slash", onPress: () => Toast.info("Hidden") },
              ]}
            >
            <Pressable
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setLift(i);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${l.name}, best ${l.best}`}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                columnGap: 12,
                height: 56,
                paddingHorizontal: 16,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderColor: colors.border,
                backgroundColor: pressed ? colors.border : "transparent",
              })}
            >
              <View style={{ width: 4, height: 28, borderRadius: 2, backgroundColor: liftColors[i], opacity: on ? 1 : 0.3 }} />
              <View style={{ flex: 1 }}>
                <Text weight={on ? "semibold" : "medium"} style={TYPE.body}>{l.name}</Text>
                <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`Best ${l.best}, ${l.when}`}</Text>
              </View>
              <Sparkline values={l.values} width={64} height={26} color={on ? liftColors[i] : colors.muted} />
              <Text weight="semibold" style={[TYPE.body, TABULAR, { width: 58, textAlign: "right" }]}>{`${l.values[l.values.length - 1]} kg`}</Text>
            </Pressable>
            </ContextMenu>
          );
        })}
      </Panel>

      <SectionHeader title="Sets by muscle, last 4 weeks" />
      <Panel>
        <BarList items={MUSCLES} color={hues.orange} />
      </Panel>
    </DemoScreen>
  );
}
