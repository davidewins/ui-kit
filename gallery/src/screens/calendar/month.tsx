// The month view of a creator's content calendar (modelled on iOS Calendar's
// month with the day list under it, and Later's content calendar): the grid
// with a dot per post in its status colour, then the picked day's posts in
// full on one panel (long press a post for its actions), then the month in
// one bar on another.
import { Badge, Button, EmptyState, Text, View } from "@/components/ui";
import { ContextMenu, type ContextMenuAction } from "@/components/ui/actions/ContextMenu";
import { MonthGrid, type DayMark } from "@/components/ui/calendar/MonthGrid";
import { dayKey } from "@/components/ui/calendar/timeline";
import { BarList } from "@/components/ui/data/BarList";
import { SegmentBar } from "@/components/ui/data/SegmentBar";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { Popover } from "@/components/ui/overlays/Popover";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { ART } from "@/gallery/demo/data";
import { DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { format, isSameDay, isSameMonth } from "date-fns";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { NETWORK_LABEL, type Network, POSTS, type Post, type PostStatus, STATUS_LABEL, TODAY, compact, engagement, fromNow, postsOn } from "./data";
import { CONTENT_ACTIONS, CalendarHeader, NetworkMarks, STATUS_BADGE, usePostActions, useStatusColor } from "./parts";

const TIME = 58;
const ORDER: PostStatus[] = ["published", "scheduled", "failed", "draft"];
const NETWORKS: Network[] = ["instagram", "tiktok", "youtube", "x"];

function PostRow({ post, first, actions }: { post: Post; first: boolean; actions: readonly ContextMenuAction[] }) {
  const colors = useThemeColors();
  const r = post.results;
  const fact =
    post.status === "published" && r
      ? `${compact(r.views)} views · ${r.likes.toLocaleString("en-IE")} likes · ${engagement(r)}`
      : post.status === "scheduled"
        ? `Goes out ${fromNow(post.at)}`
        : post.status === "draft"
          ? "Caption and cover to finish"
          : null;
  return (
    <ContextMenu actions={actions} onPress={() => Toast.info(`Opening "${post.title}"`)}>
      <View style={{ flexDirection: "row", columnGap: 12, marginLeft: 16, paddingRight: 16, paddingVertical: 14, borderTopWidth: first ? 0 : StyleSheet.hairlineWidth, borderColor: colors.border }}>
        <View style={{ width: TIME }}>
          <Text weight="semibold" style={[TYPE.body, TABULAR]}>
            {format(post.at, "HH:mm")}
          </Text>
          <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>
            {post.format}
          </Text>
        </View>
        <View style={{ flex: 1, rowGap: 6 }}>
          <Text weight="semibold" numberOfLines={2} style={TYPE.body}>
            {post.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
            <NetworkMarks networks={post.networks} />
            <Text weight="medium" numberOfLines={1} style={[TYPE.sub, { flex: 1, color: colors.muted }]}>
              {post.networks.map((n) => NETWORK_LABEL[n]).join(", ")}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Badge variant={STATUS_BADGE[post.status]}>{STATUS_LABEL[post.status]}</Badge>
          </View>
          {fact ? (
            <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR]}>
              {fact}
            </Text>
          ) : null}
          {post.error ? (
            <View style={{ rowGap: 8, alignItems: "flex-start" }}>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.error }]}>
                {post.error}
              </Text>
              <Button size="xs" onPress={() => Toast.info(`Opening "${post.title}" to fix`)}>
                Fix and retry
              </Button>
            </View>
          ) : null}
        </View>
        {post.photo ? <Image source={post.photo} style={{ width: 56, height: 56, borderRadius: 12 }} contentFit="cover" /> : null}
      </View>
    </ContextMenu>
  );
}

