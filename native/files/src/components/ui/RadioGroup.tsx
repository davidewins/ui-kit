// Pick one of a short list that should stay visible: delivery or collection
// slot, payout schedule, vehicle type. Long lists go in a PickerRow.
// iOS draws its own idiom (a column of rows with a checkmark on the chosen
// one) in SwiftUI. Android: Material 3 RadioButtons in a selectable group.
import { Column, RadioButton, Row, Text as ComposeText } from "@expo/ui/jetpack-compose";
import { fillMaxWidth, height, selectable, selectableGroup } from "@expo/ui/jetpack-compose/modifiers";
import { Button, Divider, HStack, Image, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { buttonStyle, font, foregroundStyle, frame, padding } from "@expo/ui/swift-ui/modifiers";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import { Fragment } from "react";
import { Platform } from "react-native";
import { ComposeHost, SwiftHost } from "./NativeHost";

export interface RadioOption<T extends string | number> {
  label: string;
  value: T;
}

export interface RadioGroupProps<T extends string | number> {
  options: readonly RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function RadioGroup<T extends string | number>({ options, value, onChange }: RadioGroupProps<T>) {
  const colors = useThemeColors();
  const pick = (v: T) => {
    if (v === value) return;
    haptic("selection");
    onChange(v);
  };

  if (Platform.OS === "ios") {
    return (
      <SwiftHost matchContents={{ vertical: true }}>
        <VStack spacing={0}>
          {options.map((o, i) => (
            <Fragment key={String(o.value)}>
              {i > 0 ? <Divider /> : null}
              <Button onPress={() => pick(o.value)} modifiers={[buttonStyle("plain")]}>
                <HStack modifiers={[frame({ minHeight: 48 }), padding({ horizontal: 4 })]}>
                  <Text modifiers={[font({ family: "Geist-Medium", size: 15 }), foregroundStyle(colors.text)]}>{o.label}</Text>
                  <Spacer />
                  {o.value === value ? <Image systemName="checkmark" size={16} color={colors.text} /> : null}
                </HStack>
              </Button>
            </Fragment>
          ))}
        </VStack>
      </SwiftHost>
    );
  }

  return (
    <ComposeHost matchContents={{ vertical: true }}>
      <Column modifiers={[fillMaxWidth(), selectableGroup()]}>
        {options.map((o) => (
          <Row
            key={String(o.value)}
            verticalAlignment="center"
            horizontalArrangement={{ spacedBy: 4 }}
            modifiers={[fillMaxWidth(), height(48), selectable(o.value === value, () => pick(o.value), "radioButton")]}
          >
            <RadioButton selected={o.value === value} />
            <ComposeText style={{ fontFamily: "Geist-Medium", fontSize: 15 }}>{o.label}</ComposeText>
          </Row>
        ))}
      </Column>
    </ComposeHost>
  );
}
