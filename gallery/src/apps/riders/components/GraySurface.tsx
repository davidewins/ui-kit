import { useThemeColors } from "@/hooks/useThemeColors";
import { useGroupSurface } from "@/gallery/groupStyle";
import { FC, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

/**
 * Solid gray inset surface - the non-glass stand-in for GlassSurface on
 * settings and form screens, where a frosted panel was decoration rather than
 * function. Caller supplies radius/overflow via `style`; the fill is the
 * theme's secondary background so it reads the same in light and dark.
 */
export const GraySurface: FC<{
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Gallery (TAK-1491): a grouped card that follows the flat/inset switch.
   * Left off for surfaces that are buttons (they stay filled). */
  group?: "inGutter" | "paddedInGutter";
}> = ({ children, style, group }) => {
  const colors = useThemeColors();
  const { cardInGutter, paddedInGutter } = useGroupSurface();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderCurve: "continuous",
        },
        style,
        group === "inGutter" ? cardInGutter() : null,
        group === "paddedInGutter" ? paddedInGutter() : null,
      ]}
    >
      {children}
    </View>
  );
};
