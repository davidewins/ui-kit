import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Card, EmptyState, Text, View } from "@/components/ui";
import { Gauge } from "@/components/ui/feedback/Gauge";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ART, SESSIONS, WEEK_DAYS, WEEK_PLAN, workoutById } from "@/gallery/demo/data";
import { DemoScreen, MEDIA_INSET, MediaRow, useStates } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { Check } from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const STATES = ["Workout day", "Rest day", "New"] as const;

/** Each block springs in a beat after the one above (DESIGN.md §5.1 entrance). */
function Enter({ i, children }: { i: number; children: ReactNode }) {
  return <Animated.View entering={FadeInDown.springify().damping(20).delay(i * 60)}>{children}</Animated.View>;
}

// Fitness home. Three rings for the week, the week strip, the next workout
// (it zooms into its page, press and hold to peek), then recent sessions.
// Workout day: Start in the footer. Rest day: tomorrow's plan, no footer.
export default function Today() {
  const colors = useThemeColors();
  const { state } = useStates(STATES);
  const rest = state === "Rest day";
  const [pressed, setPressed] = useState(false);
  const next = workoutById(rest ? "upper-push" : "lower-power");

  if (state === "New") {
    return (
      <DemoScreen scroll={false}>
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
      footer={rest ? undefined : <InsetFooter primaryCta={{ label: "Start workout", onPress: () => router.push("/screens/fitness/session") }} />}
    >
      <Enter i={0}>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginHorizontal: 16, marginBottom: 20 }}>
          <Gauge label="Workouts" value={3} max={5} valueLabel="3/5" />
          <Gauge label="Minutes" value={156} max={200} valueLabel="156" />
          <Gauge label="Active kcal" value={rest ? 210 : 412} max={600} valueLabel={rest ? "210" : "412"} />
        </View>
      </Enter>

      <Enter i={1}>
        <WeekStrip rest={rest} />
      </Enter>

      <Enter i={2}>
        <View style={{ marginHorizontal: 16, marginBottom: 20 }}>
          <Link href={`/screens/fitness/workout/${next.id}`} asChild>
            <Link.Trigger>
              <Pressable
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
                onPress={() => haptic("selection")}
                accessibilityRole="link"
                accessibilityLabel={`${next.name}, ${next.minutes} minutes`}
                style={{ transform: [{ scale: pressed ? 0.98 : 1 }] }}
              >
                <Card raised>
                  <Link.AppleZoom>
                    <Image source={next.photo} style={{ height: 156, borderRadius: 8 }} contentFit="cover" />
                  </Link.AppleZoom>
                  <View style={{ flexDirection: "row", alignItems: "flex-end", marginTop: 12 }}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>{rest ? "Tomorrow, 07:00" : "Today, 07:00"}</Text>
                      <Text weight="semibold" style={{ fontSize: 19, letterSpacing: -0.4 }}>{next.name}</Text>
                    </View>
                    <Text weight="medium" style={{ fontSize: 13, color: colors.muted, fontVariant: ["tabular-nums"] }}>
                      {`${next.minutes} min, ${next.exercises.length} moves`}
                    </Text>
                  </View>
                </Card>
              </Pressable>
            </Link.Trigger>
            <Link.Preview />
          </Link>
        </View>
      </Enter>

      <Enter i={3}>
        <SectionTitle>Recent</SectionTitle>
        <SettingsGroup separatorInset={MEDIA_INSET}>
          {SESSIONS.slice(0, 3).map((s) => {
            const w = workoutById(s.workout);
            return <MediaRow key={s.id} image={w.photo} title={w.name} subtitle={`${s.day}, ${s.minutes} min`} trailing={s.volume} href={`/screens/fitness/workout/${w.id}`} />;
          })}
        </SettingsGroup>
      </Enter>
    </DemoScreen>
  );
}

/** Monday to Sunday: filled when trained, grey when planned, empty on rest
 *  days, today ringed. */
function WeekStrip({ rest }: { rest: boolean }) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 16, marginBottom: 20 }}>
      {WEEK_DAYS.map((d, i) => {
        // On a rest day today (Friday) is a rest day, not a planned session.
        const plan = rest && i === 4 ? "rest" : WEEK_PLAN[i];
        const today = i === 4;
        return (
          <View key={i} style={{ alignItems: "center", gap: 6 }}>
            <Text weight={today ? "semibold" : "medium"} style={{ fontSize: 13, color: today ? colors.text : colors.muted }}>{d}</Text>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: plan === "done" ? colors.tint : plan === "planned" ? colors.surface : "transparent",
                borderWidth: today ? 2 : 0,
                borderColor: colors.text,
              }}
            >
              {plan === "done" ? <Check size={15} color={colors.onTint} strokeWidth={2.5} /> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
