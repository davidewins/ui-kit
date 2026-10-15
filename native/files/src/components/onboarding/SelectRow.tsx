// One-tap select row used inside a GlassPanel. Icon + label + optional
// description + trailing radio circle that fills with a tint check when
// selected. Disabled + comingSoon variants supported.

import { Pressable, Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Check, type LucideIcon } from "lucide-react-native";

type Props = {
  icon: LucideIcon;
  label: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  comingSoon?: boolean;
  isLast?: boolean;
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
        paddingVertical: 11,
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
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <Text
            weight="semibold"
            className="text-[14px] tracking-tight text-text"
          >
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
        {description && (
          <Text className="text-[12px] text-muted leading-relaxed mt-0.5">
            {description}
          </Text>
        )}
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
