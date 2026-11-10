// TKVR's Social account page as the account's own profile, the way Instagram
// shows it: who it is on one glass block (the three figures stacked over
// their words, whether TKVR is still connected), the week's reach as a card
// that opens Insights, then what was actually posted as a full-bleed grid of
// photos. The segmented control swaps the grid between what is live, what is
// queued and what is still a draft.
//
// Native pieces: the header menu (ActionMenu), Share profile (ShareLink),
// the connection callout (Popover), the grid switch (UISegmentedControl) and
// the confirm before disconnecting (ConfirmDialog).
import { Sparkline } from "@/components/analytics/Sparkline";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { Button } from "@/components/ui/actions/Button";
import { ShareLink } from "@/components/ui/actions/ShareLink";
import { SegmentedControl } from "@/components/ui/inputs/SegmentedControl";
import { MediaGrid, type MediaGridItem } from "@/components/ui/lists/MediaGrid";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { Popover } from "@/components/ui/overlays/Popover";
import { Avatar } from "@/components/ui/primitives/Avatar";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen, GUTTER, MediaRow, useStates } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { type Href, Stack, router } from "expo-router";
import { BarChart3, Plus, Rows3 } from "lucide-react-native";
import { useState } from "react";
import { CREATOR, DRAFTS, ENGAGEMENT, FOLLOWERS, POSTS, REACH_7, REACH_CHANGE, REACH_WEEK, SCHEDULED, compact, full } from "./data";
import { HREF, NetworkBadge, PanelRows } from "./parts";

const STATES = ["Connected", "Login expired"] as const;
const TABS = ["posts", "scheduled", "drafts"] as const;
type Tab = (typeof TABS)[number];

export default function AccountProfile() {
  const colors = useThemeColors();
  const hues = useHues();
  const { state } = useStates(STATES);
  const [tab, setTab] = useState<Tab>("posts");
  const [disconnecting, setDisconnecting] = useState(false);
  const expired = state === "Login expired";

  const grid: Record<Tab, MediaGridItem[]> = {
    posts: [...POSTS]
      .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned))
      .map((p) => ({ key: p.id, source: p.photo, label: p.caption, stat: compact(p.views), statGlyph: "eye", kind: p.kind === "photo" ? undefined : p.kind, pinned: p.pinned })),
    scheduled: SCHEDULED.map((p) => ({ key: p.id, source: p.photo, label: p.caption, stat: p.when, statGlyph: "clock", kind: p.kind === "photo" ? undefined : p.kind })),
    drafts: DRAFTS.map((p) => ({ key: p.id, source: p.photo, label: p.caption, stat: p.when, statGlyph: "pencil", kind: p.kind === "photo" ? undefined : p.kind })),
  };

  // The figure on its own line, its word on the next: never two styles on one.
  const figure = (value: string, label: string) => (
    <View style={{ flex: 1, rowGap: 1 }} accessibilityLabel={`${value} ${label}`}>
      <Text weight="semibold" numberOfLines={1} style={[TYPE.title, TABULAR]}>{value}</Text>
      <Text weight="medium" numberOfLines={1} style={[TYPE.sub, { color: colors.muted }]}>{label}</Text>
    </View>
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
          { label: "Disconnect", systemImage: "bolt.horizontal", destructive: true, onPress: () => setDisconnecting(true) },
        ]}
      />
      <DemoScreen footer={expired ? <InsetFooter primaryCta={{ label: "Connect Instagram again", onPress: () => Toast.success("Instagram connected") }} /> : undefined}>
        <Panel glass>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 16 }}>
            <Avatar name={CREATOR.name} source={CREATOR.avatar} size={84} ring={!expired} badge={<NetworkBadge network="instagram" size={24} ring on={colors.card} />} />
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

          <View style={{ flexDirection: "row", columnGap: 12, marginTop: 18 }}>
            {figure(full(CREATOR.posts), "posts")}
            {figure(full(FOLLOWERS), "followers")}
            {figure(full(CREATOR.following), "following")}
          </View>

          <Text weight="medium" style={[TYPE.body, { marginTop: 14 }]}>
            {expired ? "3 scheduled posts are on hold until you connect again. Nothing already on Instagram is affected." : CREATOR.bio}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8, marginTop: 14 }}>
            <ShareLink url={`https://instagram.com/${CREATOR.handle}`} label="Share profile" subject={`${CREATOR.name} on Instagram`} message={`Follow @${CREATOR.handle} on Instagram:`} />
            <Popover label={expired ? "Why it expired" : "Connection"} systemImage="info.circle">
              <View style={{ width: 260, padding: 16 }}>
                <Text weight="medium" style={TYPE.body}>
                  {expired
                    ? "Instagram signs apps out every 60 days and yours ran out on Sat 7 Nov. Connect again and the 3 scheduled posts go out at their set times."
                    : `TKVR can post, read your numbers and answer DMs on this account. It last synced ${CREATOR.synced}. Instagram asks you to sign in again every 60 days.`}
                </Text>
              </View>
            </Popover>
          </View>
        </Panel>

        {expired ? null : (
          <View style={{ paddingHorizontal: GUTTER, marginTop: 12, flexDirection: "row", columnGap: 8 }}>
            <View style={{ flex: 1 }}>
              <Button size="sm" fullWidth leftIcon={<Plus />} onPress={() => Toast.info("New post to Instagram")}>New post</Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button size="sm" variant="secondary" fullWidth leftIcon={<BarChart3 />} onPress={() => router.push(HREF.insights as Href)}>Insights</Button>
            </View>
            <View style={{ flex: 1 }}>
              <Button size="sm" variant="secondary" fullWidth leftIcon={<Rows3 />} onPress={() => router.push(HREF.feed as Href)}>Timeline</Button>
            </View>
          </View>
        )}

        <Panel flush style={{ marginTop: 12 }}>
          <PanelRows>
            <MediaRow
              leading={<Sparkline values={REACH_WEEK.map((d) => d.value)} width={44} height={30} color={hues.pink} />}
              title={`${full(REACH_7)} accounts reached this week`}
              subtitle={`Up ${REACH_CHANGE}% on last week, ${ENGAGEMENT}% engagement`}
              href={HREF.insights as Href}
            />
          </PanelRows>
        </Panel>

        <View style={{ paddingHorizontal: GUTTER, marginTop: 20, marginBottom: 12 }}>
          <SegmentedControl
            values={[`${full(CREATOR.posts)} posts`, `${SCHEDULED.length} scheduled`, `${DRAFTS.length} drafts`]}
            selectedIndex={TABS.indexOf(tab)}
            onChange={(i) => setTab(TABS[i])}
            accessibilityLabel="What the grid shows"
          />
        </View>
        <MediaGrid items={grid[tab]} onPress={(item) => (tab === "posts" ? router.push(HREF.feed as Href) : Toast.info(item.label))} />
      </DemoScreen>
      <ConfirmDialog
        visible={disconnecting}
        onClose={() => setDisconnecting(false)}
        title="Disconnect Instagram from TKVR?"
        message={`The ${SCHEDULED.length} scheduled posts will not go out and your numbers stop updating. Nothing already on Instagram is removed.`}
        confirmLabel="Disconnect"
        cancelLabel="Stay connected"
        destructive
        onConfirm={() => Toast.success("Instagram disconnected")}
      />
    </>
  );
}
