// The same account as a timeline, the way X shows a profile and Buffer shows
// what was sent: the week's views on one glass block, then each post as its
// own raised card (photo, caption, when), which networks it went to and what
// it did on each one. A post that failed on one network says why and can be
// retried there without touching the others.
//
// Native pieces: the header menu (ActionMenu), the sort (Menu), the callout
// on what failed (Popover), long press on a post's photo (ContextMenu), each
// post's per-network results (Disclosure) and the confirm before deleting
// (ConfirmDialog).
import { GlassSurface } from "@/components/GlassSurface";
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { Button } from "@/components/ui/actions/Button";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { Menu } from "@/components/ui/actions/Menu";
import { BarList } from "@/components/ui/data/BarList";
import { SegmentBar } from "@/components/ui/data/SegmentBar";
import { Badge } from "@/components/ui/feedback/Badge";
import { Disclosure } from "@/components/ui/lists/Disclosure";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { Popover } from "@/components/ui/overlays/Popover";
import { Avatar } from "@/components/ui/primitives/Avatar";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen, GUTTER } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { Bookmark, CircleAlert, CircleCheck, Eye, Heart, Layers, MessageCircle, Play, Plus, RotateCw, Send } from "lucide-react-native";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { CREATOR, FAILED_POST, NETWORK_LABEL, type Network, type NetworkResult, TIMELINE, WEEK_POSTS, WEEK_VIEWS, WEEK_VIEWS_BY_NETWORK, compact, full, resultsOf } from "./data";
import { NetworkBadge, copyText, useNetworkColor } from "./parts";

type Retry = "failed" | "retrying" | "posted";
const SORTS = ["Newest first", "Most viewed"] as const;
type Sort = (typeof SORTS)[number];
const sum = (results: NetworkResult[], key: "views" | "likes" | "comments") => results.reduce((n, r) => n + r[key], 0);

export default function AccountFeed() {
  const colors = useThemeColors();
  const networkColor = useNetworkColor();
  const [retry, setRetry] = useState<Retry>("failed");
  const [sort, setSort] = useState<Sort>(SORTS[0]);
  const [deleting, setDeleting] = useState<{ caption: string; networks: Network[] } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);
  const failedOn = NETWORK_LABEL[FAILED_POST.failed];
  const posted = retry === "posted";

  const retryNow = () => {
    setRetry("retrying");
    timer.current = setTimeout(() => {
      setRetry("posted");
      Toast.success(`Posted to ${failedOn}`);
    }, 1400);
  };

  const failedNetworks = [FAILED_POST.failed, ...FAILED_POST.results.map((r) => r.network)];
  const cards = [
    {
      id: FAILED_POST.id,
      views: sum(FAILED_POST.results, "views"),
      card: (
        <PostCard photo={FAILED_POST.photo} kind={FAILED_POST.kind} detail={FAILED_POST.detail} caption={FAILED_POST.caption} when={FAILED_POST.when} networks={failedNetworks} onDelete={() => setDeleting({ caption: FAILED_POST.caption, networks: FAILED_POST.results.map((r) => r.network) })} status={posted ? undefined : <Badge variant="error">{retry === "retrying" ? "Retrying" : "1 failed"}</Badge>}>
          {posted ? (
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
                <Button size="sm" variant="secondary" disabled={retry === "retrying"} onPress={() => Toast.info("Opens the post")}>Edit post</Button>
              </View>
            </View>
          )}
          <Results results={FAILED_POST.results} open />
        </PostCard>
      ),
    },
    ...TIMELINE.map((p) => {
      const results = resultsOf(p);
      const networks = results.map((r) => r.network);
      return {
        id: p.id,
        views: sum(results, "views"),
        card: (
          <PostCard photo={p.photo} kind={p.kind} detail={p.detail} caption={p.caption} when={p.when} networks={networks} onDelete={() => setDeleting({ caption: p.caption, networks })}>
            <Totals views={sum(results, "views")} likes={sum(results, "likes")} comments={sum(results, "comments")} saves={p.saves} shares={p.shares} />
            <Results results={results} />
          </PostCard>
        ),
      };
    }),
  ];
  const shown = sort === "Most viewed" ? [...cards].sort((a, b) => b.views - a.views) : cards;

  return (
    <>
      <Stack.Screen options={{ title: "Timeline" }} />
      <ActionMenu
        accessibilityLabel="Timeline actions"
        buttons={[{ label: "New post", systemImage: "plus", icon: Plus, onPress: () => Toast.info("New post") }]}
        actions={[
          { label: "Export results", systemImage: "square.and.arrow.up", onPress: () => Toast.info("Exporting this week") },
          { label: "Choose networks", systemImage: "slider.horizontal.3", onPress: () => Toast.info("Opens your connected networks") },
        ]}
      />
      <DemoScreen>
        <Panel glass>
          <Text weight="semibold" numberOfLines={1} style={[TYPE.display, TABULAR]}>{`${compact(WEEK_VIEWS)} views`}</Text>
          <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, marginTop: 2 }]}>{`This week, from ${WEEK_POSTS} posts to 4 networks`}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6, marginTop: 10, marginBottom: 16, minHeight: 28 }}>
            {posted ? <CircleCheck size={15} color={colors.success} strokeWidth={2.4} /> : <CircleAlert size={15} color={colors.error} strokeWidth={2.4} />}
            <Text weight="semibold" numberOfLines={1} style={[TYPE.sub, { flex: 1, color: posted ? colors.success : colors.error }]}>
              {posted ? "All of them landed" : `1 did not reach ${failedOn}`}
            </Text>
            {posted ? null : (
              <Popover label="Why" systemImage="info.circle">
                <View style={{ width: 260, padding: 16, rowGap: 6 }}>
                  <Landed network={failedOn} outcome="Timed out" failed />
                  {FAILED_POST.results.map((r) => (
                    <Landed key={r.network} network={NETWORK_LABEL[r.network]} outcome={`Posted ${FAILED_POST.when.split(", ")[1]}`} />
                  ))}
                  <Text weight="medium" style={[TYPE.body, { marginTop: 6 }]}>
                    {`The video is 184 MB and ${failedOn} gave up on the upload. Retry sends the same video again and leaves the other networks alone.`}
                  </Text>
                </View>
              </Popover>
            )}
          </View>
          <SegmentBar
            segments={WEEK_VIEWS_BY_NETWORK.map((n) => ({ label: NETWORK_LABEL[n.network], value: n.views, color: networkColor(n.network), display: compact(n.views) }))}
            accessibilityLabel="Views this week by network"
          />
        </Panel>

        {/* SectionHeader's metrics, with the native sort menu where its action pill sits. */}
        <View accessibilityRole="header" style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: GUTTER, marginTop: 28, marginBottom: 10, minHeight: 32, columnGap: 8 }}>
          <Text weight="semibold" numberOfLines={1} style={[TYPE.headline, { flex: 1 }]}>Sent this week</Text>
          <Menu label={sort} systemImage="arrow.up.arrow.down" items={SORTS.map((s) => ({ label: s, selected: s === sort, onPress: () => setSort(s) }))} />
        </View>

        <View style={{ rowGap: 12 }}>
          {shown.map((c) => (
            <View key={c.id}>{c.card}</View>
          ))}
        </View>

        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Button size="sm" variant="secondary" onPress={() => Haptics.selectionAsync().catch(() => {})}>Show October</Button>
        </View>
      </DemoScreen>
      <ConfirmDialog
        visible={!!deleting}
        onClose={() => setDeleting(null)}
        variant="sheet"
        title="Delete this post everywhere?"
        message={deleting ? `It comes off ${deleting.networks.map((n) => NETWORK_LABEL[n]).join(", ")} and its numbers go with it. This can't be undone.` : undefined}
        confirmLabel="Delete post"
        destructive
        onConfirm={() => Toast.success("Post deleted")}
      />
    </>
  );
}

