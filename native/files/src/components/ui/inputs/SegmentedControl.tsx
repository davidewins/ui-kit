// Segmented control. iOS draws UIKit's UISegmentedControl through
// @react-native-segmented-control (the chunky one SELLERS shipped before
// 19 Oct; David, 7 Nov: the SwiftUI Picker read too thin). Android draws
// Material 3 segmented buttons through @expo/ui's community control.
//
// Controlled: pass selectedIndex and update it in onChange. One selection
// haptic per change, so callers never fire their own.
import { SegmentedControl as CommunitySegmentedControl } from "@expo/ui/community/segmented-control";
import { Host, Picker, Text as SwiftText } from "@expo/ui/swift-ui";
import {
  accessibilityLabel as accessibilityLabelModifier,
  controlSize,
  disabled as disabledModifier,
  pickerStyle,
  tag,
} from "@expo/ui/swift-ui/modifiers";
import { useThemeColors } from "@/hooks/useThemeColors";
import NativeSegmentedControlClass, {
  type SegmentedControlProps as NativeSegmentedControlProps,
} from "@react-native-segmented-control/segmented-control";
import * as Haptics from "expo-haptics";
import type { ComponentType } from "react";
import { Platform, UIManager, View, useColorScheme, type StyleProp, type ViewStyle } from "react-native";

// The package types its default export as a NativeMethods mixin class, which
// React Native 0.88's types no longer accept as JSX; the runtime is the same.
const NativeSegmentedControl =
  NativeSegmentedControlClass as unknown as ComponentType<NativeSegmentedControlProps>;

// A dev build made before the package was added has no UIKit control in it.
// There iOS falls back to SwiftUI's segmented Picker at its large size instead
// of failing (TAK-1570: TKVR's 5 Nov iOS build, until the next native build).
const HAS_UIKIT_CONTROL =
  Platform.OS === "ios" && UIManager.hasViewManagerConfig("RNCSegmentedControl");

export interface SegmentedControlProps {
  values: readonly string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  /** 44pt by default, the ZESTY size (David, 9 Nov: "needs to be fatter").
   *  "regular" (36pt) only where a smaller control is genuinely needed. */
  size?: "regular" | "large";
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl({
  values,
  selectedIndex,
  onChange,
  size = "large",
  disabled = false,
  accessibilityLabel,
  style,
}: SegmentedControlProps) {
  const scheme = useColorScheme();
  const colors = useThemeColors();

  const select = (index: number) => {
    if (index === selectedIndex) return;
    Haptics.selectionAsync().catch(() => {});
    onChange(index);
  };

  if (Platform.OS === "ios" && !HAS_UIKIT_CONTROL) {
    return (
      <Host
        matchContents={{ vertical: true }}
        style={[{ minHeight: size === "large" ? 44 : 36 }, style]}
      >
        <Picker
          selection={selectedIndex}
          onSelectionChange={(index: number) => select(index)}
          label=""
          modifiers={[
            pickerStyle("segmented"),
            controlSize(size === "large" ? "extraLarge" : "large"),
            ...(disabled ? [disabledModifier()] : []),
            ...(accessibilityLabel ? [accessibilityLabelModifier(accessibilityLabel)] : []),
          ]}
        >
          {values.map((label, index) => (
            <SwiftText key={index} modifiers={[tag(index)]}>
              {label}
            </SwiftText>
          ))}
        </Picker>
      </Host>
    );
  }

  if (Platform.OS === "ios") {
    return (
      <NativeSegmentedControl
        values={[...values]}
        selectedIndex={selectedIndex}
        enabled={!disabled}
        onChange={(e) => select(e.nativeEvent.selectedSegmentIndex)}
        appearance={scheme === "dark" ? "dark" : "light"}
        tintColor={colors.tint}
        // No grey track: only the thumb and labels draw (David, 13 Nov).
        backgroundColor="transparent"
        fontStyle={{ color: colors.text }}
        activeFontStyle={{ color: colors.onTint }}
        accessibilityLabel={accessibilityLabel}
        style={[{ height: size === "large" ? 44 : 36 }, style]}
      />
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
