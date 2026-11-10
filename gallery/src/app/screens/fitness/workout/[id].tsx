import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Badge, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { Gauge } from "@/components/ui/feedback/Gauge";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { FOCUS, workoutById } from "@/gallery/demo/data";
import { DataTable, DemoScreen, Hero, FactList, TitleBlock, useStates, Section } from "@/gallery/demo/parts";
import { Toast } from "@/lib/toast";
import { router, useLocalSearchParams } from "expo-router";
import { User } from "lucide-react-native";

const STATES = ["Not started", "In your plan", "Done today"] as const;

/** The last times you did this workout, newest first. */
const HISTORY = [
  { date: "Today", time: "47:12", volume: "6,240", top: "100 × 3" },
  { date: "3 Nov", time: "45:03", volume: "5,980", top: "95 × 3" },
  { date: "27 Oct", time: "48:40", volume: "5,710", top: "92.5 × 4" },
  { date: "20 Oct", time: "44:55", volume: "5,450", top: "90 × 5" },
];

// Workout detail, dense like a strength logger's routine page: photo, title,
// badges, six numbers, every exercise with plan, load, last time and best,
// focus by area, your history with this workout, then the coach. Start is
// the one main action, in the sticky footer; more in the header menu.
export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const w = workoutById(id);
  const { state } = useStates(STATES);
  const sets = w.exercises.reduce((n, e) => n + e.sets, 0);
  const volume = w.exercises.reduce((n, e) => n + e.sets * (parseInt(e.reps, 10) || 0) * (e.weight ?? 0), 0);

  return (
    <>
      <ActionMenu
        accessibilityLabel="Workout actions"
        actions={[
          { label: "Edit workout", systemImage: "pencil", onPress: () => router.push("/screens/fitness/new-workout") },
          { label: "Share", systemImage: "square.and.arrow.up", onPress: () => Toast.success("Link copied") },
          ...(state === "In your plan"
            ? [{ label: "Remove from plan", systemImage: "calendar.badge.minus", destructive: true, onPress: () => Toast.success("Removed from your plan") }]
            : []),
        ]}
      />
      <DemoScreen
        secondary={state === "Not started"}
        footer={
          <InsetFooter
            primaryCta={{ label: state === "Done today" ? "Do it again" : "Start workout", onPress: () => router.push("/screens/fitness/session") }}
            secondaryCta={state === "Not started" ? { label: "Add to plan", onPress: () => Toast.success("Added for Thursday, 07:00") } : undefined}
          />
        }
      >
        <Hero source={w.photo} height={180} />
        <TitleBlock title={w.name} subtitle={`${w.kind}, ${w.level}, with ${w.coach}`} />
        <View style={{ flexDirection: "row", gap: 6, marginHorizontal: 16, marginBottom: 12 }}>
          {state !== "Not started" ? (
            <Badge variant={state === "Done today" ? "success" : "default"}>{state === "Done today" ? "Done today, 47 min" : "Thursday, 07:00"}</Badge>
          ) : null}
          <Badge>{`Done ${HISTORY.length} times`}</Badge>
          <Badge variant="warning">1 PR in reach</Badge>
        </View>
        <FactList
          items={[
            { label: "Length", value: String(w.minutes), unit: "min" },
            { label: "Moves", value: String(w.exercises.length) },
            { label: "Sets", value: String(sets) },
            { label: "Target volume", value: (volume / 1000).toFixed(1), unit: "t" },
            { label: "Energy", value: "~420", unit: "kcal" },
            { label: "Last time", value: "47", unit: "min", delta: "+2 min", good: false },
          ]}
        />

        <Section title="Exercises" art="checklist" trailing={`${sets} sets`} />
        <DataTable
          dense
          columns={[
            { key: "n", label: "#", width: 16, align: "left" },
            { key: "name", label: "Exercise" },
            { key: "plan", label: "Sets", width: 40 },
            { key: "kg", label: "Load", width: 48 },
            { key: "last", label: "Last", width: 60 },
            { key: "best", label: "Best", width: 58 },
          ]}
          rows={w.exercises.map((e, i) => ({
            n: String(i + 1),
            name: e.name,
            plan: `${e.sets}×${e.reps}`,
            kg: e.weight ? `${e.weight}` : "BW",
            last: e.last ?? "",
            best: e.best ?? "",
          }))}
        />

        <Section title="Focus" art="target" />
        <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 16, rowGap: 10, marginHorizontal: 16, marginBottom: 18 }}>
          {FOCUS[w.kind].map((f) => (
            <View key={f.area} style={{ width: "47%" }}>
              <Gauge variant="bar" label={f.area} value={f.load} valueLabel={`${Math.round(f.load * 100)}%`} />
            </View>
          ))}
        </View>

        <Section title="Your history" art="risingChart" trailing={`${HISTORY.length} times`} />
        <DataTable
          dense
          columns={[
            { key: "date", label: "Date" },
            { key: "time", label: "Time", width: 52 },
            { key: "volume", label: "Volume", width: 64 },
            { key: "top", label: "Top set", width: 72 },
          ]}
          rows={HISTORY}
          highlight={0}
        />

        <SettingsGroup>
          <SettingsRow label={w.coach} Icon={User} trailing="Coach, 12 workouts" navigates onPress={() => Toast.info(`${w.coach}'s profile`)} />
        </SettingsGroup>
      </DemoScreen>
    </>
  );
}
