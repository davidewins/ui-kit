import { View } from "@/apps/sellers/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";

export function ProductBar({
  pct,
  color,
  height = 6,
  mt = 12,
}: {
  pct: number;
  delay?: number;
  color?: string;
  height?: number;
  mt?: number;
}) {
  const colors = useThemeColors();
  return (
    <View
      className="rounded-full overflow-hidden"
      style={{ backgroundColor: colors.border, height, marginTop: mt }}
    >
      <View
        style={{
          height: "100%",
          backgroundColor: color ?? colors.tint,
          borderRadius: 999,
          width: `${Math.min(100, Math.max(0, pct))}%`,
        }}
      />
    </View>
  );
}
