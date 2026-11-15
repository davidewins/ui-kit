// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/feedback/ProgressBar.tsx. Edit it there and sync; local edits fail ui-kit:check.
// Linear progress, 0..1. iOS draws SwiftUI's ProgressView in the app tint
// (Host seedColor: the tint() modifier does not reach SwiftUI controls here);
// elsewhere a 4pt rounded track. Pass `value={null}` for indeterminate (iOS
// spinner style bar; ActivityIndicator elsewhere).
import { View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Host, ProgressView } from "@expo/ui/swift-ui";
import { progressViewStyle } from "@expo/ui/swift-ui/modifiers";
import { ActivityIndicator, Platform, type StyleProp, type ViewStyle } from "react-native";

export interface ProgressBarProps {
  value: number | null;
  /** Override the tint, e.g. colors.warning when nearly full. */
  color?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ value, color, accessibilityLabel, style }: ProgressBarProps) {
  const colors = useThemeColors();
  const fill = color ?? colors.tint;
  const clamped = value == null ? null : Math.min(1, Math.max(0, value));

  if (Platform.OS === "ios") {
    return (
      <Host ignoreSafeArea="all" matchContents={{ vertical: true }} style={style} seedColor={fill}>
        <ProgressView
          value={clamped}
          modifiers={[progressViewStyle(clamped == null ? "circular" : "linear")]}
        />
      </Host>
    );
  }

  if (clamped == null) return <ActivityIndicator color={fill} style={style} />;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[{ height: 4, borderRadius: 2, backgroundColor: colors.border, overflow: "hidden" }, style]}
    >
      <View style={{ width: `${clamped * 100}%`, height: "100%", borderRadius: 2, backgroundColor: fill }} />
    </View>
  );
}
