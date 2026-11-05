import { ComposeHost, SwiftHost } from "@/components/ui/native/NativeHost";
import { MI } from "@/gallery/composeIcons";
import { Demo, DemoPage, Frame, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import {
  Box,
  HorizontalFloatingToolbar,
  Icon,
  IconButton,
  Column,
  Text as MText,
  TopAppBar,
} from "@expo/ui/jetpack-compose";
import { align, fillMaxSize, paddingAll } from "@expo/ui/jetpack-compose/modifiers";
import { Button, NavigationStack, Text, Toolbar, ToolbarItem, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, navigationBarTitleDisplayMode, navigationTitle, padding } from "@expo/ui/swift-ui/modifiers";

// In-island toolbars. App screen headers are expo-router's native header
// (with ActionMenu on the right); these are for native islands.
export default function ToolbarPage() {
  return (
    <DemoPage
      usage={
        isIOS
          ? 'SwiftUI: import { Toolbar, ToolbarItem } from "@expo/ui/swift-ui" inside a NavigationStack. App headers use expo-router + ActionMenu.'
          : 'Compose: import { TopAppBar, HorizontalFloatingToolbar } from "@expo/ui/jetpack-compose". App headers use expo-router + ActionMenu.'
      }
    >
      {isIOS ? <SwiftToolbar /> : <ComposeBars />}
    </DemoPage>
  );
}

function SwiftToolbar() {
  const colors = useThemeColors();
  return (
    <>
      <Demo title="Top bar and bottom bar items">
        <Frame height={320}>
          <SwiftHost style={{ flex: 1 }}>
            <NavigationStack>
              <Toolbar modifiers={[navigationTitle("Order #1042"), navigationBarTitleDisplayMode("inline")]}>
                <VStack alignment="leading" spacing={6} modifiers={[padding({ all: 20 })]}>
                  <Text modifiers={[font({ family: "Geist-SemiBold", size: 17 })]}>Aoife Byrne</Text>
                  <Text modifiers={[font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.muted)]}>2x Pork belly bao, Kimchi fries</Text>
                </VStack>
                <Toolbar.Content>
                  <ToolbarItem placement="topBarTrailing">
                    <Button systemImage="square.and.arrow.up" label="Share" onPress={() => Toast.info("Sharing order #1042")} />
                  </ToolbarItem>
                  <ToolbarItem placement="bottomBar">
                    <Button systemImage="printer" label="Print ticket" onPress={() => Toast.success("Ticket printed")} />
                  </ToolbarItem>
                </Toolbar.Content>
              </Toolbar>
            </NavigationStack>
          </SwiftHost>
        </Frame>
      </Demo>
      <Note>Android: Compose TopAppBar and HorizontalFloatingToolbar.</Note>
    </>
  );
}

function ComposeBars() {
  const colors = useThemeColors();
  return (
    <>
      <Demo title="TopAppBar">
        <ComposeHost matchContents={{ vertical: true }}>
          <TopAppBar windowInsets={{ top: 0 }}>
            <TopAppBar.NavigationIcon>
              <IconButton onClick={() => Toast.info("Back")}>
                <Icon source={MI.arrowBack} contentDescription="Back" />
              </IconButton>
            </TopAppBar.NavigationIcon>
            <TopAppBar.Title>
              <MText>Order #1042</MText>
            </TopAppBar.Title>
            <TopAppBar.Actions>
              <IconButton onClick={() => Toast.info("Search orders")}>
                <Icon source={MI.search} contentDescription="Search" />
              </IconButton>
              <IconButton onClick={() => Toast.info("More")}>
                <Icon source={MI.moreVert} contentDescription="More" />
              </IconButton>
            </TopAppBar.Actions>
          </TopAppBar>
        </ComposeHost>
      </Demo>
      <Demo title="HorizontalFloatingToolbar with its FAB">
        <Frame height={180}>
          <ComposeHost style={{ flex: 1 }}>
            <Box modifiers={[fillMaxSize(), paddingAll(16)]}>
              <Column>
                <MText color={colors.muted}>Map editing: draw your delivery area.</MText>
              </Column>
              <HorizontalFloatingToolbar modifiers={[align("bottomCenter")]}>
                <IconButton onClick={() => Toast.info("Undo")}>
                  <Icon source={MI.arrowBack} contentDescription="Undo" />
                </IconButton>
                <IconButton onClick={() => Toast.info("Clear area")}>
                  <Icon source={MI.delete} contentDescription="Clear area" />
                </IconButton>
                <HorizontalFloatingToolbar.FloatingActionButton onPress={() => Toast.success("Delivery area saved")}>
                  <Icon source={MI.check} contentDescription="Save area" />
                </HorizontalFloatingToolbar.FloatingActionButton>
              </HorizontalFloatingToolbar>
            </Box>
          </ComposeHost>
        </Frame>
      </Demo>
      <Note>iOS: SwiftUI Toolbar items in a NavigationStack.</Note>
    </>
  );
}
