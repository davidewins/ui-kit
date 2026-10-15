// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/Badge.tsx. Edit it there and sync; local edits fail ui-kit:check.
import React from "react";
import { useCSSVariable } from "uniwind";
import { Text } from "./Text";
import { View } from "./View";

type BadgeVariant = "default" | "success" | "error" | "warning" | "info";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  // We use style props for colors to access our new semantic variables directly
  // This ensures perfect contrast in both light and dark modes

  let bgVar = "--color-secondary-background";
  let textVar = "--color-foreground";
  let borderVar = "transparent";

  switch (variant) {
    case "success":
      bgVar = "--color-success-bg";
      textVar = "--color-success-text";
      break;
    case "error":
      bgVar = "--color-error-bg";
      textVar = "--color-error-text";
      break;
    case "warning":
      bgVar = "--color-warning-bg";
      textVar = "--color-warning-text";
      break;
    case "info":
      bgVar = "--color-info-bg";
      textVar = "--color-info-text";
      break;
    case "default":
      bgVar = "--color-secondary-background";
      textVar = "--color-foreground";
      borderVar = "--color-border";
      break;
  }

  const bgColor = useCSSVariable(bgVar) as string;
  const textColor = useCSSVariable(textVar) as string;
  const borderColor = useCSSVariable(borderVar) as string;

  return (
    <View
      className={`
    px-2.5 py-0.5
    self-start border
    ${className}
  `}
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderRadius: 9999, // ADD THIS
      }}
      accessibilityRole="text"
    >
      <Text
        weight="medium"
        className="text-xs"
        style={{ color: textColor }}
      >
        {children}
      </Text>
    </View>
  );
};
