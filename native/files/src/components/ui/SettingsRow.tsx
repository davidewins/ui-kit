import { Pressable, Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { ChevronRight } from "lucide-react-native";
import { type ComponentType, type ReactNode, useState } from "react";
import { Href, Link } from "expo-router";
import { ActivityIndicator, Pressable as RNPressable } from "react-native";

/**
 * The one account/profile list row. VOID, RIDERS and SELLERS all render this
 * exact geometry; only the content differs per app.
 *
 * Fixed height is the point: a row carrying a switch, a spinner, a version
 * string or nothing at all is the same 52pt tall, so the list reads as a list
 * and not as a pile of differently sized things.
 *
 * Do NOT wrap this in expo-router's <Link asChild> from outside. Link clones
 * its child with an object spread, which evaluates a function `style` prop
 * (the className active: state) to {} and drops every style - that is what
 * collapsed VOID's rows to 20pt. Pass `href` instead: the row renders its own
 * Link around a plain-object-style Pressable, with the iOS peek preview.
 */
export const SETTINGS_ROW = {
  /** Fixed, never min-height. */
  height: 52,
  /** Matches the card's own horizontal padding. */
  paddingHorizontal: 16,
  /** Fixed-width glyph box so every label starts on the same x. */
  glyphWidth: 24,
  /** Glyph box to label. */
  gap: 12,
  /** 16 padding + 24 glyph + 12 gap - the separator starts under the label. */
  separatorInset: 52,
  iconSize: 20,
  iconStrokeWidth: 1.8,
  chevronSize: 16,
  chevronStrokeWidth: 2,
  labelFontSize: 15,
  labelLetterSpacing: -0.2,
  /** Caps dynamic-type growth so a large-text user does not clip the row. */
  labelMaxFontSizeMultiplier: 1.4,
} as const;

export type SettingsIcon = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

export interface SettingsRowProps {
  label: string;
  Icon: SettingsIcon;
  onPress?: () => void;
  /** Destination: the row becomes a Link with a long-press peek preview. */
  href?: Href;
  /** Rows that go somewhere get a chevron. Rows that act in place do not. */
  navigates?: boolean;
  /** Logout / delete: icon and label take the error colour. */
  destructive?: boolean;
  /** Muted text before the accessory (version string, "Stripe . Bank"). */
  trailing?: string;
  /** Unresolved attention marker, e.g. payouts not set up yet. */
  alert?: boolean;
  /** Count badge, switch, or anything else sitting left of the chevron. */
  accessory?: ReactNode;
  /** Swaps the glyph for a spinner and blocks the press. */
  loading?: boolean;
  disabled?: boolean;
  onLongPress?: () => void;
}

export function SettingsRow({
  label,
  Icon,
  onPress,
  href,
  navigates = false,
  destructive = false,
  trailing,
  alert = false,
  accessory,
  loading = false,
  disabled = false,
  onLongPress,
}: SettingsRowProps) {
  const colors = useThemeColors();
  const blocked = loading || disabled;
  const glyphColor = destructive ? colors.error : colors.muted;
  const [pressed, setPressed] = useState(false);

  const rowStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    height: SETTINGS_ROW.height,
    paddingHorizontal: SETTINGS_ROW.paddingHorizontal,
    columnGap: SETTINGS_ROW.gap,
  };
  const a11y = {
    accessibilityLabel: label,
    accessibilityHint: navigates ? `Opens ${label}` : undefined,
    accessibilityState: { busy: loading, disabled: blocked },
  };

  const content = (
    <>
      <View
        style={{ width: SETTINGS_ROW.glyphWidth, alignItems: "center" }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={colors.muted} />
        ) : (
          <Icon
            size={SETTINGS_ROW.iconSize}
            color={glyphColor}
            strokeWidth={SETTINGS_ROW.iconStrokeWidth}
          />
        )}
      </View>

      <Text
        weight="medium"
        className="flex-1"
        numberOfLines={1}
        maxFontSizeMultiplier={SETTINGS_ROW.labelMaxFontSizeMultiplier}
        style={[
          {
            fontSize: SETTINGS_ROW.labelFontSize,
            letterSpacing: SETTINGS_ROW.labelLetterSpacing,
          },
          destructive ? { color: colors.error } : null,
        ]}
      >
        {label}
      </Text>

      {trailing ? (
        <Text
          className="text-muted text-xs"
          numberOfLines={1}
          maxFontSizeMultiplier={SETTINGS_ROW.labelMaxFontSizeMultiplier}
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {trailing}
        </Text>
      ) : null}

      {alert ? (
        <View
          accessibilityLabel={`${label} needs attention`}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.error,
          }}
        />
      ) : null}

      {accessory}

      {navigates ? (
        <ChevronRight
          size={SETTINGS_ROW.chevronSize}
          color={colors.muted}
          strokeWidth={SETTINGS_ROW.chevronStrokeWidth}
        />
      ) : null}
    </>
  );

  if (href) {
    // Plain object style (pressed dim from state, not className active:) so
    // Link's clone keeps it. The Link navigates; onPress only adds a haptic.
    return (
      <Link href={href} asChild>
        <Link.Trigger>
          <RNPressable
            style={{ ...rowStyle, opacity: pressed ? 0.6 : 1 }}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onPress?.();
            }}
            disabled={blocked}
            accessibilityRole="link"
            {...a11y}
          >
            {content}
          </RNPressable>
        </Link.Trigger>
        <Link.Preview />
      </Link>
    );
  }

  return (
    <Pressable
      className="flex-row items-center active:opacity-60"
      style={rowStyle}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      onLongPress={onLongPress}
      disabled={blocked}
      accessibilityRole="button"
      {...a11y}
    >
      {content}
    </Pressable>
  );
}
