import { useThemeColors } from "@/hooks/useThemeColors";
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
}> = ({ children, style }) => {
  const colors = useThemeColors();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderCurve: "continuous",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};
