// The header of a section on a display page: the title in the text colour at
// headline size, an optional count beside it, and an optional real button on
// the right. For the muted label above a group of settings rows use
// SectionTitle instead.
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { ChevronRight } from "lucide-react-native";
import { Pressable } from "react-native";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";
import { View } from "../primitives/View";

export function SectionHeader({
  title,
  count,
  action,
  first = false,
}: {
  title: string;
  /** Shown muted beside the title: "Up next 3". */
  count?: number | string;
  /** A small filled pill on the right, e.g. "See all". */
  action?: { label: string; onPress: () => void };
  /** The first block on the page: no gap above. */
  first?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View
      accessibilityRole="header"
      style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: first ? 4 : 28, marginBottom: 10, minHeight: 30, columnGap: 8 }}
    >
      <Text weight="semibold" numberOfLines={1} style={[TYPE.headline, { flexShrink: 1 }]}>
        {title}
      </Text>
      {count !== undefined ? (
        <Text weight="semibold" style={[TYPE.headline, TABULAR, { color: colors.muted }]}>
          {count}
        </Text>
      ) : null}
      <View style={{ flex: 1 }} />
      {action ? (
        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            action.onPress();
          }}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          hitSlop={8}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            height: 30,
            paddingLeft: 12,
            paddingRight: 8,
            columnGap: 2,
            borderRadius: 15,
            backgroundColor: pressed ? colors.border : colors.surface,
          })}
        >
          <Text weight="semibold" style={TYPE.sub}>
            {action.label}
          </Text>
          <ChevronRight size={14} color={colors.muted} strokeWidth={2.4} />
        </Pressable>
      ) : null}
    </View>
  );
}
