import { Card, EmptyState, Text, View } from "@/components/ui";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { ProgressBar } from "@/components/ui/feedback/ProgressBar";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ART, SESSIONS, WEEK_DAYS, WEEK_PLAN, workoutById } from "@/gallery/demo/data";
import { DemoScreen, MEDIA_INSET, MediaRow, StatTiles, useStates } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Check } from "lucide-react-native";
import { Pressable } from "react-native";

const STATES = ["Workout day", "Rest day", "New"] as const;

// Fitness home. Workout day: the plan for today with Start in the footer.
// Rest day: no footer, tomorrow's session instead. New: nothing logged yet.
export default function Today() {
  const colors = useThemeColors();
  const { state, bar } = useStates(STATES);
  const next = workoutById(state === "Rest day" ? "upper-push" : "lower-power");

  if (state === "New") {
    return (
      <DemoScreen scroll={false} bar={bar}>
        <EmptyState
          art={{ image: ART.target }}
          title="No plan yet"
          body="Pick a workout and it shows up here each day"
          action={{ label: "Browse workouts", onPress: () => router.push("/screens/fitness/workouts") }}
        />
      </DemoScreen>
    );
  }

  return (
    <DemoScreen
      bar={bar}
      footer={state === "Workout day" ? <InsetFooter primaryCta={{ label: `Start ${next.name.toLowerCase()}`, onPress: () => router.push("/screens/fitness/session") }} /> : undefined}
    >
      <WeekStrip />

      <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
        <Pressable onPress={() => router.push(`/screens/fitness/workout/${next.id}`)} accessibilityRole="button" accessibilityLabel={next.name}>
          {({ pressed }) => (
            <Card raised>
              <View style={{ opacity: pressed ? 0.85 : 1 }}>
                <Image source={next.photo} style={{ height: 168, borderRadius: 16 }} contentFit="cover" />
                <Text weight="medium" style={{ fontSize: 13, color: colors.muted, marginTop: 12 }}>
                  {state === "Rest day" ? "Tomorrow, 07:00" : "Today, 07:00"}
                </Text>
                <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4, marginTop: 2 }}>{next.name}</Text>
                <Text weight="medium" style={{ fontSize: 15, color: colors.muted, marginTop: 2 }}>
                  {`${next.minutes} min · ${next.exercises.length} exercises · ${next.coach}`}
                </Text>
              </View>
            </Card>
          )}
        </Pressable>
      </View>

      <StatTiles items={[{ value: "3 of 5", label: "Workouts" }, { value: "156", label: "Minutes" }, { value: "1", label: "New best" }]} />

      <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
        <Card raised>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <Text weight="medium" style={{ fontSize: 15 }}>Weekly goal</Text>
            <Text weight="medium" style={{ fontSize: 15, color: colors.muted, fontVariant: ["tabular-nums"] }}>156 of 200 min</Text>
          </View>
          <ProgressBar value={0.78} accessibilityLabel="Weekly goal" />
        </Card>
      </View>

      <SectionTitle>Recent</SectionTitle>
      <SettingsGroup separatorInset={MEDIA_INSET}>
        {SESSIONS.slice(0, 3).map((s) => {
          const w = workoutById(s.workout);
          return (
            <MediaRow
              key={s.id}
              image={w.photo}
              title={w.name}
              subtitle={`${s.day}, ${s.minutes} min`}
              trailing={s.volume}
              href={`/screens/fitness/workout/${w.id}`}
            />
          );
        })}
      </SettingsGroup>
    </DemoScreen>
  );
}

/** Monday to Sunday: filled when trained, grey when planned, empty on rest days. */
function WeekStrip() {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginBottom: 18 }}>
      {WEEK_DAYS.map((d, i) => {
        const plan = WEEK_PLAN[i];
        const today = i === 4;
        return (
          <View key={i} style={{ alignItems: "center", gap: 6 }}>
            <Text weight={today ? "semibold" : "medium"} style={{ fontSize: 13, color: today ? colors.text : colors.muted }}>{d}</Text>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: plan === "done" ? colors.tint : plan === "planned" ? colors.surface : "transparent",
                borderWidth: today ? 2 : 0,
                borderColor: colors.text,
              }}
            >
              {plan === "done" ? <Check size={16} color={colors.onTint} strokeWidth={2.5} /> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

