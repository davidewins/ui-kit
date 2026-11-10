// The same account as a timeline, the way X shows a profile and Buffer shows
// what was sent: each post as it went out (photo, caption, when), which
// networks it went to and what it did on each one. A post that failed on one
// network says why and can be retried there without touching the others.
import { GlassSurface } from "@/components/GlassSurface";
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { Button } from "@/components/ui/actions/Button";
import { BarList } from "@/components/ui/data/BarList";
import { SegmentBar } from "@/components/ui/data/SegmentBar";
import { Badge } from "@/components/ui/feedback/Badge";
import { SettingsSeparator } from "@/components/ui/lists/SettingsGroup";
import { Avatar } from "@/components/ui/primitives/Avatar";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { DemoScreen, GUTTER } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { Bookmark, CircleAlert, CircleCheck, Eye, Heart, Layers, MessageCircle, Play, Plus, RotateCw, Send } from "lucide-react-native";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { CREATOR, FAILED_POST, NETWORK_LABEL, type Network, type NetworkResult, TIMELINE, WEEK_POSTS, WEEK_VIEWS, WEEK_VIEWS_BY_NETWORK, compact, full, resultsOf } from "./data";
import { NetworkBadge, useNetworkColor } from "./parts";

type Retry = "failed" | "retrying" | "posted";

export default function AccountFeed() {
  const colors = useThemeColors();
  const networkColor = useNetworkColor();
  const [retry, setRetry] = useState<Retry>("failed");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);
  const failedOn = NETWORK_LABEL[FAILED_POST.failed];

  const retryNow = () => {
    setRetry("retrying");
    timer.current = setTimeout(() => {
      setRetry("posted");
      Toast.success(`Posted to ${failedOn}`);
    }, 1400);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Timeline" }} />
      <ActionMenu
        accessibilityLabel="Timeline actions"
        buttons={[{ label: "New post", systemImage: "plus", icon: Plus, onPress: () => Toast.info("New post") }]}
        actions={[{ label: "Export results", systemImage: "square.and.arrow.up", onPress: () => Toast.info("Exporting this week") }]}
      />
      <DemoScreen>
        <View style={{ paddingHorizontal: GUTTER }}>
          <Text numberOfLines={1} style={TABULAR}>
            <Text weight="semibold" style={TYPE.display}>{compact(WEEK_VIEWS)}</Text>
            <Text weight="semibold" style={[TYPE.headline, { color: colors.muted }]}> views this week</Text>
          </Text>
          <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, marginTop: 2, marginBottom: 14 }]}>
            {`${WEEK_POSTS} posts to 4 networks. `}
            <Text weight="medium" style={{ color: retry === "posted" ? colors.success : colors.error }}>
              {retry === "posted" ? "All of them landed." : `1 did not reach ${failedOn}.`}
            </Text>
          </Text>
          <SegmentBar
            segments={WEEK_VIEWS_BY_NETWORK.map((n) => ({ label: NETWORK_LABEL[n.network], value: n.views, color: networkColor(n.network), display: compact(n.views) }))}
            accessibilityLabel="Views this week by network"
          />
        </View>

        <SettingsSeparator />
        <PostCard photo={FAILED_POST.photo} kind={FAILED_POST.kind} detail={FAILED_POST.detail} caption={FAILED_POST.caption} when={FAILED_POST.when} networks={[FAILED_POST.failed, ...FAILED_POST.results.map((r) => r.network)]} status={retry === "posted" ? undefined : <Badge variant="error">{retry === "retrying" ? "Retrying" : "1 failed"}</Badge>}>
          {retry === "posted" ? (
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>
              <CircleCheck size={18} color={colors.success} strokeWidth={2.2} />
              <Text weight="medium" style={[TYPE.body, { flex: 1 }]}>{`Posted to ${failedOn} just now. Numbers arrive within the hour.`}</Text>
            </View>
          ) : (
            <View style={{ rowGap: 12 }}>
              <View style={{ flexDirection: "row", columnGap: 8 }}>
                <CircleAlert size={18} color={colors.error} strokeWidth={2.2} style={{ marginTop: 1 }} />
                <Text weight="medium" style={[TYPE.body, { flex: 1 }]}>{FAILED_POST.reason}</Text>
              </View>
              <View style={{ flexDirection: "row", columnGap: 8 }}>
                <Button size="sm" loading={retry === "retrying"} leftIcon={<RotateCw />} onPress={retryNow} accessibilityHint="Uploads the same video again">{`Retry on ${failedOn}`}</Button>
                <Button size="sm" variant="outline" disabled={retry === "retrying"} onPress={() => Toast.info("Opens the post")}>Edit post</Button>
              </View>
            </View>
          )}
          <Results results={FAILED_POST.results} />
        </PostCard>

        {TIMELINE.map((p) => {
          const results = resultsOf(p);
          return (
            <View key={p.id}>
              <SettingsSeparator />
              <PostCard photo={p.photo} kind={p.kind} detail={p.detail} caption={p.caption} when={p.when} networks={results.map((r) => r.network)}>
                <Totals views={results.reduce((n, r) => n + r.views, 0)} likes={results.reduce((n, r) => n + r.likes, 0)} comments={results.reduce((n, r) => n + r.comments, 0)} saves={p.saves} shares={p.shares} />
                <Results results={results} />
              </PostCard>
            </View>
          );
        })}

        <View style={{ alignItems: "center", marginTop: 4 }}>
          <Button size="sm" variant="outline" onPress={() => Haptics.selectionAsync().catch(() => {})}>Show October</Button>
        </View>
      </DemoScreen>
    </>
  );
}

