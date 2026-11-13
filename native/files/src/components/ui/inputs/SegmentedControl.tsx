// Segmented control. iOS draws UIKit's UISegmentedControl through
// @react-native-segmented-control (the chunky one SELLERS shipped before
// 19 Oct; David, 7 Nov: the SwiftUI Picker read too thin). Android draws
// Material 3 segmented buttons through @expo/ui's community control.
//
// Controlled: pass selectedIndex and update it in onChange. One selection
// haptic per change, so callers never fire their own.
import { SegmentedControl as CommunitySegmentedControl } from "@expo/ui/community/segmented-control";
import { useThemeColors } from "@/hooks/useThemeColors";
import NativeSegmentedControlClass, {
  type SegmentedControlProps as NativeSegmentedControlProps,
} from "@react-native-segmented-control/segmented-control";
import * as Haptics from "expo-haptics";
import type { ComponentType } from "react";
import { Platform, View, useColorScheme, type StyleProp, type ViewStyle } from "react-native";

// The package types its default export as a NativeMethods mixin class, which
// React Native 0.88's types no longer accept as JSX; the runtime is the same.
const NativeSegmentedControl =
  NativeSegmentedControlClass as unknown as ComponentType<NativeSegmentedControlProps>;

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
