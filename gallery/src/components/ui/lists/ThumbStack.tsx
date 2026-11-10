// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/lists/ThumbStack.tsx. Edit it there and sync; local edits fail ui-kit:check.
// What is inside something, at a glance: up to a few small thumbnails,
// overlapping like a hand of cards or side by side, with "+2" when there are
// more. For the leading or trailing slot of one list row (an order, an album,
// a basket). Not a gallery and not tappable on its own: the row is.
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image, type ImageProps } from "expo-image";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";
import { View } from "../primitives/View";

export function ThumbStack({
  images,
  size = 40,
  max = 3,
  layout = "overlap",
  ringColor,
  label,
}: {
  images: readonly ImageProps["source"][];
  /** Side of each square thumbnail. */
  size?: number;
  /** Thumbnails drawn before the rest collapse into "+n" (two to four). */
  max?: number;
  /** "overlap" fans them over each other; "row" sets them side by side. */
  layout?: "overlap" | "row";
  /** The ring between overlapping thumbnails: the colour they sit on. Defaults to the page. */
  ringColor?: string;
  /** Read out in place of the pictures: "4 items". */
  label?: string;
}) {
  const colors = useThemeColors();
  const ring = layout === "overlap" ? 2 : 0;
  const shown = images.slice(0, images.length > max ? max - 1 : max);
  const more = images.length - shown.length;
  const step = layout === "overlap" ? -Math.round(size * 0.3) : 4;
  const box = {
    width: size + ring * 2,
    height: size + ring * 2,
    borderRadius: size * 0.26 + ring,
    borderCurve: "continuous" as const,
    borderWidth: ring,
    borderColor: ringColor ?? colors.background,
    overflow: "hidden" as const,
    backgroundColor: colors.secondaryBackground,
  };
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={label ?? `${images.length} pictures`} style={{ flexDirection: "row", alignItems: "center", margin: -ring }}>
      {shown.map((src, i) => (
        <View key={i} style={[box, { marginLeft: i ? step : 0, zIndex: shown.length - i + 1 }]}>
          <Image source={src} style={{ flex: 1 }} contentFit="cover" />
        </View>
      ))}
      {more > 0 ? (
        <View style={[box, { marginLeft: step, alignItems: "center", justifyContent: "center" }]}>
          <Text weight="semibold" style={[size < 36 ? TYPE.caption : TYPE.sub, TABULAR, { color: colors.muted }]}>{`+${more}`}</Text>
        </View>
      ) : null}
    </View>
  );
}
