// What the five calendar screens share: the navigation bar (view switch,
// today, add), the colours of statuses and services, the networks' marks and
// the floating peek for a tapped event.
import { SocialMark } from "@/apps/tkvr/components/SocialMark";
import { GlassSurface } from "@/components/GlassSurface";
import { Button, Text, View } from "@/components/ui";
import { HeaderIconButton } from "@/components/ui/actions/HeaderIconButton";
import { todayIcon } from "@/components/ui/calendar/TodayIcon";
import { ViewSwitch } from "@/components/ui/calendar/ViewSwitch";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { type Href, Stack, router } from "expo-router";
import { CalendarDays, Columns3, List, Plus, Rows3, Users, type LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type Network, type PostStatus, type ServiceKind, TODAY } from "./data";

// The one place the five screens' paths live.
export const HREF = {
  month: "/screens/calendar/month",
  week: "/screens/calendar/week",
  day: "/screens/calendar/day",
  agenda: "/screens/calendar/agenda",
  team: "/screens/calendar/team",
} as const;
export type CalendarView = keyof typeof HREF;

const VIEWS: { key: CalendarView; label: string; icon: LucideIcon }[] = [
  { key: "month", label: "Month", icon: CalendarDays },
  { key: "week", label: "Week", icon: Columns3 },
  { key: "day", label: "Day", icon: Rows3 },
  { key: "agenda", label: "List", icon: List },
  { key: "team", label: "Team", icon: Users },
];
const TODAY_ICON = todayIcon(TODAY.getDate());

/** The navigation bar of every calendar view: the switch where the title
 *  would be, then "today" and "add" on the right. Switching replaces the
 *  screen, so Back leaves the calendar instead of walking through views. */
export function CalendarHeader({ view, onToday, addLabel, onAdd }: { view: CalendarView; onToday: () => void; addLabel: string; onAdd: () => void }) {
  return (
    <Stack.Screen
      options={{
        headerTitle: () => <ViewSwitch options={VIEWS} value={view} onChange={(k) => router.replace(HREF[k] as Href)} />,
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <HeaderIconButton icon={TODAY_ICON} accessibilityLabel="Go to today" onPress={onToday} />
            <HeaderIconButton icon={Plus} accessibilityLabel={addLabel} onPress={onAdd} />
          </View>
        ),
      }}
    />
  );
}

/** Post status to its colour: the status colours, grey for a draft. */
export function useStatusColor(): Record<PostStatus, string> {
  const colors = useThemeColors();
  const hues = useHues();
  return { published: colors.success, scheduled: colors.warning, failed: colors.error, draft: hues.gray };
}
export const STATUS_BADGE = { published: "success", scheduled: "warning", failed: "error", draft: "default" } as const;

/** Service kind to its hue, the same in the day and team views. */
export function useKindHue(): Record<ServiceKind, string> {
  const hues = useHues();
  return { Cut: hues.blue, Colour: hues.pink, Styling: hues.teal, Barber: hues.orange };
}

const BRAND: Partial<Record<Network, string>> = { instagram: "#E4405F", youtube: "#FF0000" };

/** The networks a post goes to, as their marks in brand colour. */
export function NetworkMarks({ networks, size = 14 }: { networks: readonly Network[]; size?: number }) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", columnGap: Math.round(size / 3) }}>
      {networks.map((n) => (
        <SocialMark key={n} network={n} size={size} color={BRAND[n] ?? colors.text} />
      ))}
    </View>
  );
}

/** The tapped event, floating in glass over the calendar: what it is, when,
 *  and the one thing you would do with it. */
export function EventPeek({
  leading,
  title,
  lines,
  action,
}: {
  leading: ReactNode;
  title: string;
  lines: readonly ReactNode[];
  action: { label: string; onPress: () => void };
}) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", left: 16, right: 16, bottom: insets.bottom || 12, borderRadius: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 6 }}
    >
      <GlassSurface fill style={{ borderRadius: 24, borderCurve: "continuous", overflow: "hidden", padding: 12, flexDirection: "row", alignItems: "center", columnGap: 12 }}>
        {leading}
        <View style={{ flex: 1, rowGap: 2 }}>
          <Text weight="semibold" numberOfLines={1} style={TYPE.body}>
            {title}
          </Text>
          {lines.map((l, i) =>
            typeof l === "string" ? (
              <Text key={i} weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>
                {l}
              </Text>
            ) : (
              <View key={i}>{l}</View>
            ),
          )}
        </View>
        <Button size="sm" onPress={action.onPress}>
          {action.label}
        </Button>
      </GlassSurface>
    </View>
  );
}
