import { ComposeHost, SwiftHost } from "@/components/ui/native/NativeHost";
import { Demo, DemoPage, Frame, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Column, HorizontalPager, Text as MText } from "@expo/ui/jetpack-compose";
import { fillMaxSize, paddingAll } from "@expo/ui/jetpack-compose/modifiers";
import { Image, TabView, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, multilineTextAlignment, padding, tabViewStyle } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

const STEPS = [
  { key: "order", symbol: "bag", title: "Order from local stores", body: "Food from places in Swords and Malahide, delivered by local riders." },
  { key: "track", symbol: "bicycle", title: "Track it to your door", body: "See your rider on the map from the kitchen to your door." },
  { key: "pay", symbol: "creditcard", title: "Pay in the app", body: "Card, Apple Pay or Google Pay. No cash needed." },
] as const;

export default function PagerPage() {
  const [page, setPage] = useState(0);
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: import { TabView } from "@expo/ui/swift-ui" with tabViewStyle({ type: "page" }).'
          : 'Compose: import { HorizontalPager } from "@expo/ui/jetpack-compose".'
      }
    >
      <Demo title={`How VOID works, page ${page + 1} of ${STEPS.length}`}>
        <Frame height={300}>{isIOS ? <SwiftPager onPage={setPage} /> : <ComposePager onPage={setPage} />}</Frame>
      </Demo>
      <Note>{isIOS ? "Android: Compose HorizontalPager." : "iOS: SwiftUI TabView in the page style."}</Note>
    </DemoPage>
  );
}

function SwiftPager({ onPage }: { onPage: (i: number) => void }) {
  const colors = useThemeColors();
  return (
    <SwiftHost style={{ flex: 1 }}>
      <TabView
        defaultSelection={STEPS[0].key}
        onSelectionChange={(k) => onPage(STEPS.findIndex((s) => s.key === k))}
        modifiers={[tabViewStyle({ type: "page", indexDisplayMode: "always" })]}
      >
        {STEPS.map((s) => (
          <TabView.Tab key={s.key} value={s.key}>
            <VStack spacing={12} modifiers={[padding({ all: 28 })]}>
              <Image systemName={s.symbol} size={44} color={colors.text} />
              <Text modifiers={[font({ family: "Geist-SemiBold", size: 21 }), multilineTextAlignment("center")]}>{s.title}</Text>
              <Text modifiers={[font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.muted), multilineTextAlignment("center")]}>{s.body}</Text>
            </VStack>
          </TabView.Tab>
        ))}
      </TabView>
    </SwiftHost>
  );
}

function ComposePager({ onPage }: { onPage: (i: number) => void }) {
  const colors = useThemeColors();
  return (
    <ComposeHost style={{ flex: 1 }}>
      <HorizontalPager onSettledPageChange={onPage} pageSpacing={16} modifiers={[fillMaxSize()]}>
        {STEPS.map((s) => (
          <Column key={s.key} horizontalAlignment="center" verticalArrangement="center" modifiers={[fillMaxSize(), paddingAll(28)]}>
            <MText style={{ fontFamily: "Geist-SemiBold", fontSize: 21, textAlign: "center" }}>{s.title}</MText>
            <MText color={colors.muted} style={{ fontFamily: "Geist-Medium", fontSize: 15, textAlign: "center" }}>{s.body}</MText>
          </Column>
        ))}
      </HorizontalPager>
    </ComposeHost>
  );
}
