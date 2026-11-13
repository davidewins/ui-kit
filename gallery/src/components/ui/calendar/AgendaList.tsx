// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/calendar/AgendaList.tsx. Edit it there and sync; local edits fail ui-kit:check.
// What is coming, day by day: a large day number with its weekday at the left
// edge and that day's events as rows beside it (colour bar, time range, title,
// one detail line). Runs of days with nothing collapse to one muted line, so
// two busy weeks and two quiet ones take the room they deserve. For where
// events sit in the day use DayTimeline.
import { useThemeColors } from "@/hooks/useThemeColors";
import { addDays, format, isSameDay } from "date-fns";
import * as Haptics from "expo-haptics";
import { type ReactNode, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";
import { type CalendarEvent, dayKey } from "./timeline";

export interface AgendaEvent extends CalendarEvent {
  /** Written in place of "HH:mm to HH:mm" (an instant: "18:00"; "All day"). */
  time?: string;
  /** Right end of the row: a Badge, a thumbnail. */
  trailing?: ReactNode;
}

export interface AgendaListProps {
  /** First day listed. */
  from: Date;
  /** How many days from `from`. */
  days: number;
  events: readonly AgendaEvent[];
  /** Defaults to the real today. */
  today?: Date;
  /** The muted line for days with nothing. */
  emptyLabel?: string;
  onPressEvent?: (event: AgendaEvent) => void;
}

const LEFT = 52;

function Row({ event, onPress }: { event: AgendaEvent; onPress?: (event: AgendaEvent) => void }) {
  const colors = useThemeColors();
  const [pressed, setPressed] = useState(false);
  const time = event.time ?? `${format(event.start, "HH:mm")} to ${format(event.end, "HH:mm")}`;
  const detail = typeof event.detail === "string" ? event.detail : event.detail?.join(", ");
  const struck = event.struck ? ("line-through" as const) : ("none" as const);
  return (
    <Pressable
      disabled={!onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.(event);
      }}
      accessibilityRole="button"
      accessibilityLabel={[event.title, time, detail, event.struck ? "cancelled" : null].filter(Boolean).join(", ")}
      style={{ flexDirection: "row", alignItems: "center", columnGap: 10, paddingVertical: 7, paddingLeft: 8, paddingRight: 16, borderRadius: 10, backgroundColor: pressed ? colors.border : "transparent" }}
    >
      <View style={{ alignSelf: "stretch", width: 3, borderRadius: 1.5, backgroundColor: event.color, opacity: event.struck ? 0.4 : 1 }} />
      <View style={{ flex: 1, rowGap: 1, opacity: event.struck ? 0.6 : 1 }}>
        <Text weight="semibold" numberOfLines={2} style={[TYPE.body, { textDecorationLine: struck }]}>
          {event.title}
        </Text>
        <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>
          {[time, detail].filter(Boolean).join(", ")}
        </Text>
      </View>
      {event.trailing}
    </Pressable>
  );
}

export function AgendaList({ from, days, events, today = new Date(), emptyLabel = "Nothing planned", onPressEvent }: AgendaListProps) {
  const colors = useThemeColors();
  // Each group is one day with events, or a run of consecutive empty days.
  const groups = useMemo(() => {
    const out: { first: Date; last: Date; list: AgendaEvent[] }[] = [];
    for (let i = 0; i < days; i++) {
      const date = addDays(from, i);
      const list = events.filter((e) => isSameDay(e.start, date)).sort((a, b) => +a.start - +b.start);
      const prev = out[out.length - 1];
      if (!list.length && prev && !prev.list.length && !isSameDay(date, today) && !isSameDay(prev.last, today)) prev.last = date;
      else out.push({ first: date, last: date, list });
    }
    return out;
  }, [from, days, events, today]);

  return (
    <View>
      {groups.map((g, i) => {
        const isToday = isSameDay(g.first, today);
        const line = { borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border };
        if (!g.list.length) {
          const span = isSameDay(g.first, g.last) ? format(g.first, "EEE d") : `${format(g.first, "EEE d")} to ${format(g.last, "EEE d")}`;
          return (
            <View key={dayKey(g.first)} style={[line, { marginLeft: 16, paddingVertical: 10, flexDirection: "row", columnGap: 8 }]}>
              <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>
                {`${span}, ${emptyLabel}`}
              </Text>
            </View>
          );
        }
        return (
          <View key={dayKey(g.first)} style={[line, { marginLeft: 16, flexDirection: "row", paddingVertical: 6 }]}>
            <View accessibilityRole="header" accessibilityLabel={format(g.first, "EEEE d MMMM")} style={{ width: LEFT - 8, paddingTop: 5, alignItems: "flex-start" }}>
              <View style={{ minWidth: 36, height: 36, borderRadius: 18, paddingHorizontal: isToday ? 6 : 0, alignItems: isToday ? "center" : "flex-start", justifyContent: "center", backgroundColor: isToday ? colors.text : "transparent" }}>
                <Text weight="semibold" style={[TYPE.title, TABULAR, { color: isToday ? colors.background : colors.text }]}>
                  {format(g.first, "d")}
                </Text>
              </View>
              <Text weight="medium" style={[TYPE.caption, { color: colors.muted, marginTop: 1, marginLeft: isToday ? 8 : 0 }]}>
                {format(g.first, "EEE")}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              {g.list.map((e) => (
                <Row key={e.id} event={e} onPress={onPressEvent} />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}
