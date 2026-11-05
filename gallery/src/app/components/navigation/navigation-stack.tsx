import { SwiftHost } from "@/components/ui/NativeHost";
import { Demo, DemoPage, Frame, Note, isIOS } from "@/gallery/DemoPage";
import { ORDERS } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  HStack,
  LabeledContent,
  List,
  NavigationDestination,
  NavigationLink,
  NavigationStack,
  Section,
  Spacer,
  Text,
} from "@expo/ui/swift-ui";
import { font, foregroundStyle, navigationBarTitleDisplayMode, navigationTitle } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

// A native stack inside one island of a screen. Apps navigate with
// expo-router's Stack; this is for self-contained native flows.
export default function NavigationStackPage() {
  if (!isIOS) {
    return (
      <DemoPage usage="SwiftUI only. Android (and every app screen) navigates with expo-router's Stack.">
        <Note>Android: expo-router Stack screens; @expo/ui has no Compose navigation host.</Note>
      </DemoPage>
    );
  }
  return <SwiftStack />;
}

function SwiftStack() {
  const colors = useThemeColors();
  const [path, setPath] = useState<string[]>([]);
  const muted = [font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.muted)];
  return (
    <DemoPage usage='SwiftUI: import { NavigationStack, NavigationLink, NavigationDestination } from "@expo/ui/swift-ui". Apps navigate with expo-router.'>
      <Demo title={path.length ? `Showing order #${path[path.length - 1]}` : "Tap an order"}>
        <Frame height={440}>
          <SwiftHost style={{ flex: 1 }}>
            <NavigationStack path={path} onPathChange={setPath}>
              <List modifiers={[navigationTitle("Kitchen"), navigationBarTitleDisplayMode("inline")]}>
                <Section title="Today">
                  {ORDERS.map((o) => (
                    <NavigationLink key={o.id} value={o.id}>
                      <HStack>
                        <Text modifiers={[font({ family: "Geist-Medium", size: 15 })]}>{`#${o.id} ${o.customer}`}</Text>
                        <Spacer />
                        <Text modifiers={muted}>{o.status}</Text>
                      </HStack>
                    </NavigationLink>
                  ))}
                </Section>
              </List>
              {ORDERS.map((o) => (
                <NavigationDestination key={o.id} value={o.id}>
                  <List modifiers={[navigationTitle(`Order #${o.id}`), navigationBarTitleDisplayMode("inline")]}>
                    <LabeledContent label="Customer">
                      <Text modifiers={muted}>{o.customer}</Text>
                    </LabeledContent>
                    <LabeledContent label="Items">
                      <Text modifiers={muted}>{o.items}</Text>
                    </LabeledContent>
                    <LabeledContent label="Total">
                      <Text modifiers={muted}>{o.total}</Text>
                    </LabeledContent>
                  </List>
                </NavigationDestination>
              ))}
            </NavigationStack>
          </SwiftHost>
        </Frame>
      </Demo>
      <Note>Android: expo-router Stack screens; there is no Compose navigation host in @expo/ui.</Note>
    </DemoPage>
  );
}
