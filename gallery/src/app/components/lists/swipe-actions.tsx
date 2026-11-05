import { SwiftHost } from "@/components/ui/native/NativeHost";
import { Demo, DemoPage, Frame, Note, isIOS } from "@/gallery/DemoPage";
import { ORDERS } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Button, HStack, List, Section, Spacer, SwipeActions, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, listStyle, scrollContentBackground, tint } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

// Remixed from SELLERS' products list (SwiftUI List + SwipeActions on iOS).
export default function SwipeActionsPage() {
  if (!isIOS) {
    return (
      <DemoPage usage="SwiftUI only: SwipeActions works inside a SwiftUI List.">
        <Note>
          Android: @expo/ui has no Compose swipe actions. SELLERS uses ReanimatedSwipeable rows on Android; for one
          shared API use ContextMenu (long press).
        </Note>
      </DemoPage>
    );
  }
  return <SwiftSwipe />;
}

function SwiftSwipe() {
  const colors = useThemeColors();
  const [orders, setOrders] = useState(() => [...ORDERS]);
  const [pinned, setPinned] = useState<string[]>([]);
  return (
    <DemoPage usage='SwiftUI: import { List, SwipeActions } from "@expo/ui/swift-ui". Every swipe action also lives on the order screen.'>
      <Demo title="Swipe left to cancel or mark ready, right to pin">
        <Frame height={400}>
          <SwiftHost style={{ flex: 1 }}>
            <List modifiers={[listStyle("insetGrouped"), scrollContentBackground("hidden")]}>
              <Section title="Kitchen queue">
                {orders.map((o) => (
                  <SwipeActions key={o.id}>
                    <HStack>
                      <VStack alignment="leading" spacing={2}>
                        <Text modifiers={[font({ family: "Geist-SemiBold", size: 15 })]}>
                          {`${pinned.includes(o.id) ? "Pinned  " : ""}#${o.id} ${o.customer}`}
                        </Text>
                        <Text modifiers={[font({ family: "Geist-Medium", size: 13 }), foregroundStyle(colors.muted)]}>{o.items}</Text>
                      </VStack>
                      <Spacer />
                      <Text modifiers={[font({ family: "Geist-Medium", size: 15 })]}>{o.total}</Text>
                    </HStack>
                    <SwipeActions.Actions edge="trailing" allowsFullSwipe={false}>
                      <Button
                        label="Cancel"
                        systemImage="xmark"
                        role="destructive"
                        onPress={() => {
                          setOrders((l) => l.filter((x) => x.id !== o.id));
                          Toast.error(`#${o.id} cancelled`);
                        }}
                      />
                      <Button label="Ready" systemImage="checkmark" modifiers={[tint(colors.success)]} onPress={() => Toast.success(`#${o.id} ready`)} />
                    </SwipeActions.Actions>
                    <SwipeActions.Actions edge="leading">
                      <Button
                        label={pinned.includes(o.id) ? "Unpin" : "Pin"}
                        systemImage="pin"
                        modifiers={[tint(colors.text)]}
                        onPress={() => setPinned((l) => (l.includes(o.id) ? l.filter((x) => x !== o.id) : [...l, o.id]))}
                      />
                    </SwipeActions.Actions>
                  </SwipeActions>
                ))}
              </Section>
            </List>
          </SwiftHost>
        </Frame>
      </Demo>
      <Note>Android: no Compose swipe actions in @expo/ui; use ContextMenu (long press).</Note>
    </DemoPage>
  );
}
