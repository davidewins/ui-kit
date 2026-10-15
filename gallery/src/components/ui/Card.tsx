// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/Card.tsx. Edit it there and sync; local edits fail ui-kit:check.
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
      className={` bg-card rounded-lg p-3 border border-border ${className} `}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={accessibilityState}
    >
      {children}
    </View>
  );
};
