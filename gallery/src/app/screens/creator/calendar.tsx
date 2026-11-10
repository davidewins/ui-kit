import { SocialMark } from "@/apps/tkvr/components/SocialMark";
import { MonthCalendar } from "@/apps/tkvr/features/social/MonthCalendar";
import { NETWORK, type SocialPostState } from "@/apps/tkvr/lib/creator/social";
import { EmptyState, View } from "@/components/ui";
import { HeaderIconButton } from "@/components/ui/actions/HeaderIconButton";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ACCOUNTS, ACCOUNTS_BY_ID, BEST_SLOTS, POSTS, compact, engagement } from "@/gallery/creator/data";
import { POST_INSET, PostRow, SlotRow, StateCounts } from "@/gallery/creator/parts";
import { ART } from "@/gallery/demo/data";
import { DataTable, DemoScreen, GUTTER, Section, useStates } from "@/gallery/demo/parts";
import { SkeletonMediaRows, SkeletonSection, SkeletonTable } from "@/gallery/demo/skeletons";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Skeleton } from "@/components/ui/feedback/Skeleton";
import { format, parseISO } from "date-fns";
import { Stack } from "expo-router";
import { Plus } from "lucide-react-native";
import { useMemo, useState } from "react";

const STATES = ["Busy month", "Loading", "Empty day"] as const;
const key = (d: Date) => format(d, "yyyy-MM-dd");

// TKVR's Social calendar (app/(app)/social/calendar.tsx), redone dense. Same
// month grid (TKVR's MonthCalendar, from SELLERS' HACCP history) and the
// picked day under it, plus what the TKVR page leaves out: the month in one
// line, each post's results or why it failed, free slots at each network's
// best time, and the last seven days by network.
export default function SocialCalendar() {
  const colors = useThemeColors();
  const { state } = useStates(STATES);
  const [month, setMonth] = useState(() => new Date());
  const [selected, setSelected] = useState(() => {
    const d = new Date();
    if (state === "Empty day") d.setDate(d.getDate() + 5);
    return key(d);
  });

  const byDay = useMemo(() => {
    const out: Record<string, typeof POSTS> = {};
    for (const p of POSTS) (out[key(parseISO(p.at))] ??= []).push(p);
    return out;
  }, []);
  const dayStates = useMemo(() => {
    const out: Record<string, SocialPostState[]> = {};
    for (const [k, list] of Object.entries(byDay)) out[k] = list.map((p) => p.state);
    return out;
  }, [byDay]);
  const dayPosts = [...(byDay[selected] ?? [])].sort((a, b) => a.at.localeCompare(b.at));
  const offset = Math.round((parseISO(selected).getTime() - new Date(new Date().toDateString()).getTime()) / 86_400_000);
  const slots = BEST_SLOTS[offset] ?? [];
  const label = format(parseISO(selected), "EEEE d MMMM");

  // The last seven days, one row per network that published.
  const week = useMemo(() => {
    const since = Date.now() - 7 * 86_400_000;
    const rows = new Map<string, { posts: number; views: number; eng: number }>();
    for (const p of POSTS) {
      if (!p.results || new Date(p.at).getTime() < since) continue;
      for (const a of p.accountIds) {
        const n = ACCOUNTS_BY_ID.get(a)!.network;
        const r = rows.get(n) ?? { posts: 0, views: 0, eng: 0 };
        rows.set(n, { posts: r.posts + 1, views: r.views + p.results.views, eng: r.eng + engagement(p.results) });
      }
    }
    return [...rows.entries()].sort((a, b) => b[1].views - a[1].views);
  }, []);

  const newPost = () => Toast.info(`New post for ${label}`);

  return (
    <>
      <Stack.Screen options={{ headerRight: () => <HeaderIconButton icon={Plus} accessibilityLabel="New post on this day" onPress={newPost} /> }} />
      <DemoScreen>
        {state === "Loading" ? (
          <>
            <View style={{ marginHorizontal: GUTTER, marginBottom: 12, flexDirection: "row", gap: 14 }}>
              {[60, 64, 44, 40].map((w, i) => <Skeleton key={i} width={w} height={11} radius={4} />)}
            </View>
            <View style={{ marginHorizontal: GUTTER, gap: 14 }}>
              <Skeleton width={140} height={16} radius={4} />
              {Array.from({ length: 5 }, (_, r) => (
                <View key={r} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  {Array.from({ length: 7 }, (_, c) => <Skeleton key={c} width={32} height={32} radius={16} />)}
                </View>
              ))}
            </View>
            <SkeletonSection />
            <SkeletonMediaRows count={4} lead="time" />
            <SkeletonSection />
            <SkeletonTable rows={4} numbers={3} />
          </>
        ) : (
          <>
            <StateCounts posts={POSTS.filter((p) => isSameMonthKey(p.at, month))} />
            <View style={{ marginHorizontal: GUTTER }}>
              <MonthCalendar month={month} onMonthChange={setMonth} selected={selected} onSelect={setSelected} dayStates={dayStates} />
            </View>

            <Section title={label} art="calendar" trailing={dayPosts.length ? `${dayPosts.length} posts` : undefined} />
            {dayPosts.length === 0 && slots.length === 0 ? (
              <EmptyState layout="inline" art={{ image: ART.calendar }} title="Nothing planned" body="Your next best slot is Tuesday 18:00 on Instagram" action={{ label: "Write a post", onPress: newPost }} />
            ) : (
              <SettingsGroup separatorInset={POST_INSET}>
                {[
                  ...dayPosts.map((p) => ({ at: p.at, el: <PostRow key={p.id} post={p} href={`/screens/creator/account/${p.accountIds[0]}`} /> })),
                  ...slots.map((s) => {
                    const [h, m] = s.time.split(":").map(Number);
                    const d = parseISO(selected);
                    d.setHours(h, m);
                    return { at: d.toISOString(), el: <SlotRow key={s.time} time={s.time} why={s.why} onPress={newPost} /> };
                  }),
                ]
                  .sort((a, b) => a.at.localeCompare(b.at))
                  .map((x) => x.el)}
              </SettingsGroup>
            )}

            <Section title="Last 7 days" art="risingChart" trailing={`${ACCOUNTS.length} accounts`} />
            <DataTable
              dense
              columns={[
                { key: "net", label: "", width: 16, align: "left" },
                { key: "name", label: "Network" },
                { key: "posts", label: "Posts", width: 40 },
                { key: "views", label: "Views", width: 52 },
                { key: "eng", label: "Eng.", width: 44 },
              ]}
              rows={week.map(([n, r]) => ({
                net: <SocialMark network={n as keyof typeof NETWORK} size={14} color={colors.text} />,
                name: NETWORK[n as keyof typeof NETWORK].label,
                posts: String(r.posts),
                views: compact(r.views),
                eng: `${(r.eng / r.posts).toFixed(1)}%`,
              }))}
            />
          </>
        )}
      </DemoScreen>
    </>
  );
}

function isSameMonthKey(iso: string, month: Date) {
  const d = parseISO(iso);
  return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
}
