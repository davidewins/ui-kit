// ui-kit: copy of davidewins/ui-kit native/files/src/components/LoadErrorState.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { Text, View } from "@/components/ui";
import { GlassButton } from "@/components/ui/GlassButton";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";

interface LoadErrorStateProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  retrying?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

/**
 * Full-screen error state for a failed data load - icon, headline, one line of
 * guidance, and a solid retry CTA. Used wherever a fetch can fail to render.
 */
export const LoadErrorState: FC<LoadErrorStateProps> = ({
  title = "Something went wrong",
  message = "We couldn't load this. Check your connection and try again.",
  onRetry,
  retrying = false,
  secondaryLabel,
  onSecondary,
}) => {
  const colors = useThemeColors();
  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <View
        className="rounded-full items-center justify-center mb-5"
        style={{ width: 72, height: 72, backgroundColor: colors.secondaryBackground }}
      >
        <Ionicons name="cloud-offline-outline" size={32} color={colors.muted} />
      </View>
      <Text weight="bold" className="text-xl text-center mb-1.5">
        {title}
      </Text>
      <Text className="text-base text-muted text-center mb-8" style={{ lineHeight: 22 }}>
        {message}
      </Text>
      <View className="w-full" style={{ maxWidth: 320, gap: 4 }}>
        <GlassButton label="Try again" onPress={onRetry} loading={retrying} />
        {secondaryLabel && onSecondary ? (
          <GlassButton
            label={secondaryLabel}
            onPress={onSecondary}
            tone="neutral"
            size="md"
          />
        ) : null}
      </View>
    </View>
  );
};
