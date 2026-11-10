// TKVR's Social account page as the account's own profile, the way Instagram
// shows it: who it is, the three figures as one line of text, whether TKVR
// is still connected, then what was actually posted as a grid of photos.
// The icon tabs swap the grid between what is live, what is queued and what
// is still a draft.
import { Sparkline } from "@/components/analytics/Sparkline";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { Button } from "@/components/ui/actions/Button";
import { IconTabs } from "@/components/ui/inputs/IconTabs";
import { MediaGrid, type MediaGridItem } from "@/components/ui/lists/MediaGrid";
import { Avatar } from "@/components/ui/primitives/Avatar";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { DemoScreen, GUTTER, MediaRow, useStates } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { type Href, Stack, router } from "expo-router";
import { BarChart3, CalendarClock, Grid3x3, PencilLine, Plus, Rows3 } from "lucide-react-native";
import { useState } from "react";
import { CREATOR, DRAFTS, ENGAGEMENT, FOLLOWERS, POSTS, REACH_7, REACH_CHANGE, REACH_WEEK, SCHEDULED, compact, full } from "./data";
import { HREF, NetworkBadge } from "./parts";

const STATES = ["Connected", "Login expired"] as const;
type Tab = "posts" | "scheduled" | "drafts";

export default function AccountProfile() {
  const colors = useThemeColors();
  const hues = useHues();
  const { state } = useStates(STATES);
  const [tab, setTab] = useState<Tab>("posts");
  const expired = state === "Login expired";

  const grid: Record<Tab, MediaGridItem[]> = {
    posts: [...POSTS]
      .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned))
      .map((p) => ({ key: p.id, source: p.photo, label: p.caption, stat: compact(p.views), statGlyph: "eye", kind: p.kind === "photo" ? undefined : p.kind, pinned: p.pinned })),
    scheduled: SCHEDULED.map((p) => ({ key: p.id, source: p.photo, label: p.caption, stat: p.when, statGlyph: "clock", kind: p.kind === "photo" ? undefined : p.kind })),
    drafts: DRAFTS.map((p) => ({ key: p.id, source: p.photo, label: p.caption, stat: p.when, statGlyph: "pencil", kind: p.kind === "photo" ? undefined : p.kind })),
  };

  const figure = (value: string, label: string) => (
    <Text numberOfLines={1} style={TABULAR}>
      <Text weight="semibold" style={TYPE.headline}>{value}</Text>
      <Text weight="medium" style={[TYPE.body, { color: colors.muted }]}>{` ${label}`}</Text>
    </Text>
  );

  return (
    <>
      <Stack.Screen options={{ title: CREATOR.handle }} />
      <ActionMenu
        accessibilityLabel="Account actions"
        buttons={expired ? [] : [{ label: "New post", systemImage: "plus", icon: Plus, onPress: () => Toast.info("New post to Instagram") }]}
        actions={[
          { label: "Open on Instagram", systemImage: "arrow.up.right.square", onPress: () => Toast.info("Opening Instagram") },
          { label: "Sync now", systemImage: "arrow.clockwise", onPress: () => Toast.success("Synced") },
          { label: "Disconnect", systemImage: "bolt.horizontal", destructive: true, onPress: () => Toast.info("Disconnect Instagram") },
        ]}
      />
      <DemoScreen footer={expired ? <InsetFooter primaryCta={{ label: "Connect Instagram again", onPress: () => Toast.success("Instagram connected") }} /> : undefined}>
        <View style={{ paddingHorizontal: GUTTER, flexDirection: "row", alignItems: "center", columnGap: 16 }}>
          <Avatar name={CREATOR.name} source={CREATOR.avatar} size={84} ring={!expired} badge={<NetworkBadge network="instagram" size={24} ring />} />
          <View style={{ flex: 1, rowGap: 3 }}>
            <Text weight="semibold" numberOfLines={1} style={TYPE.title}>{CREATOR.name}</Text>
            <Text weight="medium" numberOfLines={1} style={[TYPE.body, { color: colors.muted }]}>{`@${CREATOR.handle}`}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6, marginTop: 2 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: expired ? colors.error : colors.success }} />
              <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { flex: 1, color: expired ? colors.error : colors.muted }]}>
                {expired ? "Login expired 3 days ago" : `Connected, synced ${CREATOR.synced}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: GUTTER, marginTop: 16, flexDirection: "row", alignItems: "baseline", columnGap: 18 }}>
          {figure(full(CREATOR.posts), "posts")}
          {figure(full(FOLLOWERS), "followers")}
          {figure(full(CREATOR.following), "following")}
        </View>

        <Text weight="medium" style={[TYPE.body, { paddingHorizontal: GUTTER, marginTop: 8 }]}>
          {expired ? "3 scheduled posts are on hold until you connect again. Nothing already on Instagram is affected." : CREATOR.bio}
        </Text>

        {expired ? null : (
          <View style={{ paddingHorizontal: GUTTER, marginTop: 14, flexDirection: "row", columnGap: 8 }}>
            <View style={{ flex: 1 }}>
              <Button size="sm" fullWidth leftIcon={<Plus />} onPress={() => Toast.info("New post to Instagram")}>New post</Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button size="sm" variant="outline" fullWidth leftIcon={<BarChart3 />} onPress={() => router.push(HREF.insights as Href)}>Insights</Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button size="sm" variant="outline" fullWidth leftIcon={<Rows3 />} onPress={() => router.push(HREF.feed as Href)}>Timeline</Button>
            </View>
          </View>
        )}

        <View style={{ marginTop: 10 }}>
          <MediaRow
            leading={<Sparkline values={REACH_WEEK.map((d) => d.value)} width={44} height={30} color={hues.pink} />}
            title={`${full(REACH_7)} accounts reached this week`}
            subtitle={`Up ${REACH_CHANGE}% on last week, ${ENGAGEMENT}% engagement`}
            href={HREF.insights as Href}
          />
        </View>

        <IconTabs
          tabs={[
            { key: "posts", icon: Grid3x3, label: "Posts", count: CREATOR.posts },
            { key: "scheduled", icon: CalendarClock, label: "Scheduled", count: SCHEDULED.length },
            { key: "drafts", icon: PencilLine, label: "Drafts", count: DRAFTS.length },
          ]}
          selected={tab}
          onChange={setTab}
        />
        <View style={{ marginTop: 2 }}>
          <MediaGrid items={grid[tab]} onPress={(item) => (tab === "posts" ? router.push(HREF.feed as Href) : Toast.info(item.label))} />
        </View>
      </DemoScreen>
    </>
  );
}
