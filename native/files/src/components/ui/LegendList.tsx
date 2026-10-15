import {
  LegendList as DefaultLegendList,
  LegendListProps,
  LegendListRef,
} from "@legendapp/list";
import {
  useTabPaneBottomInset,
  withBottomInset,
} from "@/hooks/useTabPaneBottomInset";
import React from "react";
import { withUniwind } from "uniwind";

const WrappedLegendList = withUniwind(DefaultLegendList);

// Create a typed wrapper that preserves generic types. Inside a FuseTopTabs
// pane it leaves room for the tab bar (see useTabPaneBottomInset).
function LegendListComponent<T>(
  props: LegendListProps<T> & { className?: string },
  ref: React.Ref<LegendListRef>
) {
  const inset = useTabPaneBottomInset();
  return (
    <WrappedLegendList
      {...(props as any)}
      ref={ref}
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
