import { Card, EmptyState, Text, View } from "@/components/ui";
import { Sparkline } from "@/components/analytics/Sparkline";
import { SegmentedControl } from "@/components/ui/inputs/SegmentedControl";
import { Gauge } from "@/components/ui/feedback/Gauge";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { ART, PERSONAL_BESTS, SESSIONS, WEEKLY_MINUTES, workoutById } from "@/gallery/demo/data";
import { DemoScreen, MEDIA_INSET, MediaRow, useStates } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router } from "expo-router";
import { Trophy } from "lucide-react-native";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import { SkeletonBars, SkeletonChartCard, SkeletonMediaRows, SkeletonSettingsRows, SkeletonTitle } from "@/gallery/demo/skeletons";

const STATES = ["Loaded", "Loading", "Empty"] as const;
const RANGES = ["Week", "Month", "Year"] as const;
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
          <SkeletonTitle />
          <SkeletonBars count={4} />
          <SkeletonTitle />
          <SkeletonSettingsRows count={3} chevron={false} />
          <SkeletonTitle />
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

          <SectionTitle>By area</SectionTitle>
          <View style={{ marginHorizontal: 16, marginBottom: 18, gap: 12 }}>
            <Gauge variant="bar" label="Legs" value={3} max={3} valueLabel="3 of 3" />
            <Gauge variant="bar" label="Push" value={1} max={2} valueLabel="1 of 2" />
            <Gauge variant="bar" label="Core" value={1} max={3} valueLabel="1 of 3" tone="warning" />
            <Gauge variant="bar" label="Mobility" value={1} max={2} valueLabel="1 of 2" />
          </View>

          <SectionTitle>Personal bests</SectionTitle>
          <SettingsGroup>
            {PERSONAL_BESTS.map((p) => (
              <SettingsRow key={p.lift} label={p.lift} Icon={Trophy} trailing={`${p.value}, ${p.when}`} />
            ))}
          </SettingsGroup>

          <SectionTitle>This week</SectionTitle>
          <SettingsGroup separatorInset={MEDIA_INSET}>
            {SESSIONS.map((s) => {
              const w = workoutById(s.workout);
              return (
                <MediaRow key={s.id} image={w.photo} title={w.name} subtitle={`${s.day} at ${s.time}, ${s.minutes} min`} trailing={s.volume} href={`/screens/fitness/workout/${w.id}`} />
              );
            })}
          </SettingsGroup>
        </>
      )}
    </DemoScreen>
  );
}
