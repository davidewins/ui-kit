// A rider's week of earnings, the Uber Driver / Deliveroo Rider way: the week
// against a goal, a bar per day you tap to open that day, then that day's
// split and every drop in it. Cash out is the one action.
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { BarChart } from "@/components/ui/data/BarChart";
import { SegmentBar } from "@/components/ui/data/SegmentBar";
import { Trend } from "@/components/ui/data/Trend";
import { Badge } from "@/components/ui/feedback/Badge";
import { ProgressBar } from "@/components/ui/feedback/ProgressBar";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { DemoScreen, GUTTER } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { DAYS, GOAL, LAST_WEEK_BY_NOW, TODAY, WEEK_TOTAL, eur } from "./data";

export default function RiderEarnings() {
  const colors = useThemeColors();
  const hues = useHues();
  const [picked, setPicked] = useState(TODAY);
  const day = DAYS[picked];
  const up = Math.round(((WEEK_TOTAL - LAST_WEEK_BY_NOW) / LAST_WEEK_BY_NOW) * 100);
  const toGo = Math.max(0, GOAL - WEEK_TOTAL);

  return (
    <DemoScreen footer={<InsetFooter primaryCta={{ label: `Cash out ${eur(WEEK_TOTAL)}`, onPress: () => Toast.success("On its way to your bank") }} />}>
      <View style={{ paddingHorizontal: GUTTER, paddingTop: 4 }}>
        <Text style={TABULAR}>
          <Text weight="semibold" style={TYPE.display}>{eur(WEEK_TOTAL)}</Text>
          <Text weight="semibold" style={[TYPE.title, { color: colors.muted }]}> this week</Text>
        </Text>
        <View style={{ marginTop: 4, marginBottom: 14 }}>
          <Trend value={`${up}%`} direction="up" note="on last week by Thursday" />
        </View>
        <ProgressBar value={Math.min(1, WEEK_TOTAL / GOAL)} color={hues.green} accessibilityLabel="Progress to your weekly goal" />
        <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, marginTop: 8 }]}>
          {toGo > 0 ? `${eur(toGo)} to go to your ${eur(GOAL)} goal, about two more evenings` : `Past your ${eur(GOAL)} goal`}
        </Text>
      </View>

      <View style={{ paddingHorizontal: GUTTER, marginTop: 24 }}>
        <BarChart
          data={DAYS.map((d, i) => ({ label: d.label, value: d.total, color: i === TODAY ? hues.green : undefined }))}
          selected={picked}
          onSelect={(i) => (DAYS[i].total === null ? Toast.info(`${DAYS[i].name} has not happened yet`) : setPicked(i))}
          format={eur}
          height={132}
          accessibilityLabel="Earnings by day this week"
        />
      </View>

      <SectionHeader title={day.name} count={day.total === null ? undefined : eur(day.total)} />
      <View style={{ paddingHorizontal: GUTTER }}>
        <Text weight="medium" style={[TYPE.body, TABULAR, { marginBottom: 12 }]}>
          {`${day.online} online${day.trips.length ? `, ${day.trips.length} drops, ${day.trips.reduce((n, t) => n + t.km, 0).toFixed(1)} km` : ""}`}
        </Text>
        <SegmentBar
          segments={[
            { label: "Fares", value: day.fares, display: eur(day.fares), color: hues.blue },
            { label: "Tips", value: day.tips, display: eur(day.tips), color: hues.green },
            ...(day.bonus ? [{ label: "Lunch rush bonus", value: day.bonus, display: eur(day.bonus), color: hues.orange }] : []),
          ]}
        />
      </View>

      {day.trips.length ? (
        <View style={{ paddingHorizontal: GUTTER, marginTop: 18 }}>
          {day.trips.map((t, i) => (
            <View key={t.time} style={{ flexDirection: "row", alignItems: "center", columnGap: 12, minHeight: 58, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}>
              <Text weight="semibold" style={[TYPE.sub, TABULAR, { width: 40 }]}>{t.time}</Text>
              <View style={{ flex: 1 }}>
                <Text weight="medium" numberOfLines={1} style={TYPE.body}>{t.from}</Text>
                <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`to ${t.to}, ${t.km.toFixed(1)} km in ${t.minutes} min`}</Text>
              </View>
              <View style={{ alignItems: "flex-end", rowGap: 3 }}>
                <Text weight="semibold" style={[TYPE.body, TABULAR]}>{eur(t.fare + t.tip)}</Text>
                {t.tip ? <Badge variant="success">{`${eur(t.tip)} tip`}</Badge> : null}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text weight="medium" style={[TYPE.sub, { color: colors.muted, paddingHorizontal: GUTTER, marginTop: 14 }]}>Drops older than three days are in your statements.</Text>
      )}
    </DemoScreen>
  );
}
