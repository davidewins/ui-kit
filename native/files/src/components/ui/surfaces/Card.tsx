import { useThemeColors } from "@/hooks/useThemeColors";
import React from "react";
import type { ViewStyle } from "react-native";
import { useUniwind } from "uniwind";
import { View } from "../primitives/View";

/**
 * A raised card: card fill, a real edge and a layered shadow, for blocks
 * that must lift off a flat page (David, 3 Nov, then 10 Nov: "no proper
 * shadows or borders"). Light: a tight contact shadow plus a wide soft one.
 * Dark: a shadow cannot show on black, so the lighter fill, a lit top edge
 * and a 1pt rim carry the lift. No overflow hidden: it would clip the shadow.
 */
export function useRaisedCardStyle(radius = 24): ViewStyle {
  const colors = useThemeColors();
  const { theme } = useUniwind();
  const dark = theme === "dark";
  return {
    backgroundColor: colors.card,
    borderRadius: radius,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)",
    boxShadow: dark
      ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 18px 40px rgba(0,0,0,0.6)"
      : "0 1px 2px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.12)",
    elevation: 4,
  };
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Lift it off the page: card fill, hairline border, soft shadow. */
  raised?: boolean;
  accessibilityRole?: "button" | "link" | "none";
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    busy?: boolean;
  };
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  raised = false,
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
}) => {
  // One look (David, 4 Nov): a block of content on the page, no grey fill.
  // `raised` is the one lifted variant (analytics). Small grey tiles are Tile.
  //
  // A flat card has no edge, so it adds no side padding: its content lines up
  // with the page's own 16pt inset instead of indenting twice (David, 9 Nov).
  // A raised card has an edge, so it keeps p-4 inside it. Any padding class
  // passed in replaces the default: "p-4 p-0" resolves by stylesheet order,
  // not string order, so the default must not be there at all.
  const raisedStyle = useRaisedCardStyle();
  const hasPadding = /(^|\s)p[xytrbl]?-/.test(className);
  const base = hasPadding ? "" : raised ? "p-4 " : "py-4 ";
  return (
    <View
      className={`${base}${className}`}
      style={raised ? raisedStyle : undefined}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState}
    >
      {children}
    </View>
  );
};
