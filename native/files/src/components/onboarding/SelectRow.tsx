// One-tap select row inside an inset-grouped panel. Icon + label + optional
// description + trailing circle that fills with a check when selected.
// RIDERS' version (spacing, note line, screen-reader labels) plus SELLERS'
// comingSoon tag: the one SelectRow for both onboarding flows.

import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Check, type LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";

type Props = {
  icon: LucideIcon;
  label: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  isLast?: boolean;
  /** Small muted line under the description - e.g. extra documents required. */
  note?: string;
  onPress?: () => void;
};

export function SelectRow({
  icon: Icon,
  label,
  description,
  selected = false,
  disabled = false,
  comingSoon = false,
  isLast = false,
  note,
  onPress,
}: Props) {
  const colors = useThemeColors();

  const inner = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          borderCurve: "continuous",
          backgroundColor: colors.tint + "1F",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={16} strokeWidth={1.8} color={colors.tint} />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text weight="semibold" style={{ fontSize: 14, color: colors.text }}>
            {label}
          </Text>
          {comingSoon && (
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 1,
                borderRadius: 4,
                backgroundColor: colors.border,
              }}
            >
              <Text
                weight="bold"
                style={{
                  fontSize: 9,
                  color: colors.muted,
                  letterSpacing: 0.4,
                }}
              >
                SOON
              </Text>
            </View>
          )}
        </View>
        {description ? (
          <Text
            style={{
              fontSize: 12,
              lineHeight: 17,
              color: colors.muted,
              marginTop: 2,
            }}
          >
            {description}
          </Text>
        ) : null}
        {note ? (
          <Text
            style={{
              fontSize: 11,
              lineHeight: 16,
              color: colors.muted,
              marginTop: 4,
            }}
          >
            {note}
          </Text>
        ) : null}
      </View>

      {selected ? (
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: colors.tint,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Check size={13} color={colors.background} strokeWidth={3} />
        </View>
      ) : (
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 1.5,
            borderColor: colors.border,
          }}
        />
      )}
    </View>
  );

  return (
    <View>
      {disabled ? (
        inner
      ) : (
        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            onPress?.();
          }}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          accessibilityRole="radio"
          accessibilityLabel={label}
          accessibilityHint={description}
          accessibilityState={{ checked: selected, disabled }}
        >
          {inner}
        </Pressable>
      )}
      {!isLast && (
        <View
          style={{
            height: 1,
            backgroundColor: colors.border,
            marginHorizontal: 14,
          }}
        />
      )}
    </View>
  );
}
