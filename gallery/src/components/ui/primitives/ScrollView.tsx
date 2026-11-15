// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/primitives/ScrollView.tsx. Edit it there and sync; local edits fail ui-kit:check.
import {
  TabPaneBottomInsetContext,
  TabPaneHeaderContext,
  useTabPaneBottomInset,
  withBottomInset,
} from "@/hooks/useTabPaneBottomInset";
import React from "react";
import { Platform } from "react-native";
import { ScrollView as RNScrollView } from "react-native-gesture-handler";
import { withUniwind } from "uniwind";

const UniwindScrollView = withUniwind(RNScrollView);

type Props = React.ComponentProps<typeof UniwindScrollView>;

// Every list lets the person put the keyboard away: drag the content
// (iOS follows the finger), or tap anywhere that is not a control. A screen
// can still pass its own values.
export const KEYBOARD_DISMISS = {
  keyboardDismissMode: Platform.OS === "ios" ? "interactive" : "on-drag",
  keyboardShouldPersistTaps: "handled",
} as const;

// Inside a FuseTopTabs pane, a vertical ScrollView leaves room for the tab bar
// (see useTabPaneBottomInset). Nested scroll views get no extra room. Under a
// see-through header it also draws the pane's tab control as its first child.
export const ScrollView = React.forwardRef<React.ComponentRef<typeof UniwindScrollView>, Props>(
  function ScrollView({ contentContainerStyle, children, ...props }, ref) {
    const inset = useTabPaneBottomInset();
    const applied = props.horizontal ? 0 : inset;
    const header = React.useContext(TabPaneHeaderContext);
    const paneHeader = props.horizontal ? null : header;
    React.useEffect(() => paneHeader?.claim(), [paneHeader]);
    return (
      <UniwindScrollView
        ref={ref}
        {...KEYBOARD_DISMISS}
        {...(paneHeader ? { contentInsetAdjustmentBehavior: "automatic" as const } : null)}
        {...props}
        contentContainerStyle={withBottomInset(contentContainerStyle, applied)}
      >
        {paneHeader ? paneHeader.node : null}
        {applied || paneHeader ? (
          <TabPaneBottomInsetContext.Provider value={0}>
            <TabPaneHeaderContext.Provider value={null}>
              {children}
            </TabPaneHeaderContext.Provider>
          </TabPaneBottomInsetContext.Provider>
        ) : (
          children
        )}
      </UniwindScrollView>
    );
  },
);
