// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/primitives/LegendList.tsx. Edit it there and sync; local edits fail ui-kit:check.
import {
  LegendList as DefaultLegendList,
  LegendListProps,
  LegendListRef,
} from "@legendapp/list";
import {
  TabPaneHeaderContext,
  useTabPaneBottomInset,
  withBottomInset,
} from "@/hooks/useTabPaneBottomInset";
import React from "react";
import { withUniwind } from "uniwind";
import { KEYBOARD_DISMISS } from "./ScrollView";

const WrappedLegendList = withUniwind(DefaultLegendList);

// Create a typed wrapper that preserves generic types. Inside a FuseTopTabs
// pane it leaves room for the tab bar (see useTabPaneBottomInset).
function LegendListComponent<T>(
  props: LegendListProps<T> & { className?: string },
  ref: React.Ref<LegendListRef>
) {
  const inset = useTabPaneBottomInset();
  // Under a see-through header: the pane's tab control leads the list.
  const header = React.useContext(TabPaneHeaderContext);
  const paneHeader = props.horizontal ? null : header;
  React.useEffect(() => paneHeader?.claim(), [paneHeader]);
  const OwnHeader = props.ListHeaderComponent as any;
  const listHeader = paneHeader ? (
    <>
      {paneHeader.node}
      {OwnHeader ? (React.isValidElement(OwnHeader) ? OwnHeader : <OwnHeader />) : null}
    </>
  ) : (
    props.ListHeaderComponent
  );
  return (
    <WrappedLegendList
      {...KEYBOARD_DISMISS}
      {...(paneHeader ? { contentInsetAdjustmentBehavior: "automatic" } : null)}
      {...(props as any)}
      ref={ref}
      ListHeaderComponent={listHeader}
      contentContainerStyle={withBottomInset(
        props.contentContainerStyle,
        props.horizontal ? 0 : inset,
      )}
    />
  );
}

export const LegendList = React.forwardRef(LegendListComponent) as <T>(
  props: LegendListProps<T> & {
    className?: string;
  } & React.RefAttributes<LegendListRef>
) => React.ReactElement;

// Re-export types for convenience
export type { LegendListRef, LegendListRenderItemProps } from "@legendapp/list";
