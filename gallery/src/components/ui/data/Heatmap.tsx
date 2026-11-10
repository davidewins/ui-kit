// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/data/Heatmap.tsx. Edit it there and sync; local edits fail ui-kit:check.
// Intensity on a grid: training days over months, busy hours by weekday,
// best times to post. One colour, stronger means more. Cells size themselves
// to fill the width unless `cell` is given.
import { useThemeColors } from "@/hooks/useThemeColors";
import { useState } from "react";
import { View } from "react-native";
import { Text } from "../primitives/Text";
import { TYPE } from "../primitives/type";

export interface HeatmapProps {
  /** Left to right; each column top to bottom. 0 to 1, null leaves a hole. */
  columns: (number | null)[][];
  color: string;
  /** Fixed cell size. Omit to fill the width. */
  cell?: number;
  /** Row height when cells should not be square (few wide columns). */
  cellHeight?: number;
  gap?: number;
  /** One per row, drawn to the left (M, W, F...). Empty strings skip a row. */
  rowLabels?: string[];
  /** Drawn under the grid, spread evenly (Jan, Feb... or 6am, noon...). */
  columnLabels?: string[];
  accessibilityLabel?: string;
}

const LABEL_W = 18;

export function Heatmap({ columns, color, cell, cellHeight, gap = 3, rowLabels, columnLabels, accessibilityLabel }: HeatmapProps) {
  const colors = useThemeColors();
  const [width, setWidth] = useState(0);
  const left = rowLabels ? LABEL_W : 0;
  const n = columns.length || 1;
  const size = cell ?? Math.max(0, (width - left - gap * (n - 1)) / n);
  const rowHeight = cellHeight ?? size;
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      {size > 0 ? (
        <View style={{ flexDirection: "row" }}>
          {rowLabels ? (
            <View style={{ width: left, rowGap: gap }}>
              {rowLabels.map((l, i) => (
                <View key={i} style={{ height: rowHeight, justifyContent: "center" }}>
                  <Text weight="medium" style={[TYPE.caption, { color: colors.muted }]}>
                    {l}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
          <View style={{ flexDirection: "row", columnGap: gap }}>
            {columns.map((col, x) => (
              <View key={x} style={{ rowGap: gap }}>
                {col.map((v, y) => (
                  <View
                    key={y}
                    style={{
                      width: size,
                      height: rowHeight,
                      borderRadius: Math.min(4, Math.min(size, rowHeight) / 4),
                      backgroundColor: v === null ? "transparent" : v <= 0 ? colors.border : color,
                      opacity: v === null || v <= 0 ? 1 : 0.25 + 0.75 * Math.min(1, v),
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      ) : null}
      {columnLabels?.length ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6, marginLeft: left }}>
          {columnLabels.map((l, i) => (
            <Text key={`${l}${i}`} weight="medium" style={[TYPE.caption, { color: colors.muted }]}>
              {l}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
