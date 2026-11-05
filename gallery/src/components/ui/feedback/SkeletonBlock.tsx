// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/feedback/SkeletonBlock.tsx. Edit it there and sync; local edits fail ui-kit:check.
// Reanimated v4 shimmer block. Replaces "centered spinner on blank screen"
// per DESIGN.md §5.6. Match the final layout's row height + radius and the
// loading state ends up almost invisible at swap time.

import { useThemeColors } from "@/hooks/useThemeColors";
import { useEffect } from "react";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export function SkeletonBlock({
  height = 16,
  width,
  radius = 8,
  className,
}: {
  height?: number;
  width?: number | `${number}%` | string;
  radius?: number;
  className?: string;
}) {
  const colors = useThemeColors();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.set(
      withRepeat(
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      ),
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.get(), [0.5, 1], [0.35, 0.7]),
  }));

  return (
    <Animated.View
      className={className}
      style={[
        {
          height,
          width: width as never,
          borderRadius: radius,
          backgroundColor: colors.border,
          borderCurve: "continuous",
        },
        style,
      ]}
    />
  );
}
