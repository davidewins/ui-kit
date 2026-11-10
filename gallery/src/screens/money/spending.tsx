// Where a month's money went, the Monzo / Copilot way: what went out as a
// ring you can pick slices of from the list beside it, this month's takings
// racing last month's, and when the shop is busy.
import { Text, View } from "@/components/ui";
import { Menu } from "@/components/ui/actions/Menu";
import { DonutChart } from "@/components/ui/data/DonutChart";
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
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable } from "react-native";
import { BUSY, CUMULATIVE, INCOME, SPEND, euro0 } from "./data";

export default function MoneySpending() {
  const colors = useThemeColors();
  const hues = useHues();
  const [picked, setPicked] = useState<number | undefined>(undefined);
  const [month, setMonth] = useState("October 2026");
  const out = SPEND.reduce((n, s) => n + s.value, 0);
  const kept = INCOME - out;
  const day = CUMULATIVE.now.length;
  const ahead = Math.round((CUMULATIVE.now[day - 1] - CUMULATIVE.before[day - 1]) * 1000);

  return (
    <DemoScreen>
      <Panel glass>
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 18 }}>
          <DonutChart
            size={156}
            thickness={19}
            segments={SPEND.map((s, i) => ({ value: s.value, label: s.label, color: picked === undefined || picked === i ? hues[s.hue] : colors.border }))}
          >
            <Text weight="semibold" style={[TYPE.title, TABULAR]}>{euro0(picked === undefined ? out : SPEND[picked].value)}</Text>
            <Text weight="medium" style={[TYPE.caption, TABULAR, { color: colors.muted, textAlign: "center" }]}>
              {picked === undefined ? "spent in October" : `${Math.round((SPEND[picked].value / out) * 100)}% of spending`}
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
                style={{ flexDirection: "row", alignItems: "center", columnGap: 8, height: 32, opacity: picked === undefined || picked === i ? 1 : 0.4 }}
              >
                <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: hues[s.hue] }} />
                <Text weight="medium" numberOfLines={1} style={[TYPE.sub, { flex: 1 }]}>{s.label}</Text>
                <Text weight="medium" style={[TYPE.sub, TABULAR]}>{euro0(s.value)}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <Text weight="medium" style={[TYPE.body, TABULAR, { marginTop: 14 }]}>
          {`${euro0(INCOME)} came in and you kept ${euro0(kept)}, ${Math.round((kept / INCOME) * 100)}% of it. Stock was two thirds of everything spent.`}
        </Text>
        <View style={{ flexDirection: "row", columnGap: 8, marginTop: 14 }}>
          <Menu label={month} systemImage="calendar" items={["October 2026", "September 2026", "August 2026", "July 2026"].map((m) => ({ label: m, selected: m === month, onPress: () => setMonth(m) }))} />
          <Popover label="What counts" systemImage="info.circle">
            <View style={{ width: 280, padding: 16, rowGap: 8 }}>
              <Text weight="medium" style={TYPE.body}>Spending is everything that left the account in the month, VAT included.</Text>
              <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>Refunds to customers are taken off what came in, not counted as spending. Transfers to your own savings are left out.</Text>
            </View>
          </Popover>
        </View>
      </Panel>

      <SectionHeader title="November against October" />
      <Panel>
        <Text weight="semibold" style={[TYPE.title, TABULAR, { color: hues.green }]}>{`€${CUMULATIVE.now[day - 1].toFixed(1)}k taken by the ${day}th`}</Text>
        <View style={{ marginTop: 2, marginBottom: 10 }}>
          <Trend value={euro0(ahead)} direction="up" note="ahead of October on the same day" />
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
      </Panel>

      <SectionHeader title="When you are busy" />
      <Panel>
        <Text weight="medium" style={[TYPE.body, { marginBottom: 12 }]}>Saturday at 13:00 is your peak. Sunday after 18:00 takes almost nothing.</Text>
        <View style={{ flexDirection: "row", marginLeft: 18, marginBottom: 6 }}>
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <Text key={i} weight="medium" style={[TYPE.caption, { flex: 1, textAlign: "center", color: colors.muted }]}>{d}</Text>
          ))}
        </View>
        <Heatmap columns={BUSY} color={hues.orange} gap={4} cellHeight={20} rowLabels={["10", "", "12", "", "14", "", "16", "", "18", "", "20"]} accessibilityLabel="Busy hours by weekday" />
      </Panel>
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
