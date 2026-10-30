import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { GlassSurface } from "@/components/GlassSurface";
import { PressableScale } from "@/components/PressableScale";
import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
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
  /** Red label on the glass/outline pills (e.g. Delete on a Liquid Glass button). */
  destructive?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Same dimensions as VOID's GlassButton (sm/md/lg); xs is SELLERS-only.
const SIZE = {
  xs: { height: 32, paddingHorizontal: 12, fontSize: 13, icon: 14 },
  sm: { height: 40, paddingHorizontal: 16, fontSize: 14, icon: 16 },
  md: { height: 46, paddingHorizontal: 18, fontSize: 15, icon: 18 },
  lg: { height: 52, paddingHorizontal: 22, fontSize: 16, icon: 20 },
} as const;

/**
 * Button - the canonical action pill, a port of VOID's GlassButton.
 *
 * - `primary`: solid, high-contrast pill (the ONE action on a screen).
 * - `danger`: solid destructive pill.
 * - `secondary`: Liquid Glass pill (BlurView fallback) with a hairline border.
 * - `outline`: quiet solid neutral pill with a hairline border.
 *
 * Press is a 2% timing dip (no spring), medium impact haptic.
 */
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
  destructive = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const colors = useThemeColors();
  const dims = SIZE[size];
  const isDisabled = disabled || loading;
  const isGlass = variant === "secondary";

  const fill =
    variant === "primary"
      ? colors.primary
      : variant === "danger"
        ? colors.danger
        : colors.secondaryBackground; // outline
  const labelColor =
    variant === "primary"
      ? colors.primaryText
      : variant === "danger"
        ? "#ffffff"
        : destructive
          ? colors.danger
          : colors.text;

  const renderIcon = (icon: React.ReactElement<{ size?: number; color?: string }>) =>
    React.cloneElement(icon, {
      size: icon.props.size ?? dims.icon,
      color: icon.props.color ?? labelColor,
    });

  const inner = loading ? (
    <ActivityIndicator size="small" color={labelColor} />
  ) : (
    <View style={styles.content}>
      {leftIcon ? <View style={styles.leftIcon}>{renderIcon(leftIcon)}</View> : null}
      <Text
        style={{ fontFamily: "Geist-SemiBold", color: labelColor, fontSize: dims.fontSize }}
        numberOfLines={1}
        maxFontSizeMultiplier={1.4}
      >
        {children}
      </Text>
      {rightIcon ? <View style={styles.rightIcon}>{renderIcon(rightIcon)}</View> : null}
    </View>
  );

  // Pill: rounded-full, so no borderCurve. minHeight, not height, so a label
  // at a larger text size grows the pill instead of being clipped.
  const shape = {
    minHeight: dims.height,
    borderRadius: 999,
    paddingHorizontal: dims.paddingHorizontal,
    paddingVertical: 4,
  };

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={
        accessibilityLabel ?? (typeof children === "string" ? children : undefined)
      }
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={() => {
        if (isDisabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress?.();
      }}
      className={`${fullWidth ? "w-full" : ""} ${className}`.trim()}
      style={[styles.shadow, isDisabled && !isGlass && styles.disabled]}
    >
      {isGlass ? (
        <GlassSurface
          isInteractive={!isDisabled}
          style={[
            styles.center,
            shape,
            {
              overflow: "hidden",
              borderColor: colors.border,
              borderWidth: StyleSheet.hairlineWidth,
            },
          ]}
        >
          {/* Dim the content only: opacity on GlassSurface or an ancestor
              permanently breaks Liquid Glass on iOS 26.1+ (expo/expo#41024). */}
          <View style={isDisabled && styles.disabled}>{inner}</View>
        </GlassSurface>
      ) : (
        <View
          style={[
            styles.center,
            shape,
            { backgroundColor: fill },
            variant === "outline" && {
              borderColor: colors.border,
              borderWidth: StyleSheet.hairlineWidth,
            },
          ]}
        >
          {inner}
        </View>
      )}
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  disabled: { opacity: 0.45 },
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  center: { alignItems: "center", justifyContent: "center" },
  content: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  leftIcon: { marginRight: 8 },
  rightIcon: { marginLeft: 8 },
});
