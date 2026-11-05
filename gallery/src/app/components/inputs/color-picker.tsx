import { View } from "@/components/ui";
import { ColorRow } from "@/components/ui/ColorRow";
import { SwiftHost } from "@/components/ui/NativeHost";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { ColorPicker } from "@expo/ui/swift-ui";
import { Palette } from "lucide-react-native";
import { useState } from "react";

export default function ColorPickerPage() {
  const [accent, setAccent] = useState("#dc2626");
  const [label, setLabel] = useState<string | null>("#000000");
  return (
    <DemoPage usage='import { ColorRow } from "@/components/ui/ColorRow". iOS: SwiftUI ColorPicker. Android: the colour shown read-only (Compose has no colour picker).'>
      <Demo title="ColorRow: storefront accent">
        <View style={{ marginHorizontal: -20 }}>
          <SettingsGroup>
            <ColorRow label="Accent" Icon={Palette} value={accent} onChange={setAccent} />
          </SettingsGroup>
        </View>
      </Demo>
      {isIOS ? (
        <Demo title="SwiftUI ColorPicker with opacity">
          <SwiftHost matchContents={{ vertical: true }}>
            <ColorPicker label="Label print colour" selection={label} onSelectionChange={setLabel} supportsOpacity />
          </SwiftHost>
        </Demo>
      ) : null}
      <Note>{isIOS ? "Android: Compose has no colour picker; ColorRow shows the colour read-only." : "iOS: SwiftUI ColorPicker."}</Note>
    </DemoPage>
  );
}
