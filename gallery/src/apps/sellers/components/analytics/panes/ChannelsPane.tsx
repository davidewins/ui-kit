// Analytics → Channels. Wired against useAnalyticsChannels: 7-day revenue
// split across own site / POS / QR / marketplace + per-channel sparks +
// storefront leaderboard. Channel labels match the pane copy from v1.

import { Donut } from "@/apps/sellers/components/analytics/Donut";
import { KpiTile } from "@/apps/sellers/components/analytics/KpiTile";
import { StorefrontList } from "@/apps/sellers/components/analytics/StorefrontList";
import { EmptyState, ScrollView, Text, View } from "@/apps/sellers/components/ui";
import { SkeletonBlock } from "@/components/ui/feedback/SkeletonBlock";
import { useAnalyticsChannels } from "@/apps/sellers/hooks/useAnalyticsChannels";
import { useThemeColors } from "@/hooks/useThemeColors";
import { LoadErrorState } from "@/components/LoadErrorState";
import { useGroupSurface } from "@/gallery/groupStyle";
import { useAnalyticsPeriodStore } from "@/apps/sellers/stores/analyticsPeriodStore";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ChevronRight, CreditCard } from "lucide-react-native";
import { Pressable } from "react-native";

function eur(cents: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function ChannelsPane() {
  const colors = useThemeColors();
  const { cardInGutter } = useGroupSurface({ raised: true });
  const periodDays = useAnalyticsPeriodStore((s) => s.periodDays);
  const { data, isLoading, error, refetch } = useAnalyticsChannels();

  if (isLoading && !data) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 32, gap: 16 }}
      >
        <View className="px-4">
          <View
            className="px-4 py-4 flex-row items-center gap-4"
            style={cardInGutter(16)}
          >
            <SkeletonBlock width={130} height={130} radius={65} />
            <View className="flex-1 gap-3">
              <SkeletonBlock width="100%" height={14} />
              <SkeletonBlock width="100%" height={14} />
              <SkeletonBlock width="100%" height={14} />
              <SkeletonBlock width="100%" height={14} />
            </View>
          </View>
        </View>
        <View className="px-4 flex-row gap-2">
          <SkeletonBlock width="48%" height={92} radius={16} />
          <SkeletonBlock width="48%" height={92} radius={16} />
        </View>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <LoadErrorState
        title="Couldn't load channels"
        message="You may be offline."
        onRetry={() => refetch()}
      />
    );
  }

  const stats = data!;

  if (stats.totalCents === 0) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          art={{ image: require("@/apps/sellers/assets/images/empty/rising-chart.png") }}
          title="No channel data yet"
          body="As orders come in, you'll see which channels your revenue comes from."
        />
      </View>
    );
  }

  const channels = [
    { type: "Own site", cents: stats.channels.storefront.cents, color: colors.success, change: stats.channels.storefront.changePct, spark: stats.channels.storefront.spark, symbol: "globe" as const },
    { type: "POS", cents: stats.channels.pos.cents, color: colors.tint, change: stats.channels.pos.changePct, spark: stats.channels.pos.spark, symbol: "creditcard" as const },
    { type: "QR", cents: stats.channels.qr.cents, color: colors.warning, change: stats.channels.qr.changePct, spark: stats.channels.qr.spark, symbol: "qrcode" as const },
    { type: "Marketplace", cents: stats.channels.marketplace.cents, color: colors.muted, change: stats.channels.marketplace.changePct, spark: stats.channels.marketplace.spark, symbol: "cart" as const },
  ];

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingTop: 12, paddingBottom: 32, gap: 16 }}
    >
      <View className="px-4">
        <View
          className="px-4 py-4 flex-row items-center gap-4"
          style={cardInGutter(16)}
        >
          <Donut
            slices={channels.map((c) => ({
              value: c.cents,
              color: c.color,
              label: c.type,
            }))}
            size={130}
            strokeWidth={16}
            centerLabel={eur(stats.totalCents)}
            centerSublabel={`LAST ${periodDays}D`}
          />
          <View className="flex-1 gap-2">
            {channels.map((c) => {
              const pct =
                stats.totalCents > 0
                  ? ((c.cents / stats.totalCents) * 100).toFixed(0)
                  : "0";
              return (
                <View key={c.type} className="flex-row items-center gap-2">
                  <View
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <Text
                    weight="medium"
                    className="text-sm tracking-tight flex-1"
                    numberOfLines={1}
                  >
                    {c.type}
                  </Text>
                  <Text
                    weight="semibold"
                    className="text-xs"
                    style={{
                      color: colors.muted,
                      fontVariant: ["tabular-nums"],
                    }}
                  >
                    {pct}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View className="px-4 flex-row" style={{ gap: 8 }}>
        <KpiTile
          label="Own site"
          value={eur(channels[0].cents)}
          change={channels[0].change}
          spark={channels[0].spark}
          symbol={channels[0].symbol}
          accent={channels[0].color}
          delay={0}
        />
        <KpiTile
          label="POS"
          value={eur(channels[1].cents)}
          change={channels[1].change}
          spark={channels[1].spark}
          symbol={channels[1].symbol}
          accent={channels[1].color}
          delay={50}
        />
      </View>
      <View className="px-4 flex-row" style={{ gap: 8 }}>
        <KpiTile
          label="QR"
          value={eur(channels[2].cents)}
          change={channels[2].change}
          spark={channels[2].spark}
          symbol={channels[2].symbol}
          accent={channels[2].color}
          delay={100}
        />
        <KpiTile
          label="Marketplace"
          value={eur(channels[3].cents)}
          change={channels[3].change}
          spark={channels[3].spark}
          symbol={channels[3].symbol}
          accent={channels[3].color}
          delay={150}
        />
      </View>

      {stats.storefronts.length > 0 ? (
        <StorefrontList items={stats.storefronts} />
      ) : null}

      <View className="px-4">
        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            router.push("/account/payments");
          }}
          className="active:bg-surface-elevated"
          style={cardInGutter(16)}
        >
          <View className="px-4 py-3.5 flex-row items-center gap-3">
            <View
              className="w-9 h-9 rounded-xl items-center justify-center"
              style={{
                backgroundColor: colors.tint + "18",
                borderCurve: "continuous",
              }}
            >
              <CreditCard size={18} strokeWidth={1.8} color={colors.tint} />
            </View>
            <View className="flex-1">
              <Text weight="medium" className="text-base tracking-tight">
                Payouts
              </Text>
              <Text className="text-xs text-muted mt-0.5">
                Stripe Connect
              </Text>
            </View>
            <ChevronRight size={16} strokeWidth={1.8} color={colors.muted} />
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}
