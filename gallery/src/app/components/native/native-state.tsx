import { Text } from "@/components/ui";
import { ComposeHost, SwiftHost } from "@/components/ui/native/NativeHost";
import { NativeButton } from "@/components/ui/actions/NativeButton";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { OutlinedTextField, SyncSwitch, Row, Text as MText } from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { SyncToggle, TextField, useNativeState } from "@expo/ui/swift-ui";
import { font, padding, strokeBorder } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";
import { View } from "react-native";

// useNativeState keeps a value on the native side, so typing and toggling
// never wait for a React render. Read it with .get(), write with .set().
export default function NativeStatePage() {
  const colors = useThemeColors();
  const note = useNativeState("Extra chilli oil please");
  const vat = useNativeState(true);
  const [read, setRead] = useState("");
  return (
    <DemoPage usage='import { useNativeState } from "@expo/ui/swift-ui" (same hook in jetpack-compose), with SyncToggle / SyncSwitch and the native text fields.'>
      <Demo title="A text field bound to native state">
        {isIOS ? (
          <SwiftHost matchContents={{ vertical: true }}>
            <TextField
              text={note}
              placeholder="Note for the kitchen"
              modifiers={[
                font({ family: "Geist-Regular", size: 16 }),
                padding({ horizontal: 14, vertical: 13 }),
                strokeBorder({ content: colors.border, style: { lineWidth: 0.75 }, shape: "roundedRectangle", cornerRadius: 16 }),
              ]}
            />
          </SwiftHost>
        ) : (
          <ComposeHost matchContents={{ vertical: true }}>
            <OutlinedTextField value={note} modifiers={[fillMaxWidth()]}>
              <OutlinedTextField.Label>
                <MText>Note for the kitchen</MText>
              </OutlinedTextField.Label>
            </OutlinedTextField>
          </ComposeHost>
        )}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <NativeButton label="Read value" onPress={() => setRead(note.get())} />
          <NativeButton label="Clear" tone="destructive" onPress={() => note.set("")} />
        </View>
        {read ? <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>{`Read: "${read}"`}</Text> : null}
      </Demo>
      <Demo title="A synced toggle">
        {isIOS ? (
          <SwiftHost matchContents={{ vertical: true }}>
            <SyncToggle isOn={vat} label="Show prices with VAT" />
          </SwiftHost>
        ) : (
          <ComposeHost matchContents={{ vertical: true }}>
            <Row modifiers={[fillMaxWidth()]} horizontalArrangement="spaceBetween" verticalAlignment="center">
              <MText>Show prices with VAT</MText>
              <SyncSwitch isOn={vat} />
            </Row>
          </ComposeHost>
        )}
      </Demo>
      <Note>{isIOS ? "Android: the same hook drives Compose text fields and SyncSwitch." : "iOS: the same hook drives SwiftUI TextField and SyncToggle."}</Note>
    </DemoPage>
  );
}
