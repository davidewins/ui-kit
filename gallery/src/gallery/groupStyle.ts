// Gallery-only (TAK-1491): container styles for the ported app screens, which
// were written against the old inset/flat switch. ZESTY has one look now
// (David, 4 Nov): groups and cards sit flat on the page. `raised` is the one
// lifted card (analytics): card fill, hairline border, soft shadow.
import { useRaisedCardStyle } from "@/components/ui/Card";
import type { ViewStyle } from "react-native";

const NONE: ViewStyle = { backgroundColor: "transparent", borderRadius: 0 };

export function useGroupSurface({ raised = false }: { raised?: boolean } = {}) {
  const raisedStyle = useRaisedCardStyle();
  const fill = (radius: number): ViewStyle => ({ ...raisedStyle, borderRadius: radius });
  return {
    flat: !raised,
    /** A card with its own 16 side margin whose rows pad themselves. */
    card: (radius = 16): ViewStyle =>
      raised ? { ...fill(radius), marginHorizontal: 16 } : { ...NONE, marginHorizontal: 0 },
    /** A card inside a wrapper that already has the 16 gutter. */
    cardInGutter: (radius = 16): ViewStyle => (raised ? fill(radius) : { ...NONE, marginHorizontal: -16 }),
    /** A card whose rows have no side padding of their own. */
    paddedCard: (radius = 16): ViewStyle =>
      raised
        ? { ...fill(radius), marginHorizontal: 16, paddingHorizontal: 16 }
        : { ...NONE, marginHorizontal: 16, paddingHorizontal: 0 },
    /** A card inside the 16 gutter that pads its content itself. */
    paddedInGutter: (radius = 16): ViewStyle =>
      raised ? { ...fill(radius), paddingHorizontal: 16 } : { ...NONE, paddingHorizontal: 0 },
    /** A tile in a row of tiles (the row keeps its px-4). */
    tile: (radius = 16): ViewStyle => (raised ? fill(radius) : { ...NONE, paddingHorizontal: 0 }),
    /** Kit SectionTitle inset, lined up with the content below it. */
    titleInset: 16,
    /** Side padding for a title that already sits in a px-4 wrapper. */
    titlePadInGutter: 0,
  };
}
