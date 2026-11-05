import { useThemeColors } from "@/hooks/useThemeColors";
import React from "react";
import { StyleSheet, type ViewStyle } from "react-native";
import { View } from "../primitives/View";

/**
 * A raised card: card fill (white / #1c1c1e), hairline border and a soft drop
 * shadow, for cards that must stand out on a flat page (analytics, David
 * 3 Nov). Dark mode has no visible shadow on black, so the border carries
 * the edge. No overflow hidden: it would clip the shadow on iOS.
 */
export function useRaisedCardStyle(radius = 24): ViewStyle {
  const colors = useThemeColors();
  return {
    backgroundColor: colors.card,
    borderRadius: radius,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
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
  const raisedStyle = useRaisedCardStyle();
  return (
    <View
      className={`p-4 ${className}`}
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
