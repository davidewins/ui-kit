import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Badge, Card, EmptyState, Text, View } from "@/components/ui";
import { Gauge } from "@/components/ui/feedback/Gauge";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ART, BODY, SESSIONS, WEEK_DAYS, WEEK_MINUTES, WEEK_PLAN, workoutById } from "@/gallery/demo/data";
import { DemoScreen, GUTTER, MEDIA_INSET, MediaRow, MetricGrid, useStates } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { Check } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

const STATES = ["Workout day", "Rest day", "New"] as const;
const ART_SIZE = 96;


// Fitness home, dense like Apple Fitness's summary: three rings, the week
// with minutes per day, the next workout with every exercise and what you
// lifted last time, body and recovery with the change since last week, then
// recent sessions with sets, heart rate and PRs.
export default function Today() {
  const colors = useThemeColors();
  const { state } = useStates(STATES);
  const rest = state === "Rest day";
  const next = workoutById(rest ? "upper-push" : "lower-power");
  const [pressed, setPressed] = useState(false);
  // The rings fill from empty when the page opens (the kit Gauge springs to
  // each new value), so the week's progress reads as progress.
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 250);
    return () => clearTimeout(t);
  }, []);
  const ring = (v: number) => (filled ? v : 0);

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
    <DemoScreen footer={rest ? undefined : <InsetFooter primaryCta={{ label: "Start workout", onPress: () => router.push("/screens/fitness/session") }} />}>
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginHorizontal: GUTTER, marginBottom: 16 }}>
          <Gauge label="Workouts" value={ring(3)} max={5} valueLabel={`${ring(3)}/5`} />
          <Gauge label="Minutes" value={ring(156)} max={200} valueLabel={String(ring(156))} />
          <Gauge label="Active kcal" value={ring(rest ? 210 : 412)} max={600} valueLabel={String(ring(rest ? 210 : 412))} />
        </View>
        <WeekStrip rest={rest} />
        <SectionTitle>{rest ? "Tomorrow, 07:00" : "Up next, 07:00"}</SectionTitle>
        <View style={{ marginHorizontal: GUTTER, marginBottom: 18 }}>
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
                  <View style={{ flexDirection: "row", columnGap: 12 }}>
                    <Link.AppleZoom>
                      <Image source={next.photo} style={{ width: ART_SIZE, height: ART_SIZE, borderRadius: 8 }} contentFit="cover" />
                    </Link.AppleZoom>
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text weight="semibold" numberOfLines={1} style={{ fontSize: 17, letterSpacing: -0.3 }}>{next.name}</Text>
                      <Text weight="medium" numberOfLines={1} style={{ fontSize: 13, color: colors.muted }}>
                        {`${next.minutes} min, ${next.exercises.length} moves, ${next.level}`}
                      </Text>
                      <Text weight="medium" numberOfLines={1} style={{ fontSize: 13, color: colors.muted }}>{`With ${next.coach}, ~420 kcal`}</Text>
                      <View style={{ flexDirection: "row", gap: 6, marginTop: 4 }}>
                        <Badge>{next.kind}</Badge>
                        {!rest ? <Badge variant="warning">1 PR in reach</Badge> : null}
                      </View>
                    </View>
                  </View>
                  <View style={{ marginTop: 12 }}>
                    {next.exercises.map((e, i) => (
                      <View
                        key={e.name}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          height: 30,
                          columnGap: 8,
                          borderTopWidth: StyleSheet.hairlineWidth,
                          borderColor: colors.border,
                        }}
                      >
                        <Text weight="medium" style={[styles.cell, { width: 16, color: colors.muted }]}>{i + 1}</Text>
                        <Text weight="medium" numberOfLines={1} style={[styles.cell, { flex: 1 }]}>{e.name}</Text>
                        <Text weight="medium" style={[styles.cell, styles.num, { width: 44 }]}>{`${e.sets}×${e.reps}`}</Text>
                        <Text weight="medium" style={[styles.cell, styles.num, { width: 52 }]}>{e.weight ? `${e.weight} kg` : "BW"}</Text>
                        <Text weight="medium" style={[styles.cell, styles.num, { width: 64, color: colors.muted }]}>{e.last ?? ""}</Text>
                      </View>
                    ))}
                  </View>
                </Card>
              </Pressable>
            </Link.Trigger>
            <Link.Preview />
          </Link>
        </View>
        <SectionTitle>Body and recovery</SectionTitle>
        <MetricGrid items={BODY} />
        <SectionTitle>Recent</SectionTitle>
        <SettingsGroup separatorInset={MEDIA_INSET}>
          {SESSIONS.slice(0, 4).map((s) => {
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
    </DemoScreen>
  );
}

/** Monday to Sunday: filled when trained, grey when planned, empty on rest
 *  days, today ringed, minutes trained under each. */
function WeekStrip({ rest }: { rest: boolean }) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: GUTTER, marginBottom: 4 }}>
      {WEEK_DAYS.map((d, i) => {
        // On a rest day today (Friday) is a rest day, not a planned session.
        const plan = rest && i === 4 ? "rest" : WEEK_PLAN[i];
        const today = i === 4;
        const mins = plan === "done" ? WEEK_MINUTES[i] : null;
        return (
          <View key={i} style={{ alignItems: "center", gap: 4, width: 36 }}>
            <Text weight={today ? "semibold" : "medium"} style={{ fontSize: 12, color: today ? colors.text : colors.muted }}>{d}</Text>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: plan === "done" ? colors.tint : plan === "planned" ? colors.surface : "transparent",
                borderWidth: today ? 2 : 0,
                borderColor: colors.text,
              }}
            >
              {plan === "done" ? <Check size={14} color={colors.onTint} strokeWidth={2.5} /> : null}
            </View>
            <Text weight="medium" style={{ fontSize: 12, color: mins ? colors.text : colors.muted, fontVariant: ["tabular-nums"] }}>
              {mins ? `${mins}m` : plan === "planned" ? "Plan" : "Rest"}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  cell: { fontSize: 13 },
  num: { textAlign: "right", fontVariant: ["tabular-nums"] },
});
