// Where a month's money went, the Monzo / Copilot way: what came in against
// what went out as a ring you can pick slices of from the list beside it,
// this month's takings racing last month's, and when the shop is busy.
import { Text, View } from "@/components/ui";
import { DonutChart } from "@/components/ui/data/DonutChart";
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
import { BUSY, CUMULATIVE, INCOME, SPEND, euro0 } from "./data";

export default function MoneySpending() {
  const colors = useThemeColors();
  const hues = useHues();
  const [picked, setPicked] = useState<number | undefined>(undefined);
  const out = SPEND.reduce((n, s) => n + s.value, 0);
  const kept = INCOME - out;
  const day = CUMULATIVE.now.length;
  const ahead = Math.round((CUMULATIVE.now[day - 1] - CUMULATIVE.before[day - 1]) * 1000);

  return (
    <DemoScreen>
      <View style={{ flexDirection: "row", alignItems: "center", columnGap: 20, paddingHorizontal: GUTTER, paddingTop: 8 }}>
        <DonutChart
          size={164}
          thickness={20}
          segments={SPEND.map((s, i) => ({ value: s.value, label: s.label, color: picked === undefined || picked === i ? hues[s.hue] : colors.border }))}
        >
          <Text weight="semibold" style={[TYPE.title, TABULAR]}>{euro0(picked === undefined ? out : SPEND[picked].value)}</Text>
          <Text weight="medium" style={[TYPE.caption, TABULAR, { color: colors.muted, textAlign: "center" }]}>
            {picked === undefined ? `spent of ${euro0(INCOME)}\ntaken in October` : `${SPEND[picked].label.toLowerCase()}, ${Math.round((SPEND[picked].value / out) * 100)}%\nof spending`}
          </Text>
        </DonutChart>
        <View style={{ flex: 1 }}>
          {SPEND.map((s, i) => (
            <Pressable
              key={s.label}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                setPicked(picked === i ? undefined : i);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: picked === i }}
              accessibilityLabel={`${s.label}, ${euro0(s.value)}`}
              hitSlop={{ top: 2, bottom: 2 }}
              style={{ flexDirection: "row", alignItems: "center", columnGap: 8, height: 32, opacity: picked === undefined || picked === i ? 1 : 0.4 }}
            >
              <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: hues[s.hue] }} />
              <Text weight="medium" numberOfLines={1} style={[TYPE.sub, { flex: 1 }]}>{s.label}</Text>
              <Text weight="semibold" style={[TYPE.sub, TABULAR]}>{euro0(s.value)}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={{ paddingHorizontal: GUTTER, marginTop: 14 }}>
        <Text weight="medium" style={[TYPE.body, TABULAR]}>
          {`You kept ${euro0(kept)}, ${Math.round((kept / INCOME) * 100)}% of what came in. Stock was two thirds of everything spent.`}
        </Text>
      </View>

      <SectionHeader title="November against October" />
      <View style={{ paddingHorizontal: GUTTER }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 10, marginBottom: 8 }}>
          <Text style={TABULAR}>
            <Text weight="semibold" style={[TYPE.title, { color: hues.green }]}>{`€${CUMULATIVE.now[day - 1].toFixed(1)}k`}</Text>
            <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>{` taken by the ${day}th`}</Text>
          </Text>
          <Trend value={euro0(ahead)} direction="up" note="ahead" />
        </View>
        <LineChart
          height={140}
          area
          series={[
            { values: CUMULATIVE.now, color: hues.green },
            { values: CUMULATIVE.before.slice(0, day), dashed: true },
          ]}
          labels={["1 Nov", "4", "8", "12 Nov"]}
          accessibilityLabel="Takings this month against last month, day by day"
        />
        <View style={{ flexDirection: "row", columnGap: 16, marginTop: 10 }}>
          <Legend color={hues.green} label="November" />
          <Legend color={colors.muted} label="October, same days" dashed />
        </View>
      </View>

      <SectionHeader title="When you are busy" />
      <View style={{ paddingHorizontal: GUTTER }}>
        <Text weight="medium" style={[TYPE.body, { marginBottom: 12 }]}>Saturday at 13:00 is your peak. Sunday after 18:00 takes almost nothing.</Text>
        <View style={{ flexDirection: "row", marginLeft: 18, marginBottom: 6 }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <Text key={i} weight="medium" style={[TYPE.caption, { flex: 1, textAlign: "center", color: colors.muted }]}>{d}</Text>
          ))}
        </View>
        <Heatmap columns={BUSY} color={hues.orange} gap={4} cellHeight={20} rowLabels={["10", "", "12", "", "14", "", "16", "", "18", "", "20"]} accessibilityLabel="Busy hours by weekday" />
      </View>
    </DemoScreen>
  );
}

function Legend({ color, label, dashed = false }: { color: string; label: string; dashed?: boolean }) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
      <View style={{ width: 14, height: 0, borderTopWidth: 2, borderStyle: dashed ? "dashed" : "solid", borderColor: color }} />
      <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>{label}</Text>
    </View>
  );
}
