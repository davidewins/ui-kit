// Totals per bucket: minutes per day, sales per hour, reach per post. Tap a
// bar to read it. One colour by default; give a bar its own colour only when
// the colour means something (a category, over a goal). For a trend use
// LineChart, for a share of a whole use DonutChart or SegmentBar.
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Pressable, View } from "react-native";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";

export interface Bar {
  label: string;
  /** null draws an empty slot (a day with nothing). */
  value: number | null;
  color?: string;
  /** Not real yet (planned, forecast): drawn as an outline. */
  muted?: boolean;
}

export interface BarChartProps {
  data: Bar[];
  height?: number;
  selected?: number;
  onSelect?: (index: number) => void;
  /** A dashed target line across the chart. */
  goal?: number;
  /** How the selected bar's value is written above it. */
  format?: (value: number) => string;
  accessibilityLabel?: string;
}

const VALUE_ROW = 18;

export function BarChart({ data, height = 140, selected, onSelect, goal, format = String, accessibilityLabel }: BarChartProps) {
  const colors = useThemeColors();
  const max = Math.max(goal ?? 0, ...data.map((d) => d.value ?? 0)) || 1;
  const plot = height - VALUE_ROW;
  return (
    <View accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <View style={{ height, flexDirection: "row", alignItems: "flex-end", columnGap: data.length > 14 ? 3 : 6 }}>
        {goal !== undefined ? (
          <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: (goal / max) * plot, borderTopWidth: 1, borderStyle: "dashed", borderColor: colors.muted }} />
        ) : null}
        {data.map((d, i) => {
          const isSelected = selected === i;
          const dim = selected !== undefined && !isSelected;
          const h = d.value === null ? 3 : Math.max(3, (d.value / max) * plot);
          const fill = d.color ?? colors.text;
          return (
            <Pressable
              key={`${d.label}${i}`}
              disabled={!onSelect}
              onPress={() => {
                Haptics.selectionAsync().catch(() => {});
                onSelect?.(i);
              }}
              accessibilityRole={onSelect ? "button" : undefined}
              accessibilityLabel={`${d.label}, ${d.value === null ? "none" : format(d.value)}`}
              style={{ flex: 1, height, justifyContent: "flex-end", alignItems: "center" }}
            >
              {isSelected && d.value !== null ? (
                <View pointerEvents="none" style={{ position: "absolute", bottom: h + 4, left: -40, right: -40, alignItems: "center" }}>
                  <Text weight="semibold" numberOfLines={1} style={[TYPE.caption, TABULAR]}>
                    {format(d.value)}
                  </Text>
                </View>
              ) : null}
              <View
                style={{
                  alignSelf: "stretch",
                  height: h,
                  borderRadius: Math.min(6, h / 2),
                  borderCurve: "continuous",
                  backgroundColor: d.value === null ? colors.border : d.muted ? "transparent" : fill,
                  borderWidth: d.muted ? 1.5 : 0,
                  borderStyle: d.muted ? "dashed" : "solid",
                  borderColor: colors.muted,
                  opacity: dim ? 0.3 : 1,
                }}
              />
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", columnGap: data.length > 14 ? 3 : 6, marginTop: 6 }}>
        {data.map((d, i) => (
          <Text
            key={`${d.label}${i}`}
            weight={selected === i ? "semibold" : "medium"}
            numberOfLines={1}
            style={[TYPE.caption, { flex: 1, textAlign: "center", color: selected === i ? colors.text : colors.muted }]}
          >
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}
