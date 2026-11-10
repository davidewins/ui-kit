import { SocialMark } from "@/apps/tkvr/components/SocialMark";
import { NETWORK } from "@/apps/tkvr/lib/creator/social";
import { Sparkline } from "@/components/analytics/Sparkline";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { EmptyState, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { ACCOUNT_STATS, POSTS, accountById, compact, engagement } from "@/gallery/creator/data";
import { POST_INSET, PostRow } from "@/gallery/creator/parts";
import { ART } from "@/gallery/demo/data";
import { DataTable, DemoScreen, FactList, GUTTER, Section, useStates } from "@/gallery/demo/parts";
import { SkeletonFacts, SkeletonMediaRows, SkeletonSection, SkeletonTable } from "@/gallery/demo/skeletons";
import { Skeleton } from "@/components/ui/feedback/Skeleton";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { useWindowDimensions } from "react-native";

const STATES = ["Connected", "Login expired", "Loading", "No posts"] as const;

// TKVR's Social account page (app/(app)/social/account/[id].tsx), redone
// dense. TKVR shows who it is and two lists of post titles; this leads with
// the number that matters (followers and the month's change, with the
// trend), the account's facts as label / value rows, what's going out next,
// then every published post's results in one table. Disconnect moves from a
// lone red row into the header menu, behind a confirm that says what stops.
export default function SocialAccount() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const account = accountById(id);
  const stats = ACCOUNT_STATS[account.id];
  const { state } = useStates(STATES, account.needsReconnect ? "Login expired" : "Connected");
  const [disconnecting, setDisconnecting] = useState(false);
  const network = NETWORK[account.network].label;

  const posts = state === "No posts" ? [] : POSTS.filter((p) => p.accountIds.includes(account.id));
  const upcoming = posts.filter((p) => p.state === "scheduled" || p.state === "failed").sort((a, b) => a.at.localeCompare(b.at));
  const published = posts.filter((p) => p.results).sort((a, b) => b.at.localeCompare(a.at));
  const avgViews = published.length ? Math.round(published.reduce((n, p) => n + p.results!.views, 0) / published.length) : 0;
  const top = [...published].sort((a, b) => b.results!.views - a.results!.views)[0];
  const up = stats.change >= 0;

  return (
    <>
      <Stack.Screen options={{ title: network }} />
      <ActionMenu
        accessibilityLabel={`${network} account actions`}
        buttons={state === "Login expired" ? [] : [{ label: `New post to ${network}`, systemImage: "plus", icon: Plus, onPress: () => Toast.info(`New post to ${network}`) }]}
        actions={[
          { label: "Open on " + network, systemImage: "arrow.up.right.square", onPress: () => Toast.info(`Opening ${network}`) },
          { label: "Disconnect", systemImage: "bolt.horizontal", destructive: true, onPress: () => setDisconnecting(true) },
        ]}
      />
      <DemoScreen
        footer={state === "Login expired" ? <InsetFooter primaryCta={{ label: `Connect ${network} again`, onPress: () => Toast.success(`${network} connected`) }} /> : undefined}
      >
        {state === "Loading" ? (
          <>
            <View style={{ marginHorizontal: GUTTER, flexDirection: "row", alignItems: "center", columnGap: 12, marginBottom: 16 }}>
              <Skeleton width={52} height={52} radius={26} />
              <View style={{ gap: 6 }}>
                <Skeleton width={140} height={15} radius={4} />
                <Skeleton width={180} height={11} radius={4} />
              </View>
            </View>
            <View style={{ marginHorizontal: GUTTER, gap: 8, marginBottom: 12 }}>
              <Skeleton width={70} height={12} radius={4} />
              <Skeleton width={180} height={38} radius={8} />
            </View>
            <SkeletonFacts rows={6} />
            <SkeletonSection />
            <SkeletonMediaRows count={2} lead="time" />
            <SkeletonSection />
            <SkeletonTable rows={5} numbers={3} />
          </>
        ) : (
          <>
            <View style={{ marginHorizontal: GUTTER, flexDirection: "row", alignItems: "center", columnGap: 12, marginBottom: 14 }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.text, alignItems: "center", justifyContent: "center" }}>
                <SocialMark network={account.network} size={24} color={colors.background} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text weight="semibold" numberOfLines={1} style={{ fontSize: 19, letterSpacing: -0.4 }}>{`@${account.name}`}</Text>
                <Text weight="medium" numberOfLines={1} style={{ fontSize: 13, color: state === "Login expired" ? colors.error : colors.muted }}>
                  {state === "Login expired" ? `${network} login expired 3 days ago. Posts there are on hold.` : `${network}, connected since March, posting as you`}
                </Text>
              </View>
            </View>

            <View style={{ marginHorizontal: GUTTER, marginBottom: 14 }}>
              <Text weight="medium" style={{ fontSize: 15, lineHeight: 20, color: colors.muted }}>Followers</Text>
              <View style={{ flexDirection: "row", alignItems: "flex-end", columnGap: 10, marginTop: 2 }}>
                <Text weight="semibold" style={{ fontSize: 40, lineHeight: 44, letterSpacing: -1.2, fontVariant: ["tabular-nums"] }}>{stats.followers.toLocaleString("en-IE")}</Text>
                <View style={{ marginBottom: 8, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: up ? colors.successBg : colors.errorBg }}>
                  <Text weight="semibold" style={{ fontSize: 12, color: up ? colors.success : colors.error, fontVariant: ["tabular-nums"] }}>
                    {`${up ? "↑" : "↓"} ${Math.abs(stats.change).toLocaleString("en-IE")} in 30 days`}
                  </Text>
                </View>
                <View style={{ marginLeft: "auto", marginBottom: 10 }}>
                  <Sparkline values={stats.trend} width={Math.min(96, width - 260)} height={28} color={up ? colors.success : colors.error} />
                </View>
              </View>
            </View>

            <FactList
              items={[
                { label: "Reach, 30 days", value: compact(stats.reach), delta: `${stats.reachChange > 0 ? "+" : ""}${stats.reachChange}%`, good: stats.reachChange >= 0 },
                { label: "Engagement", value: `${stats.engagement}%`, delta: stats.engagement >= 4 ? "Above your average" : "Below your average", good: stats.engagement >= 4 },
                { label: "Posts, 30 days", value: String(posts.length) },
                { label: "Average views", value: compact(avgViews) },
                { label: "Best time", value: stats.best },
                ...(top ? [{ label: "Top post", value: compact(top.results!.views), unit: "views" }] : []),
              ]}
            />

            {posts.length === 0 ? (
              <EmptyState layout="inline" art={{ image: ART.megaphone }} title={`Nothing on ${network} yet`} body={`Your best time here is ${stats.best}`} action={{ label: "Write a post", onPress: () => Toast.info(`New post to ${network}`) }} />
            ) : null}

            {upcoming.length ? (
              <>
                <Section title="Up next" art="stopwatch" trailing={`${upcoming.length}`} />
                <SettingsGroup separatorInset={POST_INSET}>
                  {upcoming.map((p) => <PostRow key={p.id} post={p} showDate />)}
                </SettingsGroup>
              </>
            ) : null}

            {published.length ? (
              <>
                <Section title="Results" art="risingChart" trailing={`${published.length} posts`} />
                <DataTable
                  dense
                  columns={[
                    { key: "post", label: "Post" },
                    { key: "views", label: "Views", width: 48 },
                    { key: "likes", label: "Likes", width: 44 },
                    { key: "eng", label: "Eng.", width: 42 },
                  ]}
                  rows={published.map((p) => ({
                    post: p.content,
                    views: compact(p.results!.views),
                    likes: compact(p.results!.likes),
                    eng: `${engagement(p.results!).toFixed(1)}%`,
                  }))}
                  highlight={top ? published.indexOf(top) : undefined}
                />
              </>
            ) : null}
          </>
        )}
      </DemoScreen>
      <ConfirmDialog
        visible={disconnecting}
        onClose={() => setDisconnecting(false)}
        title={`Disconnect ${network}?`}
        message={`${upcoming.length ? `${upcoming.length} scheduled posts won't go out. ` : ""}Posts already on ${network} stay there.`}
        confirmLabel="Disconnect"
        destructive
        onConfirm={() => {
          Toast.success(`${network} disconnected`);
          router.back();
        }}
      />
    </>
  );
}
