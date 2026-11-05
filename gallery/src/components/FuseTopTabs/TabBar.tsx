// ui-kit: copy of davidewins/ui-kit native/files/src/components/FuseTopTabs/TabBar.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { SegmentedControl } from "@/components/ui/inputs/SegmentedControl";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import React, { FC, RefObject, useState } from "react";
import { FlatList, Platform, useWindowDimensions, View } from "react-native";
import {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";
import { TabIndicator } from "./TabIndicator";
import { TabItem } from "./TabItem";

export type FuseTabsVariant = "native" | "pill";

export type FuseTab = {
  label: string;
  value: number;
  content: React.ReactNode;
};

const _sidePadding = 16;
const _trackPadding = 4;

type Props = {
  variant: FuseTabsVariant;
  tabs: FuseTab[];
  horizontalListRef: RefObject<FlatList<any> | null>;
  horizontalListOffsetX: SharedValue<number>;
  isHorizontalListScrollingX: SharedValue<boolean>;
  activeTabIndex: SharedValue<number>;
  prevActiveTabIndex: SharedValue<number>;
};

// variant "native" on iOS: the kit's native SegmentedControl (SwiftUI segmented Picker, Liquid
// Glass on iOS 26), kept in step with the pager - a swipe updates it on settle.
// Elsewhere: equal-width segmented control. Every tab is flex:1 so any count
// (3, 4, 5...) fills the bar and fits without horizontal scroll or clipping -
// the old content-width FlatList let a 4th tab scroll off-screen. The active
// pill slides between fixed slots (slotWidth = inner track width / tabCount).
export const TabBar: FC<Props> = ({
  variant,
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
  const [selected, setSelected] = useState(() => activeTabIndex.get());

  useAnimatedReaction(
    () => activeTabIndex.get(),
    (current, prev) => {
      if (current !== prev) runOnJS(setSelected)(current);
    },
  );

  const goTo = (index: number) => {
    prevActiveTabIndex.set(activeTabIndex.get());
    activeTabIndex.set(tabs[index].value);
    setTimeout(() => prevActiveTabIndex.set(tabs[index].value), 300);
    horizontalListRef.current?.scrollToIndex({ index, animated: true });
  };

  if (variant === "native" && Platform.OS === "ios") {
    return (
      <View style={{ marginHorizontal: _sidePadding, marginBottom: 8 }}>
        <SegmentedControl
          values={tabs.map((t) => t.label)}
          selectedIndex={selected}
          onChange={goTo}
          size="large"
        />
      </View>
    );
  }

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
            Haptics.selectionAsync().catch(() => {});
            goTo(index);
          }}
        />
      ))}
    </View>
  );
};
