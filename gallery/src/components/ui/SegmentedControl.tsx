// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/SegmentedControl.tsx. Edit it there and sync; local edits fail ui-kit:check.
// Segmented control. iOS draws SwiftUI's segmented Picker through @expo/ui
// (Liquid Glass on iOS 26, sized by SwiftUI); elsewhere a surface pill track
// with the selected segment lifted onto the page colour.
//
// Controlled: pass selectedIndex and update it in onChange. One selection
// haptic per change, so callers never fire their own.
import { Pressable, Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Host, Picker, Text as SwiftText } from "@expo/ui/swift-ui";
import {
  accessibilityLabel as a11yLabel,
  controlSize,
  disabled as disabledModifier,
  pickerStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import * as Haptics from "expo-haptics";
import { Platform, type StyleProp, type ViewStyle } from "react-native";

export interface SegmentedControlProps {
  values: readonly string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  /** "large" (44pt) for a page-level switch, "regular" (32pt) inside content. */
  size?: "regular" | "large";
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl({
  values,
  selectedIndex,
  onChange,
  size = "regular",
  disabled = false,
  accessibilityLabel,
  style,
}: SegmentedControlProps) {
  const colors = useThemeColors();

  const select = (index: number) => {
    if (index === selectedIndex) return;
    Haptics.selectionAsync().catch(() => {});
    onChange(index);
  };

  if (Platform.OS === "ios") {
    return (
      <Host matchContents={{ vertical: true }} style={style}>
        <Picker
          label={accessibilityLabel ?? ""}
          selection={selectedIndex}
          onSelectionChange={(v: number) => select(v)}
          modifiers={[
            pickerStyle("segmented"),
            controlSize(size),
            disabledModifier(disabled),
            ...(accessibilityLabel ? [a11yLabel(accessibilityLabel)] : []),
          ]}
        >
          {values.map((label, i) => (
            <SwiftText key={label} modifiers={[tag(i)]}>
              {label}
            </SwiftText>
          ))}
        </Picker>
      </Host>
    );
  }

  const height = size === "large" ? 44 : 32;
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          flexDirection: "row",
          height,
          padding: 2,
          borderRadius: height / 2,
          backgroundColor: colors.surface,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {values.map((label, i) => {
        const selected = i === selectedIndex;
        return (
          <Pressable
            key={label}
            disabled={disabled}
            onPress={() => select(i)}
            accessibilityRole="tab"
            accessibilityState={{ selected, disabled }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: (height - 4) / 2,
              backgroundColor: selected ? colors.background : "transparent",
            }}
          >
            <Text
              weight={selected ? "semibold" : "medium"}
              numberOfLines={1}
              style={{ fontSize: size === "large" ? 15 : 13, color: selected ? colors.text : colors.muted }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
