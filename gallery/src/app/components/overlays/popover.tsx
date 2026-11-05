import { Text, View } from "@/components/ui";
import { Popover } from "@/components/ui/overlays/Popover";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function PopoverPage() {
  const colors = useThemeColors();
  const line = (a: string, b: string, strong = false) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 }}>
      <Text weight={strong ? "semibold" : "medium"} style={{ fontSize: 15 }}>{a}</Text>
      <Text weight={strong ? "semibold" : "medium"} style={{ fontSize: 15, color: strong ? colors.text : colors.muted }}>{b}</Text>
    </View>
  );
  return (
    <DemoPage usage='import { Popover } from "@/components/ui/overlays/Popover". iOS: SwiftUI popover (a sheet on iPhone, a popover on iPad). Android: a Compose DropdownMenu panel.'>
      <Demo title="Fee breakdown">
        <View style={{ flexDirection: "row" }}>
          <Popover label="Fees" systemImage="info.circle">
            <View style={{ width: 260, padding: 16 }}>
              {line("Items", "€22.90")}
              {line("Delivery", "€1.60")}
              {line("Service fee", "€0.00")}
              {line("Total", "€24.50", true)}
            </View>
          </Popover>
        </View>
      </Demo>
      <Demo title="Why a payout is on hold">
        <View style={{ flexDirection: "row" }}>
          <Popover label="On hold" systemImage="clock">
            <View style={{ width: 260, padding: 16 }}>
              <Text weight="medium" style={{ fontSize: 15, lineHeight: 21 }}>
                Your bank account changed on Monday, so this payout waits 24 hours as a safety check. It goes out on Tuesday.
              </Text>
            </View>
          </Popover>
        </View>
      </Demo>
      <Note>{isIOS ? "Android: a tonal button opening a Material 3 menu panel with the same content." : "iOS: SwiftUI popover."}</Note>
    </DemoPage>
  );
}
