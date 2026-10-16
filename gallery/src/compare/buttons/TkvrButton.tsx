// Verbatim copy of TKVR src/components/ui/Button.tsx (export renamed).
import React from "react";
import { Pressable, ActivityIndicator, type ViewStyle } from "react-native";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Text } from "@/components/ui/Text";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic as fireHaptic, type HapticFeel } from "@/compare/buttons/tkvrHaptics";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps {
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string; // accepted for source-compat; styling is token-driven
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // Press feedback. Defaults by variant (see DEFAULT_FEEL); false opts out.
  haptic?: HapticFeel | false;
}

// Prominent pills hit harder than quiet ones.
const DEFAULT_FEEL: Record<ButtonVariant, HapticFeel> = {
  primary: "medium",
  danger: "medium",
  secondary: "light",
  outline: "light",
};

const HEIGHTS: Record<ButtonSize, number> = { xs: 34, sm: 42, md: 50, lg: 56 };
const FONTS: Record<ButtonSize, number> = { xs: 13, sm: 14, md: 16, lg: 17 };
const PADX: Record<ButtonSize, number> = { xs: 14, sm: 16, md: 22, lg: 24 };

// One pill, app-wide — real iOS 26 Liquid Glass (expo-glass-effect), the same
// engine as the glass cards. Primary/danger carry a tint; secondary/outline are
// clear glass. Falls back to a solid token pill where glass isn't available.
// Replaces the @expo/ui SwiftUI button that rendered a blank white-on-white pill.
export const TkvrButton: React.FC<ButtonProps> = ({
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  children,
  fullWidth = false,
  leftIcon,
  rightIcon,
  haptic,
}) => {
  const c = useThemeColors();
  const isDisabled = disabled || loading;
  const prominent = variant === "primary" || variant === "danger";
  const feel = haptic === undefined ? DEFAULT_FEEL[variant] : haptic;
  const handlePress =
    isDisabled || !onPress
      ? undefined
      : () => {
          if (feel) fireHaptic(feel);
          onPress();
        };
  // Prominent variants carry their own fill; the quiet ones need an edge so the
  // tap target has a boundary you can actually see.
  const edge: ViewStyle = prominent
    ? {}
    : { borderWidth: 1, borderColor: c.border };

  const dims: ViewStyle = {
    height: HEIGHTS[size],
    paddingHorizontal: PADX[size],
    borderRadius: 9999,
    borderCurve: "continuous",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    overflow: "hidden",
  };

  // Disabled has to read as disabled, not as absent — a 0.4-opacity pill on
  // black disappears entirely.
  const labelColor = isDisabled
    ? c.textMuted
    : prominent
      ? c.primaryText
      : c.text;
  const inner = loading ? (
    <ActivityIndicator size="small" color={labelColor} />
  ) : (
    <>
      {leftIcon}
      {typeof children === "string" || typeof children === "number" ? (
        <Text weight="semibold" style={{ color: labelColor, fontSize: FONTS[size] }}>
          {children}
        </Text>
      ) : (
        children
      )}
      {rightIcon}
    </>
  );

  const wrap: ViewStyle = {
    alignSelf: fullWidth ? "stretch" : "flex-start",
    width: fullWidth ? "100%" : undefined,
    opacity: isDisabled ? 0.65 : 1,
  };

  // SELLERS Button rule: only `secondary` is glass, and untinted. Tinted glass
  // is never solid (white primary came out grey; dark fills went grey on black),
  // so primary/danger/outline are always a solid token pill: black on light,
  // white on dark.
  if (variant === "secondary" && isLiquidGlassAvailable()) {
    return (
      <Pressable onPress={handlePress} disabled={isDisabled} style={wrap}>
        {({ pressed }) => (
          <GlassView
            glassEffectStyle="regular"
            isInteractive
            style={[dims, edge, { opacity: pressed ? 0.85 : 1 }]}
          >
            {inner}
          </GlassView>
        )}
      </Pressable>
    );
  }

  // Solid fallback (older OS): token pill.
  const bg =
    variant === "primary" ? c.primary
    : variant === "danger" ? c.danger
    : variant === "secondary" ? c.surface
    : "transparent";
  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        dims,
        wrap,
        {
          backgroundColor: bg,
          borderWidth: variant === "outline" || variant === "secondary" ? 1 : 0,
          borderColor: c.border,
          opacity: isDisabled ? 0.4 : pressed ? 0.85 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={prominent ? c.primaryText : c.text} />
      ) : (
        <>
          {leftIcon}
          {typeof children === "string" || typeof children === "number" ? (
            <Text weight="semibold" style={{ color: prominent ? c.primaryText : c.text, fontSize: FONTS[size] }}>
              {children}
            </Text>
          ) : (
            children
          )}
          {rightIcon}
        </>
      )}
    </Pressable>
  );
};
