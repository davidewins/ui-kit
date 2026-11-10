// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/actions/QuickActions.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A row of two to four round buttons with a label under each, the way a
// contact card offers Call, Message and Directions. For the few things you
// can do to the person or thing the block above is about. Not the page's
// primary action (that is the footer or the header) and not for more than
// four.
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import type { LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";
import { Text } from "../primitives/Text";
import { TYPE } from "../primitives/type";
import { View } from "../primitives/View";

export interface QuickAction {
  icon: LucideIcon;
  /** One or two words, shown under the circle. */
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export function QuickActions({
  actions,
  size = 48,
  spread = true,
}: {
  actions: readonly QuickAction[];
  /** Diameter of each circle. */
  size?: number;
  /** True shares the row's width equally; false packs them to the leading edge. */
  spread?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: "row", columnGap: spread ? 0 : 16 }}>
      {actions.map((a) => (
        <Pressable
          key={a.label}
          disabled={a.disabled}
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            a.onPress();
          }}
          accessibilityRole="button"
          accessibilityLabel={a.label}
          accessibilityState={{ disabled: !!a.disabled }}
          style={{ flex: spread ? 1 : undefined, alignItems: "center", rowGap: 6, opacity: a.disabled ? 0.4 : 1 }}
        >
          {({ pressed }) => (
            <>
              <View style={{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center", backgroundColor: colors.secondaryBackground, opacity: pressed ? 0.6 : 1 }}>
                <a.icon size={Math.round(size * 0.42)} color={colors.text} strokeWidth={2} />
              </View>
              <Text weight="medium" numberOfLines={1} style={[TYPE.caption, { color: colors.text }]}>
                {a.label}
              </Text>
            </>
          )}
        </Pressable>
      ))}
    </View>
  );
}
