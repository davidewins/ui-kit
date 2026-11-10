// Fitness home, the Apple Fitness way: three goals as rings with their
// figures and the week as small rings on one glass panel, the next workout
// as a photo, then what is changing over the last 8 weeks.
import { GlassSurface } from "@/components/GlassSurface";
import { Sparkline } from "@/components/analytics/Sparkline";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { ActivityRings } from "@/components/ui/data/ActivityRings";
import { Trend } from "@/components/ui/data/Trend";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen, GUTTER } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Image } from "expo-image";
import { Play } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { GOALS, NEXT, TODAY, TRENDS, WEEK } from "./data";

export default function FitnessToday() {
  const colors = useThemeColors();
  const hues = useHues();
  const today = WEEK[TODAY];
  const goals = [
    { label: "Move", value: today.move, goal: GOALS.move, unit: "kcal moved", color: hues.pink },
    { label: "Train", value: today.train, goal: GOALS.train, unit: "minutes trained", color: hues.green },
    { label: "Stand", value: today.stand, goal: GOALS.stand, unit: "hours on your feet", color: hues.cyan },
  ];

  return (
    <>
    <ActionMenu
      accessibilityLabel="Today actions"
      actions={[
        { label: "Change goals", systemImage: "target", onPress: () => Toast.info("Opening goals") },
        { label: "Log a workout", systemImage: "plus.circle", onPress: () => Toast.info("Logging a workout") },
        { label: "Share today", systemImage: "square.and.arrow.up", onPress: () => Toast.info("Opening share") },
      ]}
    />
    <DemoScreen footer={<InsetFooter primaryCta={{ label: "Start workout", onPress: () => Toast.info("Starting Lower body power") }} />}>
      {/* Today's three goals, and the week so far. */}
      <Panel glass>
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 20 }}>
          <ActivityRings size={148} thickness={16} rings={goals.map((g) => ({ value: g.value / g.goal, color: g.color }))} accessibilityLabel={goals.map((g) => `${g.label} ${g.value} of ${g.goal}`).join(", ")} />
          <View style={{ flex: 1, rowGap: 10 }}>
            {goals.map((g) => (
              <View key={g.label}>
                <Text weight="semibold" style={[TYPE.title, TABULAR, { color: g.color }]}>{`${g.value} / ${g.goal}`}</Text>
                <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>{g.unit}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: 16 }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {WEEK.map((d, i) => (
            <View key={i} style={{ alignItems: "center", rowGap: 6 }}>
              <Text weight={i === TODAY ? "semibold" : "medium"} style={[TYPE.caption, { color: i === TODAY ? colors.text : colors.muted }]}>{d.day}</Text>
              <ActivityRings
                size={36}
                thickness={4.5}
                gap={1.5}
                rings={[
                  { value: d.move / GOALS.move, color: hues.pink },
                  { value: d.train / GOALS.train, color: hues.green },
                  { value: d.stand / GOALS.stand, color: hues.cyan },
                ]}
              />
            </View>
          ))}
        </View>
      </Panel>

      <SectionHeader title={`Up next at ${NEXT.at}`} action={{ label: "Plan", onPress: () => Toast.info("Opening your plan") }} />
      <ContextMenu
        onPress={() => Toast.info("Opening Lower body power")}
        actions={[
          { label: "Start now", systemImage: "play.fill", onPress: () => Toast.info("Starting Lower body power") },
          { label: "Swap for another workout", systemImage: "arrow.triangle.2.circlepath", onPress: () => Toast.info("Choose a workout") },
          { label: "Move to tomorrow", systemImage: "calendar", onPress: () => Toast.success("Moved to Friday 18:30") },
          { label: "Skip today", systemImage: "forward.end", destructive: true, onPress: () => Toast.info("Skipped") },
        ]}
      >
      <View style={{ marginHorizontal: GUTTER, height: 212, borderRadius: 24, borderCurve: "continuous", overflow: "hidden" }}>
        <Image source={NEXT.photo} style={{ flex: 1 }} contentFit="cover" />
        <View style={{ position: "absolute", left: 10, right: 10, bottom: 10 }}>
          <GlassSurface fill fillOpacity={0.25} style={{ borderRadius: 18, borderCurve: "continuous", overflow: "hidden" }}>
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12, paddingVertical: 12, paddingLeft: 14, paddingRight: 12 }}>
              <View style={{ flex: 1 }}>
                <Text weight="semibold" numberOfLines={1} style={TYPE.headline}>{NEXT.name}</Text>
                <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR]}>
                  {`${NEXT.minutes} min, ${NEXT.exercises.length} lifts, about ${NEXT.kcal} kcal`}
                </Text>
              </View>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.text, alignItems: "center", justifyContent: "center" }}>
                <Play size={17} color={colors.background} fill={colors.background} />
              </View>
            </View>
          </GlassSurface>
        </View>
      </View>
      </ContextMenu>

      <SectionHeader title="Trends over 8 weeks" />
      <Panel flush>
        {TRENDS.map((t, i) => (
          <View
            key={t.label}
            style={{ flexDirection: "row", alignItems: "center", columnGap: 12, paddingVertical: 12, paddingHorizontal: 16, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}
          >
            <View style={{ flex: 1 }}>
              <Text weight="medium" style={TYPE.body}>{t.label}</Text>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${t.figure} ${t.unit}`}</Text>
            </View>
            <Sparkline values={[...t.values]} width={80} height={32} color={hues[t.hue]} />
            <View style={{ width: 78, alignItems: "flex-end" }}>
              <Trend value={t.change} direction={t.direction} good={t.good} />
            </View>
          </View>
        ))}
      </Panel>
    </DemoScreen>
    </>
  );
}
