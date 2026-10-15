import { useThemeColors } from "@/hooks/useThemeColors";
import React, { FC } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export type TabItemProps = {
  index: number;
  label: string;
  horizontalListOffsetX: SharedValue<number>;
  onPress: () => void;
};

export const TabItem: FC<TabItemProps> = ({
  index,
  label,
  horizontalListOffsetX,
  onPress,
}) => {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();

  // Active label = full text; inactive = gray (muted). Interpolated against the
  // pager offset so the colour cross-fades as you swipe between tabs.
  const rTextStyle = useAnimatedStyle(() => {
    const progress = horizontalListOffsetX.get() / width;
    return {
      color: interpolateColor(
        progress,
        [index - 1, index, index + 1],
        [colors.muted, colors.text, colors.muted],
      ),
    };
  });

  return (
    <Pressable
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 7,
        zIndex: 1,
      }}
      onPress={onPress}
    >
      <Animated.Text
        numberOfLines={1}
        style={[{ fontSize: 14, fontFamily: "Geist-SemiBold" }, rTextStyle]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};
