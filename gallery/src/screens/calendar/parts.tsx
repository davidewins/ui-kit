// What the five calendar screens share: the navigation bar (view switch,
// today, add, the "..." menu), the colours of statuses and services, the
// networks' marks, the floating peek for a tapped event, and the long-press
// actions of a post and of a booking with the confirm their delete needs.
import { SocialMark } from "@/apps/tkvr/components/SocialMark";
import { GlassSurface } from "@/components/GlassSurface";
import { Button, Text, View } from "@/components/ui";
import { ActionMenu, type MenuAction, type SFSymbolName } from "@/components/ui/actions/ActionMenu";
import { ContextMenu, type ContextMenuAction } from "@/components/ui/actions/ContextMenu";
import { ViewSwitch } from "@/components/ui/calendar/ViewSwitch";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { format } from "date-fns";
import { type Href, Stack, router } from "expo-router";
import { CalendarDays, Columns3, List, Rows3, Users, type LucideIcon } from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { type Booking, NETWORK_LABEL, type Network, type Post, type PostStatus, SERVICES, type ServiceKind, TODAY, bookingStatus } from "./data";

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
const TODAY_SYMBOL = `${TODAY.getDate()}.calendar` as SFSymbolName;

/** The navigation bar of every calendar view: the switch where the title
 *  would be, then "today", "add" and the view's own menu on the right.
 *  Switching replaces the screen, so Back leaves the calendar instead of
 *  walking through views. */
export function CalendarHeader({
  view,
  onToday,
  addLabel,
  onAdd,
  actions,
}: {
  view: CalendarView;
  onToday: () => void;
  addLabel: string;
  onAdd: () => void;
  /** The "..." menu: what you do to this calendar as a whole. */
  actions: readonly MenuAction[];
}) {
  return (
    <>
      <Stack.Screen options={{ headerTitle: () => <ViewSwitch options={VIEWS} value={view} onChange={(k) => router.replace(HREF[k] as Href)} /> }} />
      <ActionMenu
        accessibilityLabel="Calendar actions"
        actions={[
          { label: addLabel, systemImage: "plus", onPress: onAdd },
          { label: "Go to today", systemImage: TODAY_SYMBOL, onPress: onToday },
          ...actions,
        ]}
      />
    </>
  );
}

/** The "..." menu of the three content-calendar views. */
export const CONTENT_ACTIONS: readonly MenuAction[] = [
  { label: "Best times to post", systemImage: "clock", onPress: () => Toast.info("Instagram does best for you at 18:00") },
  { label: "Connect an account", systemImage: "link", onPress: () => Toast.info("Connect an account") },
  { label: "Export as CSV", systemImage: "tablecells", onPress: () => Toast.success("Calendar exported") },
];

/** The "..." menu of the two salon views. */
export const SALON_ACTIONS: readonly MenuAction[] = [
  { label: "Block out time", systemImage: "calendar.badge.minus", onPress: () => Toast.info("Block out time") },
  { label: "Opening hours", systemImage: "clock", onPress: () => Toast.info("Opening hours") },
  { label: "Print day sheet", systemImage: "printer", onPress: () => Toast.success("Day sheet sent to the printer") },
];

/** A post's long-press actions, and the confirm that deleting one needs:
 *  render `dialog` once anywhere on the screen. */
export function usePostActions() {
  const [target, setTarget] = useState<Post | null>(null);
  const [open, setOpen] = useState(false);
  const actionsFor = (p: Post): ContextMenuAction[] => [
    p.status === "published"
      ? { label: "See results", systemImage: "chart.bar", onPress: () => Toast.info(`Results: ${p.title}`) }
      : { label: "Edit post", systemImage: "pencil", onPress: () => Toast.info(`Editing "${p.title}"`) },
    ...(p.status === "published" ? [] : [{ label: "Reschedule", systemImage: "calendar.badge.clock" as const, onPress: () => Toast.info(`Pick a new time for "${p.title}"`) }]),
    { label: "Duplicate", systemImage: "plus.square.on.square", onPress: () => Toast.success("Copied to drafts") },
    {
      label: "Delete post",
      systemImage: "trash",
      destructive: true,
      onPress: () => {
        setTarget(p);
        setOpen(true);
      },
    },
  ];
  const where = target ? target.networks.map((n) => NETWORK_LABEL[n]).join(" and ") : "";
  const dialog = (
    <ConfirmDialog
      visible={open}
      onClose={() => setOpen(false)}
      title={target ? `Delete "${target.title}"?` : ""}
      message={
        target?.status === "published"
          ? `It stays up on ${where}, but its results leave your calendar. You cannot undo this.`
          : target?.status === "scheduled"
            ? `It will not go out on ${where} at ${format(target.at, "HH:mm")}. You cannot undo this.`
            : "Its caption and cover are deleted with it. You cannot undo this."
      }
      confirmLabel="Delete post"
      cancelLabel="Keep post"
      destructive
      onConfirm={() => Toast.success("Post deleted")}
    />
  );
  return { actionsFor, dialog };
}

/** A booking's long-press actions, and the confirm that cancelling one
 *  needs: render `dialog` once anywhere on the screen. */
export function useBookingActions() {
  const [target, setTarget] = useState<Booking | null>(null);
  const [open, setOpen] = useState(false);
  const actionsFor = (b: Booking): ContextMenuAction[] => {
    const first = b.client.split(" ")[0];
    return [
      { label: bookingStatus(b) === "Confirmed" ? "Reschedule" : "Rebook", systemImage: "calendar.badge.clock", onPress: () => Toast.info(`Pick a new time for ${first}`) },
      { label: `Message ${first}`, systemImage: "message", onPress: () => Toast.info(`Message ${b.client}`) },
      ...(bookingStatus(b) === "Confirmed"
        ? [
            {
              label: "Cancel booking",
              systemImage: "xmark.circle" as const,
              destructive: true,
              onPress: () => {
                setTarget(b);
                setOpen(true);
              },
            },
          ]
        : []),
    ];
  };
  const service = target ? SERVICES[target.service] : null;
  const dialog = (
    <ConfirmDialog
      visible={open}
      onClose={() => setOpen(false)}
      title={target && service ? `Cancel ${target.client}'s ${service.name.toLowerCase()}?` : ""}
      message={target && service ? `${target.client.split(" ")[0]} gets a text that ${format(target.start, "HH:mm")} is off, and €${service.price} comes off the day's total. You cannot undo this.` : undefined}
      confirmLabel="Cancel booking"
      cancelLabel="Keep booking"
      destructive
      onConfirm={() => Toast.success("Booking cancelled")}
    />
  );
  return { actionsFor, dialog };
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
 *  and the one thing you would do with it. Long press it for the rest. */
export function EventPeek({
  leading,
  title,
  lines,
  action,
  menu,
}: {
  leading: ReactNode;
  title: string;
  lines: readonly ReactNode[];
  action: { label: string; onPress: () => void };
  /** Long-press actions on the event. */
  menu?: readonly ContextMenuAction[];
}) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const row = (
    <View style={{ padding: 12, flexDirection: "row", alignItems: "center", columnGap: 12 }}>
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
    </View>
  );
  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", left: 16, right: 16, bottom: insets.bottom || 12, borderRadius: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.18, shadowRadius: 24, elevation: 6 }}
    >
      <GlassSurface fill style={{ borderRadius: 24, borderCurve: "continuous", overflow: "hidden" }}>
        {menu ? <ContextMenu actions={menu}>{row}</ContextMenu> : row}
      </GlassSurface>
    </View>
  );
}
