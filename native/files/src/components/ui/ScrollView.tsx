import {
  TabPaneBottomInsetContext,
  useTabPaneBottomInset,
  withBottomInset,
} from "@/hooks/useTabPaneBottomInset";
import React from "react";
import { ScrollView as RNScrollView } from "react-native-gesture-handler";
import { withUniwind } from "uniwind";

const UniwindScrollView = withUniwind(RNScrollView);

type Props = React.ComponentProps<typeof UniwindScrollView>;

// Inside a FuseTopTabs pane, a vertical ScrollView leaves room for the tab bar
// (see useTabPaneBottomInset). Nested scroll views get no extra room.
export const ScrollView = React.forwardRef<RNScrollView, Props>(
  function ScrollView({ contentContainerStyle, children, ...props }, ref) {
    const inset = useTabPaneBottomInset();
    const applied = props.horizontal ? 0 : inset;
    return (
      <UniwindScrollView
        ref={ref}
        {...props}
        contentContainerStyle={withBottomInset(contentContainerStyle, applied)}
      >
        {applied ? (
          <TabPaneBottomInsetContext.Provider value={0}>
            {children}
          </TabPaneBottomInsetContext.Provider>
        ) : (
          children
        )}
      </UniwindScrollView>
    );
  },
);
