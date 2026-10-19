import { TabPaneBottomInsetContext } from "@/hooks/useTabPaneBottomInset";
import React, { FC, useContext, useRef } from "react";
import {
  FlatList,
  Platform,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { BottomTabBarHeightContext } from "react-native-bottom-tabs";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { TabBar, type FuseTab, type FuseTabsVariant } from "./TabBar";
import { TabItemContainer } from "./TabItemContainer";

export type { FuseTab, FuseTabsVariant };

// "native": SwiftUI segmented control on iOS (pill elsewhere).
// "pill": the original FuseTopTabs pill track on every platform.
// Switch a whole app back in one line at startup:
//   setFuseTopTabsVariant("pill");
// or per screen with the `variant` prop.
let defaultVariant: FuseTabsVariant = "native";
export function setFuseTopTabsVariant(variant: FuseTabsVariant) {
  defaultVariant = variant;
}

type Props = {
  tabs: FuseTab[];
  style?: ViewStyle;
  onTabChange?: (index: number) => void;
  variant?: FuseTabsVariant;
};

export const FuseTopTabs: FC<Props> = ({ tabs, style, onTabChange, variant }) => {
  const { width } = useWindowDimensions();
  const horizontalListRef = useRef<FlatList>(null);
  // iOS floats the native tab bar over the panes; Android lays them out above
  // it. Outside the tab navigator the context is undefined, so no room needed.
  const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0;
  const paneBottomInset = Platform.OS === "ios" ? tabBarHeight : 0;

  const horizontalListOffsetX = useSharedValue(0);
  const isHorizontalListScrollingX = useSharedValue(false);
  const prevActiveTabIndex = useSharedValue(0);
  const activeTabIndex = useSharedValue(0);

  const notifyChange = (i: number) => {
    onTabChange?.(i);
  };

  // Bridge: any time the active tab changes (swipe-end OR tab-tap),
  // notify the parent via runOnJS. Lets parents lazy-fetch per tab.
  useAnimatedReaction(
    () => activeTabIndex.get(),
    (current, prev) => {
      if (prev != null && current !== prev) {
        runOnJS(notifyChange)(current);
      }
    },
  );

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: () => {
      isHorizontalListScrollingX.set(true);
    },
    onScroll: (event) => {
      horizontalListOffsetX.set(event.contentOffset.x);
    },
    onMomentumEnd: (event) => {
      isHorizontalListScrollingX.set(false);
      activeTabIndex.set(Math.round(event.contentOffset.x / width));
    },
  });

  return (
    <View style={[{ flex: 1 }, style]}>
      <TabBar
        variant={variant ?? defaultVariant}
        tabs={tabs}
        horizontalListRef={horizontalListRef}
        horizontalListOffsetX={horizontalListOffsetX}
        isHorizontalListScrollingX={isHorizontalListScrollingX}
        activeTabIndex={activeTabIndex}
        prevActiveTabIndex={prevActiveTabIndex}
      />
      <Animated.FlatList
        ref={horizontalListRef}
        style={{ flex: 1 }}
        data={tabs}
        renderItem={({ item, index }) => (
          <TabItemContainer
            index={index}
            activeTabIndex={activeTabIndex}
            prevActiveTabIndex={prevActiveTabIndex}
            horizontalListOffsetX={horizontalListOffsetX}
            isHorizontalListScrollingX={isHorizontalListScrollingX}
          >
            <TabPaneBottomInsetContext.Provider value={paneBottomInset}>
              {item.content}
            </TabPaneBottomInsetContext.Provider>
          </TabItemContainer>
        )}
        keyExtractor={(item) => item.value.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={false}
      />
    </View>
  );
};
