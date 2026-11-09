import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { Demo, DemoPage, Note } from "@/gallery/DemoPage";
import { Text } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Pencil, Share } from "lucide-react-native";

// The header's right side: icon buttons, then the "..." menu. This page's own
// header is the live demo.
export default function HeaderMenu() {
  const colors = useThemeColors();
  return (
    <DemoPage inline usage='import { ActionMenu } from "@/components/ui/actions/ActionMenu". Render it in the screen body, never inside headerRight.'>
      <ActionMenu
        accessibilityLabel="Order actions"
        title="Order #1042"
        buttons={[
          { label: "Share tracking link", systemImage: "square.and.arrow.up", icon: Share, onPress: () => Toast.success("Tracking link copied") },
          { label: "Edit order", systemImage: "pencil", icon: Pencil, onPress: () => Toast.info("Editing order #1042") },
        ]}
        actions={[
          { label: "Print kitchen ticket", systemImage: "printer", onPress: () => Toast.success("Ticket printed") },
          { label: "Add 10 min to prep", systemImage: "clock.badge.plus", onPress: () => Toast.info("Ready at 18:40") },
          { label: "Cancel order", systemImage: "xmark.circle", destructive: true, onPress: () => Toast.error("Order #1042 cancelled") },
        ]}
      />
      <Demo title="In the header above">
        <Text weight="medium" style={{ fontSize: 15, color: colors.muted }}>
          Two icon buttons (share, edit) and a menu with a destructive last action. Secondary actions live here; the
          main action is the big button at the bottom of the screen.
        </Text>
      </Demo>
      <Note>iOS: native Stack.Toolbar with a UIMenu in iOS 26 glass. Android: header icon buttons, the menu opens as an alert list.</Note>
    </DemoPage>
  );
}
