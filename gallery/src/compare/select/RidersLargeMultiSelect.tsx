// Verbatim copy of RIDERS src/components/select/LargeMultiSelect.tsx.
import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import type { LucideIcon } from "lucide-react-native";
import { Check } from "lucide-react-native";
import { Pressable } from "react-native";

export type LargeSelectOption<T extends string = string> = {
  id: T;
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  disabled?: boolean;
};

type LargeMultiSelectProps<T extends string = string> = {
  options: LargeSelectOption<T>[];
  selectedIds: T[];
  onSelectedIdsChange: (selectedIds: T[]) => void;
  multiple?: boolean;
};

export function LargeMultiSelect<T extends string = string>({
  options,
  selectedIds,
  onSelectedIdsChange,
  multiple = true,
}: LargeMultiSelectProps<T>) {
  const colors = useThemeColors();
  const selectedSet = new Set(selectedIds);

  const handlePress = (id: T) => {
    Haptics.selectionAsync();
    const isSelected = selectedSet.has(id);

    if (multiple) {
      if (isSelected) {
        onSelectedIdsChange(
          selectedIds.filter((selectedId) => selectedId !== id),
        );
      } else {
        onSelectedIdsChange([...selectedIds, id]);
      }
      return;
    }

    if (isSelected) {
      onSelectedIdsChange([]);
    } else {
      onSelectedIdsChange([id]);
    }
  };

  return (
    <View className="gap-3">
      {options.map((option) => {
        const isSelected = selectedSet.has(option.id);
        const Icon = option.icon;
        const iconColor = option.iconColor || colors.tint;

        return (
          <Pressable
            key={option.id}
            disabled={option.disabled}
            onPress={() => handlePress(option.id)}
            className={`p-4 rounded-2xl border ${
              isSelected
                ? "border-primary bg-secondary-background"
                : "border-border bg-background"
            } ${option.disabled ? "opacity-60" : ""}`}
            accessibilityRole={multiple ? "checkbox" : "radio"}
            accessibilityLabel={option.title}
            accessibilityHint={option.description}
            accessibilityState={{ checked: isSelected, disabled: option.disabled }}
          >
            <View className="flex-row items-center gap-4">
              {Icon ? (
                <View
                  className="w-12 h-12 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${iconColor}20` }}
                >
                  <Icon size={22} color={iconColor} />
                </View>
              ) : null}

              <View className="flex-1">
                <Text weight="semibold" className="text-base tracking-tight">
                  {option.title}
                </Text>
                {option.description ? (
                  <Text className="text-sm text-muted">
                    {option.description}
                  </Text>
                ) : null}
              </View>

              {isSelected ? (
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Check size={14} color="white" />
                </View>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
