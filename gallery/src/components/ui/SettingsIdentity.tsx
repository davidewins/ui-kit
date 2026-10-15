// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/SettingsIdentity.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { Pressable, Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { ChevronRight } from "lucide-react-native";
import type { ReactNode } from "react";
import { SETTINGS_GROUP, SettingsSeparator } from "./SettingsGroup";

/**
 * The identity block at the top of an account/profile screen: who or what
 * this workspace belongs to, and a tap through to edit it.
 *
 * Same card, padding, type and chevron in all three apps. What differs is the
 * `leading` slot - VOID and RIDERS pass a round 60pt person avatar, SELLERS
 * passes a rounded-square business tile, because a circle means a person.
 */
export const SETTINGS_IDENTITY = {
  /** Both the round avatar and the square business tile are this size. */
  avatarSize: 60,
  titleFontSize: 18,
  titleLetterSpacing: -0.4,
  subtitleFontSize: 14,
  chevronSize: 20,
  chevronStrokeWidth: 1.8,
  /** Separates the row from a footer block, not from another row. */
  footerSeparatorInset: 16,
} as const;

export function SettingsIdentity({
  leading,
  title,
  subtitle,
  caption,
  trailing,
  footer,
  onPress,
  accessibilityLabel,
}: {
  leading: ReactNode;
  title: string;
  /** Second line, e.g. email or registered business name. */
  subtitle?: string | null;
  /** Third line, e.g. phone number. */
  caption?: string | null;
  /** Status pill or similar, right of the text and left of the chevron. */
  trailing?: ReactNode;
  /** Block below a hairline inside the same card, e.g. today's stats. */
  footer?: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  const colors = useThemeColors();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: SETTINGS_GROUP.radius,
        borderCurve: "continuous",
        overflow: "hidden",
        marginHorizontal: SETTINGS_GROUP.marginHorizontal,
        marginBottom: SETTINGS_GROUP.marginBottom,
      }}
    >
      <Pressable
        className="flex-row items-center gap-2 px-4 py-3.5 active:opacity-60"
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          onPress();
        }}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {leading}

        <View className="flex-1">
          <Text
            weight="semibold"
            numberOfLines={1}
            maxFontSizeMultiplier={1.3}
            style={{
              fontSize: SETTINGS_IDENTITY.titleFontSize,
              letterSpacing: SETTINGS_IDENTITY.titleLetterSpacing,
            }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              weight="medium"
              className="text-muted"
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={{ fontSize: SETTINGS_IDENTITY.subtitleFontSize }}
            >
              {subtitle}
            </Text>
          ) : null}
          {caption ? (
            <Text
              className="text-muted"
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
              style={{ fontSize: SETTINGS_IDENTITY.subtitleFontSize }}
            >
              {caption}
            </Text>
          ) : null}
        </View>

        {trailing}

        <ChevronRight
          size={SETTINGS_IDENTITY.chevronSize}
          color={colors.muted}
          strokeWidth={SETTINGS_IDENTITY.chevronStrokeWidth}
        />
      </Pressable>

      {footer ? (
        <>
          <SettingsSeparator inset={SETTINGS_IDENTITY.footerSeparatorInset} />
          {footer}
        </>
      ) : null}
    </View>
  );
}
