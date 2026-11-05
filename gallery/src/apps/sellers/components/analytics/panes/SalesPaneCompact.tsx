// Analytics → Sales (Compact "Dense operator").
// Ported from src/redesigns/analytics/option-1.tsx, wired to REAL data:
//   - useAnalyticsRevenue  → headline figure, KPI rows, top sellers, peak hours
//   - useAnalyticsChannels → channel mix bars
// Taste anchor: TKVR today/index.tsx + bfi-10-results.tsx - big tabular-nums
// hero, restrained inset-grouped rows, token-only fill bars (the BFI domain
// `h-2 bg-border` → `bg-primary` fill pattern), one Skia trend line up top.
//
// All chart colours are theme tokens (tint/success/info), never raw hex.
// Period filter is owned by the host (analytics/index.tsx) via the period
// store; this pane re-renders when the period changes.

import { AreaChart } from "@/apps/sellers/components/analytics/AreaChart";
import { alpha } from "@/apps/sellers/components/analytics/utils";
import { EmptyState, Pressable, ScrollView, SectionTitle, Text, View } from "@/apps/sellers/components/ui";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";
import { useAnalyticsChannels } from "@/apps/sellers/hooks/useAnalyticsChannels";
import { useAnalyticsRevenue } from "@/apps/sellers/hooks/useAnalyticsRevenue";
import { useThemeColors } from "@/hooks/useThemeColors";
import { LoadErrorState } from "@/components/LoadErrorState";
import { useGroupSurface } from "@/gallery/groupStyle";
import { useAnalyticsPeriodStore } from "@/apps/sellers/stores/analyticsPeriodStore";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react-native";

