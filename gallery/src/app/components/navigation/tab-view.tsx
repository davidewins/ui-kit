import { ComposeHost, SwiftHost } from "@/components/ui/native/NativeHost";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Frame, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Box, Column, Icon, NavigationBar, NavigationBarItem, Text as MText } from "@expo/ui/jetpack-compose";
import { fillMaxSize, fillMaxWidth, weight } from "@expo/ui/jetpack-compose/modifiers";
import { TabView, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

const TABS = [
  { key: "orders", label: "Orders", symbol: "bag", icon: MI.list, body: "4 orders in the kitchen" },
  { key: "menu", label: "Menu", symbol: "fork.knife", icon: MI.home, body: "32 items, 3 sold out" },
  { key: "account", label: "Account", symbol: "person", icon: MI.person, body: "Bao House, Swords" },
] as const;

// Tabs inside one island of a screen. App-level tabs are native tabs through
// expo-router (UITabBar / BottomNavigationView), not these.
export default function TabViewPage() {
  const [tab, setTab] = useState<string>("orders");
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: import { TabView } from "@expo/ui/swift-ui". App tabs use expo-router native tabs.'
          : 'Compose: import { NavigationBar, NavigationBarItem } from "@expo/ui/jetpack-compose". App tabs use expo-router native tabs.'
      }
    >
      <Demo title={`Selected: ${TABS.find((t) => t.key === tab)!.label}`}>
        <Frame height={300}>{isIOS ? <SwiftTabs onTab={setTab} /> : <ComposeTabs tab={tab} onTab={setTab} />}</Frame>
      </Demo>
      <Note>{isIOS ? "Android: Compose NavigationBar with NavigationBarItems." : "iOS: SwiftUI TabView."}</Note>
    </DemoPage>
  );
}

function SwiftTabs({ onTab }: { onTab: (k: string) => void }) {
  const colors = useThemeColors();
  return (
    <SwiftHost style={{ flex: 1 }}>
      <TabView defaultSelection="orders" onSelectionChange={onTab}>
        {TABS.map((t) => (
          <TabView.Tab key={t.key} value={t.key} label={t.label} systemImage={t.symbol}>
            <VStack>
              <Text modifiers={[font({ family: "Geist-SemiBold", size: 17 })]}>{t.label}</Text>
              <Text modifiers={[font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.muted)]}>{t.body}</Text>
            </VStack>
          </TabView.Tab>
        ))}
      </TabView>
    </SwiftHost>
  );
}

function ComposeTabs({ tab, onTab }: { tab: string; onTab: (k: string) => void }) {
  const colors = useThemeColors();
  const current = TABS.find((t) => t.key === tab)!;
  return (
    <ComposeHost style={{ flex: 1 }}>
      <Column modifiers={[fillMaxSize()]}>
        <Box contentAlignment="center" modifiers={[fillMaxWidth(), weight(1)]}>
          <Column horizontalAlignment="center">
            <MText style={{ fontFamily: "Geist-SemiBold", fontSize: 17 }}>{current.label}</MText>
            <MText color={colors.muted}>{current.body}</MText>
          </Column>
        </Box>
        <NavigationBar>
          {TABS.map((t) => (
            <NavigationBarItem key={t.key} selected={t.key === tab} onClick={() => onTab(t.key)}>
              <NavigationBarItem.Icon>
                <Icon source={t.icon} contentDescription="" />
              </NavigationBarItem.Icon>
              <NavigationBarItem.Label>
                <MText>{t.label}</MText>
              </NavigationBarItem.Label>
            </NavigationBarItem>
          ))}
        </NavigationBar>
      </Column>
    </ComposeHost>
  );
}
