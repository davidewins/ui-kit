// The same account as numbers, the Instagram Insights way: followers and
// their 30-day curve on glass (drag to read a day), reach by day (tap a
// bar), where the reach came from, when followers are around, and the posts
// that did the work. The range is a native menu; long-press a post for more.
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { Menu } from "@/components/ui/actions/Menu";
import { BarChart } from "@/components/ui/data/BarChart";
import { DonutChart } from "@/components/ui/data/DonutChart";
import { Heatmap } from "@/components/ui/data/Heatmap";
import { LineChart } from "@/components/ui/data/LineChart";
import { Trend } from "@/components/ui/data/Trend";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { Popover } from "@/components/ui/overlays/Popover";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Image } from "expo-image";
import { type Href, Stack, router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import {
  BEST_TIMES, BEST_TIMES_COLUMNS, BEST_TIMES_ROWS, CREATOR, DAYS_30, ENGAGEMENT, FOLLOWERS, FOLLOWERS_30, FOLLOWERS_GAINED_30,
  REACH_30, REACH_7, REACH_CHANGE, REACH_FOLLOWERS, REACH_SOURCES, REACH_WEEK, TOP_POSTS, compact, full, interactions,
} from "./data";
import { HREF } from "./parts";

const RANGES = ["Last 7 days", "Last 30 days", "Last 90 days"];

export default function AccountInsights() {
  const colors = useThemeColors();
  const hues = useHues();
  const [day, setDay] = useState<number | undefined>(undefined);
  const [bar, setBar] = useState(REACH_WEEK.length - 2);
  const [range, setRange] = useState(RANGES[1]);
  const sourceColors = [hues.pink, hues.orange, hues.blue, hues.teal, hues.gray];
  const top = TOP_POSTS[0].views;

  return (
    <>
      <Stack.Screen options={{ title: `@${CREATOR.handle}` }} />
      <ActionMenu
        accessibilityLabel="Insights actions"
        actions={[
          { label: "Export as PDF", systemImage: "square.and.arrow.up", onPress: () => Toast.success("Report sent to your email") },
          { label: "Compare with another account", systemImage: "arrow.left.arrow.right", onPress: () => Toast.info("Choose an account") },
          { label: "Open on Instagram", systemImage: "arrow.up.right.square", onPress: () => Toast.info("Opening Instagram") },
        ]}
      />
      <DemoScreen>
        <Panel glass>
          <Text weight="semibold" style={[TYPE.display, TABULAR]}>{day === undefined ? `${full(FOLLOWERS)} followers` : `${full(FOLLOWERS_30[day])} on ${DAYS_30[day]}`}</Text>
          <View style={{ marginTop: 4, marginBottom: 12 }}>
            <Trend value={full(FOLLOWERS_GAINED_30)} direction="up" note={`in 30 days, ${ENGAGEMENT}% engage with a post`} />
          </View>
          <LineChart series={[{ values: FOLLOWERS_30, color: hues.pink }]} area height={140} selected={day} onSelect={setDay} labels={[DAYS_30[0], DAYS_30[10], DAYS_30[20], DAYS_30[DAYS_30.length - 1]]} accessibilityLabel="Followers over 30 days" />
          <View style={{ flexDirection: "row", columnGap: 8, marginTop: 14 }}>
            <Menu label={range} systemImage="calendar" items={RANGES.map((r) => ({ label: r, selected: r === range, onPress: () => setRange(r) }))} />
            <Popover label="What counts" systemImage="info.circle">
              <View style={{ width: 280, padding: 16, rowGap: 8 }}>
                <Text weight="medium" style={TYPE.body}>Followers are counted at midnight Irish time each day.</Text>
                <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>Reach is the number of different accounts that saw any post, once each. Views count every time a post was played.</Text>
              </View>
            </Popover>
          </View>
        </Panel>

        <SectionHeader title="Reach this week" />
        <Panel>
          <Text weight="semibold" style={[TYPE.title, TABULAR]}>{`${full(REACH_WEEK[bar].value)} accounts`}</Text>
          <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, marginBottom: 12 }]}>{REACH_WEEK[bar].date}</Text>
          <BarChart data={REACH_WEEK.map((d) => ({ label: d.label, value: d.value }))} selected={bar} onSelect={setBar} format={compact} height={132} accessibilityLabel="Accounts reached per day" />
          <View style={{ marginTop: 12 }}>
            <Trend value={`${Math.abs(REACH_CHANGE)}%`} direction={REACH_CHANGE >= 0 ? "up" : "down"} note={`on the week before, ${full(REACH_7)} in all`} />
          </View>
        </Panel>

        <SectionHeader title="Where the reach came from" />
        <Panel>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 20 }}>
            <DonutChart size={132} thickness={16} segments={REACH_SOURCES.map((s, i) => ({ ...s, color: sourceColors[i] }))}>
              <Text weight="semibold" style={[TYPE.headline, TABULAR]}>{compact(REACH_30)}</Text>
              <Text weight="medium" style={[TYPE.caption, { color: colors.muted }]}>reached</Text>
            </DonutChart>
            <View style={{ flex: 1, rowGap: 8 }}>
              {REACH_SOURCES.map((s, i) => (
                <View key={s.label} style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: sourceColors[i] }} />
                  <Text weight="medium" style={[TYPE.sub, { flex: 1 }]}>{s.label}</Text>
                  <Text weight="medium" style={[TYPE.sub, TABULAR]}>{`${Math.round((s.value / REACH_30) * 100)}%`}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text weight="medium" style={[TYPE.body, TABULAR, { marginTop: 14 }]}>
            {`${Math.round(((REACH_30 - REACH_FOLLOWERS) / REACH_30) * 100)}% of them do not follow you yet. Reels found most of those.`}
          </Text>
        </Panel>

        <SectionHeader title="When your followers are on" />
        <Panel>
          <Text weight="medium" style={[TYPE.body, { marginBottom: 12 }]}>Tuesday and Thursday at 18:00 are your best slots. Saturdays are quiet until lunch.</Text>
          <Heatmap columns={BEST_TIMES} color={hues.pink} gap={3} rowLabels={BEST_TIMES_ROWS} columnLabels={BEST_TIMES_COLUMNS} accessibilityLabel="Follower activity by day and hour" />
        </Panel>

        <SectionHeader title="Top posts" action={{ label: "Timeline", onPress: () => router.push(HREF.feed as Href) }} />
        <Panel flush>
          {TOP_POSTS.map((p, i) => (
            <ContextMenu
              key={p.id}
              actions={[
                { label: "Open on Instagram", systemImage: "arrow.up.right.square", onPress: () => Toast.info("Opening Instagram") },
                { label: "Post it again", systemImage: "arrow.2.squarepath", onPress: () => Toast.info("Added to drafts") },
                { label: "Copy link", systemImage: "link", onPress: () => Toast.success("Link copied") },
              ]}
            >
              <Pressable
                onPress={() => router.push(HREF.feed as Href)}
                accessibilityRole="button"
                accessibilityLabel={`${p.caption}, ${full(p.views)} views`}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 12,
                  minHeight: 72,
                  paddingHorizontal: 16,
                  borderTopWidth: i ? StyleSheet.hairlineWidth : 0,
                  borderColor: colors.border,
                  backgroundColor: pressed ? colors.border : "transparent",
                })}
              >
                <Image source={p.photo} style={{ width: 48, height: 48, borderRadius: 10 }} contentFit="cover" />
                <View style={{ flex: 1, rowGap: 5 }}>
                  <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 8 }}>
                    <Text weight="medium" numberOfLines={1} style={[TYPE.body, { flex: 1 }]}>{p.caption}</Text>
                    <Text weight="semibold" style={[TYPE.body, TABULAR]}>{compact(p.views)}</Text>
                  </View>
                  <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.border }}>
                    <View style={{ width: `${(p.views / top) * 100}%`, height: 4, borderRadius: 2, backgroundColor: hues.pink }} />
                  </View>
                  <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${full(interactions(p))} likes, comments, saves and shares`}</Text>
                </View>
              </Pressable>
            </ContextMenu>
          ))}
        </Panel>
      </DemoScreen>
    </>
  );
}
