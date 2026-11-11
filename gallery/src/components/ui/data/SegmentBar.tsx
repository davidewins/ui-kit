// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/data/SegmentBar.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A whole split into parts along one bar, with a legend that carries the
// numbers: sales by channel, macros, storage, time in heart-rate zones.
// Takes less room than a DonutChart and compares parts better.
import { View } from "react-native";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";

export interface Segment {
  value: number;
  color: string;
  label: string;
  /** Written in the legend instead of the percentage ("€1,240", "42 min"). */
  display?: string;
}

export interface SegmentBarProps {
  segments: Segment[];
  height?: number;
  /** Dot, label and figure per part under the bar. */
  legend?: boolean;
  accessibilityLabel?: string;
}

export function SegmentBar({ segments, height = 12, legend = true, accessibilityLabel }: SegmentBarProps) {
  const total = segments.reduce((n, s) => n + s.value, 0) || 1;
  const figure = (s: Segment) => s.display ?? `${Math.round((s.value / total) * 100)}%`;
  return (
    <View accessibilityRole="image" accessibilityLabel={accessibilityLabel ?? segments.map((s) => `${s.label} ${figure(s)}`).join(", ")}>
      <View style={{ flexDirection: "row", height, columnGap: 2, borderRadius: height / 2, overflow: "hidden" }}>
        {/* Destructured on purpose: Reanimated's Babel plugin warns on any
            `x.value` written inside an inline style, shared value or not. */}
        {segments.map(({ label, value, color }) => (
          <View key={label} style={{ flex: value, minWidth: 2, backgroundColor: color }} />
        ))}
      </View>
      {legend ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 16, rowGap: 6, marginTop: 10 }}>
          {segments.map((s) => (
            <View key={s.label} style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: s.color }} />
              <Text weight="medium" style={[TYPE.sub, TABULAR]}>
                {`${s.label} ${figure(s)}`}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
