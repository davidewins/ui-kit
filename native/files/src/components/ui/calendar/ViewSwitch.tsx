// The compact switch between ways of seeing the same thing (Month, Week, Day,
// List) that lives in the navigation bar, as on iPad Calendar and Fantastical:
// every option is an icon, and the chosen one is a filled pill that also says
// its name. Small enough for a header title slot. Not a page-level segmented
// control: for filters in the page body use SegmentedControl or Chips.
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import type { LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Text } from "../primitives/Text";
import { TYPE } from "../primitives/type";

export interface ViewOption<K extends string> {
  key: K;
  /** Shown beside the icon when chosen; spoken for the others. */
  label: string;
  icon: LucideIcon;
}

export interface ViewSwitchProps<K extends string> {
  options: readonly ViewOption<K>[];
  value: K;
  onChange: (key: K) => void;
}

const HEIGHT = 30;

export function ViewSwitch<K extends string>({ options, value, onChange }: ViewSwitchProps<K>) {
  const colors = useThemeColors();
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: "row", alignItems: "center", padding: 3, borderRadius: (HEIGHT + 6) / 2, backgroundColor: colors.surface }}>
      {options.map(({ key, label, icon: Icon }) => {
        const on = key === value;
        return (
          <Pressable
            key={key}
            onPress={() => {
              if (on) return;
              Haptics.selectionAsync().catch(() => {});
              onChange(key);
            }}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: on }}
            hitSlop={{ top: 8, bottom: 8 }}
            style={({ pressed }) => ({
              height: HEIGHT,
              minWidth: HEIGHT + 2,
              paddingHorizontal: on ? 10 : 0,
              borderRadius: HEIGHT / 2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              columnGap: 5,
              backgroundColor: on ? colors.text : pressed ? colors.border : "transparent",
            })}
          >
            <Icon size={16} strokeWidth={2} color={on ? colors.background : colors.muted} />
            {on ? (
              <Text weight="semibold" style={[TYPE.sub, { color: colors.background }]}>
                {label}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
