import React from "react";
import { useColorScheme } from "react-native";
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
  // Only the default badge has a border. useCSSVariable("transparent") is
  // undefined, which drew a black 1pt border on every status badge in light mode.
  let borderVar = "--color-border";

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

  // Light mode is TKVR's badge: white label on the saturated status fill,
  // grey for default and info. Dark mode keeps the tints above. (David, 15 Oct)
  const solidVar =
    variant === "success"
      ? "--color-success"
      : variant === "error"
        ? "--color-error"
        : variant === "warning"
          ? "--color-warning"
          : "--color-muted";
  const light = useColorScheme() !== "dark";

  const tintBg = useCSSVariable(bgVar) as string;
  const tintText = useCSSVariable(textVar) as string;
  const solid = useCSSVariable(solidVar) as string;
  const border = useCSSVariable(borderVar) as string;
  const bgColor = light ? solid : tintBg;
  const textColor = light ? "#FFFFFF" : tintText;
  const borderColor = !light && variant === "default" ? border : "transparent";

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
