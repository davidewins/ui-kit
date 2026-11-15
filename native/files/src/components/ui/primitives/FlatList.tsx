import {
  TabPaneHeaderContext,
  useTabPaneBottomInset,
  withBottomInset,
} from "@/hooks/useTabPaneBottomInset";
import React from "react";
import { FlatList as RNFlatList, type FlatListProps } from "react-native";
import { KEYBOARD_DISMISS } from "./ScrollView";
import { withUniwind } from "uniwind";

const UniwindFlatList = withUniwind(RNFlatList);

// Leaves room for the tab bar inside a FuseTopTabs pane (see
// useTabPaneBottomInset).
function FlatListComponent<T>(
  props: FlatListProps<T> & { className?: string },
  ref: React.Ref<RNFlatList<T>>,
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
    <UniwindFlatList
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

export const FlatList = React.forwardRef(FlatListComponent) as <T>(
  props: FlatListProps<T> & { className?: string } & React.RefAttributes<
      RNFlatList<T>
    >,
) => React.ReactElement;
