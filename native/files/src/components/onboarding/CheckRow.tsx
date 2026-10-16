// Confirmation checkbox row for declaration lists (insurance self-cert, TOS).
// Same inset-grouped row geometry as SelectRow, with a square-ish tick target
// on the left because the user is agreeing to a statement, not picking one of
// several options.

import { Text } from "@/components/ui/Text";
import { View } from "@/components/ui/View";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Check } from "lucide-react-native";
import { Pressable } from "react-native";

type Props = {
  checked: boolean;
  onPress: () => void;
  text: string;
  isLast?: boolean;
};

export function CheckRow({ checked, onPress, text, isLast = false }: Props) {
  const colors = useThemeColors();

  return (
    <View>
      <Pressable
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          onPress();
        }}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        accessibilityRole="checkbox"
        accessibilityLabel={text}
        accessibilityState={{ checked }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 7,
              borderCurve: "continuous",
              marginTop: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: checked ? colors.tint : "transparent",
              borderWidth: checked ? 0 : 1.5,
              borderColor: colors.border,
            }}
          >
            {checked ? (
              <Check size={13} color={colors.background} strokeWidth={3} />
            ) : null}
          </View>
          <Text
            weight="medium"
            style={{ flex: 1, fontSize: 13, lineHeight: 19, color: colors.text }}
          >
            {text}
          </Text>
        </View>
      </Pressable>
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
