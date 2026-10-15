// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/GlassButton.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { GlassSurface } from "@/components/GlassSurface";
import { PressableScale } from "@/components/PressableScale";
import { Text } from "@/components/ui/Text";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { FC, ReactElement, cloneElement } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type GlassButtonSize = "sm" | "md" | "lg";
// primary = solid, high-contrast (the ONE action on screen - must stand out).
// neutral = quiet secondary. danger = destructive. glass = frosted, only for
// buttons sitting over imagery/content where translucency actually reads.
type GlassButtonTone = "primary" | "neutral" | "danger" | "glass";

interface GlassButtonProps {
  label: string;
  onPress: () => void | Promise<void>;
  size?: GlassButtonSize;
  tone?: GlassButtonTone;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactElement<{ size?: number; color?: string }>;
  rightIcon?: ReactElement<{ size?: number; color?: string }>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** "solid": an opaque border-coloured pill with a muted label instead of
   * fading, for buttons floating over content (product add bar). */
  disabledStyle?: "fade" | "solid";
  /** The caller fires its own result haptic. */
  haptic?: boolean;
}

const SIZE = {
  sm: { height: 40, paddingHorizontal: 16, fontSize: 14, icon: 16 },
  md: { height: 46, paddingHorizontal: 18, fontSize: 15, icon: 18 },
  lg: { height: 52, paddingHorizontal: 22, fontSize: 16, icon: 20 },
} as const;

/**
 * The app's action-button primitive. `primary` is a SOLID, high-contrast pill
 * (the inverse of the background) so the main action always stands out - glass
 * is translucent and disappears over flat screens, so it is NOT used for the
 * primary CTA. Animated press + haptics via PressableScale.
 */
export const GlassButton: FC<GlassButtonProps> = ({
  label,
  onPress,
  size = "md",
  tone = "primary",
  disabled = false,
  loading = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  accessibilityHint,
  disabledStyle = "fade",
  haptic = true,
}) => {
  const colors = useThemeColors();
  const dims = SIZE[size];
  const isDisabled = disabled || loading;
  const isGlass = tone === "glass";
  const solidDisabled = isDisabled && !isGlass && disabledStyle === "solid";

  // Solid fills for everything except the explicit glass tone.
  const fill = solidDisabled
    ? colors.border
    : tone === "primary"
      ? colors.text
      : tone === "danger"
        ? colors.error
        : colors.secondaryBackground; // neutral
  const labelColor = solidDisabled
    ? colors.text
    : tone === "primary"
      ? colors.background
      : tone === "danger"
        ? colors.onVariant
        : tone === "neutral"
          ? colors.text
          : colors.text; // glass

  const renderIcon = (icon: ReactElement<{ size?: number; color?: string }>) =>
    cloneElement(icon, {
      size: icon.props.size ?? dims.icon,
      color: icon.props.color ?? labelColor,
    });

  const inner = loading ? (
    <ActivityIndicator size="small" color={labelColor} />
  ) : (
    <View style={styles.content}>
      {leftIcon ? <View style={styles.leftIcon}>{renderIcon(leftIcon)}</View> : null}
      <Text
        weight="semibold"
        style={{ color: labelColor, fontSize: dims.fontSize }}
        // Never truncated: long labels shrink a little instead.
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {label}
      </Text>
      {rightIcon ? <View style={styles.rightIcon}>{renderIcon(rightIcon)}</View> : null}
    </View>
  );

  const shape = {
    height: dims.height,
    borderRadius: dims.height / 2,
    paddingHorizontal: dims.paddingHorizontal,
  };

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={() => {
        if (isDisabled) return;
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={[
        styles.shadow,
        fullWidth && styles.fullWidth,
        isDisabled && !isGlass && !solidDisabled && styles.disabled,
      ]}
    >
      {isGlass ? (
        <GlassSurface
          isInteractive={!isDisabled}
          style={[
            styles.center,
            shape,
            { overflow: "hidden", borderColor: colors.border, borderWidth: StyleSheet.hairlineWidth },
          ]}
        >
          {/* Dim the content only - opacity on GlassSurface or an ancestor
              permanently breaks Liquid Glass rendering on iOS 26.1+ and
              doesn't recover until remount (expo/expo#41024). */}
          <View style={isDisabled && styles.disabled}>{inner}</View>
        </GlassSurface>
      ) : (
        <View
          style={[
            styles.center,
            shape,
            { backgroundColor: fill },
            tone === "neutral" && {
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
  fullWidth: { alignSelf: "stretch" },
  disabled: { opacity: 0.45 },
  shadow: {
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  center: { alignItems: "center", justifyContent: "center" },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  leftIcon: { marginRight: 8 },
  rightIcon: { marginLeft: 8 },
});
