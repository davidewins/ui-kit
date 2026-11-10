// A share of a whole as a ring, with room in the middle for the total. Use it
// for two to six parts; more than that reads better as a BarList. Pair it
// with a legend (SegmentBar's, or your own rows) since slices carry no text.
import { useThemeColors } from "@/hooks/useThemeColors";
import type { ReactNode } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

export interface DonutSegment {
  value: number;
  color: string;
  label?: string;
}

export interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  /** Centred in the hole: the total, a label. */
  children?: ReactNode;
  accessibilityLabel?: string;
}

export function DonutChart({ segments, size = 148, thickness = 18, children, accessibilityLabel }: DonutChartProps) {
  const colors = useThemeColors();
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((n, s) => n + s.value, 0) || 1;
  // A gap between slices, taken out of each slice's own length.
  const gap = segments.length > 1 ? 3 : 0;
  let offset = 0;
  return (
    <View
      style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? segments.map((s) => `${s.label ?? ""} ${Math.round((s.value / total) * 100)}%`).join(", ")}
    >
      <Svg width={size} height={size} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.border} strokeWidth={thickness} fill="none" />
        {segments.map((s, i) => {
          const length = (s.value / total) * c;
          const dash = Math.max(0, length - gap);
          const el = (
            <Circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={s.color}
              strokeWidth={thickness}
              fill="none"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += length;
          return el;
        })}
      </Svg>
      {children}
    </View>
  );
}
