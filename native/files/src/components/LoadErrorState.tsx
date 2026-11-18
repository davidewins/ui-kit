import { Text, View } from "@/components/ui";
import { GlassButton } from "@/components/ui/actions/GlassButton";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image } from "expo-image";
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
 * Full-screen error state for a failed data load - Thiings art, headline, one line of
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
      {/* Thiings art at EmptyState's size, not an icon in a grey circle
          (David, 18 Nov: no icon empty or error screens anywhere). The image
          ships with the kit, so every app that syncs this file has it. */}
      <Image
        source={require("@/assets/images/kit/load-error.png")}
        style={{ width: 88, height: 88, marginBottom: 12 }}
        contentFit="contain"
        accessible={false}
      />
      {/* Same title and body type as EmptyState. */}
      <Text
        weight="semibold"
        className="text-center"
        maxFontSizeMultiplier={1.4}
        style={{ fontSize: 17, letterSpacing: -0.3, color: colors.text, maxWidth: 280 }}
      >
        {title}
      </Text>
      <Text
        className="text-center mt-1.5 mb-8"
        maxFontSizeMultiplier={1.4}
        style={{ fontSize: 14, lineHeight: 20, color: colors.muted, maxWidth: 280 }}
      >
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
