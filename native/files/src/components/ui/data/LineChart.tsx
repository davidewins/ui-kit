// A trend over time: one smoothed line (optionally filled underneath), plus
// optional comparison lines. Drag or tap to read a point. For a single tiny
// trend inside a row use Sparkline; for totals per bucket use BarChart.
// Drawn with react-native-svg so it is the same on iOS, Android and web.
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { useId, useMemo, useRef, useState } from "react";
import { type GestureResponderEvent, View } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";
import { Text } from "../primitives/Text";
import { TYPE } from "../primitives/type";

export interface LineSeries {
  values: number[];
  /** Defaults to the text colour. */
  color?: string;
  /** A comparison line (last period, a target). */
  dashed?: boolean;
}

export interface LineChartProps {
  /** The first series is the main one: it gets the fill and the marker. */
  series: LineSeries[];
  height?: number;
  /** Axis labels spread evenly under the chart (first, middle, last...). */
  labels?: string[];
  /** Fill under the main line. */
  area?: boolean;
  /** Index of the point being read. */
  selected?: number;
  onSelect?: (index: number) => void;
  accessibilityLabel?: string;
}

const PAD_TOP = 10;
const PAD_BOTTOM = 6;

export function LineChart({ series, height = 160, labels, area = false, selected, onSelect, accessibilityLabel }: LineChartProps) {
  const colors = useThemeColors();
  const [width, setWidth] = useState(0);
  const gradientId = useId().replace(/:/g, "");
  const last = useRef<number | undefined>(undefined);
  const main = series[0];
  const count = main?.values.length ?? 0;

  const geo = useMemo(() => {
    if (!main || count < 2 || width <= 0) return null;
    const all = series.flatMap((s) => s.values);
    const min = Math.min(...all);
    const max = Math.max(...all);
    const span = max - min || 1;
    const lo = min - span * 0.08;
    const hi = max + span * 0.04;
    const usable = height - PAD_TOP - PAD_BOTTOM;
    const x = (i: number, n: number) => (i / (n - 1)) * width;
    const y = (v: number) => PAD_TOP + usable - ((v - lo) / (hi - lo)) * usable;
    const path = (values: number[]) =>
      values
        .map((v, i) => {
          const px = x(i, values.length);
          const py = y(v);
          if (i === 0) return `M${px} ${py}`;
          const prevX = x(i - 1, values.length);
          const cx = (prevX + px) / 2;
          return `C${cx} ${y(values[i - 1])} ${cx} ${py} ${px} ${py}`;
        })
        .join(" ");
    return { x, y, paths: series.map((s) => path(s.values)) };
  }, [series, main, count, width, height]);

  const read = (e: GestureResponderEvent) => {
    if (!onSelect || width <= 0 || count < 2) return;
    const i = Math.max(0, Math.min(count - 1, Math.round((e.nativeEvent.locationX / width) * (count - 1))));
    if (i !== last.current) {
      last.current = i;
      Haptics.selectionAsync().catch(() => {});
      onSelect(i);
    }
  };

  const mainColor = main?.color ?? colors.text;
  const marker = selected ?? count - 1;

  return (
    <View accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      <View
        style={{ height }}
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => !!onSelect}
        onResponderGrant={read}
        onResponderMove={read}
        onResponderRelease={() => {
          last.current = undefined;
        }}
      >
        {geo ? (
          <Svg width={width} height={height} pointerEvents="none">
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={mainColor} stopOpacity={0.28} />
                <Stop offset="1" stopColor={mainColor} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            {[0, 0.5, 1].map((f) => {
              const gy = PAD_TOP + (height - PAD_TOP - PAD_BOTTOM) * f;
              return <Line key={f} x1={0} x2={width} y1={gy} y2={gy} stroke={colors.border} strokeWidth={1} />;
            })}
            {area ? <Path d={`${geo.paths[0]} L${width} ${height} L0 ${height} Z`} fill={`url(#${gradientId})`} /> : null}
            {series.map((s, i) =>
              i === 0 ? null : (
                <Path key={i} d={geo.paths[i]} fill="none" stroke={s.color ?? colors.muted} strokeWidth={1.6} strokeDasharray={s.dashed ? "4 5" : undefined} strokeLinecap="round" />
              ),
            )}
            <Path d={geo.paths[0]} fill="none" stroke={mainColor} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" />
            {selected !== undefined ? (
              <Line x1={geo.x(marker, count)} x2={geo.x(marker, count)} y1={0} y2={height} stroke={colors.muted} strokeWidth={1} strokeDasharray="2 4" />
            ) : null}
            <Circle cx={Math.min(width - 5, Math.max(5, geo.x(marker, count)))} cy={geo.y(main.values[marker])} r={5} fill={mainColor} stroke={colors.background} strokeWidth={2.5} />
          </Svg>
        ) : null}
      </View>
      {labels?.length ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
          {labels.map((l, i) => (
            <Text key={`${l}${i}`} weight="medium" style={[TYPE.caption, { color: colors.muted }]}>
              {l}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
