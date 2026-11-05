// Analytics → Customers. Wired against useAnalyticsCustomers: total /
// new this week / repeat rate / lifetime, retention curve over 12 weeks,
// top spenders. Top spender names are obfuscated to "Customer XXXX" until
// the CRM module is enabled (CRM owns customer profile lookup).

import { AreaChart } from "@/apps/sellers/components/analytics/AreaChart";
import { KpiTile } from "@/apps/sellers/components/analytics/KpiTile";
import { EmptyState, Pressable, ScrollView, SectionTitle, Text, View } from "@/apps/sellers/components/ui";
import { Button } from "@/components/ui/actions/Button";
import { SkeletonBlock } from "@/components/ui/feedback/SkeletonBlock";
import { useAnalyticsCustomers } from "@/apps/sellers/hooks/useAnalyticsCustomers";
import { useCurrentVendorId } from "@/apps/sellers/hooks/useCurrentVendor";
import { useThemeColors } from "@/hooks/useThemeColors";
import { LoadErrorState } from "@/components/LoadErrorState";
import { useGroupSurface } from "@/gallery/groupStyle";
import { useVendorModules } from "@/apps/sellers/hooks/useVendorModules";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";

function eur(cents: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function CustomersPane() {
  const colors = useThemeColors();
  const { cardInGutter, titlePadInGutter } = useGroupSurface({ raised: true });
  const { data: vendorId } = useCurrentVendorId();
  const { data: modules } = useVendorModules(vendorId);
  const crmEnabled = (modules ?? []).some(
    (m) =>
      m.module_key === "customer_crm" &&
      (m.status === "enabled" || m.status === "setup_pending"),
  );

  const { data, isLoading, error, refetch } = useAnalyticsCustomers();

  if (isLoading && !data) {
    return (
      <ScrollView
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 32, gap: 16 }}
      >
        <View className="px-4">
          <View
            className="px-4 py-4 gap-3"
            style={cardInGutter(16)}
          >
            <SkeletonBlock width={100} height={11} />
            <SkeletonBlock width={140} height={28} />
            <SkeletonBlock width="100%" height={100} radius={12} />
          </View>
        </View>
        <View className="px-4 flex-row gap-2">
          <SkeletonBlock width="48%" height={92} radius={16} />
          <SkeletonBlock width="48%" height={92} radius={16} />
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
        title="Couldn't load customers"
        message="You may be offline."
        onRetry={() => refetch()}
      />
    );
  }

  const stats = data!;

  if (stats.totalCustomers === 0) {
    return (
      <View className="flex-1 bg-background">
        <EmptyState
          art={{ image: require("@/apps/sellers/assets/images/empty/people.png") }}
          title="No customers yet"
          body="Once people start ordering, you'll see retention, repeat rate and top spenders here."
        />
      </View>
    );
  }

  const retentionThisMonth =
    stats.retentionCurve.length > 0
      ? stats.retentionCurve[stats.retentionCurve.length - 1]
      : 0;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingTop: 12, paddingBottom: 32, gap: 16 }}
    >
      <View className="px-4">
        <View
          className="px-4 py-4"
          style={cardInGutter(16)}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text
                className="text-[13px]"
                style={{ color: colors.muted, lineHeight: 17 }}
              >
                Retention
              </Text>
              <Text
                weight="bold"
                className="tracking-tight text-text mt-1"
                style={{
                  fontSize: 28,
                  letterSpacing: -0.8,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {retentionThisMonth}%
              </Text>
              <Text className="text-xs text-muted mt-0.5">
                Customers who came back this month
              </Text>
            </View>
          </View>
          {stats.retentionCurve.length > 0 ? (
            <View style={{ marginTop: 10, marginHorizontal: -4 }}>
              <AreaChart
                values={stats.retentionCurve}
                color={colors.tint}
                height={100}
                fillTopOpacity={0.28}
              />
            </View>
          ) : null}
        </View>
      </View>

      <View className="px-4 flex-row" style={{ gap: 8 }}>
        <KpiTile
          label="Total customers"
          value={String(stats.totalCustomers)}
          symbol="person.2"
          accent={colors.tint}
          delay={0}
        />
        <KpiTile
          label="New this week"
          value={String(stats.newThisWeek)}
          change={stats.newChangePct}
          spark={stats.newSpark}
          symbol="person.badge.plus"
          accent={colors.success}
          delay={50}
        />
      </View>
      <View className="px-4 flex-row" style={{ gap: 8 }}>
        <KpiTile
          label="Repeat rate"
          value={`${stats.repeatRatePct}%`}
          symbol="arrow.clockwise"
          accent={colors.success}
          delay={100}
        />
        <KpiTile
          label="Avg lifetime"
          value={eur(stats.avgLifetimeCents)}
          symbol="banknote"
          accent={colors.tint}
          delay={150}
        />
      </View>

      {stats.topSpenders.length > 0 ? (
        <View className="px-4">
          <SectionTitle inset={titlePadInGutter} style={{ marginTop: 4 }}>
            Top spenders
          </SectionTitle>
          <View style={cardInGutter(16)}>
            {stats.topSpenders.map((c, i) => (
              <Pressable
                key={c.id}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  router.push(`/customers/${c.id}`);
                }}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <View
                  className={`px-4 py-3 flex-row items-center gap-3 ${
                    i < stats.topSpenders.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <View
                    className="w-9 h-9 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.tint + "20" }}
                  >
                    <Text
                      weight="bold"
                      className="text-xs"
                      style={{ color: colors.tint }}
                    >
                      {c.initials}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text weight="medium" className="text-sm tracking-tight">
                      {c.name}
                    </Text>
                    <Text className="text-xs text-muted mt-0.5">
                      {c.visits} {c.visits === 1 ? "visit" : "visits"}
                    </Text>
                  </View>
                  <Text
                    weight="semibold"
                    className="text-sm tracking-tight"
                    style={{ fontVariant: ["tabular-nums"] }}
                  >
                    {eur(c.total)}
                  </Text>
                  <ChevronRight size={14} strokeWidth={1.8} color={colors.muted} />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View className="px-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            router.push("/customers");
          }}
        >
          Open Customers CRM
        </Button>
      </View>
      {!crmEnabled ? (
        <Text className="px-6 text-[11px] text-muted text-center">
          Top spender names are obfuscated until the CRM module is enabled.
        </Text>
      ) : null}
    </ScrollView>
  );
}
