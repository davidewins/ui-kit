import React, { FC, PropsWithChildren } from "react";
import { useWindowDimensions, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";

// One pane of the horizontal pager. Panes slide side by side with the swipe
// on every platform (David, 9 Nov: "they're not sliding"). The old iOS-only
// "fuse" effect faded the outgoing pane out over the first 70% of the swipe
// and the incoming one in over the last 30%, which read as a cross-fade.
// The shared values stay in Props so FuseTopTabs' call site is unchanged.

type Props = {
  index: number;
  activeTabIndex: SharedValue<number>;
  prevActiveTabIndex: SharedValue<number>;
  horizontalListOffsetX: SharedValue<number>;
  isHorizontalListScrollingX: SharedValue<boolean>;
};

export const TabItemContainer: FC<PropsWithChildren<Props>> = ({ children }) => {
  const { width } = useWindowDimensions();
  return <View style={{ width, flex: 1 }}>{children}</View>;
};
