// A live strength session between sets, the Hevy / Apple Workout way: the
// rest clock is the page (on glass, with glass controls), the set log sits
// under it, the next lifts are queued below. One action in the footer.
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { RoundButton } from "@/components/ui/actions/RoundButton";
import { ActivityRings } from "@/components/ui/data/ActivityRings";
import { Badge } from "@/components/ui/feedback/Badge";
import { StepperRow } from "@/components/ui/inputs/StepperRow";
import { Disclosure } from "@/components/ui/lists/Disclosure";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import * as Haptics from "expo-haptics";
import { Check, Dumbbell, Heart, Minus, Plus, Repeat, SkipForward } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { SESSION } from "./data";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function FitnessSession() {
  const colors = useThemeColors();
  const hues = useHues();
  const [left, setLeft] = useState<number>(SESSION.rest.left);
  const [logged, setLogged] = useState(SESSION.sets.filter((s) => s.done).length);
  const current = Math.min(logged, SESSION.sets.length - 1);
  const zones = [hues.gray, hues.cyan, hues.green, hues.orange, hues.red];
  const [weight, setWeight] = useState<number>(SESSION.sets[2].weight);
  const [reps, setReps] = useState<number>(SESSION.sets[2].reps);
  const [ending, setEnding] = useState(false);
  const nudge = (by: number) => setLeft((v) => Math.max(0, Math.min(SESSION.rest.of + 60, v + by)));

  return (
    <>
    <ActionMenu
      title={SESSION.exercise}
      accessibilityLabel="Workout actions"
      actions={[
        { label: "Swap this lift", systemImage: "arrow.triangle.2.circlepath", onPress: () => Toast.info("Choose a lift") },
        { label: "Add a set", systemImage: "plus", onPress: () => Toast.success("Set 5 added") },
        { label: "Add a note", systemImage: "square.and.pencil", onPress: () => Toast.info("Note") },
        { label: "End workout", systemImage: "stop.circle", destructive: true, onPress: () => setEnding(true) },
      ]}
    />
    <DemoScreen
      secondary
      footer={
        <InsetFooter
          primaryCta={{
            label: logged < SESSION.sets.length ? `Log set ${logged + 1}` : "Next lift",
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
              setLogged((n) => Math.min(SESSION.sets.length, n + 1));
              setLeft(SESSION.rest.of);
            },
          }}
          secondaryCta={{ label: "Finish workout", onPress: () => setEnding(true) }}
        />
      }
    >
      <Panel glass>
        {/* What you are on, and your heart. */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <Text weight="semibold" style={TYPE.title}>{SESSION.exercise}</Text>
            <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`Lift ${SESSION.position}, ${SESSION.elapsed} elapsed`}</Text>
          </View>
          <View style={{ alignItems: "flex-end", rowGap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }}>
              <Heart size={15} color={hues.red} fill={hues.red} />
              <Text weight="semibold" style={[TYPE.headline, TABULAR]}>{`${SESSION.heart.now} bpm`}</Text>
            </View>
            <View style={{ flexDirection: "row", columnGap: 2 }} accessibilityLabel={SESSION.heart.zone}>
              {zones.map((z, i) => (
                <View key={i} style={{ width: 14, height: 5, borderRadius: 2.5, backgroundColor: z, opacity: i === 2 ? 1 : 0.25 }} />
              ))}
            </View>
          </View>
        </View>

        {/* The rest clock. */}
        <View style={{ alignItems: "center", marginTop: 22 }}>
          <ActivityRings size={224} thickness={13} rings={[{ value: left / SESSION.rest.of, color: hues.orange }]} accessibilityLabel={`Rest, ${clock(left)} left`}>
            <Text weight="semibold" style={[TYPE.numeral, TABULAR]}>{clock(left)}</Text>
            <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`rest left of ${clock(SESSION.rest.of)}`}</Text>
          </ActivityRings>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 16, marginTop: 16 }}>
            <RoundButton accessibilityLabel="15 seconds less" onPress={() => nudge(-15)}>
              <Minus size={19} color={colors.text} strokeWidth={2.4} />
            </RoundButton>
            <RoundButton accessibilityLabel="Skip rest" size={52} onPress={() => setLeft(0)}>
              <SkipForward size={21} color={colors.text} strokeWidth={2.2} />
            </RoundButton>
            <RoundButton accessibilityLabel="15 seconds more" onPress={() => nudge(15)}>
              <Plus size={19} color={colors.text} strokeWidth={2.4} />
            </RoundButton>
          </View>
        </View>
      </Panel>

      <SectionHeader title={`Set ${Math.min(logged + 1, SESSION.sets.length)}`} />
      <Panel flush>
        <StepperRow label="Weight" Icon={Dumbbell} value={weight} onChange={setWeight} min={20} max={200} step={2.5} format={(n) => `${n} kg`} />
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: 52 }} />
        <StepperRow label="Reps" Icon={Repeat} value={reps} onChange={setReps} min={1} max={20} format={(n) => `${n} reps`} />
      </Panel>

      <SectionHeader title={`Sets, ${logged} of ${SESSION.sets.length} done`} />
      <Panel flush>
        {SESSION.sets.map((s, i) => {
          const done = i < logged;
          const now = i === current && !done;
          return (
            <View
              key={s.n}
              style={{ flexDirection: "row", alignItems: "center", columnGap: 12, height: 56, paddingHorizontal: 16, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: done ? colors.success : "transparent",
                  borderWidth: done ? 0 : 1.5,
                  borderColor: now ? colors.text : colors.border,
                }}
              >
                {done ? <Check size={15} color="#fff" strokeWidth={3} /> : <Text weight="semibold" style={[TYPE.sub, TABULAR, { color: now ? colors.text : colors.muted }]}>{s.n}</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text weight={now ? "semibold" : "medium"} style={[TYPE.body, TABULAR, { color: done || now ? colors.text : colors.muted }]}>{`${s.weight} kg × ${s.reps}`}</Text>
                <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`Last time ${s.last}`}</Text>
              </View>
              <View>{done && s.rpe ? <Badge>{`RPE ${s.rpe}`}</Badge> : now ? <Badge variant="warning">Up now</Badge> : null}</View>
            </View>
          );
        })}
      </Panel>

      <Panel style={{ marginTop: 12 }}>
        <Disclosure title={`${SESSION.queue.length} more lifts after this`}>
          <View>
            {SESSION.queue.map((q) => (
              <View key={q.name} style={{ flexDirection: "row", alignItems: "center", columnGap: 10, height: 40 }}>
                <Text weight="medium" style={[TYPE.body, { flex: 1 }]}>{q.name}</Text>
                <Text weight="medium" style={[TYPE.body, TABULAR]}>{`${q.plan} at ${q.load}`}</Text>
              </View>
            ))}
          </View>
        </Disclosure>
      </Panel>
    </DemoScreen>
    <ConfirmDialog
      visible={ending}
      onClose={() => setEnding(false)}
      title="End the workout here?"
      message={`You have logged ${logged} of ${SESSION.sets.length} sets on ${SESSION.exercise} and 4 lifts are left.`}
      confirmLabel="End and save"
      cancelLabel="Keep going"
      onConfirm={() => Toast.success("Workout saved")}
    />
    </>
  );
}
