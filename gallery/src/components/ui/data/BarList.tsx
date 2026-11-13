// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/data/BarList.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A ranking: each row is a name, its figure and a bar showing its size
// against the biggest. For top products, muscle groups, traffic sources:
// anything with more parts than a DonutChart can show, or where the names
// matter more than the shape.
import { useThemeColors } from "@/hooks/useThemeColors";
import type { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";

export interface BarListItem {
  label: string;
  value: number;
  /** The figure as written ("€1,240", "12 sets"). Defaults to the value. */
  display?: string;
  /** A second, muted fact on its own line under the label ("38 sold"). */
  detail?: string;
  color?: string;
  /** A thumbnail, avatar or mark before the label. */
  leading?: ReactNode;
}

export function BarList({ items, max, color }: { items: BarListItem[]; max?: number; color?: string }) {
  const colors = useThemeColors();
  const top = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <View style={{ rowGap: 14 }}>
      {items.map((item, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }} accessibilityLabel={`${item.label}, ${item.display ?? item.value}`}>
          {item.leading}
          <View style={{ flex: 1, rowGap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 8 }}>
              <Text weight="medium" numberOfLines={1} style={[TYPE.body, { flex: 1 }]}>
                {item.label}
              </Text>
              <Text weight="semibold" style={[TYPE.body, TABULAR]}>
                {item.display ?? item.value}
              </Text>
            </View>
            {item.detail ? (
              <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted, marginTop: -4 }]}>
                {item.detail}
              </Text>
            ) : null}
            <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.border }}>
              <View style={{ width: `${Math.max(2, Math.min(100, (item.value / top) * 100))}%`, height: 6, borderRadius: 3, backgroundColor: item.color ?? color ?? colors.text }} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
