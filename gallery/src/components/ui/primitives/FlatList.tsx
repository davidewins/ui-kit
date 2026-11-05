// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/primitives/FlatList.tsx. Edit it there and sync; local edits fail ui-kit:check.
import {
  useTabPaneBottomInset,
  withBottomInset,
} from "@/hooks/useTabPaneBottomInset";
import React from "react";
import { FlatList as RNFlatList, type FlatListProps } from "react-native";
import { withUniwind } from "uniwind";

const UniwindFlatList = withUniwind(RNFlatList);

// Leaves room for the tab bar inside a FuseTopTabs pane (see
// useTabPaneBottomInset).
function FlatListComponent<T>(
  props: FlatListProps<T> & { className?: string },
  ref: React.Ref<RNFlatList<T>>,
) {
  const inset = useTabPaneBottomInset();
  return (
    <UniwindFlatList
      {...(props as any)}
      ref={ref}
      contentContainerStyle={withBottomInset(
        props.contentContainerStyle,
        props.horizontal ? 0 : inset,
      )}
    />
  );
}

export const FlatList = React.forwardRef(FlatListComponent) as <T>(
  props: FlatListProps<T> & { className?: string } & React.RefAttributes<
      RNFlatList<T>
    >,
) => React.ReactElement;