function eur(cents: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

function eurWhole(cents: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

// ── Delta pill ──────────────────────────────────────────────────────────────
// Inline +/-% with token success/error. Used in the hero and KPI rows.
function DeltaPill({ delta }: { delta: number | null }) {
  const colors = useThemeColors();
  if (delta === null) return null;
  const up = delta >= 0;
  const tint = up ? colors.success : colors.error;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <View className="flex-row items-center gap-0.5">
      <Icon size={12} color={tint} strokeWidth={2.4} />
      <Text
        weight="semibold"
        className="text-[12px]"
        style={{ color: tint, fontVariant: ["tabular-nums"] }}
      >
        {Math.abs(delta).toFixed(0)}%
      </Text>
    </View>
  );
}

function GroupBlock({ children }: { children: React.ReactNode }) {
  const { paddedCard } = useGroupSurface({ raised: true });
  return (
    <View style={paddedCard(18)}>
      {children}
    </View>
  );
}

function Sep() {
  const colors = useThemeColors();
  return (
    <View
      style={{ height: 1, backgroundColor: colors.border }}
    />
  );
}

export function SalesPaneCompact() {
  const colors = useThemeColors();
  const { paddedCard, titleInset } = useGroupSurface({ raised: true });
  const periodDays = useAnalyticsPeriodStore((s) => s.periodDays);
  const { data, isLoading, error, refetch } = useAnalyticsRevenue();
  const { data: channelData } = useAnalyticsChannels();

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (isLoading && !data) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 48 }}
      >
        <View className="px-5 gap-3">
          <SkeletonBlock width={150} height={11} />
          <SkeletonBlock width={200} height={36} />
          <SkeletonBlock width="100%" height={96} radius={12} />
        </View>
        <View className="px-4 mt-8 gap-2">
          <SkeletonBlock width="100%" height={46} radius={18} />
          <SkeletonBlock width="100%" height={120} radius={18} />
        </View>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <LoadErrorState
        title="Couldn't load sales"
        message="You may be offline."
        onRetry={() => refetch()}
      />
    );
  }

  const stats = data!;
  const hasData = stats.weekRevenue.some((v) => v > 0);

  if (!hasData) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          art={{ image: require("@/apps/sellers/assets/images/empty/rising-chart.png") }}
          title="No sales yet"
          body="Once orders come in, you'll see revenue, top products and peak hours here."
        />
      </View>
    );
  }

  // ── Derived figures (all from real fields) ─────────────────────────────────
  const periodRevenueCents = stats.weekRevenue.reduce((a, v) => a + v, 0);
  const aovCents = stats.aovCents;

  // KPI rows - value + delta, drawn from the same fields the tile grid used.
  const kpiRows: {
    label: string;
    value: string;
    delta: number | null;
  }[] = [
    {
      label: "Orders",
      value: String(stats.ordersCount),
      delta: stats.ordersChangePct,
    },
    {
      label: "Avg order",
      value: eur(stats.aovCents),
      delta: stats.aovChangePct,
    },
    {
      label: "Customers",
      value: String(stats.customersCount),
      delta: stats.customersChangePct,
    },
    {
      label: "Refunds",
      value: String(stats.refundsCount),
      delta: stats.refundsChangePct,
    },
  ];

  const topSellers = stats.topProducts.slice(0, 5);
  const sellerMax = Math.max(...topSellers.map((p) => p.sold), 1);

  const peakHours = stats.peakHours.filter(() => true);
  const peakMax = Math.max(...peakHours.map((h) => h.count), 1);
  const hasPeak = stats.peakHours.some((h) => h.count > 0);

  // Channel mix - real cents from useAnalyticsChannels, rendered as % bars.
  const channelTotal = channelData?.totalCents ?? 0;
  const channelMix =
    channelData && channelTotal > 0
      ? [
          {
            label: "Own site",
            cents: channelData.channels.storefront.cents,
            color: colors.success,
          },
          {
            label: "POS",
            cents: channelData.channels.pos.cents,
            color: colors.tint,
          },
          {
            label: "QR",
            cents: channelData.channels.qr.cents,
            color: colors.warning,
          },
          {
            label: "Marketplace",
            cents: channelData.channels.marketplace.cents,
            color: colors.muted,
          },
        ].filter((c) => c.cents > 0)
      : [];

  // Period subline - "287 orders · €41.60 average" energy.
  const periodSub = `${stats.ordersCount} ${
    stats.ordersCount === 1 ? "order" : "orders"
  } · ${eur(aovCents)} average`;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingBottom: 48 }}
    >
      {/* ── Headline figure + Skia trend ──────────────────────────────────── */}
      <View className="px-4 pt-3 border-b border-border pb-4">
        <Text className="text-[15px]" style={{ color: colors.muted, lineHeight: 20 }}>
          Revenue, last {periodDays} days
        </Text>
        <View className="flex-row items-baseline gap-2 mt-1">
          <Text
            weight="bold"
            className="text-[34px] text-text"
            style={{ letterSpacing: -1, fontVariant: ["tabular-nums"] }}
          >
            {eurWhole(periodRevenueCents)}
          </Text>
          <DeltaPill delta={stats.changePct} />
        </View>
        <Text className="text-[13px] mt-0.5" style={{ color: colors.muted }}>
          {periodSub}
        </Text>

        <View style={{ marginTop: 12, marginHorizontal: -4 }}>
          <AreaChart
            values={stats.weekRevenue}
            color={colors.success}
            height={96}
          />
        </View>
        <View
          className="flex-row justify-between mt-1"
          style={{ marginHorizontal: 4 }}
        >
          {stats.periodDays === 7 ? (
            ["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <Text
                key={i}
                className="text-[10px]"
                style={{ color: colors.muted }}
              >
                {d}
              </Text>
            ))
          ) : (
            <>
              <Text className="text-[10px]" style={{ color: colors.muted }}>
                {periodDays}d ago
              </Text>
              <Text className="text-[10px]" style={{ color: colors.muted }}>
                today
              </Text>
            </>
          )}
        </View>
      </View>

      {/* ── Key metrics - dense KPI rows ──────────────────────────────────── */}
      <SectionTitle inset={titleInset}>Key Metrics</SectionTitle>
      <GroupBlock>
        {kpiRows.map((m, i) => (
          <View key={m.label}>
            <View
              className="flex-row items-center justify-between"
              style={{ minHeight: 46, paddingVertical: 10 }}
            >
              <Text className="text-[15px] text-text">{m.label}</Text>
              <View className="flex-row items-center gap-3">
                <Text
                  weight="semibold"
                  className="text-[15px] text-text"
                  style={{ fontVariant: ["tabular-nums"] }}
                >
                  {m.value}
                </Text>
                <View style={{ width: 48, alignItems: "flex-end" }}>
                  <DeltaPill delta={m.delta} />
                </View>
              </View>
            </View>
            {i === kpiRows.length - 1 ? null : <Sep />}
          </View>
        ))}
      </GroupBlock>

      {/* ── Top sellers - ranked rows with proportional sold-volume bar ───── */}
      {topSellers.length > 0 ? (
        <>
          <SectionTitle inset={titleInset}>Top Sellers</SectionTitle>
          <GroupBlock>
            {topSellers.map((p, i) => (
              <View key={p.id}>
                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync().catch(() => {});
                    router.push(`/screens/selling/product/${p.id}`);
                  }}
                  className=" active:bg-surface-elevated"
                  style={{ minHeight: 46, paddingVertical: 9 }}
                >
                  <View className="flex-row items-center">
                    <Text
                      weight="bold"
                      className="text-[13px]"
                      style={{
                        color: colors.muted,
                        width: 22,
                        fontVariant: ["tabular-nums"],
                      }}
                    >
                      {i + 1}
                    </Text>
                    <View className="flex-1 pr-2">
                      <Text
                        weight="medium"
                        className="text-[15px] text-text"
                        numberOfLines={1}
                      >
                        {p.name}
                      </Text>
                      <Text
                        className="text-[12px] mt-0.5"
                        style={{ color: colors.muted }}
                      >
                        {eur(p.revenue)}
                      </Text>
                    </View>
                    <Text
                      weight="semibold"
                      className="text-[15px] text-text"
                      style={{ fontVariant: ["tabular-nums"] }}
                    >
                      {p.sold}
                    </Text>
                    <Text
                      className="text-[12px] ml-1"
                      style={{ color: colors.muted }}
                    >
                      sold
                    </Text>
                  </View>
                  {/* proportional bar - token tint fill on border track */}
                  <View
                    className="mt-2 ml-[22px]"
                    style={{
                      height: 4,
                      borderRadius: 2,
                      backgroundColor: colors.border,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: `${Math.max(6, (p.sold / sellerMax) * 100)}%`,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: colors.tint,
                      }}
                    />
                  </View>
                </Pressable>
                {i === topSellers.length - 1 ? null : <Sep />}
              </View>
            ))}
          </GroupBlock>
        </>
      ) : null}

      {/* ── Peak hours - inline token bars ────────────────────────────────── */}
      {hasPeak ? (
        <>
          <SectionTitle inset={titleInset}>Peak Hours</SectionTitle>
          <View className="pt-4 pb-3" style={paddedCard(18)}>
            <View
              className="flex-row items-end justify-between"
              style={{ height: 84 }}
            >
              {peakHours.map((h, i) => {
                const isPeak = h.count === peakMax && h.count > 0;
                return (
                  <View key={`${h.hour}-${i}`} className="flex-1 items-center">
                    <View
                      style={{
                        width: "62%",
                        height: Math.max(4, (h.count / peakMax) * 76),
                        borderRadius: 3,
                        backgroundColor: isPeak
                          ? colors.tint
                          : colors.tint + alpha(0.2),
                      }}
                    />
                  </View>
                );
              })}
            </View>
            <View className="flex-row justify-between mt-2">
              {peakHours.map((h, i) => (
                <Text
                  key={`${h.hour}-label-${i}`}
                  className="flex-1 text-center text-[10px]"
                  style={{
                    color: colors.muted,
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {h.hour.slice(0, 2)}
                </Text>
              ))}
            </View>
            <Text
              className="text-[12px] mt-2"
              style={{ color: colors.muted }}
            >
              Busiest at {stats.peakHourLabel}
            </Text>
          </View>
        </>
      ) : null}

      {/* ── Channel mix - real cents → % token bars ───────────────────────── */}
      {channelMix.length > 0 ? (
        <>
          <SectionTitle inset={titleInset}>Channel Mix</SectionTitle>
          <GroupBlock>
            {channelMix.map((ch, i) => {
              const pct = Math.round((ch.cents / channelTotal) * 100);
              return (
                <View key={ch.label}>
                  <View

                    style={{
                      minHeight: 46,
                      paddingVertical: 11,
                      justifyContent: "center",
                    }}
                  >
                    <View className="flex-row items-center justify-between mb-1.5">
                      <View className="flex-row items-center gap-2">
                        <View
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: ch.color }}
                        />
                        <Text className="text-[15px] text-text">
                          {ch.label}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Text
                          className="text-[13px]"
                          style={{
                            color: colors.muted,
                            fontVariant: ["tabular-nums"],
                          }}
                        >
                          {eurWhole(ch.cents)}
                        </Text>
                        <Text
                          weight="semibold"
                          className="text-[14px] text-text"
                          style={{ fontVariant: ["tabular-nums"] }}
                        >
                          {pct}%
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: colors.border,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          width: `${Math.max(2, pct)}%`,
                          height: 5,
                          borderRadius: 3,
                          backgroundColor: ch.color,
                        }}
                      />
                    </View>
                  </View>
                  {i === channelMix.length - 1 ? null : <Sep />}
                </View>
              );
            })}
          </GroupBlock>
        </>
      ) : null}

      {/* ── Fulfillment mix - real percentage from revenue RPC ────────────── */}
      {stats.fulfillmentMix.length > 0 ? (
        <>
          <SectionTitle inset={titleInset}>Fulfillment</SectionTitle>
          <GroupBlock>
            {stats.fulfillmentMix.map((f, i) => (
              <View key={f.type}>
                <View

                  style={{
                    minHeight: 46,
                    paddingVertical: 11,
                    justifyContent: "center",
                  }}
                >
                  <View className="flex-row items-center justify-between mb-1.5">
                    <Text className="text-[15px] text-text">{f.type}</Text>
                    <View className="flex-row items-center gap-2">
                      <Text
                        className="text-[13px]"
                        style={{
                          color: colors.muted,
                          fontVariant: ["tabular-nums"],
                        }}
                      >
                        {eurWhole(f.amount)}
                      </Text>
                      <Text
                        weight="semibold"
                        className="text-[14px] text-text"
                        style={{ fontVariant: ["tabular-nums"] }}
                      >
                        {Math.round(f.percentage)}%
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      height: 5,
                      borderRadius: 3,
                      backgroundColor: colors.border,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: `${Math.max(2, Math.round(f.percentage))}%`,
                        height: 5,
                        borderRadius: 3,
                        backgroundColor: colors.foreground,
                      }}
                    />
                  </View>
                </View>
                {i === stats.fulfillmentMix.length - 1 ? null : <Sep />}
              </View>
            ))}
          </GroupBlock>
        </>
      ) : null}
    </ScrollView>
  );
}
