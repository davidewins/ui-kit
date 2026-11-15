// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/inputs/PickerRow.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A SettingsRow that picks one value from a short list. iOS puts SwiftUI's
// menu Picker in the accessory slot (current value + up/down chevrons, the
// native pop-up menu on tap); elsewhere the row shows the value as trailing
// text and opens an Alert list.
//
// Same 52pt geometry as every SettingsRow, so it drops into a SettingsGroup
// next to switches and links.
import { useThemeColors } from "@/hooks/useThemeColors";
import { Host, Picker, Text as SwiftText } from "@expo/ui/swift-ui";
import {
  disabled as disabledModifier,
  labelsHidden,
  pickerStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import * as Haptics from "expo-haptics";
import { Alert, Platform } from "react-native";
import { SettingsRow, type SettingsIcon } from "../lists/SettingsRow";

export interface PickerOption<T extends string | number> {
  label: string;
  value: T;
}

export interface PickerRowProps<T extends string | number> {
  label: string;
  Icon: SettingsIcon;
  options: readonly PickerOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export function PickerRow<T extends string | number>({
  label,
  Icon,
  options,
  value,
  onChange,
  disabled = false,
}: PickerRowProps<T>) {
  const colors = useThemeColors();
  const current = options.find((o) => o.value === value);

  if (Platform.OS === "ios") {
    return (
      <SettingsRow
        label={label}
        Icon={Icon}
        disabled={disabled}
        accessory={
          <Host ignoreSafeArea="all" matchContents seedColor={colors.muted}>
            <Picker
              label={label}
              selection={value}
              onSelectionChange={(v: T) => {
                Haptics.selectionAsync().catch(() => {});
                onChange(v);
              }}
              modifiers={[
                pickerStyle("menu"),
                labelsHidden(),
                disabledModifier(disabled),
              ]}
            >
              {options.map((o) => (
                <SwiftText key={String(o.value)} modifiers={[tag(o.value)]}>
                  {o.label}
                </SwiftText>
              ))}
            </Picker>
          </Host>
        }
      />
    );
  }

  return (
    <SettingsRow
      label={label}
      Icon={Icon}
      trailing={current?.label}
      navigates
      disabled={disabled}
      onPress={() =>
        Alert.alert(label, undefined, [
          ...options.map((o) => ({
            text: o.value === value ? `${o.label}  ✓` : o.label,
            onPress: () => onChange(o.value),
          })),
          { text: "Cancel", style: "cancel" as const },
        ])
      }
    />
  );
}
