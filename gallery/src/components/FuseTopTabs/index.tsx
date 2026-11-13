// ui-kit: copy of davidewins/ui-kit native/files/src/components/FuseTopTabs/index.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { TabPaneBottomInsetContext, TabPaneHeaderContext, type TabPaneHeader } from "@/hooks/useTabPaneBottomInset";
import React, { FC, useCallback, useContext, useMemo, useRef, useState } from "react";
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
  /** iOS see-through header height (headerTransparent). The tab control then
   *  leads the active pane's own list, which scrolls up under the header the
   *  way Today does; there is no pager or fixed strip, so iOS finds that list
   *  as the screen's scroll view and gives it the Liquid Glass edge. Until a
   *  list takes the control (loading, empty) it sits above the pane, below
   *  the header. */
  headerInset?: number;
};

export const FuseTopTabs: FC<Props> = ({ tabs, style, onTabChange, variant, initialIndex = 0, swipeable = true, headerInset }) => {
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

  const [active, setActive] = useState(startIndex);
  const notifyChange = (i: number) => {
    setActive(i);
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

  const [claims, setClaims] = useState(0);
  const [barHeight, setBarHeight] = useState(0);
  const claim = useCallback(() => {
    setClaims((n) => n + 1);
    return () => setClaims((n) => n - 1);
  }, []);
  const bar = (
    <TabBar
      variant={variant ?? defaultVariant}
      tabs={tabs}
      horizontalListRef={horizontalListRef}
      horizontalListOffsetX={horizontalListOffsetX}
      isHorizontalListScrollingX={isHorizontalListScrollingX}
      activeTabIndex={activeTabIndex}
      prevActiveTabIndex={prevActiveTabIndex}
    />
  );
  const paneHeader = useMemo<TabPaneHeader>(() => ({ node: bar, claim }), [tabs, variant, claim]); // eslint-disable-line react-hooks/exhaustive-deps

  if (headerInset != null) {
    const pane = tabs[Math.min(active, tabs.length - 1)];
    return (
      <View style={[{ flex: 1 }, style]}>
        <TabPaneBottomInsetContext.Provider value={paneBottomInset}>
          <TabPaneHeaderContext.Provider value={paneHeader}>
            <View key={pane?.value} style={{ flex: 1, paddingTop: claims === 0 ? headerInset + barHeight : 0 }}>
              {pane?.content}
            </View>
          </TabPaneHeaderContext.Provider>
        </TabPaneBottomInsetContext.Provider>
        {/* Drawn after the pane so the pane's list stays first in line for iOS. */}
        {claims === 0 ? (
          <View
            onLayout={(e) => setBarHeight(e.nativeEvent.layout.height)}
            style={{ position: "absolute", top: headerInset, left: 0, right: 0 }}
          >
            {bar}
          </View>
        ) : null}
      </View>
    );
  }

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
