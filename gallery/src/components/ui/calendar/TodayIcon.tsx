// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/calendar/TodayIcon.tsx. Edit it there and sync; local edits fail ui-kit:check.
// The "jump to today" glyph: a calendar leaf with today's date on it, as in
// Google Calendar's toolbar. It takes the same props as a lucide icon, so it
// goes anywhere one does: `<HeaderIconButton icon={todayIcon(10)} ... />`.
import { useFontFamily } from "@/hooks/useFontFamily";
import type { LucideIcon } from "lucide-react-native";
import Svg, { Path, Rect, Text as SvgText } from "react-native-svg";

/** A lucide-shaped icon showing `day` (1 to 31). Create it once per day, outside render or in useMemo. */
export function todayIcon(day: number): LucideIcon {
  function TodayIcon({ size = 24, color = "currentColor", strokeWidth = 2 }: { size?: number | string; color?: string; strokeWidth?: number | string }) {
    const family = useFontFamily();
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect x={3} y={4.5} width={18} height={16.5} rx={4.5} stroke={color} strokeWidth={strokeWidth} />
        <Path d="M8 2.5v3.5M16 2.5v3.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        <SvgText x={12} y={17.2} textAnchor="middle" fontFamily={family("semibold")} fontSize={day > 9 ? 9.5 : 10.5} fill={color}>
          {String(day)}
        </SvgText>
      </Svg>
    );
  }
  return TodayIcon as unknown as LucideIcon;
}
