import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import React, { FC, RefObject } from "react";
import { FlatList, useWindowDimensions, View } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { TabIndicator } from "./TabIndicator";
import { TabItem } from "./TabItem";

export type FuseTab = {
  label: string;
  value: number;
  content: React.ReactNode;
};

const _sidePadding = 16;
const _trackPadding = 4;

type Props = {
  tabs: FuseTab[];
  horizontalListRef: RefObject<FlatList<any> | null>;
  horizontalListOffsetX: SharedValue<number>;
  isHorizontalListScrollingX: SharedValue<boolean>;
  activeTabIndex: SharedValue<number>;
  prevActiveTabIndex: SharedValue<number>;
};

// Equal-width iOS-style segmented control. Every tab is flex:1 so any count
// (3, 4, 5...) fills the bar and fits without horizontal scroll or clipping -
// the old content-width FlatList let a 4th tab scroll off-screen. The active
// pill slides between fixed slots (slotWidth = inner track width / tabCount).
export const TabBar: FC<Props> = ({
  tabs,
  horizontalListRef,
  horizontalListOffsetX,
  isHorizontalListScrollingX,
  activeTabIndex,
  prevActiveTabIndex,
}) => {
  const colors = useThemeColors();
  const { width: windowWidth } = useWindowDimensions();
  const slotWidth =
    (windowWidth - _sidePadding * 2 - _trackPadding * 2) / tabs.length;

  return (
    <View
      style={{
        marginHorizontal: _sidePadding,
        padding: _trackPadding,
        flexDirection: "row",
        position: "relative",
        borderRadius: 9999,
        backgroundColor: colors.surface,
        marginBottom: 8
      }}
    >
      <TabIndicator
        activeTabIndex={activeTabIndex}
        slotWidth={slotWidth}
        trackPadding={_trackPadding}
        windowWidth={windowWidth}
        horizontalListOffsetX={horizontalListOffsetX}
        isHorizontalListScrollingX={isHorizontalListScrollingX}
      />
      {tabs.map((item, index) => (
        <TabItem
          key={item.value}
          index={index}
          label={item.label}
          horizontalListOffsetX={horizontalListOffsetX}
          onPress={() => {
            prevActiveTabIndex.set(activeTabIndex.get());
            Haptics.selectionAsync().catch(() => {});
            activeTabIndex.set(item.value);
            setTimeout(() => prevActiveTabIndex.set(item.value), 300);
            horizontalListRef.current?.scrollToIndex({ index, animated: true });
          }}
        />
      ))}
    </View>
  );
};
