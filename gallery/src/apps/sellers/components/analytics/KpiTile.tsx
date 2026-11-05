import { Pressable, Text, View } from "@/apps/sellers/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useGroupSurface } from "@/gallery/groupStyle";
import * as Haptics from "expo-haptics";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useState } from "react";
import { ChangeBadge } from "./ChangeBadge";
import { Sparkline } from "@/components/analytics/Sparkline";

const SPARK_HEIGHT = 28;

function hasMeaningfulSpark(spark: number[] | undefined): spark is number[] {
  if (!spark || spark.length < 2) return false;
  const min = Math.min(...spark);
  const max = Math.max(...spark);
  return max - min > 0;
}

// Treat anything that parses to 0 (or unparseable) as a zero-state KPI.
// Examples: "0", "€0.00", "0%", "-".
function isZeroish(value: string): boolean {
  const n = parseFloat(value.replace(/[^\d.-]/g, ""));
  return !Number.isFinite(n) || n === 0;
}

export function KpiTile({
  label,
  value,
  change,
  spark,
  symbol,
  accent,
  delay: _delay,
  onPress,
}: {
  label: string;
  value: string;
  change?: number | null;
  spark?: number[];
  symbol: SymbolViewProps["name"];
  accent: string;
  delay: number;
  onPress?: () => void;
}) {
  const colors = useThemeColors();
  const { tile } = useGroupSurface({ raised: true });
  const [w, setW] = useState(0);
  const showSpark = hasMeaningfulSpark(spark);
  // Hide the change badge when:
  //   - there's no value to compare (null / undefined)
  //   - the math gave a non-finite result (NaN / ±Infinity)
  //   - the current KPI is 0 (a 0 → 0 transition or 0 from any baseline isn't actionable)
  const showChange =
    change != null && Number.isFinite(change) && !isZeroish(value);

  return (
    <Pressable
      className="flex-1"
      onPress={
        onPress
          ? () => {
              Haptics.selectionAsync().catch(() => {});
              onPress();
            }
          : undefined
      }
      style={({ pressed }) => ({
        opacity: pressed && onPress ? 0.55 : 1,
      })}
    >
      <View
        className="p-3.5"
        style={tile(16)}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View
            className="w-7 h-7 rounded-lg items-center justify-center"
            style={{ backgroundColor: accent + "1A" }}
          >
            <SymbolView
              name={symbol}
              size={14}
              tintColor={accent}
              weight="semibold"
            />
          </View>
          {showChange ? <ChangeBadge change={change!} /> : null}
        </View>

        <Text
          weight="bold"
          className="text-text"
          style={{
            fontSize: 22,
            letterSpacing: -0.6,
            fontVariant: ["tabular-nums"],
          }}
          numberOfLines={1}
        >
          {value}
        </Text>
        <Text
          className="text-[11px] mt-0.5"
          style={{ color: colors.muted }}
          numberOfLines={1}
        >
          {label}
        </Text>

        {showSpark ? (
          <View
            onLayout={(e) => setW(e.nativeEvent.layout.width)}
            className="mt-2"
            style={{ height: SPARK_HEIGHT }}
          >
            <Sparkline values={spark!} width={w} color={accent} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
