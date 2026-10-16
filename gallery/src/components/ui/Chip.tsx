// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/Chip.tsx. Edit it there and sync; local edits fail ui-kit:check.
// Selectable chip, from VOID's AcquisitionSourcePicker SourceChip. Selected:
// solid tint pill with a check. Unselected: interactive Liquid Glass (BlurView,
// then card, on older phones). 40pt tall, Medium 14 / SemiBold when selected.
import { GlassSurface } from "@/components/GlassSurface";
import { PressableScale } from "@/components/PressableScale";
import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Check, type LucideIcon } from "lucide-react-native";
import { StyleSheet } from "react-native";

export function Chip({
  label,
  icon: Icon,
  selected = false,
  disabled = false,
  onPress,
}: {
  label: string;
  icon?: LucideIcon;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}) {
  const colors = useThemeColors();
  const content = (
    <>
      {selected ? (
        <Check size={16} color={colors.onTint} strokeWidth={2.5} />
      ) : Icon ? (
        <Icon size={16} color={colors.text} strokeWidth={1.8} />
      ) : null}
      <Text
        weight={selected ? "semibold" : "medium"}
        style={{ color: selected ? colors.onTint : colors.text, fontSize: 14 }}
      >
        {label}
      </Text>
    </>
  );

  return (
    <PressableScale
      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      style={{ height: 40 }}
    >
      {selected ? (
        <View style={[styles.chip, { backgroundColor: colors.tint }]}>{content}</View>
      ) : (
        <GlassSurface isInteractive={!disabled} style={styles.chip}>
          {/* Spec 1.10: dim the children, never the glass. */}
          <View style={[styles.row, { opacity: disabled ? 0.5 : 1 }]}>{content}</View>
        </GlassSurface>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderCurve: "continuous",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    justifyContent: "center",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 7 },
});
