import {
  LegendList as DefaultLegendList,
  LegendListProps,
  LegendListRef,
} from "@legendapp/list";
import React from "react";
import { withUniwind } from "uniwind";

const WrappedLegendList = withUniwind(DefaultLegendList);

// Create a typed wrapper that preserves generic types
function LegendListComponent<T>(
  props: LegendListProps<T> & { className?: string },
  ref: React.Ref<LegendListRef>
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- withUniwind erases generic type params; cast required to bridge generic <T> to wrapped component
  return <WrappedLegendList {...(props as any)} ref={ref} />;
}

export const LegendList = React.forwardRef(LegendListComponent) as <T>(
  props: LegendListProps<T> & {
    className?: string;
  } & React.RefAttributes<LegendListRef>
) => React.ReactElement;

// Re-export types for convenience
export type { LegendListRef, LegendListRenderItemProps } from "@legendapp/list";
