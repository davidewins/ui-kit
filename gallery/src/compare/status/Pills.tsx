// Status chip lifted out of its app, markup unchanged:
// - SellersTrendChip: SELLERS src/app/(protected)/(tabs)/dashboard/index.tsx (revenue hero chip)
import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";

export function SellersTrendChip({ changePct }: { changePct: number }) {
  const colors = useThemeColors();
  const positive = changePct >= 0;
  const trendBg = positive ? colors.successBg : colors.errorBg;
  const trendFg = positive ? colors.success : colors.error;
  return (
    <View
      className="flex-row items-center gap-1 rounded-full px-2 py-0.5 mb-2"
      style={{ backgroundColor: trendBg, borderCurve: "continuous" }}
    >
      <Text
        weight="semibold"
        className="text-[11px]"
        style={{ color: trendFg, fontVariant: ["tabular-nums"] }}
      >
        {positive ? "↑" : "↓"} {Math.abs(changePct).toFixed(1)}% vs
        yesterday
      </Text>
    </View>
  );
}
