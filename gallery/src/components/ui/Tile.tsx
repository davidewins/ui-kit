// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/Tile.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A small grey tile: the one place a surface fill belongs on a page (David,
// 4 Nov: "in obvious, small places use it"). For tile grids, stat chips and
// compact pickable blocks, never for grouping rows (SettingsGroup) or a block
// of content (Card).
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "./View";

export function Tile({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      className={`bg-surface p-3 ${className}`}
      style={[{ borderRadius: 16, borderCurve: "continuous" }, style]}
    >
      {children}
    </View>
  );
}
