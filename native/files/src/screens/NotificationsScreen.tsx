// NotificationsScreen: the one Notifications page for every app (David, 19
// Nov: VOID's drifted from SELLERS'). Moved from SELLERS
// src/app/(protected)/account/notifications/index.tsx, the reference:
//   * the kit SegmentedControl pinned under the header, one segment per
//     channel (Push, Email, SMS), never scrolling away;
//   * when push is off at the OS, a "Turn On Notifications" row and an
//     "Open iOS Settings" row, with a warning line under them;
//   * per channel, groups of SettingsRows under the Settings screen's section
//     titles: one glyph per alert, a kit Switch, or "Always On" for alerts
//     that can't be turned off;
//   * one muted line under the list saying what always comes through.
//
// The screen sets no header options. The app's route:
//   <Stack.Screen options={{ title: "Notifications" }} />
// The app owns the data (load, optimistic save, rollback) and passes values in.
import { ScrollView, View } from "@/components/ui";
import { SegmentedControl } from "@/components/ui/inputs/SegmentedControl";
import { Switch } from "@/components/ui/inputs/Switch";
import type { SettingsIcon } from "@/components/ui/lists/SettingsRow";
import { BellOff, Settings } from "lucide-react-native";
import type { Href } from "expo-router";
import { useState } from "react";
import { Linking, Platform, RefreshControl } from "react-native";
import { SettingsNote, SettingsSections, type SettingsScreenSection } from "./SettingsScreen";

export interface NotificationItem {
  key: string;
  label: string;
  icon: SettingsIcon;
  /** Security and the like: shows "Always On", no switch. */
  alwaysOn?: boolean;
}

export interface NotificationGroup {
  title: string;
  items: readonly NotificationItem[];
}

export interface NotificationChannel {
  key: string;
  /** Segment label: "Push", "Email", "SMS". */
  label: string;
  groups: readonly NotificationGroup[];
  /** Muted line under the list: what always comes through on this channel. */
  note: string;
}

export interface NotificationsScreenProps {
  channels: readonly NotificationChannel[];
  isOn: (channel: string, item: string) => boolean;
  onToggle: (channel: string, item: string, next: boolean) => void;
  /** Switches stay visible but disabled while the real values load. */
  loading?: boolean;
  /** OS permission for push: false shows the turn-on rows on the push segment. */
  pushPermission?: boolean | null;
  /** The app's permission screen. */
  pushPermissionHref?: Href;
  /** Warning under the turn-on rows, e.g. "Push is off, so order updates won't reach you." */
  pushOffNote?: string;
  refreshing?: boolean;
  onRefresh?: () => void;
}

function openOsSettings() {
  if (Platform.OS === "ios") Linking.openURL("app-settings:");
  else Linking.openSettings();
}

export function NotificationsScreen({
  channels,
  isOn,
  onToggle,
  loading = false,
  pushPermission,
  pushPermissionHref,
  pushOffNote,
  refreshing = false,
  onRefresh,
}: NotificationsScreenProps) {
  const [index, setIndex] = useState(0);
  const channel = channels[Math.min(index, channels.length - 1)];

  const permissionSection: SettingsScreenSection | null =
    channel.key === "push" && pushPermission === false
      ? {
          key: "permission",
          rows: [
            { key: "turn-on", label: "Turn On Notifications", icon: BellOff, alert: true, navigates: true, href: pushPermissionHref },
            { key: "os", label: "Open iOS Settings", icon: Settings, onPress: openOsSettings },
          ],
          note: pushOffNote,
        }
      : null;

  const sections: SettingsScreenSection[] = channel.groups.map((group) => ({
    key: `${channel.key}-${group.title}`,
    title: group.title,
    rows: group.items.map((item) => {
      const on = item.alwaysOn ? true : isOn(channel.key, item.key);
      return {
        key: item.key,
        label: item.label,
        icon: item.icon,
        value: item.alwaysOn ? "Always On" : undefined,
        disabled: item.alwaysOn,
        onPress: item.alwaysOn || loading ? undefined : () => onToggle(channel.key, item.key, !on),
        accessory: item.alwaysOn ? undefined : (
          <Switch
            value={on}
            onValueChange={(next) => onToggle(channel.key, item.key, next)}
            disabled={loading}
            accessibilityLabel={`${item.label}, ${channel.label}`}
          />
        ),
      };
    }),
  }));

  return (
    <View className="flex-1 bg-background">
      {channels.length > 1 ? (
        <SegmentedControl
          values={channels.map((c) => c.label)}
          selectedIndex={index}
          onChange={setIndex}
          accessibilityLabel="Notification channel"
          style={{ marginHorizontal: 16, marginTop: 8, marginBottom: 12 }}
        />
      ) : null}
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined}
      >
        <SettingsSections sections={permissionSection ? [permissionSection, ...sections] : sections} />
        <SettingsNote>{channel.note}</SettingsNote>
      </ScrollView>
    </View>
  );
}
