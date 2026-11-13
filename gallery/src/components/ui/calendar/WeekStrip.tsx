// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/calendar/WeekStrip.tsx. Edit it there and sync; local edits fail ui-kit:check.
// One week in a row: weekday over day number, a dot under days that have
// something, the selected day filled. For choosing the day a timeline or list
// below it shows. Swipe sideways or use the arrows to change week; the new
// week slides in from the side it lies on. For a whole month use MonthGrid.
import { RoundButton } from "../actions/RoundButton";
import { useThemeColors } from "@/hooks/useThemeColors";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import * as Haptics from "expo-haptics";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useMemo, useRef } from "react";
import { PanResponder, Pressable, View } from "react-native";
import Animated from "react-native-reanimated";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";
import { dayKey, usePeriodSlide } from "./timeline";

export interface WeekStripProps {
  selected: Date;
  /** Also called with the same weekday of the next or previous week when the week changes. */
  onSelect: (date: Date) => void;
  /** Dot colour by "yyyy-MM-dd" for days that have something. */
  dots?: Record<string, string>;
  /** Defaults to the real today. */
  today?: Date;
  /** Round previous / next buttons at the ends. Swiping works either way. */
  arrows?: boolean;
}

const CIRCLE = 36;

export function WeekStrip({ selected, onSelect, dots = {}, today = new Date(), arrows = true }: WeekStripProps) {
  const colors = useThemeColors();
  const days = useMemo(() => {
    const first = startOfWeek(selected, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(first, i));
  }, [selected]);
  const entering = usePeriodSlide(dayKey(days[0]));
  const shift = (weeks: number) => {
    Haptics.selectionAsync().catch(() => {});
    onSelect(addDays(selected, weeks * 7));
  };
  const shiftRef = useRef(shift);
  shiftRef.current = shift;
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > 40) shiftRef.current(g.dx < 0 ? 1 : -1);
      },
    }),
  ).current;

  const arrow = (label: string, Icon: typeof ChevronLeft, weeks: number) => (
    <View style={{ marginTop: 18 }}>
      <RoundButton size={30} accessibilityLabel={label} onPress={() => shift(weeks)}>
        <Icon size={16} color={colors.text} strokeWidth={2.2} />
      </RoundButton>
    </View>
  );

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
      {arrows ? arrow("Previous week", ChevronLeft, -1) : null}
      <Animated.View key={dayKey(days[0])} entering={entering} {...pan.panHandlers} style={{ flex: 1, flexDirection: "row" }}>
        {days.map((date) => {
          const isSelected = isSameDay(date, selected);
          const isToday = isSameDay(date, today);
          const dot = dots[dayKey(date)];
          return (
            <Pressable
              key={dayKey(date)}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                onSelect(date);
              }}
              accessibilityRole="button"
              accessibilityLabel={`${format(date, "EEEE d MMMM")}${isToday ? ", today" : ""}`}
              accessibilityState={{ selected: isSelected }}
              style={{ flex: 1, alignItems: "center", rowGap: 4 }}
            >
              <Text weight="medium" style={[TYPE.caption, { color: colors.muted }]}>
                {format(date, "EEE")}
              </Text>
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
                <Text weight={isSelected || isToday ? "semibold" : "medium"} style={[TYPE.body, TABULAR, { color: isSelected ? colors.background : colors.text }]}>
                  {format(date, "d")}
                </Text>
              </View>
              <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: dot ?? "transparent" }} />
            </Pressable>
          );
        })}
      </Animated.View>
      {arrows ? arrow("Next week", ChevronRight, 1) : null}
    </View>
  );
}
