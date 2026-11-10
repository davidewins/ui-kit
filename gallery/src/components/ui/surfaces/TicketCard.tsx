// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/surfaces/TicketCard.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A receipt or ticket: a raised card with a tear line across it, a semicircle
// notch bitten out of each side and a dashed rule between them. The main
// content goes above the line, the stub (a reference number, a code, a total)
// below it. The notches take the page colour, so it reads on both themes.
// Not a general card (Card raised) and not for more than one tear.
import { useThemeColors } from "@/hooks/useThemeColors";
import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import Svg, { Line } from "react-native-svg";
import { View } from "../primitives/View";
import { useRaisedCardStyle } from "./Card";

export function TicketCard({
  children,
  stub,
  notch = 11,
  padding = 20,
  pageColor,
}: {
  /** Above the tear line. */
  children: ReactNode;
  /** Below the tear line. */
  stub: ReactNode;
  /** Radius of the side notches. */
  notch?: number;
  /** Inner padding of both parts. */
  padding?: number;
  /** What the card sits on, when that is not the page background. */
  pageColor?: string;
}) {
  const colors = useThemeColors();
  const raised = useRaisedCardStyle(24);
  const page = pageColor ?? colors.background;
  const hair = StyleSheet.hairlineWidth;

  // Half a circle in the page colour, clipped so only the half inside the
  // card draws; its hairline carries the card's edge round the bite.
  const bite = (side: "left" | "right") => (
    <View style={{ position: "absolute", top: 0, [side]: -hair, width: notch + hair, height: notch * 2, overflow: "hidden" }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          [side]: -notch,
          width: notch * 2,
          height: notch * 2,
          borderRadius: notch,
          backgroundColor: page,
          borderWidth: hair,
          borderColor: colors.border,
        }}
      />
    </View>
  );

  return (
    <View style={raised}>
      <View style={{ padding }}>{children}</View>
      <View style={{ height: notch * 2, justifyContent: "center" }}>
        <View style={{ marginHorizontal: notch + 8 }}>
          <Svg width="100%" height={2}>
            <Line x1="1" y1="1" x2="100%" y2="1" stroke={colors.muted} strokeOpacity={0.5} strokeWidth={1.5} strokeDasharray="1 6" strokeLinecap="round" />
          </Svg>
        </View>
        {bite("left")}
        {bite("right")}
      </View>
      <View style={{ padding }}>{stub}</View>
    </View>
  );
}
