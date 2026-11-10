import { Badge, Card, EmptyState, Text, View } from "@/components/ui";
import { Sparkline } from "@/components/analytics/Sparkline";
import { SegmentedControl } from "@/components/ui/inputs/SegmentedControl";
import { Gauge } from "@/components/ui/feedback/Gauge";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ART, PERSONAL_BESTS, SESSIONS, WEEKLY_MINUTES, WEEKS, workoutById } from "@/gallery/demo/data";
import { DataTable, DemoScreen, MEDIA_INSET, MediaRow, useStates, Section } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router } from "expo-router";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { SkeletonBars, SkeletonChartCard, SkeletonMediaRows, SkeletonTable, SkeletonSection } from "@/gallery/demo/skeletons";

const STATES = ["Loaded", "Loading", "Empty"] as const;
const RANGES = ["Week", "Month", "Year"] as const;
const AREAS = [
  { area: "Legs", done: 3, goal: 3 },
  { area: "Push", done: 1, goal: 2 },
  { area: "Pull", done: 1, goal: 2 },
  { area: "Core", done: 1, goal: 3 },
  { area: "Mobility", done: 1, goal: 2 },
  { area: "Cardio", done: 2, goal: 2 },
];
const TOTALS = ["156 min", "612 min", "6,980 min"];

// Progress: the trend in one raised card, personal bests, then every session.
export default function History() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const { state } = useStates(STATES);
  const [range, setRange] = useState(0);

  if (state === "Empty") {
    return (
      <DemoScreen scroll={false}>
        <EmptyState
          art={{ image: ART.stopwatch }}
          title="Nothing logged yet"
          body="Finish a workout and your progress shows up here"
          action={{ label: "Start a workout", onPress: () => router.push("/screens/fitness/workouts") }}
        />
      </DemoScreen>
    );
  }

  return (
    <DemoScreen>
      <SegmentedControl values={RANGES} selectedIndex={range} onChange={setRange} accessibilityLabel="Range" style={{ marginHorizontal: 16, marginBottom: 16 }} />
      {state === "Loading" ? (
        <>
          <SkeletonChartCard />
          <SkeletonSection />
          <SkeletonBars count={6} twoUp />
          <SkeletonSection />
          <SkeletonTable rows={6} numbers={4} />
          <SkeletonSection />
          <SkeletonTable rows={5} numbers={3} />
          <SkeletonSection />
          <SkeletonMediaRows count={5} trailing="figure" />
        </>
      ) : (
        <>
          <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
            <Card raised>
              <Text weight="medium" style={{ fontSize: 15, color: colors.muted }}>Time trained</Text>
              <Text weight="semibold" style={{ fontSize: 34, letterSpacing: -0.8, marginTop: 2, fontVariant: ["tabular-nums"] }}>{TOTALS[range]}</Text>
              <Text weight="medium" style={{ fontSize: 13, color: colors.success, marginBottom: 14 }}>Up 20% on the 4 before</Text>
              <Sparkline values={WEEKLY_MINUTES} width={width - 64} height={64} color={colors.text} />
            </Card>
          </View>

          <Section title="By area" art="target" trailing="This week" />
          <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 16, rowGap: 10, marginHorizontal: 16, marginBottom: 18 }}>
            {AREAS.map((a) => (
              <View key={a.area} style={{ width: "47%" }}>
                <Gauge variant="bar" label={a.area} value={a.done} max={a.goal} valueLabel={`${a.done} of ${a.goal}`} tone={a.done / a.goal < 0.5 ? "warning" : "default"} />
              </View>
            ))}
          </View>

          <Section title="Weeks" art="calendar" trailing="Last 6" />
          <DataTable
            dense
            columns={[
              { key: "week", label: "Week" },
              { key: "sessions", label: "Sessions", width: 60 },
              { key: "minutes", label: "Min", width: 40 },
              { key: "volume", label: "Volume", width: 56 },
              { key: "prs", label: "PRs", width: 32 },
            ]}
            rows={WEEKS.map((w) => ({ week: w.week, sessions: String(w.sessions), minutes: String(w.minutes), volume: w.volume, prs: w.prs ? String(w.prs) : "" }))}
            highlight={0}
          />

          <Section title="Personal bests" art="gift" />
          <DataTable
            dense
            columns={[
              { key: "lift", label: "Lift" },
              { key: "best", label: "Best", width: 64 },
              { key: "e1rm", label: "Est. 1RM", width: 64 },
              { key: "when", label: "When", width: 52 },
            ]}
            rows={PERSONAL_BESTS.map((p) => ({ lift: p.lift, best: p.value, e1rm: p.e1rm, when: p.when }))}
          />

          <Section title="Sessions" art="clipboard" trailing="This week" />
          <SettingsGroup separatorInset={MEDIA_INSET}>
            {SESSIONS.map((s) => {
              const w = workoutById(s.workout);
              return (
                <MediaRow
                  key={s.id}
                  image={w.photo}
                  title={w.name}
                  subtitle={`${s.day} ${s.time}, ${s.minutes} min, ${s.sets} sets, ${s.avgHr} bpm`}
                  trailing={s.volume}
                  accessory={s.prs ? <Badge variant="success">{`${s.prs} PR`}</Badge> : undefined}
                  href={`/screens/fitness/workout/${w.id}`}
                />
              );
            })}
          </SettingsGroup>
        </>
      )}
    </DemoScreen>
  );
}
