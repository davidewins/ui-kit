import { Text, View } from "@/apps/sellers/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { SymbolView } from "expo-symbols";

export function ChangeBadge({
  change,
  invertColor = false,
}: {
  change: number;
  invertColor?: boolean;
}) {
  const colors = useThemeColors();
  const directionUp = change >= 0;
  const isGood = invertColor ? !directionUp : directionUp;
  const fg = isGood ? colors.success : colors.error;
  const bg = isGood ? colors.successBg : colors.errorBg;
  return (
    <View
      className="flex-row items-center gap-0.5 px-2 py-1 rounded-full"
      style={{ backgroundColor: bg }}
    >
      <SymbolView
        name={directionUp ? "arrow.up.right" : "arrow.down.right"}
        size={10}
        tintColor={fg}
        weight="bold"
        fallback={
          <Text style={{ color: fg }} weight="bold" className="text-[10px]">
            {directionUp ? "↑" : "↓"}
          </Text>
        }
      />
      <Text weight="semibold" className="text-[11px]" style={{ color: fg }}>
        {Math.abs(change).toFixed(1)}%
      </Text>
    </View>
  );
}
