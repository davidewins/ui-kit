// Text action in a header (Cancel / Save / Create / Done), lifted from
// SELLERS src/components/HeaderTextButton.tsx. Both sides of a sheet use this
// so they read the same; iOS 26 draws the glass capsule. 15pt regular (David,
// 15 Nov: New Shift's 17pt medium Cancel and Create were "so big and fat").
import { Pressable, Text } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { ActivityIndicator } from "react-native";

export function HeaderTextButton({
  label,
  onPress,
  disabled = false,
  loading = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      hitSlop={12}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      className="px-3 active:opacity-60"
      style={{ height: 32, justifyContent: "center", opacity: disabled ? 0.4 : 1 }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.muted} />
      ) : (
        <Text style={{ fontSize: 15, color: colors.tint }}>{label}</Text>
      )}
    </Pressable>
  );
}
