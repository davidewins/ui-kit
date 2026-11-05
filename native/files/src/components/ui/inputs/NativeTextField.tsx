// A platform text field: the system keyboard, autofill, password manager and
// text selection come from the OS. Same job as the kit Input, drawn natively:
// iOS: SwiftUI TextField (SecureField when `secure`) in the kit's 16pt
// continuous outline, label above in Geist. Android: Material 3
// OutlinedTextField with its floating label and supporting text.
//
// Controlled: `value` + `onChangeText`. An error replaces the hint.
import { OutlinedTextField, Text as ComposeText } from "@expo/ui/jetpack-compose";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { SecureField, TextField, useNativeState } from "@expo/ui/swift-ui";
import {
  font,
  keyboardType as keyboardTypeModifier,
  padding,
  strokeBorder,
  textContentType,
  textFieldStyle,
} from "@expo/ui/swift-ui/modifiers";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { ComposeHost, SwiftHost } from "../native/NativeHost";
import { Text } from "../primitives/Text";
import { View } from "../primitives/View";

export type NativeTextFieldKeyboard = "default" | "email" | "number" | "decimal" | "phone";

export interface NativeTextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Hides the text (passwords, PINs). */
  secure?: boolean;
  keyboard?: NativeTextFieldKeyboard;
  /** Helper line under the field. */
  hint?: string;
  /** Replaces the hint and turns the outline red. */
  error?: string;
  disabled?: boolean;
}

const IOS_KEYBOARD = {
  default: "default",
  email: "email-address",
  number: "numeric",
  decimal: "decimal-pad",
  phone: "phone-pad",
} as const;

const ANDROID_KEYBOARD = {
  default: "text",
  email: "email",
  number: "number",
  decimal: "decimal",
  phone: "phone",
} as const;

export function NativeTextField({
  label,
  value,
  onChangeText,
  placeholder,
  secure = false,
  keyboard = "default",
  hint,
  error,
  disabled = false,
}: NativeTextFieldProps) {
  const colors = useThemeColors();
  const text = useNativeState(value);
  const [focused, setFocused] = useState(false);

  // Keep the native field in step when the parent changes the value (e.g. clears it).
  useEffect(() => {
    if (text.get() !== value) text.set(value);
  }, [text, value]);

  const footer = error ?? hint;

  if (Platform.OS === "ios") {
    const ring = error ? colors.error : focused ? colors.tint : colors.border;
    const modifiers = [
      textFieldStyle("plain" as const),
      font({ family: "Geist-Regular", size: 16 }),
      keyboardTypeModifier(IOS_KEYBOARD[keyboard]),
      ...(secure ? [textContentType("password" as const)] : keyboard === "email" ? [textContentType("emailAddress" as const)] : []),
      padding({ horizontal: 14, vertical: 13 }),
      strokeBorder({ content: ring, style: { lineWidth: 0.75 }, shape: "roundedRectangle", cornerRadius: 16 }),
    ];
    const fieldProps = {
      text,
      placeholder,
      onTextChange: onChangeText,
      onFocusChange: setFocused,
      modifiers,
    };
    return (
      <View style={{ opacity: disabled ? 0.5 : 1 }} pointerEvents={disabled ? "none" : "auto"}>
        <Text weight="medium" style={{ fontSize: 13, color: colors.muted, marginBottom: 6, paddingHorizontal: 4 }}>
          {label}
        </Text>
        <SwiftHost matchContents={{ vertical: true }}>
          {secure ? <SecureField {...fieldProps} /> : <TextField {...fieldProps} />}
        </SwiftHost>
        {footer ? (
          <Text style={{ fontSize: 12, marginTop: 6, paddingHorizontal: 4, color: error ? colors.error : colors.muted }}>
            {footer}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <ComposeHost matchContents={{ vertical: true }}>
      <OutlinedTextField
        value={text}
        onValueChange={onChangeText}
        enabled={!disabled}
        singleLine
        isError={!!error}
        visualTransformation={secure ? "password" : "none"}
        keyboardOptions={{ keyboardType: secure ? "password" : ANDROID_KEYBOARD[keyboard], autoCorrectEnabled: !secure }}
        modifiers={[fillMaxWidth()]}
      >
        <OutlinedTextField.Label>
          <ComposeText>{label}</ComposeText>
        </OutlinedTextField.Label>
        {placeholder ? (
          <OutlinedTextField.Placeholder>
            <ComposeText>{placeholder}</ComposeText>
          </OutlinedTextField.Placeholder>
        ) : null}
        {footer ? (
          <OutlinedTextField.SupportingText>
            <ComposeText>{footer}</ComposeText>
          </OutlinedTextField.SupportingText>
        ) : null}
      </OutlinedTextField>
    </ComposeHost>
  );
}
