// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/lists/SectionHeader.tsx. Edit it there and sync; local edits fail ui-kit:check.
// The header of a section on a display page: the title alone, in the text
// colour at headline size, and an optional real button on the right (on
// Liquid Glass). One line, one text style: anything else the section needs
// to say goes into the title ("Reach this week") or into the section. For
// the muted label above a group of settings rows use SectionTitle instead.
import { GlassSurface } from "@/components/GlassSurface";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { ChevronRight } from "lucide-react-native";
import { Pressable } from "react-native";
import { Text } from "../primitives/Text";
import { TYPE } from "../primitives/type";
import { View } from "../primitives/View";

export function SectionHeader({
  title,
  action,
  first = false,
}: {
  title: string;
  /** A small glass pill on the right, e.g. "See all". */
  action?: { label: string; onPress: () => void };
  /** The first block on the page: no gap above. */
  first?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <View
      accessibilityRole="header"
      style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: first ? 4 : 28, marginBottom: 10, minHeight: 32, columnGap: 8 }}
    >
      <Text weight="semibold" numberOfLines={1} style={[TYPE.headline, { flex: 1 }]}>
        {title}
      </Text>
      {action ? (
        <GlassSurface isInteractive fillColor={colors.surface} style={{ borderRadius: 16, overflow: "hidden" }}>
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
              height: 32,
              paddingLeft: 13,
              paddingRight: 9,
              columnGap: 2,
              backgroundColor: pressed ? colors.border : "transparent",
            })}
          >
            <Text weight="semibold" style={TYPE.sub}>
              {action.label}
            </Text>
            <ChevronRight size={14} color={colors.text} strokeWidth={2.4} />
          </Pressable>
        </GlassSurface>
      ) : null}
    </View>
  );
}
