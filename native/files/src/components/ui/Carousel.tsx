// A horizontal strip of cards that snaps: featured stores, a dish's photos,
// promo tiles. Items are React Native views at a fixed size.
// iOS: SwiftUI horizontal ScrollView with view-aligned snapping.
// Android: Material 3 HorizontalMultiBrowseCarousel (the large item with
// smaller peeking neighbours, items masked as they scroll).
import { HorizontalMultiBrowseCarousel, RNHostView as ComposeRNHostView } from "@expo/ui/jetpack-compose";
import { height as composeHeight } from "@expo/ui/jetpack-compose/modifiers";
import { HStack, RNHostView, ScrollView } from "@expo/ui/swift-ui";
import { padding, scrollTargetBehavior, scrollTargetLayout } from "@expo/ui/swift-ui/modifiers";
import type { ReactElement } from "react";
import { Platform, View } from "react-native";
import { ComposeHost, SwiftHost } from "./NativeHost";

export interface CarouselProps<T> {
  data: readonly T[];
  keyExtractor: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactElement;
  /** Width of one card. */
  itemWidth: number;
  /** Height of the strip (and of every card). */
  height: number;
}

export function Carousel<T>({ data, keyExtractor, renderItem, itemWidth, height }: CarouselProps<T>) {
  if (Platform.OS === "ios") {
    return (
      <SwiftHost style={{ height }}>
        <ScrollView axes="horizontal" showsIndicators={false} modifiers={[scrollTargetBehavior("viewAligned")]}>
          <HStack spacing={12} modifiers={[scrollTargetLayout(), padding({ horizontal: 16 })]}>
            {data.map((item, i) => (
              <RNHostView key={keyExtractor(item, i)} matchContents>
                <View style={{ width: itemWidth, height }}>{renderItem(item, i)}</View>
              </RNHostView>
            ))}
          </HStack>
        </ScrollView>
      </SwiftHost>
    );
  }

  return (
    <ComposeHost style={{ height }}>
      <HorizontalMultiBrowseCarousel
        preferredItemWidth={itemWidth}
        itemSpacing={8}
        contentPadding={{ start: 16, end: 16 }}
        modifiers={[composeHeight(height)]}
      >
        {data.map((item, i) => (
          <ComposeRNHostView key={keyExtractor(item, i)}>
            <View style={{ width: itemWidth, height }}>{renderItem(item, i)}</View>
          </ComposeRNHostView>
        ))}
      </HorizontalMultiBrowseCarousel>
    </ComposeHost>
  );
}
