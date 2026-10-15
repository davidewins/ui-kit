// Status pills lifted out of their apps, markup unchanged:
// - AdminTintPill: ADMIN src/components/intel/primitives.tsx (TintPill)
// - AdminDotPill: ADMIN src/redesigns/lead-detail/option-2.tsx (Pill)
// - SellersTrendChip: SELLERS src/app/(protected)/(tabs)/dashboard/index.tsx (revenue hero chip)
import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";

export function AdminTintPill({
  color,
  label,
}: {
  color: string;
  label: string;
  dot?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View
      className="flex-row items-center rounded-full px-2 py-0.5"
      style={{ backgroundColor: color }}
    >
      <Text className="text-[10px] uppercase" style={{ fontWeight: "700", color: colors.onAccent, letterSpacing: 0.4 }}>
        {label}
      </Text>
    </View>
  );
}

export function AdminDotPill({ color, children, solid }: { color: string; children: string; solid?: boolean }) {
  return (
    <View
      className="flex-row items-center gap-1 rounded-full px-2.5 py-1"
      style={{ backgroundColor: solid ? color : color + "1f" }}
    >
      <View
        style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: solid ? "#fff" : color }}
      />
      <Text
        className="text-[10px] uppercase"
        style={{ fontWeight: "700", color: solid ? "#fff" : color, letterSpacing: 0.5 }}
      >
        {children}
      </Text>
    </View>
  );
}

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
