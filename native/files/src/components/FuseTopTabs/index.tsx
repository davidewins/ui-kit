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
  /** Tab to open on (e.g. a deep link into Analytics > Customers). */
  initialIndex?: number;
  /** false: panes change only from the control, never by a sideways swipe.
   *  Use it when a pane holds something that swipes sideways itself (a
   *  calendar's weeks, a chart scrub), or the pager takes the swipe. */
  swipeable?: boolean;
};

export const FuseTopTabs: FC<Props> = ({ tabs, style, onTabChange, variant, initialIndex = 0, swipeable = true }) => {
  const { width } = useWindowDimensions();
  const horizontalListRef = useRef<FlatList>(null);
  // iOS floats the native tab bar over the panes; Android lays them out above
  // it. Outside the tab navigator the context is undefined, so no room needed.
  const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0;
  const paneBottomInset = Platform.OS === "ios" ? tabBarHeight : 0;

  const startIndex = Math.min(Math.max(0, initialIndex), Math.max(0, tabs.length - 1));
  const horizontalListOffsetX = useSharedValue(startIndex * width);
  const isHorizontalListScrollingX = useSharedValue(false);
  const prevActiveTabIndex = useSharedValue(startIndex);
  const activeTabIndex = useSharedValue(startIndex);

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
        initialScrollIndex={startIndex}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        pagingEnabled
        scrollEnabled={swipeable}
        decelerationRate="fast"
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={false}
      />
    </View>
  );
};
