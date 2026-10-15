// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/Skeleton.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { FC, useEffect } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { View } from "./View";

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

/**
 * A single shimmering placeholder block. Composes into skeleton screens that
 * mirror final layout - always prefer this over a bare ActivityIndicator so
 * loading feels like the content arriving, not the app hanging.
 */
export const Skeleton: FC<SkeletonProps> = ({
  width,
  height = 14,
  radius = 7,
  style,
  className,
}) => {
  const opacity = useSharedValue(0.45);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, [opacity]);

  return (
    <Animated.View
      className={`bg-secondary-background ${className ?? ""}`}
      style={[
        { width, height, borderRadius: radius, borderCurve: "continuous" },
        animatedStyle,
        style,
      ]}
    />
  );
};

/**
 * Convenience list skeleton - N stacked "banner + logo + two lines" cards, the
 * shape used across storefront feeds. Drop in wherever a list is loading.
 */
export const SkeletonList: FC<{ count?: number }> = ({ count = 3 }) => (
  <View className="flex-1 bg-background pt-4">
    {Array.from({ length: count }, (_, i) => (
      <View key={i} className="mx-4 mb-6">
        <Skeleton height={172} radius={14} style={styles.banner} />
        <View className="flex-row mt-2.5 gap-2.5">
          <Skeleton width={40} height={40} radius={10} />
          <View className="flex-1 gap-2 pt-1">
            <Skeleton width="72%" />
            <Skeleton width="48%" />
          </View>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  banner: { width: "100%" },
});