/** One network and how the post fared there, in the callout: both ends of
 *  the row in the same size, red only where it failed. */
function Landed({ network, outcome, failed = false }: { network: string; outcome: string; failed?: boolean }) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text weight="medium" style={TYPE.body}>{network}</Text>
      <Text weight="semibold" style={[TYPE.body, TABULAR, failed ? { color: colors.error } : null]}>{outcome}</Text>
    </View>
  );
}

function PostCard({ photo, kind, detail, caption, when, networks, status, onDelete, children }: { photo: number; kind: "photo" | "video" | "carousel"; detail?: string; caption: string; when: string; networks: Network[]; status?: ReactNode; onDelete: () => void; children: ReactNode }) {
  const colors = useThemeColors();
  const Glyph = kind === "video" ? Play : Layers;
  return (
    <Panel>
      <View style={{ rowGap: 12 }}>
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
                <NetworkBadge network={n} size={22} ring on={colors.card} />
              </View>
            ))}
          </View>
        </View>
        <Text weight="medium" style={TYPE.body}>{caption}</Text>
        <ContextMenu
          actions={[
            { label: "Copy caption", systemImage: "doc.on.doc", onPress: () => copyText(caption, "Caption copied") },
            { label: "Post again", systemImage: "arrow.2.squarepath", onPress: () => Toast.info("New post with the same photo and caption") },
            { label: "Edit post", systemImage: "pencil", onPress: () => Toast.info("Opens the post") },
            { label: "Delete everywhere", systemImage: "trash", destructive: true, onPress: onDelete },
          ]}
        >
          <View style={{ height: 232, borderRadius: 20, borderCurve: "continuous", overflow: "hidden" }}>
            <Image source={photo} style={{ flex: 1 }} contentFit="cover" transition={120} />
            {detail ? (
              <GlassSurface fill style={{ position: "absolute", left: 10, bottom: 10, height: 28, paddingHorizontal: 10, borderRadius: 14, overflow: "hidden", flexDirection: "row", alignItems: "center", columnGap: 5 }}>
                <Glyph size={12} color={colors.text} fill={kind === "video" ? colors.text : "none"} strokeWidth={2.2} />
                <Text weight="semibold" style={[TYPE.sub, TABULAR]}>{detail}</Text>
              </GlassSurface>
            ) : null}
          </View>
        </ContextMenu>
        {children}
      </View>
    </Panel>
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

/** What the post did on each network, folded under one line. Open on the
 *  post that needs attention, closed where the totals already say it. */
function Results({ results, open = false }: { results: NetworkResult[]; open?: boolean }) {
  const networkColor = useNetworkColor();
  return (
    <Disclosure title={`Results on ${results.length} ${results.length === 1 ? "network" : "networks"}`} defaultOpen={open}>
      <View style={{ paddingTop: 12, paddingBottom: 2 }}>
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
      </View>
    </Disclosure>
  );
}
