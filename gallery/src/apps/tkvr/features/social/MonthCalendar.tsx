import { Pressable, Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { SocialPostState } from "@/apps/tkvr/lib/creator/social";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import * as Haptics from "expo-haptics";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useMemo } from "react";

// TAK-1401: the month grid for social posts. Copied from SELLERS
// ComplianceCalendar (src/app/(protected)/haccp/history.tsx): month nav, Mon
// to Sun headers, a 32pt day circle with a status dot under it. Changed: the
// selected day is a solid fill (no tinted ring, TKVR's no-ghost rule), and the
// dot is the day's most urgent post: failed, then scheduled, then published.

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthCalendar({
  month,
  onMonthChange,
  selected,
  onSelect,
  dayStates,
}: {
  month: Date;
  onMonthChange: (month: Date) => void;
  selected: string;
  onSelect: (day: string) => void;
  /** "yyyy-MM-dd" to the states of that day's posts. */
  dayStates: Record<string, SocialPostState[]>;
}) {
  const colors = useThemeColors();

  const weeks = useMemo(() => {
    const calStart = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const calEnd = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const rows: Date[][] = [];
    let day = calStart;
    while (day <= calEnd) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(day);
        day = addDays(day, 1);
      }
      rows.push(week);
    }
    return rows;
  }, [month]);

  const dotColor = (key: string) => {
    const states = dayStates[key];
    if (!states?.length) return null;
    if (states.includes("failed")) return colors.error;
    if (states.includes("scheduled")) return colors.warning;
    if (states.includes("published")) return colors.success;
    return colors.muted;
  };

  return (
    <View className="bg-secondary-background rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onMonthChange(subMonths(month, 1));
          }}
          hitSlop={12}
        >
          <ChevronLeft size={20} color={colors.text} />
        </Pressable>
        <Text weight="semibold" className="text-base tracking-tight">
          {format(month, "MMMM yyyy")}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onMonthChange(addMonths(month, 1));
          }}
          hitSlop={12}
        >
          <ChevronRight size={20} color={colors.text} />
        </Pressable>
      </View>

      <View className="flex-row mb-2">
        {WEEKDAYS.map((d) => (
          <View key={d} className="flex-1 items-center">
            <Text className="text-xs text-muted" weight="medium">
              {d}
            </Text>
          </View>
        ))}
      </View>

      {weeks.map((week, wi) => (
        <View key={wi} className="flex-row mb-1">
          {week.map((date) => {
            const inMonth = isSameMonth(date, month);
            const key = format(date, "yyyy-MM-dd");
            const dot = dotColor(key);
            const isSelected = selected === key;
            const today = isToday(date);
            return (
              <Pressable
                key={key}
                className="flex-1 items-center py-1"
                accessibilityRole="button"
                accessibilityLabel={format(date, "EEEE d MMMM")}
                accessibilityState={{
                  selected: isSelected,
                  disabled: !inMonth,
                }}
                onPress={() => {
                  if (!inMonth) return;
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onSelect(key);
                }}
                disabled={!inMonth}
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={[
                    isSelected && { backgroundColor: colors.tint },
                    today &&
                      !isSelected && {
                        borderWidth: 1,
                        borderColor: colors.border,
                      },
                  ]}
                >
                  <Text
                    className="text-xs"
                    weight={today || isSelected ? "bold" : "regular"}
                    style={{
                      color: !inMonth
                        ? colors.muted + "40"
                        : isSelected
                          ? colors.background
                          : colors.text,
                    }}
                  >
                    {format(date, "d")}
                  </Text>
                </View>
                {inMonth && dot ? (
                  <View
                    className="w-1.5 h-1.5 rounded-full mt-0.5"
                    style={{ backgroundColor: dot }}
                  />
                ) : (
                  <View className="w-1.5 h-1.5 mt-0.5" />
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
