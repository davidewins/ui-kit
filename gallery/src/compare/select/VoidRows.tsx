// Inline rows lifted out of VOID screens, markup unchanged:
// - VoidPickerRow: src/app/(protected)/config/dropoff-options.tsx (map body),
//   plus an optional `leading` icon placed the way VoidOptionRow places it
// - VoidOptionRow: src/app/(protected)/(tabs)/profile/appearance/index.tsx (OptionRow)
// - VoidSourceChip: src/components/onboarding/AcquisitionSourcePicker.tsx (SourceChip)
import { PressableScale } from "@/components/PressableScale";
import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

export function VoidPickerRow({
  label,
  description,
  isSelected,
  isLast,
  onPress,
  leading,
}: {
  label: string;
  description: string;
  isSelected: boolean;
  isLast: boolean;
  onPress: () => void;
  leading?: React.ReactNode;
}) {
  const colors = useThemeColors();
  return (
    <React.Fragment>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          onPress();
        }}
        accessibilityRole="radio"
        accessibilityLabel={label}
        accessibilityState={{ selected: isSelected }}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 14,
          gap: 12,
          backgroundColor: pressed ? colors.secondaryBackground : "transparent",
        })}
      >
        {leading}
        <View className="flex-1">
          <Text weight={isSelected ? "semibold" : "medium"}>{label}</Text>
          <Text weight="medium" className="text-sm text-muted mt-0.5">
            {description}
          </Text>
        </View>
        {isSelected && <Check size={20} color={colors.tint} strokeWidth={2.5} />}
      </Pressable>
      {!isLast && (
        <View style={{ height: 1, backgroundColor: colors.separator, marginLeft: leading ? 48 : 16 }} />
      )}
    </React.Fragment>
  );
}

export function VoidOptionRow({
  label,
  selected,
  isLast,
  onPress,
  leading,
  fontFamily,
}: {
  label: string;
  selected: boolean;
  isLast: boolean;
  onPress: () => void;
  leading?: React.ReactNode;
  /** Font rows preview their own face. */
  fontFamily?: string;
}) {
  const colors = useThemeColors();
  return (
    <>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          onPress();
        }}
        accessibilityRole="radio"
        accessibilityLabel={label}
        accessibilityState={{ selected }}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 14,
          gap: 12,
          backgroundColor: pressed ? colors.secondaryBackground : "transparent",
        })}
      >
        {leading}
        <Text
          weight={selected ? "semibold" : "medium"}
          className="flex-1 text-base"
          style={fontFamily ? { fontFamily } : undefined}
        >
          {label}
        </Text>
        {selected ? <Check size={20} color={colors.tint} strokeWidth={2.5} /> : null}
      </Pressable>
      {!isLast ? (
        <View style={{ height: 1, backgroundColor: colors.separator, marginLeft: 16 }} />
      ) : null}
    </>
  );
}

type IoniconName = keyof typeof Ionicons.glyphMap;

export function VoidSourceChip({
  label,
  icon,
  active,
  disabled,
  onPress,
}: {
  label: string;
  icon: IoniconName;
  active: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const colors = useThemeColors();
  return (
    <PressableScale
      hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active, disabled }}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={styles.chipWrap}
    >
      <View
        style={[
          styles.chip,
          active
            ? { backgroundColor: colors.tint, borderColor: colors.tint }
            : {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: disabled ? 0.5 : 1,
              },
        ]}
      >
        {active ? (
          <Check size={16} color={colors.onTint} strokeWidth={2.5} />
        ) : (
          <Ionicons name={icon} size={16} color={colors.text} />
        )}
        <Text
          weight={active ? "semibold" : "medium"}
          style={{ color: active ? colors.onTint : colors.text, fontSize: 14 }}
        >
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chipWrap: {
    height: 40,
  },
  chip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    justifyContent: "center",
  },
});
