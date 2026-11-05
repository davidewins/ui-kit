import { Badge } from "@/components/ui/Badge";
import { ComposeHost, SwiftHost } from "@/components/ui/NativeHost";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Icon, RNHostView as MRNHostView, Row, Text as MText } from "@expo/ui/jetpack-compose";
import { HStack, Image, RNHostView, Text } from "@expo/ui/swift-ui";
import { font } from "@expo/ui/swift-ui/modifiers";

// Every native island starts with a host. The kit's SwiftHost / ComposeHost
// are the @expo/ui Hosts themed black and white; RNHostView puts React Native
// views back inside a native layout.
export default function HostPage() {
  const colors = useThemeColors();
  return (
    <DemoPage usage={'import { SwiftHost, ComposeHost } from "@/components/ui/NativeHost". One host per island, never nested, never the other platform\'s.'}>
      <Demo title="matchContents: sized by its content">
        {isIOS ? (
          <SwiftHost matchContents>
            <HStack spacing={8}>
              <Image systemName="bicycle" size={20} color={colors.text} />
              <Text modifiers={[font({ family: "Geist-Medium", size: 15 })]}>Ciarán is 4 min away</Text>
            </HStack>
          </SwiftHost>
        ) : (
          <ComposeHost matchContents>
            <Row horizontalArrangement={{ spacedBy: 8 }} verticalAlignment="center">
              <Icon source={MI.person} size={20} />
              <MText style={{ fontFamily: "Geist-Medium", fontSize: 15 }}>Ciarán is 4 min away</MText>
            </Row>
          </ComposeHost>
        )}
      </Demo>
      <Demo title="RNHostView: a kit Badge inside a native row">
        {isIOS ? (
          <SwiftHost matchContents>
            <HStack spacing={8}>
              <Text modifiers={[font({ family: "Geist-Medium", size: 15 })]}>Order #1043</Text>
              <RNHostView matchContents>
                <Badge variant="success">Ready</Badge>
              </RNHostView>
            </HStack>
          </SwiftHost>
        ) : (
          <ComposeHost matchContents>
            <Row horizontalArrangement={{ spacedBy: 8 }} verticalAlignment="center">
              <MText style={{ fontFamily: "Geist-Medium", fontSize: 15 }}>Order #1043</MText>
              <MRNHostView matchContents>
                <Badge variant="success">Ready</Badge>
              </MRNHostView>
            </Row>
          </ComposeHost>
        )}
      </Demo>
      <Note>
        {isIOS
          ? "Android: ComposeHost themes Material 3 with the kit colours (no Material purple)."
          : "iOS: SwiftHost sets the tint to the text colour (no system blue)."}
      </Note>
    </DemoPage>
  );
}
