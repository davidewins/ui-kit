// Analytics → Insights. Reserved for the scraped competitor module
// (feedback_analytics_vs_insights.md - Insights = competitor data, not own).
// v1 surface is honest about the wait + offers a "notify me" hook.
//
// Flow trace
//   1. User goal: see whether Insights is live and what it'll show.
//   2. State change: tapping "Notify me" fires a toast (analytics signal),
//      no DB write today.
//   3. Next: stays on Analytics → Insights pane (modal-style takeover -
//      tab bar still owns navigation).

import { InsightsHero } from "@/apps/sellers/components/landings/insights/InsightsHero";
import { ScrollView, Text, View } from "@/apps/sellers/components/ui";
import { useGroupSurface } from "@/gallery/groupStyle";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Sparkles, Star, Tags, TrendingUp } from "lucide-react-native";
import { Pressable } from "react-native";
import { Toast } from "@/lib/toast";

const ROWS = [
  {
    icon: Tags,
    title: "Price scans",
    desc: "What nearby places charge for the same dish, refreshed nightly.",
  },
  {
    icon: Star,
    title: "Rating tracking",
    desc: "Where you sit and where you're heading on each platform.",
  },
  {
    icon: TrendingUp,
    title: "Trend signals",
    desc: "Which dishes are climbing or fading in your area, week on week.",
  },
];

export function InsightsPane() {
  const colors = useThemeColors();
  const { card } = useGroupSurface({ raised: true });

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingTop: 12, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <InsightsHero />

      <View className="px-5 mt-7 mb-5">
        <View className="flex-row items-center gap-2 mb-2">
          <Sparkles size={14} color={colors.tint} strokeWidth={2} />
          <Text
            className="text-[13px] leading-[17px]"
            weight="medium"
            style={{ color: colors.tint }}
          >
            Coming soon
          </Text>
        </View>
        <Text
          weight="bold"
          className="text-[28px] tracking-tight text-text"
          style={{ letterSpacing: -0.5, lineHeight: 32 }}
        >
          Watch your local market.
        </Text>
        <Text className="text-[15px] text-muted mt-3 leading-[21px]">
          See what nearby places charge, where they're trending, and how your
          prices and reviews compare - without opening a competitor's app.
        </Text>
      </View>

      <View
        style={card(22)}
      >
        {ROWS.map((row, i) => {
          const Icon = row.icon;
          const isLast = i === ROWS.length - 1;
          return (
            <View key={row.title}>
              <View className="flex-row items-start gap-4 px-4 py-4">
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 13,
                    borderCurve: "continuous",
                    backgroundColor: colors.tint + "18",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} strokeWidth={1.8} color={colors.tint} />
                </View>
                <View className="flex-1">
                  <Text
                    weight="semibold"
                    className="text-[15px] tracking-tight text-text"
                  >
                    {row.title}
                  </Text>
                  <Text className="text-[13px] text-muted leading-[17px] mt-0.5">
                    {row.desc}
                  </Text>
                </View>
              </View>
              {!isLast && <View className="h-px bg-border mx-4" />}
            </View>
          );
        })}
      </View>

      <View className="px-4 mt-6">
        <Pressable
          onPress={() => {
            Toast.success("We'll let you know when Insights ships");
          }}
          style={({ pressed }) => ({
            backgroundColor: colors.tint,
            borderRadius: 999,
            paddingVertical: 14,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text
            weight="semibold"
            className="text-[16px] tracking-tight"
            style={{ color: colors.background }}
          >
            Notify me when it ships
          </Text>
        </Pressable>
        <Text className="text-[13px] text-muted text-center mt-3 leading-[17px]">
          Free for everyone in your launch cohort.
        </Text>
      </View>
    </ScrollView>
  );
}
