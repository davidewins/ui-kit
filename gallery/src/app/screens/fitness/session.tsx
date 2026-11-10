import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Card, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { Gauge } from "@/components/ui/feedback/Gauge";
import { StepperRow } from "@/components/ui/inputs/StepperRow";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { workoutById } from "@/gallery/demo/data";
import { DataTable, DemoScreen, FactList, TitleBlock, useStates, Section } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { Check, Circle, Hash, Trophy, Weight } from "lucide-react-native";
import { useEffect, useState } from "react";
import Animated, { ZoomIn } from "react-native-reanimated";

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
  const { state } = useStates(STATES);
  const [weight, setWeight] = useState(80);
  const [reps, setReps] = useState(6);
  const [ending, setEnding] = useState(false);
  // Sets of the first exercise logged so far; Log set really logs.
  const [done, setDone] = useState(2);
  const [justLogged, setJustLogged] = useState(-1);
  const exSets = W.exercises[0].sets;
  const totalSets = W.exercises.reduce((n, e) => n + e.sets, 0);
  const logSet = () => {
    if (done >= exSets) return;
    setJustLogged(done);
    setDone(done + 1);
  };
  const elapsed = useTicker(18 * 60 + 42, 1);
  const rest = useTicker(90, -1);
  const ex = W.exercises[0];

  const footer =
    state === "Lifting" ? (
      <InsetFooter
        primaryCta={{
          label: done < exSets ? `Log set ${done + 1}` : "Next exercise",
          onPress: () => {
            if (done < exSets) {
              logSet();
              Toast.success(`Set ${done + 1} logged, ${weight} kg × ${reps}`);
            } else Toast.info("Up next: Romanian deadlift");
          },
        }}
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
      <DemoScreen footer={footer} secondary={state !== "Finished"}>
        {state === "Finished" ? (
          <>
            <TitleBlock title="Workout done" subtitle={`${W.name}, today 07:10 to 07:57`} />
            <FactList
              items={[
                { label: "Time", value: "47:12", delta: "+2:09 vs last", good: false },
                { label: "Volume", value: "6,240", unit: "kg", delta: "+260 kg", good: true },
                { label: "Sets", value: "16", delta: "Same as last" , good: true },
                { label: "Avg heart rate", value: "128", unit: "bpm" },
                { label: "Max heart rate", value: "171", unit: "bpm" },
                { label: "Energy", value: "412", unit: "kcal" },
              ]}
            />
            <SettingsGroup>
              <SettingsRow label="New best: back squat" Icon={Trophy} trailing="100 kg × 3" />
            </SettingsGroup>
            <Section title="Exercises" art="checkMark" />
            <DataTable
              dense
              columns={[
                { key: "name", label: "Exercise" },
                { key: "sets", label: "Sets", width: 36 },
                { key: "top", label: "Top set", width: 64 },
                { key: "vol", label: "Volume", width: 56 },
                { key: "diff", label: "vs last", width: 52 },
              ]}
              rows={W.exercises.map((e, i) => ({
                name: e.name,
                sets: String(e.sets),
                top: i === 0 ? "100 × 3" : `${e.weight} × ${e.reps}`,
                vol: `${Math.round((e.sets * (parseInt(e.reps, 10) || 0) * (e.weight ?? 0)) / 10) * 10}`,
                diff: i === 2 ? "-40" : `+${(i + 1) * 30}`,
              }))}
            />
          </>
        ) : (
          <>
            <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
              <Card raised>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text weight="semibold" numberOfLines={1} style={{ fontSize: 17, letterSpacing: -0.3 }}>{ex.name}</Text>
                    <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>
                      {state === "Resting" ? `Rest, then set ${Math.min(done + 1, ex.sets)} of ${ex.sets}` : `Set ${Math.min(done + 1, ex.sets)} of ${ex.sets}, rest ${clock(ex.rest ?? 90)} after`}
                    </Text>
                    <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>{`Exercise 1 of ${W.exercises.length}, best ${ex.best}`}</Text>
                  </View>
                  <Text weight="semibold" style={{ fontSize: 34, letterSpacing: -0.8, fontVariant: ["tabular-nums"] }}>
                    {state === "Resting" ? clock(rest) : `${weight}`}
                  </Text>
                  {state === "Resting" ? null : <Text weight="medium" style={{ fontSize: 13, color: colors.muted, marginLeft: 4, marginTop: 10 }}>{`kg × ${reps}`}</Text>}
                </View>
              </Card>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-around", marginHorizontal: 16, marginBottom: 8 }}>
              <Gauge label="Sets" value={done} max={totalSets} valueLabel={`${done}/${totalSets}`} />
              <Gauge label="Volume" value={done * weight * reps} max={6240} valueLabel={(done * weight * reps).toLocaleString("en-IE")} />
              <Gauge label="Time" value={elapsed} max={45 * 60} valueLabel={`${Math.floor(elapsed / 60)}m`} />
            </View>

            <Section title={ex.name} art="stopwatch" trailing={`${done} of ${ex.sets} sets`} />
            <DataTable
              columns={[
                { key: "set", label: "Set", width: 32, align: "left" },
                { key: "prev", label: "Previous" },
                { key: "kg", label: "kg", width: 48 },
                { key: "reps", label: "Reps", width: 44 },
                { key: "done", label: "", width: 24, align: "center" },
              ]}
              rows={Array.from({ length: ex.sets }, (_, i) => ({
                set: String(i + 1),
                prev: ex.last ?? "",
                kg: i < done || i === done ? String(i < 2 ? ex.weight : weight) : "",
                reps: i < done || i === done ? (i < 2 ? ex.reps : String(reps)) : "",
                done:
                  i < done ? (
                    // The set just logged ticks in with a spring; earlier ones sit still.
                    <Animated.View key={`check-${i}-${i === justLogged}`} entering={i === justLogged ? ZoomIn.springify().damping(12) : undefined}>
                      <Check size={16} color={colors.success} strokeWidth={2.5} />
                    </Animated.View>
                  ) : i === done ? (
                    <Circle size={14} color={colors.text} strokeWidth={2.5} />
                  ) : (
                    ""
                  ),
              }))}
              highlight={done < ex.sets ? done : undefined}
              muted={Array.from({ length: done }, (_, i) => i)}
            />

            {state === "Lifting" ? (
              <SettingsGroup>
                <StepperRow label="Weight" Icon={Weight} value={weight} onChange={setWeight} min={0} max={300} step={2.5} format={(v) => `${v} kg`} />
                <StepperRow label="Reps" Icon={Hash} value={reps} onChange={setReps} min={1} max={30} />
              </SettingsGroup>
            ) : null}

            <Section title="Still to do" art="checklist" trailing={`${W.exercises.length - 1} exercises`} />
            <DataTable
              dense
              columns={[
                { key: "name", label: "Exercise" },
                { key: "plan", label: "Sets", width: 40 },
                { key: "kg", label: "Load", width: 44 },
                { key: "last", label: "Last", width: 60 },
                { key: "rest", label: "Rest", width: 40 },
              ]}
              rows={W.exercises.slice(1).map((e) => ({
                name: e.name,
                plan: `${e.sets}×${e.reps}`,
                kg: e.weight ? String(e.weight) : "BW",
                last: e.last ?? "",
                rest: clock(e.rest ?? 90),
              }))}
            />
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
