// ui-kit: copy of davidewins/ui-kit native/files/src/components/FuseTopTabs/TabItemContainer.tsx. Edit it there and sync; local edits fail ui-kit:check.
import React, { FC, PropsWithChildren } from "react";
import { Platform, useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const _translateXGap = 20;

type Props = {
  index: number;
  activeTabIndex: SharedValue<number>;
  prevActiveTabIndex: SharedValue<number>;
  horizontalListOffsetX: SharedValue<number>;
  isHorizontalListScrollingX: SharedValue<boolean>;
};

export const TabItemContainer: FC<PropsWithChildren<Props>> = ({
  children,
  index,
  activeTabIndex,
  prevActiveTabIndex,
  horizontalListOffsetX,
  isHorizontalListScrollingX,
}) => {
  const { width } = useWindowDimensions();

  const rContainerStyle = useAnimatedStyle(() => {
    if (Platform.OS === "android") return {};

    if (
      Math.abs(activeTabIndex.get() - prevActiveTabIndex.get()) > 1 &&
      index !== activeTabIndex.get() &&
      !isHorizontalListScrollingX.get()
    ) {
      return { opacity: 0 };
    }

    const progress = horizontalListOffsetX.get() / width;
    const fadeOut = interpolate(progress, [index, index + 0.7], [1, 0], Extrapolation.CLAMP);
    const fadeIn = interpolate(progress, [index - 0.3, index], [0, 1], Extrapolation.CLAMP);
    const translateXOut = interpolate(
      progress,
      [index, index + 0.7],
      [0, width * 0.7 - _translateXGap],
      Extrapolation.CLAMP
    );
    const translateXIn = interpolate(
      progress,
      [index - 0.3, index],
      [-width * 0.3 + _translateXGap, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity: fadeOut * fadeIn,
      transform: [{ translateX: translateXOut + translateXIn }],
    };
  });

  return (
    <Animated.View style={[{ width, flex: 1 }, rContainerStyle]}>
      {children}
    </Animated.View>
  );
};
