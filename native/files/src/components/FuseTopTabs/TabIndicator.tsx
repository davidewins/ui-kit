import { useThemeColors } from "@/hooks/useThemeColors";
import React, { FC } from "react";
import { useColorScheme } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const _duration = 220;

type Props = {
  activeTabIndex: SharedValue<number>;
  slotWidth: number;
  trackPadding: number;
  windowWidth: number;
  horizontalListOffsetX: SharedValue<number>;
  isHorizontalListScrollingX: SharedValue<boolean>;
};

// Equal-width segmented pill that sits behind the active label. Slides between
// fixed slots - interpolated 1:1 with the pager while swiping, timed on tap.
// The pill is lifted off the grey surface track: the page colour plus a soft
// shadow in light (surfaceElevated #f2f2f7 vanished on the #f5f5f5 track once
// light surfaces went grey), the raised #2c2c2e in dark.
export const TabIndicator: FC<Props> = ({
  activeTabIndex,
  slotWidth,
  trackPadding,
  windowWidth,
  horizontalListOffsetX,
  isHorizontalListScrollingX,
}) => {
  const colors = useThemeColors();
  const dark = useColorScheme() === "dark";

  const rStyle = useAnimatedStyle(() => {
    const idx = isHorizontalListScrollingX.get()
      ? horizontalListOffsetX.get() / windowWidth
      : activeTabIndex.get();
    const target = trackPadding + idx * slotWidth;
    return {
      width: slotWidth,
      left: isHorizontalListScrollingX.get()
        ? target
        : withTiming(target, { duration: _duration }),
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top: trackPadding,
          bottom: trackPadding,
          borderRadius: 9999,
          backgroundColor: dark ? colors.surfaceElevated : colors.background,
          shadowColor: "#000",
          shadowOpacity: dark ? 0 : 0.08,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 1 },
        },
        rStyle,
      ]}
    />
  );
};
