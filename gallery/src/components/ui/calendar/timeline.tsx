// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/calendar/timeline.tsx. Edit it there and sync; local edits fail ui-kit:check.
// The shared parts of every hour-rail calendar (DayTimeline, WeekGrid): the
// event shape, the hour labels and lines, the "now" line, the event block and
// the maths that lays overlapping events side by side. Not a component to put
// on a screen: use DayTimeline or WeekGrid.
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import { Plus } from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { FadeInLeft, FadeInRight } from "react-native-reanimated";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";

export interface CalendarEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
  /** Lines under the title, most important first: as many as the block has room for are shown. */
  detail?: string | readonly string[];
  /** A hue from useHues() (or a status colour): tints the block, fills its left edge. */
  color: string;
  /** Called off: grey, title struck through. */
  struck?: boolean;
  /** Not an event but free time on offer: a dashed outline with a plus. */
  open?: boolean;
  /** Which resource column it belongs to (DayTimeline `columns`). */
  column?: string;
  /** Drawn under the title in place of `detail` (brand marks, an avatar). */
  accessory?: ReactNode;
}

export const RAIL = 44;
/** Room above the first hour line so its label is not cut off. */
export const PAD = 8;
export const dayKey = (d: Date) => format(d, "yyyy-MM-dd");

/**
 * The entering animation for a calendar body keyed by its period ("yyyy-MM-dd"
 * of the period's first day): a later period slides in from the right, an
 * earlier one from the left, the first render does not move.
 */
export function usePeriodSlide(key: string) {
  const [last, setLast] = useState({ key, dir: 0 });
  if (last.key !== key) setLast({ key, dir: key > last.key ? 1 : -1 });
  return last.dir === 0 ? undefined : last.dir > 0 ? FadeInRight.duration(220) : FadeInLeft.duration(220);
}
const hours = (d: Date) => d.getHours() + d.getMinutes() / 60;
export const yOf = (d: Date, startHour: number, hourHeight: number) => PAD + (hours(d) - startHour) * hourHeight;

/** Overlapping events share the width: each gets a column and the number of columns in its cluster. */
export function pack(events: readonly CalendarEvent[]) {
  const out = new Map<string, { col: number; cols: number }>();
  const sorted = [...events].sort((a, b) => +a.start - +b.start || +b.end - +a.end);
  let cluster: CalendarEvent[] = [];
  let ends: number[] = [];
  let clusterEnd = 0;
  const flush = () => {
    for (const e of cluster) out.get(e.id)!.cols = ends.length;
    cluster = [];
    ends = [];
    clusterEnd = 0;
  };
  for (const e of sorted) {
    if (cluster.length && +e.start >= clusterEnd) flush();
    let col = ends.findIndex((t) => t <= +e.start);
    if (col === -1) col = ends.push(0) - 1;
    ends[col] = +e.end;
    out.set(e.id, { col, cols: 1 });
    cluster.push(e);
    clusterEnd = Math.max(clusterEnd, +e.end);
  }
  flush();
  return out;
}

/** Hour labels down the left and a hairline per hour across the rest. */
export function HourGrid({ startHour, endHour, hourHeight, now }: { startHour: number; endHour: number; hourHeight: number; now?: Date }) {
  const colors = useThemeColors();
  const hues = useHues();
  const nowHours = now ? hours(now) : -1;
  const showNow = nowHours >= startHour && nowHours <= endHour;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: endHour - startHour + 1 }, (_, i) => {
        const y = PAD + i * hourHeight;
        // The now label takes the place of an hour label it would touch.
        const hidden = showNow && Math.abs(nowHours - (startHour + i)) < 14 / hourHeight;
        return (
          <View key={i} style={{ position: "absolute", top: y, left: 0, right: 0 }}>
            <View style={{ marginLeft: RAIL, height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
            {hidden ? null : (
              <Text weight="medium" style={[TYPE.caption, TABULAR, { position: "absolute", top: -7, width: RAIL - 8, textAlign: "right", color: colors.muted }]}>
                {`${String(startHour + i).padStart(2, "0")}:00`}
              </Text>
            )}
          </View>
        );
      })}
      {showNow ? (
        <Text weight="semibold" style={[TYPE.caption, TABULAR, { position: "absolute", top: yOf(now!, startHour, hourHeight) - 7, width: RAIL - 8, textAlign: "right", color: hues.red }]}>
          {format(now!, "HH:mm")}
        </Text>
      ) : null}
    </View>
  );
}

