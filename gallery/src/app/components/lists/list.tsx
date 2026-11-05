import { ComposeHost, SwiftHost } from "@/components/ui/NativeHost";
import { BottomSwitch } from "@/gallery/BottomSwitch";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Frame, Note, isIOS } from "@/gallery/DemoPage";
import { MENU, ORDERS } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Icon, LazyColumn, ListItem, Text as MText } from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { HStack, List, Section, Spacer, Text } from "@expo/ui/swift-ui";
import { font, foregroundStyle, listStyle, scrollContentBackground } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

const STYLES = ["Inset grouped", "Plain"] as const;

export default function ListPage() {
  const [style, setStyle] = useState(0);
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: import { List, Section } from "@expo/ui/swift-ui". Apps use SettingsGroup for short lists and LegendList for long ones.'
          : 'Compose: import { LazyColumn, ListItem } from "@expo/ui/jetpack-compose". Apps use SettingsGroup for short lists and LegendList for long ones.'
      }
      bottom={isIOS ? <BottomSwitch values={STYLES} selectedIndex={style} onChange={setStyle} accessibilityLabel="List style" /> : undefined}
    >
      {isIOS ? <SwiftList plain={style === 1} /> : <ComposeList />}
    </DemoPage>
  );
}

function SwiftList({ plain }: { plain: boolean }) {
  const colors = useThemeColors();
  const [items, setItems] = useState(() => [...MENU]);
  return (
    <>
      <Demo title="Menu: swipe to delete, long press to reorder">
        <Frame height={430}>
          <SwiftHost style={{ flex: 1 }}>
            <List modifiers={[listStyle(plain ? "plain" : "insetGrouped"), scrollContentBackground("hidden")]}>
              <Section title="Bao House menu">
                <List.ForEach
                  onDelete={(idx) => {
                    const gone = idx.map((i) => items[i].name).join(", ");
                    setItems((l) => l.filter((_, i) => !idx.includes(i)));
                    Toast.success(`${gone} removed`);
                  }}
                  onMove={(src, dst) =>
                    setItems((l) => {
                      const moving = src.map((i) => l[i]);
                      const rest = l.filter((_, i) => !src.includes(i));
                      const at = dst - src.filter((i) => i < dst).length;
                      rest.splice(at, 0, ...moving);
                      return rest;
                    })
                  }
                >
                  {items.map((m) => (
                    <HStack key={m.name}>
                      <Text modifiers={[font({ family: "Geist-Medium", size: 15 })]}>{m.name}</Text>
                      <Spacer />
                      <Text modifiers={[font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.muted)]}>{m.price}</Text>
                    </HStack>
                  ))}
                </List.ForEach>
              </Section>
            </List>
          </SwiftHost>
        </Frame>
      </Demo>
      <Note>Android: Compose LazyColumn of ListItems.</Note>
    </>
  );
}

function ComposeList() {
  const colors = useThemeColors();
  return (
    <>
      <Demo title="Orders: LazyColumn of ListItems">
        <Frame height={430}>
          <ComposeHost style={{ flex: 1 }}>
            <LazyColumn modifiers={[fillMaxWidth()]}>
              <LazyColumn.Items data={ORDERS} keyExtractor={(o) => o.id}>
                {({ item: o }) => (
                  <ListItem colors={{ containerColor: "transparent" }}>
                    <ListItem.OverlineContent>
                      <MText>{`#${o.id}  ${o.status}`}</MText>
                    </ListItem.OverlineContent>
                    <ListItem.HeadlineContent>
                      <MText>{o.customer}</MText>
                    </ListItem.HeadlineContent>
                    <ListItem.SupportingContent>
                      <MText color={colors.muted}>{o.items}</MText>
                    </ListItem.SupportingContent>
                    <ListItem.LeadingContent>
                      <Icon source={MI.person} contentDescription="" />
                    </ListItem.LeadingContent>
                    <ListItem.TrailingContent>
                      <MText>{o.total}</MText>
                    </ListItem.TrailingContent>
                  </ListItem>
                )}
              </LazyColumn.Items>
            </LazyColumn>
          </ComposeHost>
        </Frame>
      </Demo>
      <Note>iOS: SwiftUI List with swipe to delete and drag to reorder.</Note>
    </>
  );
}
