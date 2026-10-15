import { useThemeColors } from "@/hooks/useThemeColors";
import { LucideIcon } from "lucide-react-native";
import { Image } from "expo-image";
import { FC, ReactElement } from "react";
import type { ImageSourcePropType } from "react-native";
import { GlassButton } from "./GlassButton";
import { Text } from "./Text";
import { View } from "./View";

interface EmptyStateProps {
  /** Lucide icon shown in a soft circular chip above the headline. */
  icon?: LucideIcon;
  /**
   * A Thiings 3D icon PNG (src/assets/images/empty, same set as SELLERS) at
   * 88pt; wins over `icon`. One object that names the thing.
   */
  image?: ImageSourcePropType;
  title: string;
  message?: string;
  /** Optional call-to-action (e.g. "Reset filters", "Browse stores"). */
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactElement<{ size?: number; color?: string }>;
  actionLoading?: boolean;
  /** Fills the parent (centered) vs. sitting inline within scrolling content. */
  fullScreen?: boolean;
}

/**
 * Canonical empty state - soft icon chip, headline, one line of guidance, and an
 * optional glass CTA. Mirrors the home feed's empty treatment so every screen
 * reads as one system. Use for "no results", "nothing here yet", filtered-to-zero.
 */
export const EmptyState: FC<EmptyStateProps> = ({
  icon: Icon,
  image,
  title,
  message,
  actionLabel,
  onAction,
  actionIcon,
  actionLoading = false,
  fullScreen = true,
}) => {
  const colors = useThemeColors();
  return (
    <View
      className={
        fullScreen
          ? "flex-1 items-center justify-center px-8 gap-4"
          : "items-center px-8 pt-24 gap-4"
      }
    >
      <View className="items-center gap-3">
        {image ? (
          <Image
            source={image}
            style={{ width: 88, height: 88, marginBottom: 12 }}
            contentFit="contain"
            accessible={false}
          />
        ) : Icon ? (
          <View
            className="rounded-full items-center justify-center mb-1"
            style={{
              width: 72,
              height: 72,
              backgroundColor: colors.secondaryBackground,
            }}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          >
            <Icon size={32} color={colors.muted} strokeWidth={1.8} />
          </View>
        ) : null}
        <View className="items-center gap-2">
          <Text
            weight="semibold"
            className="text-xl tracking-tight text-center"
          >
            {title}
          </Text>
          {message ? (
            <Text className="text-muted text-center" style={{ lineHeight: 22 }}>
              {message}
            </Text>
          ) : null}
        </View>
      </View>
      {actionLabel && onAction ? (
        <GlassButton
          label={actionLabel}
          tone="primary"
          size="sm"
          fullWidth={false}
          leftIcon={actionIcon}
          loading={actionLoading}
          onPress={onAction}
        />
      ) : null}
    </View>
  );
};
