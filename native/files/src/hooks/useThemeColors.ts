import { useFontFamily } from "@/hooks/useFontFamily";
import { useMemo } from "react";
import { Platform } from "react-native";
import { useCSSVariable } from "uniwind";

export function useThemeColors() {
  const fontFamily = useFontFamily();
  const headerFont = fontFamily("semibold");
  const text = useCSSVariable("--color-text") as string;
  const background = useCSSVariable("--color-background") as string;
  const secondaryBackground = useCSSVariable(
    "--color-secondary-background",
  ) as string;
  const surface = useCSSVariable("--color-surface") as string;
  const foreground = useCSSVariable("--color-foreground") as string;
  const border = useCSSVariable("--color-border") as string;
  const separator = useCSSVariable("--color-separator") as string;
  const muted = useCSSVariable("--color-muted") as string;
  const tint = useCSSVariable("--color-tint") as string;
  const primary = useCSSVariable("--color-primary") as string;
  const onVariant = useCSSVariable("--color-on-variant") as string;
  const onTint = useCSSVariable("--color-on-tint") as string;
  const success = useCSSVariable("--color-success") as string;
  const successBg = useCSSVariable("--color-success-bg") as string;
  const successText = useCSSVariable("--color-success-text") as string;
  const error = useCSSVariable("--color-error") as string;
  const errorBg = useCSSVariable("--color-error-bg") as string;
  const errorText = useCSSVariable("--color-error-text") as string;
  const warning = useCSSVariable("--color-warning") as string;
  const warningBg = useCSSVariable("--color-warning-bg") as string;
  const warningText = useCSSVariable("--color-warning-text") as string;
  const info = useCSSVariable("--color-info") as string;
  const infoBg = useCSSVariable("--color-info-bg") as string;
  const infoText = useCSSVariable("--color-info-text") as string;
  const card = useCSSVariable("--color-card") as string;
  const tabBackground = useCSSVariable("--color-tab-background") as string;
  const tabIconDefault = useCSSVariable("--color-tab-icon-default") as string;
  const tabIconSelected = useCSSVariable("--color-tab-icon-selected") as string;
  const inputBackground = useCSSVariable("--color-input-background") as string;
  const inputBorder = useCSSVariable("--color-input-border") as string;
  const surfaceElevated = useCSSVariable("--color-surface-elevated") as string;
  const onAccent = useCSSVariable("--color-on-accent") as string;

  return useMemo(
    () => ({
      // Base Colors
      text,
      background,
      secondaryBackground,
      surface,
      foreground,
      border,
      separator,
      muted,
      tint,
      primary,
      onVariant,
      onTint,

      // Semantic Colors
      success,
      successBg,
      successText,

      error,
      errorBg,
      errorText,

      warning,
      warningBg,
      warningText,

      info,
      infoBg,
      infoText,

      // Component Specific
      card,
      tabBackground,
      tabIconDefault,
      tabIconSelected,
      inputBackground,
      inputBorder,
      surfaceElevated,
      onAccent,

      // Legacy aliases (old names still used across SELLERS, TKVR, ADMIN, demo)
      danger: error,
      destructive: error,
      textMuted: muted,
      tertiary: muted,
      surfaceMuted: surfaceElevated,
      primaryText: onTint,
      onPrimary: onTint,

      headerStyle:
        Platform.OS === "android" ? { backgroundColor: background } : null,

      headerTitleStyle: { fontFamily: headerFont },
      headerLargeTitleStyle: { fontFamily: headerFont, fontSize: 32 },
    }),
    [
      headerFont,
      text,
      background,
      secondaryBackground,
      surface,
      foreground,
      border,
      separator,
      muted,
      tint,
      primary,
      onVariant,
      onTint,
      success,
      successBg,
      successText,
      error,
      errorBg,
      errorText,
      warning,
      warningBg,
      warningText,
      info,
      infoBg,
      infoText,
      card,
      tabBackground,
      tabIconDefault,
      tabIconSelected,
      inputBackground,
      inputBorder,
      surfaceElevated,
      onAccent,
    ],
  );
}
