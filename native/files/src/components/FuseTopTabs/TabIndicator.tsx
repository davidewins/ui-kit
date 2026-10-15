import { useThemeColors } from "@/hooks/useThemeColors";
import React, { FC } from "react";
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
// Fill is surfaceElevated: a gray pill on the white (surface) track in light,
// and a lighter raised pill on the dark track in dark mode.
export const TabIndicator: FC<Props> = ({
  activeTabIndex,
  slotWidth,
  trackPadding,
  windowWidth,
  horizontalListOffsetX,
  isHorizontalListScrollingX,
}) => {
  const colors = useThemeColors();

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
          backgroundColor: colors.surfaceElevated,
        },
        rStyle,
      ]}
    />
  );
};