export default function CalendarMonth() {
  const colors = useThemeColors();
  const statusColor = useStatusColor();
  const hues = useHues();
  const { actionsFor, dialog } = usePostActions();
  const networkHue: Record<Network, string> = { instagram: hues.pink, tiktok: hues.cyan, youtube: hues.red, x: hues.gray };
  const [month, setMonth] = useState(TODAY);
  const [selected, setSelected] = useState(TODAY);

  const marks = useMemo(() => {
    const out: Record<string, DayMark> = {};
    for (const p of POSTS) {
      const k = dayKey(p.at);
      out[k] = { dots: [...(out[k]?.dots ?? []), statusColor[p.status]] };
    }
    return out;
  }, [statusColor]);

  const dayPosts = postsOn(selected);
  const inMonth = POSTS.filter((p) => isSameMonth(p.at, month));
  const views = inMonth.reduce((n, p) => n + (p.results?.views ?? 0), 0);
  // A post's views are shared equally between the networks it went to.
  const byNetwork = NETWORKS.map((n) => {
    const list = inMonth.filter((p) => p.networks.includes(n));
    return { n, posts: list.length, views: Math.round(list.reduce((sum, p) => sum + (p.results?.views ?? 0) / p.networks.length, 0)) };
  }).sort((a, b) => b.views - a.views);
  const newPost = () => Toast.info(`New post for ${format(selected, "EEE d MMM")}`);

  return (
    <>
      <CalendarHeader
        view="month"
        addLabel="New post on this day"
        onAdd={newPost}
        actions={CONTENT_ACTIONS}
        onToday={() => {
          setMonth(TODAY);
          setSelected(TODAY);
        }}
      />
      <DemoScreen>
        <View style={{ marginHorizontal: 16 }}>
          <MonthGrid month={month} onMonthChange={setMonth} selected={selected} onSelect={setSelected} marks={marks} today={TODAY} />
        </View>

        <SectionHeader
          title={
            isSameDay(selected, TODAY)
              ? `${dayPosts.length ? `${dayPosts.length} ${dayPosts.length === 1 ? "post" : "posts"} today` : "Today"}, ${format(selected, "d MMMM")}`
              : `${dayPosts.length ? `${dayPosts.length} ${dayPosts.length === 1 ? "post" : "posts"} on ` : ""}${format(selected, "EEEE d MMMM")}`
          }
        />
        {dayPosts.length ? (
          <Panel flush>
            {dayPosts.map((p, i) => (
              <PostRow key={p.id} post={p} first={i === 0} actions={actionsFor(p)} />
            ))}
          </Panel>
        ) : (
          <Panel flush>
            <EmptyState layout="inline" art={{ image: ART.calendar }} title="Nothing planned" body="Instagram does best for you at 18:00. The slot is free on this day." action={{ label: "Plan a post", plus: true, onPress: newPost }} />
          </Panel>
        )}

        {inMonth.length ? (
          <>
            <SectionHeader title={`${inMonth.length} ${inMonth.length === 1 ? "post" : "posts"} in ${format(month, "MMMM")}`} />
            <Panel style={{ rowGap: 12 }}>
              <View>
                <Text weight="semibold" style={[TYPE.title, TABULAR]}>
                  {`${compact(views)} views`}
                </Text>
                <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>
                  {`From ${inMonth.filter((p) => p.results).length} published posts`}
                </Text>
              </View>
              <SegmentBar
                segments={ORDER.map((s) => {
                  const n = inMonth.filter((p) => p.status === s).length;
                  return { label: STATUS_LABEL[s], value: n, color: statusColor[s], display: String(n) };
                }).filter((s) => s.value > 0)}
              />
              {views ? (
                <>
                  <View style={{ marginTop: 12 }}>
                    <BarList
                      items={byNetwork.map(({ n, posts, views: v }) => ({
                        label: NETWORK_LABEL[n],
                        value: v,
                        display: `${compact(v)} views`,
                        detail: `${posts} posts`,
                        color: networkHue[n],
                        leading: <NetworkMarks networks={[n]} size={18} />,
                      }))}
                    />
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Popover label="How views are split" systemImage="info.circle">
                      <View style={{ width: 280, padding: 16, rowGap: 8 }}>
                        <Text weight="medium" style={TYPE.body}>
                          A post that went to two networks has its views shared equally between them.
                        </Text>
                        <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>
                          That way the four bars add up to the month's total and no view is counted twice.
                        </Text>
                      </View>
                    </Popover>
                  </View>
                </>
              ) : null}
            </Panel>
          </>
        ) : null}
      </DemoScreen>
      {dialog}
    </>
  );
}
