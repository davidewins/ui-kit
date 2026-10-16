// Inline rows lifted out of VOID screens, markup unchanged:
// - VoidPickerRow: src/app/(protected)/config/dropoff-options.tsx (map body),
//   plus an optional `leading` icon placed the way VoidOptionRow places it
// - VoidOptionRow: src/app/(protected)/(tabs)/profile/appearance/index.tsx (OptionRow)
import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";

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
          {/* David, 16 Oct: no gap under the title, subtitle a size down. */}
          <Text weight="medium" className="text-muted" style={{ fontSize: 13, lineHeight: 17 }}>
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

