import React from "react";
import { View } from "./View";

interface CardProps {
  children: React.ReactNode;
  className?: string;
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
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
}) => {
  return (
    <View
      // Same fill and shape as SettingsGroup (spec §2.3): surface, radius 24, no border.
      className={`bg-surface p-4 ${className}`}
      style={{ borderRadius: 24, borderCurve: "continuous" }}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState}
    >
      {children}
    </View>
  );
};