function PostCard({ photo, kind, detail, caption, when, networks, status, children }: { photo: number; kind: "photo" | "video" | "carousel"; detail?: string; caption: string; when: string; networks: Network[]; status?: ReactNode; children: ReactNode }) {
  const colors = useThemeColors();
  const Glyph = kind === "video" ? Play : Layers;
  return (
    <View style={{ paddingHorizontal: GUTTER, paddingVertical: 18, rowGap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}>
        <Avatar name={CREATOR.name} source={CREATOR.avatar} size={40} />
        <View style={{ flex: 1 }}>
          <Text weight="semibold" numberOfLines={1} style={TYPE.body}>{CREATOR.name}</Text>
          <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{when}</Text>
        </View>
        {status}
        <View style={{ flexDirection: "row" }} accessibilityLabel={`Sent to ${networks.map((n) => NETWORK_LABEL[n]).join(", ")}`}>
          {networks.map((n, i) => (
            <View key={n} style={{ marginLeft: i ? -6 : 0 }}>
              <NetworkBadge network={n} size={22} ring />
            </View>
          ))}
        </View>
      </View>
      <Text weight="medium" style={TYPE.body}>{caption}</Text>
      <View style={{ height: 232, borderRadius: 20, borderCurve: "continuous", overflow: "hidden" }}>
        <Image source={photo} style={{ flex: 1 }} contentFit="cover" transition={120} />
        {detail ? (
          <GlassSurface fill style={{ position: "absolute", left: 10, bottom: 10, height: 28, paddingHorizontal: 10, borderRadius: 14, overflow: "hidden", flexDirection: "row", alignItems: "center", columnGap: 5 }}>
            <Glyph size={12} color={colors.text} fill={kind === "video" ? colors.text : "none"} strokeWidth={2.2} />
            <Text weight="semibold" style={[TYPE.sub, TABULAR]}>{detail}</Text>
          </GlassSurface>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/** Every network added up, set like the row of counts under a post on X. */
function Totals({ views, likes, comments, saves, shares }: { views: number; likes: number; comments: number; saves: number; shares: number }) {
  const colors = useThemeColors();
  const items = [
    { Icon: Eye, value: compact(views), label: "views" },
    { Icon: Heart, value: full(likes), label: "likes" },
    { Icon: MessageCircle, value: full(comments), label: "comments" },
    { Icon: Bookmark, value: full(saves), label: "saves" },
    { Icon: Send, value: full(shares), label: "shares" },
  ];
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      {items.map(({ Icon, value, label }) => (
        <View key={label} style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }} accessibilityLabel={`${value} ${label}`}>
          <Icon size={16} color={colors.muted} strokeWidth={2} />
          <Text weight="semibold" style={[TYPE.sub, TABULAR]}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

function Results({ results }: { results: NetworkResult[] }) {
  const networkColor = useNetworkColor();
  return (
    <BarList
      items={results.map((r) => ({
        label: NETWORK_LABEL[r.network],
        value: r.views,
        display: `${compact(r.views)} views`,
        detail: `${full(r.likes)} likes, ${r.comments} comments`,
        color: networkColor(r.network),
        leading: <NetworkBadge network={r.network} size={30} />,
      }))}
    />
  );
}
