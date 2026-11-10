import { Badge, View } from "@/components/ui";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { workoutById } from "@/gallery/demo/data";
import { DemoScreen, Hero, StatTiles, TitleBlock, useStates } from "@/gallery/demo/parts";
import { Toast } from "@/lib/toast";
import { router, useLocalSearchParams } from "expo-router";
import { Dumbbell, User } from "lucide-react-native";

const STATES = ["Not started", "In your plan", "Done today"] as const;

// Workout detail: photo, title, three stat tiles, the exercise list, and the
// one main action (Start) in the sticky footer. More in the header menu.
export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const w = workoutById(id);
  const { state, bar } = useStates(STATES);

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
        bar={bar}
        secondary={state === "Not started"}
        footer={
          <InsetFooter
            primaryCta={{ label: state === "Done today" ? "Do it again" : "Start workout", onPress: () => router.push("/screens/fitness/session") }}
            secondaryCta={state === "Not started" ? { label: "Add to plan", onPress: () => Toast.success("Added for Thursday, 07:00") } : undefined}
          />
        }
      >
        <Hero source={w.photo} />
        <TitleBlock title={w.name} subtitle={`${w.kind} with ${w.coach}`} />
        {state !== "Not started" ? (
          <View style={{ marginHorizontal: 20, marginTop: -6, marginBottom: 16 }}>
            <Badge variant={state === "Done today" ? "success" : "default"}>{state === "Done today" ? "Done today, 47 min" : "Thursday, 07:00"}</Badge>
          </View>
        ) : null}
        <StatTiles items={[{ value: `${w.minutes} min`, label: "Length" }, { value: String(w.exercises.length), label: "Exercises" }, { value: w.level, label: "Level" }]} />
        <SectionTitle>Exercises</SectionTitle>
        <SettingsGroup>
          {w.exercises.map((e) => (
            <SettingsRow key={e.name} label={e.name} Icon={Dumbbell} trailing={`${e.sets} × ${e.reps}${e.weight ? `, ${e.weight} kg` : ""}`} />
          ))}
        </SettingsGroup>
        <SectionTitle>Coach</SectionTitle>
        <SettingsGroup>
          <SettingsRow label={w.coach} Icon={User} trailing="12 workouts" navigates onPress={() => Toast.info(`${w.coach}'s profile`)} />
        </SettingsGroup>
      </DemoScreen>
    </>
  );
}
