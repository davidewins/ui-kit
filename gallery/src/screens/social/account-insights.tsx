// The same account as numbers, the Instagram Insights way: followers and
// their 30-day curve (drag to read a day), reach by day (tap a bar), where
// the reach came from, when followers are around, and the posts that did
// the work.
import { Text, View } from "@/components/ui";
import { BarChart } from "@/components/ui/data/BarChart";
import { DonutChart } from "@/components/ui/data/DonutChart";
import { Heatmap } from "@/components/ui/data/Heatmap";
import { LineChart } from "@/components/ui/data/LineChart";
import { Trend } from "@/components/ui/data/Trend";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { DemoScreen, GUTTER } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image } from "expo-image";
import { type Href, Stack, router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import {
  BEST_TIMES, BEST_TIMES_COLUMNS, BEST_TIMES_ROWS, CREATOR, DAYS_30, ENGAGEMENT, FOLLOWERS, FOLLOWERS_30, FOLLOWERS_GAINED_30,
  REACH_30, REACH_7, REACH_CHANGE, REACH_FOLLOWERS, REACH_SOURCES, REACH_WEEK, TOP_POSTS, compact, full, interactions,
} from "./data";
import { HREF } from "./parts";

export default function AccountInsights() {
  const colors = useThemeColors();
  const hues = useHues();
  const [day, setDay] = useState<number | undefined>(undefined);
  const [bar, setBar] = useState(REACH_WEEK.length - 2);
  const sourceColors = [hues.pink, hues.orange, hues.blue, hues.teal, hues.gray];
  const top = TOP_POSTS[0].views;

  return (
    <DemoScreen>
      <Stack.Screen options={{ title: `@${CREATOR.handle}` }} />
      <View style={{ paddingHorizontal: GUTTER, paddingTop: 4 }}>
        <Text style={TABULAR}>
          <Text weight="semibold" style={TYPE.display}>{full(day === undefined ? FOLLOWERS : FOLLOWERS_30[day])}</Text>
          <Text weight="semibold" style={[TYPE.title, { color: colors.muted }]}>{day === undefined ? " followers" : ` on ${DAYS_30[day]}`}</Text>
        </Text>
        <View style={{ marginTop: 4, marginBottom: 12 }}>
          <Trend value={full(FOLLOWERS_GAINED_30)} direction="up" note={`in 30 days, ${ENGAGEMENT}% engage with a post`} />
        </View>
        <LineChart series={[{ values: FOLLOWERS_30, color: hues.pink }]} area height={140} selected={day} onSelect={setDay} labels={[DAYS_30[0], DAYS_30[10], DAYS_30[20], DAYS_30[DAYS_30.length - 1]]} accessibilityLabel="Followers over 30 days" />
      </View>

      <SectionHeader title="Reach" count="7 days" />
      <View style={{ paddingHorizontal: GUTTER }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 10, marginBottom: 10 }}>
          <Text style={TABULAR}>
            <Text weight="semibold" style={TYPE.title}>{full(REACH_WEEK[bar].value)}</Text>
            <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>{` accounts, ${REACH_WEEK[bar].date}`}</Text>
          </Text>
        </View>
        <BarChart data={REACH_WEEK.map((d) => ({ label: d.label, value: d.value }))} selected={bar} onSelect={setBar} format={compact} height={132} accessibilityLabel="Accounts reached per day" />
        <View style={{ marginTop: 12 }}>
          <Trend value={`${Math.abs(REACH_CHANGE)}%`} direction={REACH_CHANGE >= 0 ? "up" : "down"} note={`on the week before, ${full(REACH_7)} in all`} />
        </View>
      </View>

      <SectionHeader title="Where it came from" count="30 days" />
      <View style={{ flexDirection: "row", alignItems: "center", columnGap: 20, paddingHorizontal: GUTTER }}>
        <DonutChart size={132} thickness={16} segments={REACH_SOURCES.map((s, i) => ({ ...s, color: sourceColors[i] }))}>
          <Text weight="semibold" style={[TYPE.headline, TABULAR]}>{compact(REACH_30)}</Text>
          <Text weight="medium" style={[TYPE.caption, { color: colors.muted }]}>reached</Text>
        </DonutChart>
        <View style={{ flex: 1, rowGap: 8 }}>
          {REACH_SOURCES.map((s, i) => (
            <View key={s.label} style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>
              <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: sourceColors[i] }} />
              <Text weight="medium" style={[TYPE.sub, { flex: 1 }]}>{s.label}</Text>
              <Text weight="semibold" style={[TYPE.sub, TABULAR]}>{`${Math.round((s.value / REACH_30) * 100)}%`}</Text>
            </View>
          ))}
        </View>
      </View>
      <Text weight="medium" style={[TYPE.body, TABULAR, { paddingHorizontal: GUTTER, marginTop: 14 }]}>
        {`${Math.round(((REACH_30 - REACH_FOLLOWERS) / REACH_30) * 100)}% of them do not follow you yet. Reels found most of those.`}
      </Text>

      <SectionHeader title="When your followers are on" />
      <View style={{ paddingHorizontal: GUTTER }}>
        <Text weight="medium" style={[TYPE.body, { marginBottom: 12 }]}>Tuesday and Thursday at 18:00 are your best slots. Saturdays are quiet until lunch.</Text>
        <Heatmap columns={BEST_TIMES} color={hues.pink} gap={3} rowLabels={BEST_TIMES_ROWS} columnLabels={BEST_TIMES_COLUMNS} accessibilityLabel="Follower activity by day and hour" />
      </View>

      <SectionHeader title="Top posts" count={TOP_POSTS.length} action={{ label: "Timeline", onPress: () => router.push(HREF.feed as Href) }} />
      {TOP_POSTS.map((p, i) => (
        <Pressable
          key={p.id}
          onPress={() => router.push(HREF.feed as Href)}
          accessibilityRole="button"
          accessibilityLabel={`${p.caption}, ${full(p.views)} views`}
          style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", columnGap: 12, paddingHorizontal: GUTTER, backgroundColor: pressed ? colors.border : "transparent" })}
        >
          <Text weight="semibold" style={[TYPE.sub, TABULAR, { width: 14, color: colors.muted }]}>{i + 1}</Text>
          <Image source={p.photo} style={{ width: 48, height: 48, borderRadius: 10 }} contentFit="cover" />
          <View style={{ flex: 1, minHeight: 68, justifyContent: "center", rowGap: 5, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}>
            <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 8 }}>
              <Text weight="medium" numberOfLines={1} style={[TYPE.body, { flex: 1 }]}>{p.caption}</Text>
              <Text weight="semibold" style={[TYPE.body, TABULAR]}>{compact(p.views)}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>
              <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border }}>
                <View style={{ width: `${(p.views / top) * 100}%`, height: 4, borderRadius: 2, backgroundColor: hues.pink }} />
              </View>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${full(interactions(p))} interactions`}</Text>
            </View>
          </View>
        </Pressable>
      ))}
    </DemoScreen>
  );
}
