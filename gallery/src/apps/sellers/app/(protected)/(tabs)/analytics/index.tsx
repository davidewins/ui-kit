// Analytics tab - FuseTopTabs host. Sales / Customers / Channels / Insights.
// Insights is reserved for the competitor-scrape module (own-data == Analytics,
// scraped-competitor == Insights - feedback_analytics_vs_insights.md).
//
// Flow trace
//   1. User goal: see how the business is doing across own data + future
//      competitor signals.
//   2. State change: FuseTopTabs swap; sub-pushes from each pane.
//   3. Next: native back returns to whichever pane was active.

import { ChannelsPane } from "@/apps/sellers/components/analytics/panes/ChannelsPane";
import { CustomersPane } from "@/apps/sellers/components/analytics/panes/CustomersPane";
// import { InsightsPane } from "@/apps/sellers/components/analytics/panes/InsightsPane";
import { SalesPaneCompact } from "@/apps/sellers/components/analytics/panes/SalesPaneCompact";
import { FuseTopTabs, type FuseTab } from "@/components/FuseTopTabs";
import { PERMISSIONS, useMyPermissions } from "@/apps/sellers/hooks/useMyPermissions";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  PERIOD_LABELS,
  useAnalyticsPeriodStore,
  type AnalyticsPeriod,
} from "@/apps/sellers/stores/analyticsPeriodStore";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { CalendarRange } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

function HeaderIcon({
  icon: Icon,
  onPress,
}: {
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      className="px-2"
      style={({ pressed }) => ({
        height: 32,
        justifyContent: "center",
        opacity: pressed ? 0.4 : 1,
      })}
    >
      <Icon size={22} strokeWidth={1.8} color={colors.tint} />
    </Pressable>
  );
}

const PERIOD_OPTIONS: AnalyticsPeriod[] = [7, 30, 90];

// Android only: the header button cycles 7 -> 30 -> 90 days.
function presentPeriodPicker(
  current: AnalyticsPeriod,
  onPick: (p: AnalyticsPeriod) => void,
) {
  onPick(PERIOD_OPTIONS[(PERIOD_OPTIONS.indexOf(current) + 1) % PERIOD_OPTIONS.length]);
}

export default function AnalyticsScreen() {
  const colors = useThemeColors();
  const { hasPermission, isOwner } = useMyPermissions();
  const canViewAnalytics =
    isOwner ||
    hasPermission(PERMISSIONS.VIEW_ANALYTICS) ||
    hasPermission(PERMISSIONS.MANAGE_FINANCIAL);
  const [active, setActive] = useState(0);
  const periodDays = useAnalyticsPeriodStore((s) => s.periodDays);
  const setPeriod = useAnalyticsPeriodStore((s) => s.setPeriod);
  const pickPeriod = (p: AnalyticsPeriod) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setPeriod(p);
  };

  const tabs = useMemo<FuseTab[]>(
    () => [
      { label: "Sales", value: 0, content: <SalesPaneCompact /> },
      { label: "Customers", value: 1, content: <CustomersPane /> },
      { label: "Channels", value: 2, content: <ChannelsPane /> },
      // { label: "Insights", value: 3, content: <InsightsPane /> },
    ],
    [],
  );

  if (!canViewAnalytics) {
    // Per the no-blank-states rule: when a staff user lacks analytics
    // permission, show a small honest note pointing them to their own
    // performance via Today, not a "Talk to your manager" deflection.
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Stack.Screen options={{ title: "Analytics" }} />
        <Text style={{ color: colors.text, fontWeight: "600", fontSize: 18 }}>
          Your performance lives on Today
        </Text>
        <Text
          style={{
            color: colors.muted,
            marginTop: 6,
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          Personal stats and your queue are on the Today tab. Owners and
          managers see business-wide analytics here.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen
        options={{
          title: "Analytics",
          // The date range sits on the RIGHT: anything on the left replaces
          // the back button. iOS: native pull-down menu below. Android: tap
          // cycles 7 / 30 / 90 days.
          headerRight:
            Platform.OS === "ios"
              ? undefined
              : () => (
                  <HeaderIcon
                    icon={CalendarRange}
                    onPress={() => presentPeriodPicker(periodDays, pickPeriod)}
                  />
                ),
        }}
      />

      {Platform.OS === "ios" ? (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Menu icon="calendar" accessibilityLabel="Date range">
            {PERIOD_OPTIONS.map((p) => (
              <Stack.Toolbar.MenuAction
                key={p}
                isOn={p === periodDays}
                onPress={() => pickPeriod(p)}
              >
                {PERIOD_LABELS[p]}
              </Stack.Toolbar.MenuAction>
            ))}
          </Stack.Toolbar.Menu>
        </Stack.Toolbar>
      ) : null}

      <FuseTopTabs tabs={tabs} onTabChange={setActive} />
    </View>
  );
}