/** The current time: a dot and a line across one day's width. Place inside that day's column. */
export function NowLine({ now, startHour, hourHeight }: { now: Date; startHour: number; hourHeight: number }) {
  const hues = useHues();
  return (
    <View pointerEvents="none" accessibilityLabel={`Now, ${format(now, "HH:mm")}`} style={{ position: "absolute", left: -4, right: 0, top: yOf(now, startHour, hourHeight) - 4, height: 8, flexDirection: "row", alignItems: "center" }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: hues.red }} />
      <View style={{ flex: 1, height: 1.5, backgroundColor: hues.red }} />
    </View>
  );
}

/** One event, placed by its times inside a day column. `slot` comes from pack(). */
export function EventBlock({
  event,
  slot,
  startHour,
  hourHeight,
  compact = false,
  onPress,
}: {
  event: CalendarEvent;
  slot: { col: number; cols: number };
  startHour: number;
  hourHeight: number;
  /** Caption-size title: for narrow columns. */
  compact?: boolean;
  onPress?: (event: CalendarEvent) => void;
}) {
  const colors = useThemeColors();
  const hues = useHues();
  const top = yOf(event.start, startHour, hourHeight);
  const height = Math.max(18, yOf(event.end, startHour, hourHeight) - top - 2);
  const color = event.struck ? hues.gray : event.color;
  // Whole lines only: a line that does not fit is left out, never cut.
  const titleType = compact || height < 30 ? TYPE.caption : TYPE.sub;
  const padV = height < 32 ? 1 : height < 44 ? 2 : 4;
  const spare = Math.floor((height - padV * 2 - titleType.lineHeight) / TYPE.caption.lineHeight);
  const details = (typeof event.detail === "string" ? [event.detail] : (event.detail ?? [])).slice(0, Math.max(0, spare));
  const times = `${format(event.start, "HH:mm")} to ${format(event.end, "HH:mm")}`;
  return (
    <Pressable
      disabled={!onPress}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.(event);
      }}
      accessibilityRole="button"
      accessibilityLabel={[event.title, ...(typeof event.detail === "string" ? [event.detail] : (event.detail ?? [])), times, event.struck ? "cancelled" : null].filter(Boolean).join(", ")}
      style={({ pressed }) => ({
        position: "absolute",
        top: top + 1,
        height,
        left: `${(slot.col / slot.cols) * 100}%`,
        width: `${100 / slot.cols}%`,
        paddingLeft: 1,
        paddingRight: 1,
        opacity: event.struck ? 0.6 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {/* Page colour under the tint, so hour lines do not show through the text. */}
      <View style={{ flex: 1, borderRadius: 6, backgroundColor: colors.background }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            borderRadius: 6,
            overflow: "hidden",
            backgroundColor: event.open ? "transparent" : `${color}33`,
            borderWidth: event.open ? 1 : 0,
            borderStyle: "dashed",
            borderColor: colors.muted,
          }}
        >
          {event.open ? null : <View style={{ width: 3, backgroundColor: color }} />}
          <View style={{ flex: 1, paddingVertical: padV, paddingLeft: compact ? 4 : 7, paddingRight: compact ? 2 : 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 4 }}>
              {event.open ? <Plus size={12} color={colors.muted} strokeWidth={2.4} /> : null}
              <Text
                weight="semibold"
                numberOfLines={1}
                style={[titleType, TABULAR, { flexShrink: 1, color: event.open ? colors.muted : colors.text, textDecorationLine: event.struck ? "line-through" : "none" }]}
              >
                {event.title}
              </Text>
            </View>
            {spare >= 1 && event.accessory ? <View style={{ marginTop: 2 }}>{event.accessory}</View> : null}
            {event.accessory
              ? null
              : details.map((line) => (
                  <Text key={line} weight="medium" numberOfLines={1} style={[TYPE.caption, TABULAR, { color: colors.muted }]}>
                    {line}
                  </Text>
                ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
