// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/calendar/DayTimeline.tsx. Edit it there and sync; local edits fail ui-kit:check.
// One day against the clock: an hour rail with events placed by start and end
// time, overlapping events side by side, and a line at the current time. Give
// it `columns` (one per person, room or court) for a resource view: each
// column gets a header and its own events. It does not scroll by itself: put
// it in the page's scroll view. For seven days use WeekGrid, for a plain list
// of what is coming use AgendaList.
import { useThemeColors } from "@/hooks/useThemeColors";
import { isSameDay } from "date-fns";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";
import { type CalendarEvent, EventBlock, HourGrid, NowLine, PAD, RAIL, pack } from "./timeline";

export interface TimelineColumn {
  /** Matches CalendarEvent.column. */
  key: string;
  title: string;
  /** Muted line under the title: "5 h 45 of 8 h". */
  detail?: string;
  /** 0 to 1: how full the column is, drawn as a bar under the header. */
  load?: number;
  /** Colour of the load bar. */
  color?: string;
}

export interface DayTimelineProps {
  day: Date;
  events: readonly CalendarEvent[];
  /** First and last hour on the rail (24h). */
  startHour?: number;
  endHour?: number;
  /** Points per hour. 64 and up leaves room for two lines in a 30 minute event. */
  hourHeight?: number;
  /** Draws the now line when it falls on `day`. Defaults to the real time. */
  now?: Date;
  columns?: readonly TimelineColumn[];
  onPressEvent?: (event: CalendarEvent) => void;
}

export function DayTimeline({ day, events, startHour = 8, endHour = 19, hourHeight = 64, now = new Date(), columns, onPressEvent }: DayTimelineProps) {
  const colors = useThemeColors();
  const isToday = isSameDay(day, now);
  const lanes = useMemo(() => {
    const today = events.filter((e) => isSameDay(e.start, day));
    const keys = columns ? columns.map((c) => c.key) : [undefined];
    return keys.map((key) => {
      const list = key === undefined ? today : today.filter((e) => e.column === key);
      return { key: key ?? "all", list, slots: pack(list) };
    });
  }, [events, day, columns]);

  return (
    <View>
      {columns ? (
        <View style={{ flexDirection: "row", marginLeft: RAIL, paddingBottom: 8 }}>
          {columns.map((c) => (
            <View key={c.key} accessibilityLabel={[c.title, c.detail].filter(Boolean).join(", ")} style={{ flex: 1, paddingHorizontal: 4, rowGap: 1 }}>
              <Text weight="semibold" numberOfLines={1} style={TYPE.sub}>
                {c.title}
              </Text>
              {c.detail ? (
                <Text weight="medium" numberOfLines={1} style={[TYPE.caption, TABULAR, { color: colors.muted }]}>
                  {c.detail}
                </Text>
              ) : null}
              {c.load !== undefined ? (
                <View style={{ height: 4, borderRadius: 2, marginTop: 5, backgroundColor: colors.border, overflow: "hidden" }}>
                  <View style={{ width: `${Math.min(1, Math.max(0, c.load)) * 100}%`, height: 4, borderRadius: 2, backgroundColor: c.color ?? colors.text }} />
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
      <View style={{ height: PAD * 2 + (endHour - startHour) * hourHeight }}>
        <HourGrid startHour={startHour} endHour={endHour} hourHeight={hourHeight} now={isToday ? now : undefined} />
        <View style={{ position: "absolute", top: 0, bottom: 0, left: RAIL, right: 0, flexDirection: "row" }}>
          {lanes.map((lane, i) => (
            <View key={lane.key} style={{ flex: 1, borderLeftWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}>
              <View style={{ flex: 1, marginHorizontal: columns ? 2 : 0 }}>
                {lane.list.map((e) => (
                  <EventBlock key={e.id} event={e} slot={lane.slots.get(e.id)!} startHour={startHour} hourHeight={hourHeight} compact={!!columns} onPress={onPressEvent} />
                ))}
              </View>
            </View>
          ))}
          {isToday ? <NowLine now={now} startHour={startHour} hourHeight={hourHeight} /> : null}
        </View>
      </View>
    </View>
  );
}
