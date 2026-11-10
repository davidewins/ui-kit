// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/primitives/BrandMark.tsx. Edit it there and sync; local edits fail ui-kit:check.
// The mark of a card network or a courier, as a small rounded rectangle in
// the brand's own colours: beside "Visa ending 4242", beside a tracking
// number. Every mark is the same shape (a card, 1.56 : 1) so rows that carry
// different brands line up. Not for app icons or social logos.
import { Image } from "expo-image";
import { Text } from "./Text";
import { View } from "./View";

const CARDS = {
  visa: require("@/assets/images/brands/VisaBlue.png"),
  mastercard: require("@/assets/images/brands/Mastercard.png"),
  applepay: require("@/assets/images/brands/ApplePay.png"),
} as const;

/** Drawn marks: brand fill, brand lettering. */
const COURIERS = {
  dpd: { bg: "#DC0032", fg: "#FFFFFF", text: "dpd" },
  anpost: { bg: "#00704A", fg: "#FFD100", text: "post" },
} as const;

const NAMES = { visa: "Visa", mastercard: "Mastercard", applepay: "Apple Pay", dpd: "DPD", anpost: "An Post" } as const;

export type Brand = keyof typeof CARDS | keyof typeof COURIERS;

export function BrandMark({
  brand,
  size = 24,
}: {
  brand: Brand;
  /** Height of the mark. Its width is 1.56 times this. */
  size?: number;
}) {
  const width = Math.round(size * 1.56);
  const shape = { width, height: size, borderRadius: size * 0.2, borderCurve: "continuous" as const, overflow: "hidden" as const };
  if (brand === "dpd" || brand === "anpost") {
    const c = COURIERS[brand];
    return (
      <View accessible accessibilityRole="image" accessibilityLabel={NAMES[brand]} style={[shape, { backgroundColor: c.bg, alignItems: "center", justifyContent: "center" }]}>
        {/* Lettering scales with the mark, so its size is computed, not a type role. */}
        <Text weight="bold" style={{ color: c.fg, fontSize: size * 0.5, lineHeight: size * 0.62, letterSpacing: size * -0.02 }}>
          {c.text}
        </Text>
      </View>
    );
  }
  // The card art fills the PNG's width; "cover" trims the transparent rows.
  return <Image source={CARDS[brand]} accessibilityLabel={NAMES[brand]} style={shape} contentFit="cover" />;
}
