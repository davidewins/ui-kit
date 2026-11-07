// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/inputs/SegmentedControl.tsx. Edit it there and sync; local edits fail ui-kit:check.
// Segmented control. iOS draws UIKit's UISegmentedControl through
// @react-native-segmented-control (the chunky one SELLERS shipped before
// 19 Oct; David, 7 Nov: the SwiftUI Picker read too thin). Android draws
// Material 3 segmented buttons through @expo/ui's community control.
//
// Controlled: pass selectedIndex and update it in onChange. One selection
// haptic per change, so callers never fire their own.
import { SegmentedControl as CommunitySegmentedControl } from "@expo/ui/community/segmented-control";
import { useThemeColors } from "@/hooks/useThemeColors";
import NativeSegmentedControl from "@react-native-segmented-control/segmented-control";
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
