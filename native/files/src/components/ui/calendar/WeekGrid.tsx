// Seven days against the clock, Monday first: the shape of a week at a
// glance. Seven equal columns on the same hour rail as DayTimeline, compact
// event blocks (keep titles to a word or a time: a column is about 46pt
// wide), today's column shaded, a line at the current time. It does not
// scroll by itself. For one day in detail use DayTimeline.
import { useThemeColors } from "@/hooks/useThemeColors";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";
import { type CalendarEvent, EventBlock, HourGrid, NowLine, PAD, RAIL, dayKey, pack } from "./timeline";

export interface WeekGridProps {
  /** Any date in the week to show. */
  week: Date;
  events: readonly CalendarEvent[];
  startHour?: number;
  endHour?: number;
  /** Points per hour. */
  hourHeight?: number;
  /** Marks today's column and draws the now line. Defaults to the real time. */
  now?: Date;
  onPressEvent?: (event: CalendarEvent) => void;
  /** Tapping a day's header (to open that day). */
  onPressDay?: (date: Date) => void;
}

export function WeekGrid({ week, events, startHour = 8, endHour = 20, hourHeight = 44, now = new Date(), onPressEvent, onPressDay }: WeekGridProps) {
  const colors = useThemeColors();
  const days = useMemo(() => {
    const first = startOfWeek(week, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(first, i);
      const list = events.filter((e) => isSameDay(e.start, date));
      return { date, list, slots: pack(list) };
    });
  }, [week, events]);

  return (
    <View>
      <View style={{ flexDirection: "row", marginLeft: RAIL, paddingBottom: 6 }}>
        {days.map(({ date, list }) => {
          const isToday = isSameDay(date, now);
          return (
            <Pressable
              key={dayKey(date)}
              disabled={!onPressDay}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                onPressDay?.(date);
              }}
              accessibilityRole="button"
              accessibilityLabel={`${format(date, "EEEE d MMMM")}, ${list.length} items${isToday ? ", today" : ""}`}
              style={{ flex: 1, alignItems: "center", rowGap: 2 }}
            >
              <Text weight="medium" style={[TYPE.caption, { color: colors.muted }]}>
                {format(date, "EEE")}
              </Text>
              <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: isToday ? colors.text : "transparent" }}>
                <Text weight="semibold" style={[TYPE.body, TABULAR, { color: isToday ? colors.background : colors.text }]}>
                  {format(date, "d")}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={{ height: PAD * 2 + (endHour - startHour) * hourHeight }}>
        <View pointerEvents="none" style={{ position: "absolute", top: 0, bottom: 0, left: RAIL, right: 0, flexDirection: "row" }}>
          {days.map(({ date }) => (
            <View key={dayKey(date)} style={{ flex: 1, backgroundColor: isSameDay(date, now) ? colors.surface : "transparent" }} />
          ))}
        </View>
        <HourGrid startHour={startHour} endHour={endHour} hourHeight={hourHeight} now={days.some((d) => isSameDay(d.date, now)) ? now : undefined} />
        <View style={{ position: "absolute", top: 0, bottom: 0, left: RAIL, right: 0, flexDirection: "row" }}>
          {days.map(({ date, list, slots }, i) => (
            <View key={dayKey(date)} style={{ flex: 1, borderLeftWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}>
              {list.map((e) => (
                <EventBlock key={e.id} event={e} slot={slots.get(e.id)!} startHour={startHour} hourHeight={hourHeight} compact onPress={onPressEvent} />
              ))}
              {isSameDay(date, now) ? <NowLine now={now} startHour={startHour} hourHeight={hourHeight} /> : null}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
