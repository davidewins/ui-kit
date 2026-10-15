// ui-kit: copy of davidewins/ui-kit native/files/src/hooks/useTabPaneBottomInset.ts. Edit it there and sync; local edits fail ui-kit:check.
// Bottom room for scroll content inside a FuseTopTabs pane.
//
// iOS only insets the scroll view it treats as the screen's primary one for the
// floating native tab bar. A pane's vertical list sits inside FuseTopTabs'
// horizontal pager, so iOS never adjusts it and the last rows end up hidden
// under the tab bar. FuseTopTabs provides the measured bar height here, and the
// ui ScrollView / FlatList / LegendList wrappers add it to their bottom padding.

import { createContext, useContext } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";

export const TabPaneBottomInsetContext = createContext(0);

export function useTabPaneBottomInset() {
  return useContext(TabPaneBottomInsetContext);
}

// Adds `inset` on top of whatever bottom padding the style already sets.
export function withBottomInset(
  style: StyleProp<ViewStyle>,
  inset: number,
): StyleProp<ViewStyle> {
  if (!inset) return style;
  const flat = StyleSheet.flatten(style) ?? {};
  const base = flat.paddingBottom ?? flat.paddingVertical ?? flat.padding ?? 0;
  return [flat, { paddingBottom: (typeof base === "number" ? base : 0) + inset }];
}
