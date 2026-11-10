// The block a display page is built from: a surface at the page gutter that
// lifts off the page. Raised (fill, edge, shadow) by default; `glass` makes
// it Liquid Glass on iOS 26 for the one hero block of a page or anything that
// floats over a photo or scrolling content. Put a SectionHeader above it, not
// inside it. For a group of settings rows use SettingsGroup; for a small grey
// fill use Tile.
import { GlassSurface } from "@/components/GlassSurface";
import type { ReactNode } from "react";
import { Platform, type StyleProp, View, type ViewStyle } from "react-native";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useRaisedCardStyle } from "./Card";

export interface PanelProps {
  children: ReactNode;
  /** Liquid Glass instead of the raised card (falls back to raised). */
  glass?: boolean;
  /** No inner padding: for rows that run edge to edge and bring their own. */
  flush?: boolean;
  /** Sits inside an already padded container: no page gutter. */
  inset?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Panel({ children, glass = false, flush = false, inset = false, style }: PanelProps) {
  const raised = useRaisedCardStyle();
  const box: ViewStyle = { marginHorizontal: inset ? 0 : 16, padding: flush ? 0 : 16 };
  if (glass && Platform.OS === "ios" && isLiquidGlassAvailable()) {
    return (
      <GlassSurface style={[{ borderRadius: 24, borderCurve: "continuous", overflow: "hidden" }, box, style]}>{children}</GlassSurface>
    );
  }
  return <View style={[raised, box, style]}>{children}</View>;
}
