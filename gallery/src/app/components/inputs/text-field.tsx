import { Text } from "@/components/ui";
import { ComposeHost, SwiftHost } from "@/components/ui/NativeHost";
import { NativeTextField } from "@/components/ui/NativeTextField";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { BasicTextField, Text as MText, TextField as MTextField } from "@expo/ui/jetpack-compose";
import { fillMaxWidth, paddingAll, background, clip, Shapes } from "@expo/ui/jetpack-compose/modifiers";
import { TextField, useNativeState } from "@expo/ui/swift-ui";
import { font, padding, strokeBorder } from "@expo/ui/swift-ui/modifiers";
import { useState } from "react";

const EIRCODE = /^[A-Z]\d{2} ?[A-Z0-9]{4}$/i;

export default function TextFieldPage() {
  const colors = useThemeColors();
  const [email, setEmail] = useState("aoife@example.com");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [eircode, setEircode] = useState("K67 XW");
  const eircodeError = eircode && !EIRCODE.test(eircode) ? "That Eircode looks short. It's 7 characters, like K67 XW32." : undefined;

  return (
    <DemoPage usage='import { NativeTextField } from "@/components/ui/NativeTextField". iOS: SwiftUI TextField / SecureField. Android: Compose OutlinedTextField.'>
      <Demo title="Email" gap={16}>
        <NativeTextField label="Email" value={email} onChangeText={setEmail} keyboard="email" placeholder="you@example.com" />
      </Demo>
      <Demo title="Password (secure)">
        <NativeTextField label="Password" value={password} onChangeText={setPassword} secure hint="At least 8 characters." />
      </Demo>
      <Demo title="Phone with hint">
        <NativeTextField label="Mobile" value={phone} onChangeText={setPhone} keyboard="phone" placeholder="087 123 4567" hint="Your rider calls this number if they can't find you." />
      </Demo>
      <Demo title="Error">
        <NativeTextField label="Eircode" value={eircode} onChangeText={setEircode} error={eircodeError} />
      </Demo>
      <Demo title="Disabled">
        <NativeTextField label="Store ID" value="bao-house-swords" onChangeText={() => {}} disabled hint="Set by VOID when the store was created." />
      </Demo>
      {isIOS ? <IOSMultiline /> : <AndroidRaw />}
      <Text weight="medium" style={{ fontSize: 13, color: colors.muted, paddingHorizontal: 20, paddingTop: 16 }}>
        {isIOS ? "Android: Compose OutlinedTextField, TextField and BasicTextField." : "iOS: SwiftUI TextField and SecureField."}
      </Text>
    </DemoPage>
  );
}

function IOSMultiline() {
  const colors = useThemeColors();
  const note = useNativeState("Leave at the side door, the bell is broken.");
  return (
    <Demo title="Multi-line (SwiftUI TextField, vertical axis)">
      <SwiftHost matchContents={{ vertical: true }}>
        <TextField
          text={note}
          axis="vertical"
          placeholder="Delivery note"
          modifiers={[
            font({ family: "Geist-Regular", size: 16 }),
            padding({ horizontal: 14, vertical: 13 }),
            strokeBorder({ content: colors.border, style: { lineWidth: 0.75 }, shape: "roundedRectangle", cornerRadius: 16 }),
          ]}
        />
      </SwiftHost>
    </Demo>
  );
}

function AndroidRaw() {
  const colors = useThemeColors();
  const note = useNativeState("Leave at the side door, the bell is broken.");
  const code = useNativeState("");
  return (
    <>
      <Demo title="Filled TextField, multi-line">
        <ComposeHost matchContents={{ vertical: true }}>
          <MTextField value={note} minLines={3} modifiers={[fillMaxWidth()]}>
            <MTextField.Label>
              <MText>Delivery note</MText>
            </MTextField.Label>
          </MTextField>
        </ComposeHost>
      </Demo>
      <Demo title="BasicTextField (unstyled)">
        <ComposeHost matchContents={{ vertical: true }}>
          <BasicTextField
            value={code}
            singleLine
            keyboardOptions={{ keyboardType: "number", imeAction: "done" }}
            textStyle={{ fontSize: 22, color: colors.text, letterSpacing: 6 }}
            modifiers={[fillMaxWidth(), clip(Shapes.RoundedCorner(16)), background(colors.border), paddingAll(14)]}
          >
            <BasicTextField.Placeholder>
              <MText color={colors.muted}>Pickup PIN</MText>
            </BasicTextField.Placeholder>
          </BasicTextField>
        </ComposeHost>
      </Demo>
    </>
  );
}
