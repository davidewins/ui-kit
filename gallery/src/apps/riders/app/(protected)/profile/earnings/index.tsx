import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useGroupSurface } from "@/gallery/groupStyle";
import { getEarnings } from "@/apps/riders/services/api";
import Logger from "@/lib/Logger";
import RNSegmentedControl, {
  type SegmentedControlProps,
} from "@react-native-segmented-control/segmented-control";
import * as Haptics from "expo-haptics";
import { useColorScheme } from "react-native";
import {
  Bike,
  Gift,
  HandCoins,
  PiggyBank,
  Wallet,
} from "lucide-react-native";
import React, { ComponentType, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// Gallery: the library's class typing breaks under RN 0.88 types; same component.
const SegmentedControl = RNSegmentedControl as unknown as React.ComponentType<SegmentedControlProps>;

type Period = "week" | "month" | "all";

const PERIODS: Period[] = ["week", "month", "all"];
const LABELS = ["This Week", "This Month", "All Time"];

interface EarningsData {
  period: string;
  deliveryCount: number;
  baseFeeCents: number;
  tipsCents: number;
  bonusesCents: number;
  totalCents: number;
}

const NUM = { fontVariant: ["tabular-nums" as const] };

const fmt = (cents: number) => `€${(cents / 100).toFixed(2)}`;

type LucideIcon = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const colors = useThemeColors();
  const { cardInGutter, titlePadInGutter } = useGroupSurface();
  const items = React.Children.toArray(children);
  return (
    <View className="mb-7">
      <Text
        weight="semibold"
        className="text-[13px] text-muted tracking-tight mb-2"
        style={{ paddingHorizontal: titlePadInGutter }}
      >
        {label}
      </Text>
      <View style={cardInGutter(16)}>
        {items.map((child, i) => (
          <React.Fragment key={i}>
            {i > 0 ? (
              <View
                style={{
                  height: StyleSheet.hairlineWidth,
                  backgroundColor: colors.separator,
                  marginLeft: 52,
                }}
              />
            ) : null}
            {child}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

/** Label on the left behind its icon, money on the right. */
function AmountRow({
  Icon,
  label,
  value,
}: {
  Icon: LucideIcon;
  label: string;
  value: string;
}) {
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center gap-3 px-4 py-3.5">
      <View style={{ width: 24, alignItems: "center" }}>
        <Icon size={19} color={colors.muted} strokeWidth={2} />
      </View>
      <Text className="flex-1 text-[15px] leading-snug tracking-tight text-text">
        {label}
      </Text>
      <Text weight="medium" className="text-[15px] tracking-tight text-text" style={NUM}>
        {value}
      </Text>
    </View>
  );
}

export default function EarningsScreen() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const { cardInGutter } = useGroupSurface();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);

  const period = PERIODS[selectedIndex];

  useEffect(() => {
    let active = true;
    setLoading(true);
    getEarnings(period)
      .then((res) => { if (active) setData(res); })
      .catch((err) => Logger.error("[Earnings] Failed to fetch:", err))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [period]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <SegmentedControl
        values={LABELS}
        selectedIndex={selectedIndex}
        onChange={(e) => {
          Haptics.selectionAsync();
          setSelectedIndex(e.nativeEvent.selectedSegmentIndex);
        }}
        appearance={colorScheme === "dark" ? "dark" : "light"}
        style={{ marginBottom: 20, height: 44 }}
      />

      {loading ? (
        <View className="py-20 items-center">
          <ActivityIndicator color={colors.text} />
        </View>
      ) : data ? (
        <Animated.View entering={FadeIn.duration(180)}>
          {/* Headline total - the one number this screen exists for. */}
          <View className="px-4 py-5 mb-7" style={cardInGutter(16)}>
            <Text
              weight="bold"
              className="mt-1"
              style={[NUM, { fontSize: 40, letterSpacing: -1.2 }]}
            >
              {fmt(data.totalCents)}
            </Text>
            <View className="flex-row items-center gap-1.5 mt-1">
              <Bike size={14} color={colors.muted} strokeWidth={2} />
              <Text className="text-muted text-[13px] tracking-tight" style={NUM}>
                {data.deliveryCount}{" "}
                {data.deliveryCount === 1 ? "delivery" : "deliveries"}
              </Text>
            </View>
          </View>

          <Section label="Breakdown">
            <AmountRow
              Icon={Bike}
              label="Base delivery fees"
              value={fmt(data.baseFeeCents)}
            />
            <AmountRow
              Icon={HandCoins}
              label="Tips"
              value={fmt(data.tipsCents)}
            />
            <AmountRow
              Icon={Gift}
              label="Bonuses"
              value={fmt(data.bonusesCents)}
            />
            {/* Total closes the stub - no glyph, so it reads as a sum and not
                as one more line item. */}
            <View className="flex-row items-center px-4 py-3.5">
              <Text
                weight="bold"
                style={[NUM, { fontSize: 20, letterSpacing: -0.4 }]}
              >
                {fmt(data.totalCents)}
              </Text>
            </View>
          </Section>

          <View className="flex-row items-start gap-2 px-2">
            <PiggyBank
              size={14}
              color={colors.muted}
              strokeWidth={2}
              style={{ marginTop: 2 }}
            />
            <Text className="flex-1 text-muted text-xs leading-snug">
              Payouts are processed via Stripe Connect to your linked bank
              account.
            </Text>
          </View>
        </Animated.View>
      ) : (
        <View className="py-20 items-center px-8">
          <Wallet size={28} color={colors.muted} strokeWidth={1.8} />
          <Text weight="semibold" className="text-base mt-3">
            Couldn&apos;t load earnings
          </Text>
          <Text className="text-muted text-sm text-center mt-1 leading-snug">
            Check your connection and try again.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
