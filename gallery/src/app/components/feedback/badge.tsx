import { View } from "@/components/ui";
import { CountBadge } from "@/components/ui/CountBadge";
import { ComposeHost, SwiftHost } from "@/components/ui/NativeHost";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Frame, Note, isIOS } from "@/gallery/DemoPage";
import { Badge, BadgedBox, Icon, Row, Text as MText } from "@expo/ui/jetpack-compose";
import { TabView, Text } from "@expo/ui/swift-ui";
import { badge } from "@expo/ui/swift-ui/modifiers";
import { Bell } from "lucide-react-native";

export default function BadgePage() {
  return (
    <DemoPage usage='import { CountBadge } from "@/components/ui/CountBadge". Native: SwiftUI badge() modifier on tabs, Compose BadgedBox. White text on a red fill.'>
      <Demo title="CountBadge (kit)">
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <View>
            <Bell size={24} />
            <CountBadge count={3} size="sm" style={{ position: "absolute", top: -6, right: -8 }} />
          </View>
          <CountBadge count={12} />
          <CountBadge count={140} />
        </View>
      </Demo>
      {isIOS ? (
        <>
          <Demo title="SwiftUI tab badge">
            <Frame height={160}>
              <SwiftHost style={{ flex: 1 }}>
                <TabView defaultSelection="orders">
                  <TabView.Tab value="orders" label="Orders" systemImage="bag" modifiers={[badge("4")]}>
                    <Text>4 new orders</Text>
                  </TabView.Tab>
                  <TabView.Tab value="chat" label="Messages" systemImage="message" modifiers={[badge("1")]}>
                    <Text>1 unread message</Text>
                  </TabView.Tab>
                </TabView>
              </SwiftHost>
            </Frame>
          </Demo>
          <Note>Android: Compose BadgedBox puts a Badge on an icon.</Note>
        </>
      ) : (
        <>
          <Demo title="Compose BadgedBox">
            <ComposeHost matchContents>
              <Row horizontalArrangement={{ spacedBy: 28 }}>
                <BadgedBox>
                  <BadgedBox.Badge>
                    <Badge>
                      <MText>4</MText>
                    </Badge>
                  </BadgedBox.Badge>
                  <Icon source={MI.list} contentDescription="4 new orders" />
                </BadgedBox>
                <BadgedBox>
                  <BadgedBox.Badge>
                    <Badge />
                  </BadgedBox.Badge>
                  <Icon source={MI.person} contentDescription="Profile needs attention" />
                </BadgedBox>
              </Row>
            </ComposeHost>
          </Demo>
          <Note>iOS: the SwiftUI badge() modifier on a tab or list row.</Note>
        </>
      )}
    </DemoPage>
  );
}
