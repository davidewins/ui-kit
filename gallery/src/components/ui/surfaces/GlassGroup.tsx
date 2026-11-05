// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/surfaces/GlassGroup.tsx. Edit it there and sync; local edits fail ui-kit:check.
// The container for a group of SelectRows (David, 16 Oct: they only look right
// on Liquid Glass). Liquid Glass on iOS 26; on phones without it, the same
// grey grouped card as SettingsGroup. Callers set the outer margin.
import { GlassSurface } from "@/components/GlassSurface";
import { useThemeColors } from "@/hooks/useThemeColors";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import type { ReactNode } from "react";
import { Platform, View, type StyleProp, type ViewStyle } from "react-native";

const SHAPE: ViewStyle = { borderRadius: 24, borderCurve: "continuous", overflow: "hidden" };

export function GlassGroup({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const colors = useThemeColors();
  if (Platform.OS === "ios" && isLiquidGlassAvailable()) {
    return <GlassSurface style={[SHAPE, style]}>{children}</GlassSurface>;
  }
  return <View style={[SHAPE, { backgroundColor: colors.surface }, style]}>{children}</View>;
}
