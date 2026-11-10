// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/calendar/MonthGrid.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A month of days, Monday first, for picking a day and seeing at a glance
// which days have something on them. The selected day is a filled circle in
// the text colour, today sits in a grey circle, and each day can carry up to
// three coloured dots or a count. It has no list of its own: put the selected
// day's events under it. For seven days against the clock use WeekGrid.
import { useThemeColors } from "@/hooks/useThemeColors";
import { addDays, addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { Pressable, View } from "react-native";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";
import { PeriodBar } from "./PeriodBar";
import { dayKey } from "./timeline";

export interface DayMark {
  /** Colours of the first three things on the day. */
  dots?: readonly string[];
  /** Drawn in place of the dots, for a day too busy for them. */
  count?: number;
}

export interface MonthGridProps {
  /** Any date in the month to show. */
  month: Date;
  onMonthChange: (month: Date) => void;
  selected?: Date;
  onSelect: (date: Date) => void;
  /** By "yyyy-MM-dd". */
  marks?: Record<string, DayMark>;
  /** Defaults to the real today. */
  today?: Date;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CIRCLE = 36;

export function MonthGrid({ month, onMonthChange, selected, onSelect, marks = {}, today = new Date() }: MonthGridProps) {
  const colors = useThemeColors();
  const weeks = useMemo(() => {
    const first = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const last = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const rows: Date[][] = [];
    for (let d = first; d <= last; d = addDays(d, 7)) rows.push(Array.from({ length: 7 }, (_, i) => addDays(d, i)));
    return rows;
  }, [month]);

  return (
    <View>
      <PeriodBar title={format(month, "MMMM yyyy")} unit="month" onPrevious={() => onMonthChange(addMonths(month, -1))} onNext={() => onMonthChange(addMonths(month, 1))} />
      <View style={{ flexDirection: "row", marginTop: 12, marginBottom: 4 }}>
        {WEEKDAYS.map((d, i) => (
          <Text key={d} weight="medium" style={[TYPE.caption, { flex: 1, textAlign: "center", color: i > 4 ? colors.muted : colors.text, opacity: i > 4 ? 0.7 : 0.6 }]}>
            {d}
          </Text>
        ))}
      </View>
      {weeks.map((week) => (
        <View key={dayKey(week[0])} style={{ flexDirection: "row" }}>
          {week.map((date) => {
            const inMonth = isSameMonth(date, month);
            const isSelected = !!selected && isSameDay(date, selected);
            const isToday = isSameDay(date, today);
            const mark = marks[dayKey(date)];
            const dots = mark?.dots?.slice(0, 3) ?? [];
            return (
              <Pressable
                key={dayKey(date)}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  if (!inMonth) onMonthChange(date);
                  onSelect(date);
                }}
                accessibilityRole="button"
                accessibilityLabel={`${format(date, "EEEE d MMMM")}${mark?.count ?? dots.length ? `, ${mark?.count ?? dots.length} items` : ""}${isToday ? ", today" : ""}`}
                accessibilityState={{ selected: isSelected }}
                style={{ flex: 1, alignItems: "center", height: 52, paddingTop: 2 }}
              >
                <View
                  style={{
                    width: CIRCLE,
                    height: CIRCLE,
                    borderRadius: CIRCLE / 2,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected ? colors.text : isToday ? colors.border : "transparent",
                  }}
                >
                  <Text
                    weight={isSelected || isToday ? "semibold" : "medium"}
                    style={[TYPE.body, TABULAR, { color: isSelected ? colors.background : colors.text, opacity: inMonth || isSelected ? 1 : 0.3 }]}
                  >
                    {format(date, "d")}
                  </Text>
                </View>
                <View style={{ height: 12, flexDirection: "row", alignItems: "center", columnGap: 3, opacity: inMonth ? 1 : 0.3 }}>
                  {mark?.count !== undefined ? (
                    <Text weight="semibold" style={[TYPE.caption, TABULAR, { color: colors.muted, lineHeight: 12 }]}>
                      {mark.count}
                    </Text>
                  ) : (
                    dots.map((c, i) => <View key={i} style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: c }} />)
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
