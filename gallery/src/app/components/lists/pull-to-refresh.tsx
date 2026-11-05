import { ComposeHost, SwiftHost } from "@/components/ui/NativeHost";
import { Demo, DemoPage, Frame, Note, isIOS } from "@/gallery/DemoPage";
import { ORDERS } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { LazyColumn, ListItem, PullToRefreshBox, Text as MText } from "@expo/ui/jetpack-compose";
import { fillMaxSize } from "@expo/ui/jetpack-compose/modifiers";
import { HStack, List, Spacer, Text } from "@expo/ui/swift-ui";
import { font, foregroundStyle, refreshable } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Native lists refresh natively. React Native lists in the apps use
// RefreshControl on the FlatList / LegendList.
export default function PullToRefreshPage() {
  const [checked, setChecked] = useState(() => new Date());
  const time = checked.toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const refresh = async () => {
    await wait(900);
    setChecked(new Date());
    Toast.success("Orders up to date");
  };
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: refreshable() modifier on a List. React Native lists use RefreshControl.'
          : 'Compose: import { PullToRefreshBox } from "@expo/ui/jetpack-compose". React Native lists use RefreshControl.'
      }
    >
      <Demo title={`Pull down. Last checked ${time}`}>
        <Frame height={360}>{isIOS ? <SwiftRefresh onRefresh={refresh} /> : <ComposeRefresh onRefresh={refresh} />}</Frame>
      </Demo>
      <Note>{isIOS ? "Android: Compose PullToRefreshBox around a LazyColumn." : "iOS: the SwiftUI refreshable() modifier on a List."}</Note>
    </DemoPage>
  );
}

function SwiftRefresh({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const colors = useThemeColors();
  return (
    <SwiftHost style={{ flex: 1 }}>
      <List modifiers={[refreshable(onRefresh)]}>
        {ORDERS.map((o) => (
          <HStack key={o.id}>
            <Text modifiers={[font({ family: "Geist-Medium", size: 15 })]}>{`#${o.id} ${o.customer}`}</Text>
            <Spacer />
            <Text modifiers={[font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.muted)]}>{o.status}</Text>
          </HStack>
        ))}
      </List>
    </SwiftHost>
  );
}

function ComposeRefresh({ onRefresh }: { onRefresh: () => Promise<void> }) {
  const colors = useThemeColors();
  const [refreshing, setRefreshing] = useState(false);
  return (
    <ComposeHost style={{ flex: 1 }}>
      <PullToRefreshBox
        isRefreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          onRefresh().finally(() => setRefreshing(false));
        }}
        indicator={{ color: colors.text }}
        modifiers={[fillMaxSize()]}
      >
        <LazyColumn modifiers={[fillMaxSize()]}>
          {ORDERS.map((o) => (
            <ListItem key={o.id} colors={{ containerColor: "transparent" }}>
              <ListItem.HeadlineContent>
                <MText>{`#${o.id} ${o.customer}`}</MText>
              </ListItem.HeadlineContent>
              <ListItem.TrailingContent>
                <MText color={colors.muted}>{o.status}</MText>
              </ListItem.TrailingContent>
            </ListItem>
          ))}
        </LazyColumn>
      </PullToRefreshBox>
    </ComposeHost>
  );
}
