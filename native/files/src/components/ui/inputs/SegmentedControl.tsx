// Segmented control. iOS draws SwiftUI's segmented Picker through @expo/ui
// (Liquid Glass on iOS 26, sized by SwiftUI); Android draws Material 3
// segmented buttons through @expo/ui's community segmented control.
//
// Controlled: pass selectedIndex and update it in onChange. One selection
// haptic per change, so callers never fire their own.
import { SegmentedControl as CommunitySegmentedControl } from "@expo/ui/community/segmented-control";
import { Host, Picker, Text as SwiftText } from "@expo/ui/swift-ui";
import {
  accessibilityLabel as a11yLabel,
  controlSize,
  disabled as disabledModifier,
  pickerStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import * as Haptics from "expo-haptics";
import { Platform, View, useColorScheme, type StyleProp, type ViewStyle } from "react-native";

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
  const scheme = useColorScheme();

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

  // Android: Material 3 segmented buttons through @expo/ui (the same control
  // VOID's order screens use), not a hand-drawn pill.
  // The label sits on a wrapper: SDK 57's community control has no prop for it.
  return (
    <View accessibilityLabel={accessibilityLabel} style={style}>
      <CommunitySegmentedControl
        values={[...values]}
        selectedIndex={selectedIndex}
        onChange={(e) => select(e.nativeEvent.selectedSegmentIndex)}
        enabled={!disabled}
        appearance={scheme === "dark" ? "dark" : "light"}
      />
    </View>
  );
}
