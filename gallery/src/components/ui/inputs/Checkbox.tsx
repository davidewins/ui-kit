// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/inputs/Checkbox.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A tick box for "this and that" choices: allergens on an item, which
// orders to print, accepting terms. One on/off setting is a Switch instead.
// iOS has no checkbox control, so it draws the iOS idiom: a SwiftUI button
// with a filled checkmark circle. Android: Material 3 Checkbox.
import { Checkbox as ComposeCheckbox, Row, Text as ComposeText } from "@expo/ui/jetpack-compose";
import { fillMaxWidth, toggleable } from "@expo/ui/jetpack-compose/modifiers";
import { Button, HStack, Image, Spacer, Text } from "@expo/ui/swift-ui";
import { buttonStyle, disabled as disabledModifier, font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import { Platform } from "react-native";
import { ComposeHost, SwiftHost } from "../native/NativeHost";

export interface CheckboxProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ label, value, onValueChange, disabled = false }: CheckboxProps) {
  const colors = useThemeColors();
  const flip = () => {
    haptic("selection");
    onValueChange(!value);
  };

  if (Platform.OS === "ios") {
    return (
      <SwiftHost matchContents={{ vertical: true }}>
        <Button onPress={flip} modifiers={[buttonStyle("plain"), disabledModifier(disabled)]}>
          <HStack spacing={12}>
            <Image
              systemName={value ? "checkmark.circle.fill" : "circle"}
              size={22}
              color={value ? colors.text : colors.muted}
            />
            <Text modifiers={[font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.text)]}>{label}</Text>
            <Spacer />
          </HStack>
        </Button>
      </SwiftHost>
    );
  }

  return (
    <ComposeHost matchContents={{ vertical: true }}>
      <Row
        verticalAlignment="center"
        horizontalArrangement={{ spacedBy: 4 }}
        modifiers={[fillMaxWidth(), toggleable(value, () => flip(), { enabled: !disabled, role: "checkbox" })]}
      >
        <ComposeCheckbox value={value} enabled={!disabled} />
        <ComposeText style={{ fontFamily: "Geist-Medium", fontSize: 15 }}>{label}</ComposeText>
      </Row>
    </ComposeHost>
  );
}
