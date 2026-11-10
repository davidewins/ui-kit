// A category mark: a glyph on a coloured rounded square (round with
// `round`). The colour says what kind of thing the row is (a sale, a refund,
// a workout type), so it comes from useHues, never from the status colours.
// For a brand use BrandMark; for a person use Avatar.
import type { ComponentType } from "react";
import { View } from "react-native";

export interface IconTileProps {
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
  size?: number;
  round?: boolean;
  /** The glyph colour. White suits every hue except yellow. */
  glyph?: string;
}

export function IconTile({ Icon, color, size = 40, round = false, glyph = "#fff" }: IconTileProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: round ? size / 2 : size * 0.3,
        borderCurve: "continuous",
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={size * 0.48} color={glyph} strokeWidth={2.2} />
    </View>
  );
}
