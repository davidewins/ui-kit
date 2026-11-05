import { Text, View } from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { ContextMenu } from "@/components/ui/ContextMenu";
import { Tile } from "@/components/ui/Tile";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { ORDERS } from "@/gallery/demoData";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";

export default function ContextMenuPage() {
  const colors = useThemeColors();
  return (
    <DemoPage usage='import { ContextMenu } from "@/components/ui/ContextMenu". Long press each order.'>
      <Demo title="Long press an order">
        {ORDERS.slice(0, 3).map((o) => (
          <ContextMenu
            key={o.id}
            onPress={() => Toast.info(`Opening order #${o.id}`)}
            actions={[
              { label: "Mark ready", systemImage: "checkmark.circle", onPress: () => Toast.success(`#${o.id} ready for pickup`) },
              { label: "Message customer", systemImage: "message", onPress: () => Toast.info(`Chat with ${o.customer}`) },
              { label: "Cancel order", systemImage: "xmark.circle", destructive: true, onPress: () => Toast.error(`#${o.id} cancelled`) },
            ]}
          >
            <Tile>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text weight="semibold" style={{ fontSize: 15 }}>
                  #{o.id} {o.customer}
                </Text>
                <Badge variant={o.status === "Ready" ? "success" : "default"}>{o.status}</Badge>
              </View>
              <Text weight="medium" style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>
                {o.items}, {o.total}
              </Text>
            </Tile>
          </ContextMenu>
        ))}
      </Demo>
      <Note>
        {isIOS
          ? "Android: the same ContextMenu opens a Material 3 DropdownMenu under the order."
          : "iOS: SwiftUI contextMenu lifts the order and blurs the page."}
      </Note>
    </DemoPage>
  );
}
