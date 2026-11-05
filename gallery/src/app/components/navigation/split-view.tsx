import { SwiftHost } from "@/components/ui/native/NativeHost";
import { Demo, DemoPage, Frame, Note, isIOS } from "@/gallery/DemoPage";
import { STORES } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Button, List, NavigationSplitView, Text, VStack, type NavigationSplitViewColumn } from "@expo/ui/swift-ui";
import { font, foregroundStyle, navigationBarTitleDisplayMode, navigationTitle, padding } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

// Sidebar + detail. On iPhone it collapses to one column; on iPad both show.
export default function SplitViewPage() {
  if (!isIOS) {
    return (
      <DemoPage usage="SwiftUI only. Android: a list screen that pushes a detail screen with expo-router.">
        <Note>Android: list and detail as two expo-router screens; @expo/ui has no Compose split view.</Note>
      </DemoPage>
    );
  }
  return <SwiftSplit />;
}

function SwiftSplit() {
  const colors = useThemeColors();
  const [store, setStore] = useState<(typeof STORES)[number]>(STORES[0]);
  const [column, setColumn] = useState<NavigationSplitViewColumn>("sidebar");
  return (
    <DemoPage usage='SwiftUI: import { NavigationSplitView } from "@expo/ui/swift-ui". One column on iPhone, two on iPad.'>
      <Demo title={`Selected: ${store.name}`}>
        <Frame height={440}>
          <SwiftHost style={{ flex: 1 }}>
            <NavigationSplitView preferredCompactColumn={column} onPreferredCompactColumnChange={setColumn}>
              <NavigationSplitView.Sidebar>
                <List modifiers={[navigationTitle("Stores"), navigationBarTitleDisplayMode("inline")]}>
                  {STORES.map((s) => (
                    <Button
                      key={s.name}
                      label={s.name}
                      onPress={() => {
                        setStore(s);
                        setColumn("detail");
                      }}
                    />
                  ))}
                </List>
              </NavigationSplitView.Sidebar>
              <NavigationSplitView.Detail>
                <VStack alignment="leading" spacing={8} modifiers={[padding({ all: 20 }), navigationTitle(store.name), navigationBarTitleDisplayMode("inline")]}>
                  <Text modifiers={[font({ family: "Geist-SemiBold", size: 21 })]}>{store.name}</Text>
                  <Text modifiers={[font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.muted)]}>{store.meta}</Text>
                </VStack>
              </NavigationSplitView.Detail>
            </NavigationSplitView>
          </SwiftHost>
        </Frame>
      </Demo>
      <Note>Android: list and detail as two expo-router screens.</Note>
    </DemoPage>
  );
}
