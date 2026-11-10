// The list view of the content calendar (modelled on Fantastical's list and
// Google Calendar's Schedule): two weeks, day by day, with the quiet days
// folded to a line so the gaps in the plan are as visible as the posts. The
// panel at the top counts the same fourteen days as bars and filters the list
// to one status; each week is its own panel.
import { Text, View } from "@/components/ui";
import { Menu } from "@/components/ui/actions/Menu";
import { AgendaList, type AgendaEvent } from "@/components/ui/calendar/AgendaList";
import { PeriodBar } from "@/components/ui/calendar/PeriodBar";
import { BarChart } from "@/components/ui/data/BarChart";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { addDays, format, getISOWeek, isSameDay, isSameMonth, startOfWeek } from "date-fns";
import { useMemo, useState } from "react";
import { POSTS, type Post, type PostStatus, STATUS_LABEL, TODAY, compact, fromNow } from "./data";
import { CONTENT_ACTIONS, CalendarHeader, NetworkMarks, useStatusColor } from "./parts";

const THIS_WEEK = startOfWeek(TODAY, { weekStartsOn: 1 });
const DAYS = 14;
const STATUSES: PostStatus[] = ["scheduled", "draft", "failed", "published"];

const fact = (p: Post) =>
  p.status === "published" && p.results ? `${compact(p.results.views)} views` : p.status === "scheduled" ? fromNow(p.at) : p.status === "failed" ? "failed to post" : "draft";

export default function CalendarAgenda() {
  const colors = useThemeColors();
  const statusColor = useStatusColor();
  const [from, setFrom] = useState(THIS_WEEK);
  const [status, setStatus] = useState<PostStatus | null>(null);
  const to = addDays(from, DAYS - 1);

  const posts = useMemo(() => POSTS.filter((p) => p.at >= from && p.at < addDays(from, DAYS) && (!status || p.status === status)), [from, status]);
  const events: AgendaEvent[] = useMemo(
    () =>
      posts.map((p) => ({
        id: p.id,
        start: p.at,
        end: p.at,
        time: format(p.at, "HH:mm"),
        title: p.title,
        detail: `${p.format} · ${fact(p)}`,
        color: statusColor[p.status],
        trailing: <NetworkMarks networks={p.networks} size={15} />,
      })),
    [posts, statusColor],
  );
  const perDay = Array.from({ length: DAYS }, (_, i) => {
    const date = addDays(from, i);
    return { date, list: posts.filter((p) => isSameDay(p.at, date)) };
  });
  const empty = perDay.filter((d) => d.list.length === 0 && d.date >= TODAY).length;
  const weekTitle = (start: Date) => (isSameDay(start, THIS_WEEK) ? "This week" : isSameDay(start, addDays(THIS_WEEK, 7)) ? "Next week" : `Week ${getISOWeek(start)}`);
  const inWeek = (start: Date) => posts.filter((p) => p.at >= start && p.at < addDays(start, 7)).length;

  return (
    <>
      <CalendarHeader view="agenda" addLabel="New post" onAdd={() => Toast.info("New post")} onToday={() => setFrom(THIS_WEEK)} actions={CONTENT_ACTIONS} />
      <DemoScreen>
        <View style={{ marginHorizontal: 16 }}>
          <PeriodBar
            title={`${format(from, isSameMonth(from, to) ? "d" : "d MMM")} to ${format(to, "d MMM")}`}
            unit="two weeks"
            onPrevious={() => setFrom(addDays(from, -DAYS))}
            onNext={() => setFrom(addDays(from, DAYS))}
          />
        </View>
        <Panel style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
            <Text weight="semibold" numberOfLines={1} style={[TYPE.headline, TABULAR, { flex: 1 }]}>
              {`${posts.length} ${posts.length === 1 ? "post" : "posts"} in 2 weeks`}
            </Text>
            <Menu
              label={status ? STATUS_LABEL[status] : "All posts"}
              systemImage="line.3.horizontal.decrease"
              items={[
                { label: "All posts", selected: !status, onPress: () => setStatus(null) },
                ...STATUSES.map((s) => ({ label: STATUS_LABEL[s], selected: s === status, onPress: () => setStatus(s) })),
              ]}
            />
          </View>
          <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted, marginTop: 2, marginBottom: 14 }]}>
            {`${empty} ${empty === 1 ? "day" : "days"} still with nothing`}
          </Text>
          <BarChart
            height={72}
            data={perDay.map(({ date, list }) => ({
              label: format(date, "EEEEE"),
              value: list.length || null,
              // The day's colour is where most of its posts stand.
              color: date < TODAY ? statusColor.published : list.some((p) => p.status === "scheduled") ? statusColor.scheduled : statusColor.draft,
            }))}
            accessibilityLabel="Posts per day over these two weeks"
          />
        </Panel>

        {[from, addDays(from, 7)].map((start) => (
          <View key={+start}>
            <SectionHeader title={`${weekTitle(start)}, ${inWeek(start)} ${inWeek(start) === 1 ? "post" : "posts"}`} />
            <Panel flush style={{ paddingVertical: 4 }}>
              <AgendaList from={start} days={7} events={events} today={TODAY} emptyLabel="Nothing planned" />
            </Panel>
          </View>
        ))}
      </DemoScreen>
    </>
  );
}
