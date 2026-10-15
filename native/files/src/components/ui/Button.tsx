import React from "react";
import { ActivityIndicator, Pressable as RNPressable } from "react-native";
import { useFontFamily } from "@/hooks/useFontFamily";
import { useCSSVariable, withUniwind } from "uniwind";
import { Text } from "./Text";
import { View } from "./View";

const StyledPressable = withUniwind(RNPressable);

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps {
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactElement<{ size?: number; color?: string }>;
  rightIcon?: React.ReactElement<{ size?: number; color?: string }>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-foreground active:opacity-90 shadow-sm",
  secondary:
    "bg-secondary-background active:opacity-90 border-[1px] border-border shadow-sm",
  danger: "bg-error active:opacity-90 shadow-sm",
};

// These class names are kept for Tailwind completeness but we also force colors via style
const textVariantStyles: Record<ButtonVariant, string> = {
  primary: "text-background",
  secondary: "text-foreground",
  danger: "text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2 py-1 h-7 rounded-full",
  sm: "px-3 py-1.5 h-8 rounded-full",
  md: "px-4 py-2.5 h-10 rounded-full",
  lg: "px-6 py-3 h-12 rounded-full",
};

const textSizeStyles: Record<ButtonSize, string> = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
};

// Pads the touch target to 44pt (xs 28, sm 32, md 40, lg 48).
const hitSlops: Record<ButtonSize, number> = {
  xs: 8,
  sm: 6,
  md: 2,
  lg: 0,
};

const iconSizes: Record<ButtonSize, number> = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 24,
};

export const Button: React.FC<ButtonProps> = ({
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  children,
  className = "",
  fullWidth = false,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const isDisabled = disabled || loading;
  const fontFamily = useFontFamily();

  // Get theme colors
  const foregroundColor = useCSSVariable("--color-text") as string;
  const backgroundColor = useCSSVariable("--color-background") as string;
  const onVariantColor = useCSSVariable("--color-on-variant") as string;
  const mutedColor = useCSSVariable("--color-muted") as string;
  const borderColor = useCSSVariable("--color-border") as string;

  // Determine the exact text color needed for contrast
  const getTextColor = () => {
    if (isDisabled) {
      return mutedColor;
    }
    if (variant === "primary") {
      // Primary button: bg-foreground needs text-background for contrast
      return backgroundColor;
    }
    if (variant === "danger") {
      return onVariantColor;
    }
    // secondary uses the foreground colour
    return foregroundColor;
  };

  const textColorToUse = getTextColor();

  const renderIcon = (
    icon: React.ReactElement<{ size?: number; color?: string }>,
    side: "left" | "right",
  ) => {
    if (!icon) return null;

    const IconWithStyles = React.cloneElement(icon, {
      size: icon.props.size || iconSizes[size],
      color: icon.props.color || textColorToUse,
    });

    return (
      <View className={side === "left" ? "mr-2" : "ml-2"}>
        {IconWithStyles}
      </View>
    );
  };

  return (
    <StyledPressable
      onPress={onPress}
      disabled={isDisabled}
      hitSlop={hitSlops[size]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === "string" ? children : undefined)}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`
        ${isDisabled ? "" : variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        items-center justify-center flex-row
        ${className}
      `}
      style={{
        borderRadius: 9999,
        flexDirection: "row",
        ...(isDisabled ? { backgroundColor: borderColor } : {}),
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColorToUse} />
      ) : (
        <>
          {leftIcon && renderIcon(leftIcon, "left")}
          <Text
            className={`
            ${textSizeStyles[size]}
            tracking-tight
          `}
            style={{
              fontFamily: fontFamily("semibold"),
              color: textColorToUse,
            }}
          >
            {children}
          </Text>
          {rightIcon && renderIcon(rightIcon, "right")}
        </>
      )}
    </StyledPressable>
  );
};
