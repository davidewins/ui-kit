import { Card, Text, View } from "@/components/ui";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ProgressBar } from "@/components/ui/feedback/ProgressBar";
import { StepperRow } from "@/components/ui/inputs/StepperRow";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { workoutById } from "@/gallery/demo/data";
import { DemoScreen, MEDIA_INSET, MediaRow, StatTiles, TitleBlock, useStates } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { Check, Circle, Hash, Trophy, Weight } from "lucide-react-native";
import { useEffect, useState } from "react";

const STATES = ["Lifting", "Resting", "Finished"] as const;
const W = workoutById("lower-power");

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function useTicker(from: number, dir: 1 | -1) {
  const [t, setT] = useState(from);
  useEffect(() => {
    setT(from);
    const id = setInterval(() => setT((v) => Math.max(0, v + dir)), 1000);
    return () => clearInterval(id);
  }, [from, dir]);
  return t;
}

// A live session. Lifting: log the next set with steppers. Resting: the rest
// countdown. Finished: the summary and Save. End workout is in the header menu.
export default function Session() {
  const colors = useThemeColors();
  const { state, bar } = useStates(STATES);
  const [weight, setWeight] = useState(80);
  const [reps, setReps] = useState(6);
  const [ending, setEnding] = useState(false);
  const elapsed = useTicker(18 * 60 + 42, 1);
  const rest = useTicker(90, -1);
  const ex = W.exercises[0];

  const footer =
    state === "Lifting" ? (
      <InsetFooter
        primaryCta={{ label: "Log set 3", onPress: () => { haptic("success"); Toast.success(`Set 3 logged, ${weight} kg × ${reps}`); } }}
        secondaryCta={{ label: "Skip exercise", onPress: () => Toast.info("Up next: Romanian deadlift") }}
      />
    ) : state === "Resting" ? (
      <InsetFooter primaryCta={{ label: "Skip rest", onPress: () => Toast.info("Rest skipped") }} secondaryCta={{ label: "Add 30 seconds", onPress: () => Toast.info("Rest +30 s") }} />
    ) : (
      <InsetFooter primaryCta={{ label: "Save workout", onPress: () => { Toast.success("Workout saved"); router.back(); } }} />
    );

  return (
    <>
      {state !== "Finished" ? (
        <ActionMenu
          accessibilityLabel="Session actions"
          actions={[{ label: "End workout", systemImage: "xmark.circle", destructive: true, onPress: () => setEnding(true) }]}
        />
      ) : null}
      <DemoScreen bar={bar} footer={footer} secondary={state !== "Finished"}>
        {state === "Finished" ? (
          <>
            <TitleBlock title="Workout done" subtitle={`${W.name}, today at 07:10`} />
            <StatTiles items={[{ value: "47 min", label: "Time" }, { value: "6,240 kg", label: "Volume" }, { value: "18", label: "Sets" }]} />
            <SectionTitle>New best</SectionTitle>
            <SettingsGroup>
              <SettingsRow label="Back squat" Icon={Trophy} trailing="100 kg × 3" />
            </SettingsGroup>
            <SectionTitle>Exercises</SectionTitle>
            <SettingsGroup>
              {W.exercises.map((e) => (
                <SettingsRow key={e.name} label={e.name} Icon={Check} trailing={`${e.sets} sets`} />
              ))}
            </SettingsGroup>
          </>
        ) : (
          <>
            <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
              <Card raised>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text weight="medium" style={{ fontSize: 15, color: colors.muted }}>{state === "Resting" ? "Rest" : ex.name}</Text>
                  <Text weight="medium" style={{ fontSize: 15, color: colors.muted, fontVariant: ["tabular-nums"] }}>{clock(elapsed)}</Text>
                </View>
                <Text weight="semibold" style={{ fontSize: 44, letterSpacing: -1, marginTop: 4, fontVariant: ["tabular-nums"] }}>
                  {state === "Resting" ? clock(rest) : "Set 3 of 4"}
                </Text>
                <Text weight="medium" style={{ fontSize: 15, color: colors.muted, marginTop: 2, marginBottom: 14 }}>
                  {state === "Resting" ? `Next: ${ex.name}, set 3 of 4` : `Last time ${ex.weight} kg × ${ex.reps}`}
                </Text>
                <ProgressBar value={state === "Resting" ? rest / 90 : 2 / 18} accessibilityLabel={state === "Resting" ? "Rest left" : "Workout progress"} />
              </Card>
            </View>

            {state === "Lifting" ? (
              <SettingsGroup>
                <StepperRow label="Weight" Icon={Weight} value={weight} onChange={setWeight} min={0} max={300} step={2.5} format={(v) => `${v} kg`} />
                <StepperRow label="Reps" Icon={Hash} value={reps} onChange={setReps} min={1} max={30} />
              </SettingsGroup>
            ) : null}

            <SectionTitle>{ex.name}</SectionTitle>
            <SettingsGroup>
              {Array.from({ length: ex.sets }, (_, i) => (
                <SettingsRow
                  key={i}
                  label={`Set ${i + 1}`}
                  Icon={i < 2 ? Check : Circle}
                  trailing={i < 2 ? `${ex.weight} kg × ${ex.reps}` : i === 2 ? "Now" : "To do"}
                />
              ))}
            </SettingsGroup>

            <SectionTitle>Up next</SectionTitle>
            <SettingsGroup separatorInset={MEDIA_INSET}>
              {W.exercises.slice(1, 3).map((e) => (
                <MediaRow key={e.name} image={W.photo} title={e.name} subtitle={`${e.sets} × ${e.reps}${e.weight ? `, ${e.weight} kg` : ""}`} />
              ))}
            </SettingsGroup>
          </>
        )}
      </DemoScreen>
      <ConfirmDialog
        visible={ending}
        onClose={() => setEnding(false)}
        title="End this workout?"
        message="The 2 sets you logged are saved. The rest is skipped."
        confirmLabel="End workout"
        destructive
        onConfirm={() => router.back()}
      />
    </>
  );
}
