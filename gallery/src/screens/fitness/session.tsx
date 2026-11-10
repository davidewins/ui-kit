// A live strength session between sets, the Hevy / Apple Workout way: the
// rest clock is the page, the set log sits under it, the next lifts are
// queued below. One thumb-reach action in the footer.
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { ActivityRings } from "@/components/ui/data/ActivityRings";
import { Badge } from "@/components/ui/feedback/Badge";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { DemoScreen, GUTTER } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import * as Haptics from "expo-haptics";
import { Check, Heart, Minus, Plus } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { SESSION } from "./data";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function FitnessSession() {
  const colors = useThemeColors();
  const hues = useHues();
  const [left, setLeft] = useState<number>(SESSION.rest.left);
  const [logged, setLogged] = useState(SESSION.sets.filter((s) => s.done).length);
  const current = Math.min(logged, SESSION.sets.length - 1);
  const zones = [hues.gray, hues.cyan, hues.green, hues.orange, hues.red];

  const nudge = (by: number) => {
    Haptics.selectionAsync().catch(() => {});
    setLeft((v) => Math.max(0, Math.min(SESSION.rest.of + 60, v + by)));
  };

  return (
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
          secondaryCta={{ label: "Finish workout", onPress: () => Toast.info("Workout saved") }}
        />
      }
    >
      {/* What you are on, and your heart. */}
      <View style={{ flexDirection: "row", alignItems: "flex-end", paddingHorizontal: GUTTER, paddingTop: 4 }}>
        <View style={{ flex: 1 }}>
          <Text weight="semibold" style={TYPE.title}>{SESSION.exercise}</Text>
          <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`Lift ${SESSION.position}, ${SESSION.elapsed} elapsed`}</Text>
        </View>
        <View style={{ alignItems: "flex-end", rowGap: 5 }}>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }}>
            <Heart size={15} color={hues.red} fill={hues.red} />
            <Text style={TABULAR}>
              <Text weight="semibold" style={TYPE.headline}>{SESSION.heart.now}</Text>
              <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}> bpm</Text>
            </Text>
          </View>
          <View style={{ flexDirection: "row", columnGap: 2 }} accessibilityLabel={SESSION.heart.zone}>
            {zones.map((z, i) => (
              <View key={i} style={{ width: 14, height: 5, borderRadius: 2.5, backgroundColor: z, opacity: i === 2 ? 1 : 0.25 }} />
            ))}
          </View>
        </View>
      </View>

      {/* The rest clock. */}
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <ActivityRings size={228} thickness={13} rings={[{ value: left / SESSION.rest.of, color: hues.orange }]} accessibilityLabel={`Rest, ${clock(left)} left`}>
          <Text weight="semibold" style={[TYPE.numeral, TABULAR]}>{clock(left)}</Text>
          <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`rest left of ${clock(SESSION.rest.of)}`}</Text>
        </ActivityRings>
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 10, marginTop: 14 }}>
          <RoundButton label="15 seconds less" onPress={() => nudge(-15)}><Minus size={18} color={colors.text} strokeWidth={2.4} /></RoundButton>
          <Pressable
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              setLeft(0);
            }}
            accessibilityRole="button"
            accessibilityLabel="Skip rest"
            style={({ pressed }) => ({ height: 40, paddingHorizontal: 20, borderRadius: 20, justifyContent: "center", backgroundColor: pressed ? colors.border : colors.surface })}
          >
            <Text weight="semibold" style={TYPE.body}>Skip rest</Text>
          </Pressable>
          <RoundButton label="15 seconds more" onPress={() => nudge(15)}><Plus size={18} color={colors.text} strokeWidth={2.4} /></RoundButton>
        </View>
      </View>

      <SectionHeader title="Sets" count={`${logged} of ${SESSION.sets.length}`} />
      <View style={{ paddingHorizontal: GUTTER }}>
        {SESSION.sets.map((s, i) => {
          const done = i < logged;
          const now = i === current && !done;
          return (
            <View
              key={s.n}
              style={{ flexDirection: "row", alignItems: "center", columnGap: 12, height: 52, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}
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
      </View>

      <SectionHeader title="Then" count={SESSION.queue.length} />
      <View style={{ paddingHorizontal: GUTTER, rowGap: 10 }}>
        {SESSION.queue.map((q, i) => (
          <View key={q.name} style={{ flexDirection: "row", alignItems: "baseline", columnGap: 10 }}>
            <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, width: 16 }]}>{i + 2}</Text>
            <Text weight="medium" style={[TYPE.body, { flex: 1 }]}>{q.name}</Text>
            <Text weight="medium" style={[TYPE.body, TABULAR, { color: colors.muted }]}>{`${q.plan} at ${q.load}`}</Text>
          </View>
        ))}
      </View>
    </DemoScreen>
  );
}

function RoundButton({ label, onPress, children }: { label: string; onPress: () => void; children: React.ReactNode }) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => ({ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? colors.border : colors.surface })}
    >
      {children}
    </Pressable>
  );
}
