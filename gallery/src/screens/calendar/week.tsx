// The week view of the content calendar (modelled on Notion Calendar's week
// and Buffer's): every post of the week as a block at its hour, coloured by
// status, with the networks' marks inside. The panel above the grid counts
// the week and filters it to one network. Tap a post and it comes up in the
// glass peek at the bottom; long press the peek for the rest of its actions.
import { Badge, Text, View } from "@/components/ui";
import { Menu } from "@/components/ui/actions/Menu";
import { PeriodBar } from "@/components/ui/calendar/PeriodBar";
import type { CalendarEvent } from "@/components/ui/calendar/timeline";
import { WeekGrid } from "@/components/ui/calendar/WeekGrid";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { DemoScreen } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { addDays, addMinutes, format, getISOWeek, isSameMonth, startOfWeek } from "date-fns";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { NETWORK_LABEL, NOW, type Network, POSTS, type PostStatus, STATUS_LABEL, TODAY, compact, fromNow } from "./data";
import { CONTENT_ACTIONS, CalendarHeader, EventPeek, NetworkMarks, STATUS_BADGE, usePostActions, useStatusColor } from "./parts";

const ORDER: PostStatus[] = ["published", "scheduled", "failed", "draft"];
const ACTION: Record<PostStatus, string> = { published: "Results", scheduled: "Edit", failed: "Fix", draft: "Finish" };
const NETWORKS: Network[] = ["instagram", "tiktok", "youtube", "x"];
const NEXT_UP = POSTS.find((p) => p.status === "scheduled" && p.at > NOW)?.id ?? null;

export default function CalendarWeek() {
  const colors = useThemeColors();
  const statusColor = useStatusColor();
  const [week, setWeek] = useState(TODAY);
  const [pickedId, setPickedId] = useState(NEXT_UP);
  const [network, setNetwork] = useState<Network | null>(null);
  const { actionsFor, dialog } = usePostActions();

  const first = startOfWeek(week, { weekStartsOn: 1 });
  const last = addDays(first, 6);
  const posts = useMemo(() => {
    const from = startOfWeek(week, { weekStartsOn: 1 });
    return POSTS.filter((p) => p.at >= from && p.at < addDays(from, 7) && (!network || p.networks.includes(network)));
  }, [week, network]);
  const events: CalendarEvent[] = useMemo(
    () =>
      posts.map((p) => ({
        id: p.id,
        start: p.at,
        end: addMinutes(p.at, 60),
        title: format(p.at, "HH:mm"),
        detail: p.title,
        color: statusColor[p.status],
        accessory: <NetworkMarks networks={p.networks} size={11} />,
      })),
    [posts, statusColor],
  );
  const picked = posts.find((p) => p.id === pickedId);

  return (
    <>
      <CalendarHeader view="week" addLabel="New post this week" onAdd={() => Toast.info(`New post, week ${getISOWeek(first)}`)} onToday={() => setWeek(TODAY)} actions={CONTENT_ACTIONS} />
      <DemoScreen
        footer={
          picked ? (
            <EventPeek
              leading={
                picked.photo ? (
                  <Image source={picked.photo} style={{ width: 52, height: 52, borderRadius: 12 }} contentFit="cover" />
                ) : (
                  <View style={{ width: 52, height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: colors.border }}>
                    <NetworkMarks networks={picked.networks} size={20} />
                  </View>
                )
              }
              title={picked.title}
              lines={[
                `${format(picked.at, "EEE d MMM, HH:mm")} · ${picked.format}`,
                <View key="s" style={{ flexDirection: "row", alignItems: "center", columnGap: 6, marginTop: 2 }}>
                  <Badge variant={STATUS_BADGE[picked.status]}>{STATUS_LABEL[picked.status]}</Badge>
                  <NetworkMarks networks={picked.networks} size={13} />
                  <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { flex: 1, color: colors.muted }]}>
                    {picked.results ? `${compact(picked.results.views)} views` : picked.status === "scheduled" ? fromNow(picked.at) : ""}
                  </Text>
                </View>,
              ]}
              action={{ label: ACTION[picked.status], onPress: () => Toast.info(`${ACTION[picked.status]}: ${picked.title}`) }}
              menu={actionsFor(picked)}
            />
          ) : undefined
        }
      >
        <View style={{ marginHorizontal: 16 }}>
          <PeriodBar
            title={`${format(first, isSameMonth(first, last) ? "d" : "d MMM")} to ${format(last, "d MMM")}`}
            unit="week"
            onPrevious={() => setWeek(addDays(week, -7))}
            onNext={() => setWeek(addDays(week, 7))}
          />
        </View>
        <Panel style={{ marginTop: 10, marginBottom: 16, rowGap: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
            <Text weight="semibold" numberOfLines={1} style={[TYPE.headline, TABULAR, { flex: 1 }]}>
              {posts.length ? `Week ${getISOWeek(first)}, ${posts.length} ${posts.length === 1 ? "post" : "posts"}` : `Nothing planned in week ${getISOWeek(first)}`}
            </Text>
            <Menu
              label={network ? NETWORK_LABEL[network] : "All networks"}
              systemImage="line.3.horizontal.decrease"
              items={[
                { label: "All networks", selected: !network, onPress: () => setNetwork(null) },
                ...NETWORKS.map((n) => ({ label: NETWORK_LABEL[n], selected: n === network, onPress: () => setNetwork(n) })),
              ]}
            />
          </View>
          {posts.length ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 14, rowGap: 4 }}>
              {ORDER.map((s) => {
                const n = posts.filter((p) => p.status === s).length;
                return n ? (
                  <View key={s} style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: statusColor[s] }} />
                    <Text weight="medium" style={[TYPE.sub, TABULAR]}>
                      {`${n} ${STATUS_LABEL[s].toLowerCase()}`}
                    </Text>
                  </View>
                ) : null;
              })}
            </View>
          ) : null}
        </Panel>
        <View style={{ marginHorizontal: 16 }}>
          <WeekGrid week={week} events={events} startHour={7} endHour={22} hourHeight={44} now={NOW} onPressEvent={(e) => setPickedId(e.id)} />
        </View>
      </DemoScreen>
      {dialog}
    </>
  );
}
