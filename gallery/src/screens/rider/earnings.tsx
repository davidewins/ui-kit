// A rider's week of earnings, the Uber Driver / Deliveroo Rider way: the week
// with a bar per day (tap one to open that day) and a native gauge against
// the goal on glass, then that day's split and every drop in it. Long-press
// a drop for its actions. Cash out is the one action.
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { BarChart } from "@/components/ui/data/BarChart";
import { SegmentBar } from "@/components/ui/data/SegmentBar";
import { Trend } from "@/components/ui/data/Trend";
import { Badge } from "@/components/ui/feedback/Badge";
import { Gauge } from "@/components/ui/feedback/Gauge";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { Popover } from "@/components/ui/overlays/Popover";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen } from "@/gallery/demo/parts";
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
  const [cashing, setCashing] = useState(false);
  const day = DAYS[picked];
  const up = Math.round(((WEEK_TOTAL - LAST_WEEK_BY_NOW) / LAST_WEEK_BY_NOW) * 100);
  const toGo = Math.max(0, GOAL - WEEK_TOTAL);

  return (
    <>
      <ActionMenu
        accessibilityLabel="Earnings actions"
        actions={[
          { label: "Change weekly goal", systemImage: "target", onPress: () => Toast.info("Weekly goal") },
          { label: "Statements", systemImage: "doc.text", onPress: () => Toast.info("Opening statements") },
          { label: "Tax summary", systemImage: "percent", onPress: () => Toast.info("Tax summary for 2026") },
        ]}
      />
      <DemoScreen footer={<InsetFooter primaryCta={{ label: `Cash out ${eur(WEEK_TOTAL)}`, onPress: () => setCashing(true) }} />}>
        <Panel glass>
          <Text weight="semibold" style={[TYPE.display, TABULAR]}>{`${eur(WEEK_TOTAL)} this week`}</Text>
          <View style={{ marginTop: 4, marginBottom: 16 }}>
            <Trend value={`${up}%`} direction="up" note="on last week by Thursday" />
          </View>
          <BarChart
            data={DAYS.map((d, i) => ({ label: d.label, value: d.total, color: i === TODAY ? hues.green : undefined }))}
            selected={picked}
            onSelect={(i) => (DAYS[i].total === null ? Toast.info(`${DAYS[i].name} has not happened yet`) : setPicked(i))}
            format={eur}
            height={132}
            accessibilityLabel="Earnings by day this week"
          />
          <View style={{ height: 16 }} />
          <Gauge variant="bar" value={Math.min(WEEK_TOTAL, GOAL)} max={GOAL} label={`Weekly goal of ${eur(GOAL)}`} valueLabel={toGo > 0 ? `${eur(toGo)} to go` : "Reached"} tone="success" />
        </Panel>

        <SectionHeader title={day.total === null ? day.name : `${day.name}, ${eur(day.total)}`} />
        <Panel>
          <Text weight="medium" style={[TYPE.body, TABULAR, { marginBottom: 12 }]}>
            {`${day.online} online${day.trips.length ? `, ${day.trips.length} drops, ${day.trips.reduce((n, t) => n + t.km, 0).toFixed(1)} km` : ""}`}
          </Text>
          <SegmentBar
            segments={[
              { label: "Fares", value: day.fares, display: eur(day.fares), color: hues.blue },
              { label: "Tips", value: day.tips, display: eur(day.tips), color: hues.green },
              ...(day.bonus ? [{ label: "Bonus", value: day.bonus, display: eur(day.bonus), color: hues.orange }] : []),
            ]}
          />
          {day.bonus ? (
            <View style={{ flexDirection: "row", marginTop: 12 }}>
              <Popover label="Lunch rush bonus" systemImage="bolt.fill">
                <View style={{ width: 280, padding: 16, rowGap: 8 }}>
                  <Text weight="medium" style={TYPE.body}>€10 for four drops between 12:00 and 14:00 in Dublin 1, 2, 7 or 8.</Text>
                  <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>You did four by 13:40. The same bonus runs tomorrow from 12:00.</Text>
                </View>
              </Popover>
            </View>
          ) : null}
        </Panel>

        {day.trips.length ? (
          <Panel flush style={{ marginTop: 12 }}>
            {day.trips.map((t, i) => (
              <ContextMenu
                key={t.time}
                actions={[
                  { label: "See the route", systemImage: "map", onPress: () => Toast.info(`${t.from} to ${t.to}`) },
                  { label: "Copy trip details", systemImage: "doc.on.doc", onPress: () => Toast.success("Trip copied") },
                  { label: "Report a problem", systemImage: "exclamationmark.bubble", destructive: true, onPress: () => Toast.info("Opening support") },
                ]}
              >
                <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, minHeight: 60, paddingHorizontal: 16, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}>
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
              </ContextMenu>
            ))}
          </Panel>
        ) : (
          <Text weight="medium" style={[TYPE.sub, { color: colors.muted, paddingHorizontal: 16, marginTop: 14 }]}>Drops older than three days are in your statements.</Text>
        )}
      </DemoScreen>
      <ConfirmDialog
        visible={cashing}
        onClose={() => setCashing(false)}
        title={`Cash out ${eur(WEEK_TOTAL)}?`}
        message="It reaches your Revolut ending 2290 in a few minutes. Instant cash out costs 50c; Monday's weekly payout is free."
        confirmLabel="Cash out now"
        cancelLabel="Wait for Monday"
        onConfirm={() => Toast.success("On its way to your bank")}
      />
    </>
  );
}
