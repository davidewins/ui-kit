import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Badge, Card, EmptyState, Text, View } from "@/components/ui";
import { Gauge } from "@/components/ui/feedback/Gauge";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ART, BODY, SESSIONS, WEEK_DAYS, WEEK_MINUTES, WEEK_PLAN, workoutById } from "@/gallery/demo/data";
import { DemoScreen, GUTTER, MEDIA_INSET, MediaRow, FactList, useStates, Section } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import { Image } from "expo-image";
import { Link, router } from "expo-router";
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
        <Headline rest={rest} />
        <WeekBars rest={rest} />
        <View style={{ marginHorizontal: GUTTER, gap: 12, marginTop: 4 }}>
          <Gauge variant="bar" label="Workouts this week" value={ring(3)} max={5} valueLabel={`${ring(3)} of 5`} />
          <Gauge variant="bar" label="Active energy" value={ring(rest ? 1640 : 1840)} max={2500} valueLabel={`${ring(rest ? 1640 : 1840).toLocaleString("en-IE")} of 2,500 kcal`} />
        </View>
        <Section title={rest ? "Tomorrow" : "Up next"} art="stopwatch" trailing="07:00" />
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
        <Section title="Body and recovery" art="risingChart" trailing="vs last week" />
        <FactList items={BODY} />
        <Section title="Recent" art="calendar" />
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

/** The page's one big number, like SELLERS Today's revenue: minutes trained
 *  this week, with the change against last week in a status pill. */
function Headline({ rest }: { rest: boolean }) {
  const colors = useThemeColors();
  const up = !rest;
  return (
    <View style={{ paddingHorizontal: GUTTER, marginTop: 4, marginBottom: 16 }}>
      <Text weight="medium" style={{ fontSize: 15, lineHeight: 20, color: colors.muted }}>Trained this week</Text>
      <View style={{ flexDirection: "row", alignItems: "flex-end", columnGap: 10, marginTop: 2 }}>
        <Text weight="semibold" style={{ fontSize: 40, lineHeight: 44, letterSpacing: -1.2, fontVariant: ["tabular-nums"] }}>
          {rest ? "135" : "156"}
          <Text weight="medium" style={{ fontSize: 20, letterSpacing: -0.4, color: colors.muted }}> min</Text>
        </Text>
        <View style={{ marginBottom: 8, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: up ? colors.successBg : colors.errorBg }}>
          <Text weight="semibold" style={{ fontSize: 12, color: up ? colors.success : colors.error, fontVariant: ["tabular-nums"] }}>
            {up ? "↑ 20% vs last week" : "↓ 4% vs last week"}
          </Text>
        </View>
      </View>
    </View>
  );
}

/** Minutes per day as bars, Monday first. Trained days are filled, today is
 *  outlined, planned days dashed, rest days empty; minutes under each. */
function WeekBars({ rest }: { rest: boolean }) {
  const colors = useThemeColors();
  const H = 72;
  const most = Math.max(...WEEK_MINUTES.map((m) => m ?? 0), 45);
  return (
    <View style={{ flexDirection: "row", columnGap: 8, marginHorizontal: GUTTER, marginBottom: 12 }}>
      {WEEK_DAYS.map((d, i) => {
        const plan = rest && i === 4 ? "rest" : WEEK_PLAN[i];
        const today = i === 4;
        const mins = plan === "done" ? (WEEK_MINUTES[i] ?? 0) : plan === "planned" ? 45 : 0;
        const h = mins ? Math.max(6, (mins / most) * H) : 0;
        return (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <View style={{ height: H, width: "100%", justifyContent: "flex-end" }}>
              {h ? (
                <View
                  style={{
                    height: h,
                    borderRadius: 6,
                    backgroundColor: plan === "done" ? colors.text : "transparent",
                    borderWidth: plan === "done" ? 0 : 1.5,
                    borderStyle: plan === "planned" ? "dashed" : "solid",
                    borderColor: today ? colors.text : colors.muted,
                  }}
                />
              ) : (
                <View style={{ height: 2, borderRadius: 1, backgroundColor: colors.border }} />
              )}
            </View>
            <Text weight={today ? "semibold" : "medium"} style={{ fontSize: 12, marginTop: 6, color: today ? colors.text : colors.muted }}>{d}</Text>
            <Text weight="medium" style={{ fontSize: 11, color: plan === "done" ? colors.text : colors.muted, fontVariant: ["tabular-nums"] }}>
              {plan === "done" ? `${WEEK_MINUTES[i]}m` : plan === "planned" ? "Plan" : "Rest"}
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
