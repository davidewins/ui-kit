// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/ColorRow.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A SettingsRow for a colour: SwiftUI's ColorPicker well as the accessory on
// iOS (opens the system colour sheet); elsewhere a read-only swatch.
import { View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ColorPicker, Host } from "@expo/ui/swift-ui";
import { disabled as disabledModifier, labelsHidden } from "@expo/ui/swift-ui/modifiers";
import { Platform, StyleSheet } from "react-native";
import { SettingsRow, type SettingsIcon } from "./SettingsRow";

export interface ColorRowProps {
  label: string;
  Icon: SettingsIcon;
  /** Hex, e.g. "#dc2626". */
  value: string;
  onChange: (value: string) => void;
  supportsOpacity?: boolean;
  disabled?: boolean;
}

export function ColorRow({ label, Icon, value, onChange, supportsOpacity = false, disabled = false }: ColorRowProps) {
  const colors = useThemeColors();
  return (
    <SettingsRow
      label={label}
      Icon={Icon}
      disabled={disabled}
      accessory={
        Platform.OS === "ios" ? (
          <Host matchContents>
            <ColorPicker
              label={label}
              selection={value}
              onSelectionChange={onChange}
              supportsOpacity={supportsOpacity}
              modifiers={[labelsHidden(), disabledModifier(disabled)]}
            />
          </Host>
        ) : (
          <View
            accessibilityLabel={`${label}: ${value}`}
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: value,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.border,
            }}
          />
        )
      }
    />
  );
}
