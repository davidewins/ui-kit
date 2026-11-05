import { ComposeHost, SwiftHost } from "@/components/ui/NativeHost";
import { Demo, DemoPage, Frame, Note, isIOS } from "@/gallery/DemoPage";
import { MENU, STORES } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Card as MCard, Column, LazyColumn, LazyRow, Text as MText } from "@expo/ui/jetpack-compose";
import { paddingAll, width } from "@expo/ui/jetpack-compose/modifiers";
import { HStack, LazyHStack, LazyVStack, ScrollView, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { background, font, foregroundStyle, frame, padding, shapes } from "@expo/ui/swift-ui/modifiers";

// Lazy stacks only build rows as they scroll into view. Apps use LegendList
// for long React Native lists; these are for long native lists.
const MANY = Array.from({ length: 60 }, (_, i) => ({ id: String(1100 + i), total: `€${(12 + (i % 9) * 2.5).toFixed(2)}` }));

export default function LazyStacksPage() {
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: import { LazyVStack, LazyHStack } from "@expo/ui/swift-ui" with .ForEach for data.'
          : 'Compose: import { LazyColumn, LazyRow } from "@expo/ui/jetpack-compose" with .Items for data.'
      }
    >
      {isIOS ? <Swift /> : <Compose />}
    </DemoPage>
  );
}

function Swift() {
  const colors = useThemeColors();
  return (
    <>
      <Demo title="LazyHStack: stores near you">
        <SwiftHost style={{ height: 96 }}>
          <ScrollView axes="horizontal" showsIndicators={false}>
            <LazyHStack spacing={12} modifiers={[padding({ horizontal: 4 })]}>
              <LazyHStack.ForEach data={STORES} keyExtractor={(s) => s.name}>
                {({ item }) => (
                  <VStack
                    alignment="leading"
                    spacing={4}
                    modifiers={[frame({ width: 200, height: 88, alignment: "topLeading" }), padding({ all: 14 }), background(colors.surface, shapes.roundedRectangle({ cornerRadius: 16, roundedCornerStyle: "continuous" }))]}
                  >
                    <Text modifiers={[font({ family: "Geist-SemiBold", size: 15 })]}>{item.name}</Text>
                    <Text modifiers={[font({ family: "Geist-Medium", size: 13 }), foregroundStyle(colors.muted)]}>{item.meta}</Text>
                  </VStack>
                )}
              </LazyHStack.ForEach>
            </LazyHStack>
          </ScrollView>
        </SwiftHost>
      </Demo>
      <Demo title="LazyVStack: 60 past orders">
        <Frame height={320}>
          <SwiftHost style={{ flex: 1 }}>
            <ScrollView>
              <LazyVStack spacing={0} modifiers={[padding({ horizontal: 16 })]}>
                <LazyVStack.ForEach data={MANY} keyExtractor={(o) => o.id}>
                  {({ item }) => (
                    <HStack modifiers={[frame({ height: 48 })]}>
                      <Text modifiers={[font({ family: "Geist-Medium", size: 15 })]}>{`Order #${item.id}`}</Text>
                      <Spacer />
                      <Text modifiers={[font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.muted)]}>{item.total}</Text>
                    </HStack>
                  )}
                </LazyVStack.ForEach>
              </LazyVStack>
            </ScrollView>
          </SwiftHost>
        </Frame>
      </Demo>
      <Note>Android: Compose LazyRow and LazyColumn.</Note>
    </>
  );
}

function Compose() {
  const colors = useThemeColors();
  return (
    <>
      <Demo title="LazyRow: menu">
        <ComposeHost style={{ height: 100 }}>
          <LazyRow horizontalArrangement={{ spacedBy: 12 }}>
            <LazyRow.Items data={MENU} keyExtractor={(m) => m.name}>
              {({ item }) => (
                <MCard modifiers={[width(180)]}>
                  <Column modifiers={[paddingAll(14)]}>
                    <MText style={{ fontFamily: "Geist-SemiBold", fontSize: 15 }}>{item.name}</MText>
                    <MText color={colors.muted}>{item.price}</MText>
                  </Column>
                </MCard>
              )}
            </LazyRow.Items>
          </LazyRow>
        </ComposeHost>
      </Demo>
      <Demo title="LazyColumn: 60 past orders">
        <Frame height={320}>
          <ComposeHost style={{ flex: 1 }}>
            <LazyColumn contentPadding={{ start: 16, end: 16 }}>
              <LazyColumn.Items data={MANY} keyExtractor={(o) => o.id}>
                {({ item }) => (
                  <MText style={{ fontSize: 15, lineHeight: 48 }}>{`Order #${item.id}   ${item.total}`}</MText>
                )}
              </LazyColumn.Items>
            </LazyColumn>
          </ComposeHost>
        </Frame>
      </Demo>
      <Note>iOS: SwiftUI LazyHStack and LazyVStack.</Note>
    </>
  );
}
