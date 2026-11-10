// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/inputs/IconTabs.tsx. Edit it there and sync; local edits fail ui-kit:check.
// Tabs drawn as icons across the full width, with a line that slides under
// the chosen one: a profile's posts / tagged / saved, a library's grid / list.
// Lighter than a SegmentedControl, for switching what one list shows when the
// icons are already understood. Each tab can carry a count beside its icon.
// Not for navigation between screens, and not for more than four tabs.
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import type { LucideIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";

export interface IconTab<K extends string = string> {
  key: K;
  icon: LucideIcon;
  /** Read by screen readers; not drawn. */
  label: string;
  count?: number;
}

export interface IconTabsProps<K extends string = string> {
  tabs: readonly IconTab<K>[];
  selected: K;
  onChange: (key: K) => void;
}

export function IconTabs<K extends string>({ tabs, selected, onChange }: IconTabsProps<K>) {
  const colors = useThemeColors();
  const [width, setWidth] = useState(0);
  const slot = tabs.length ? width / tabs.length : 0;
  const index = Math.max(0, tabs.findIndex((t) => t.key === selected));
  const x = useSharedValue(0);
  useEffect(() => {
    x.set(withTiming(index * slot, { duration: 180 }));
  }, [index, slot, x]);
  const line = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessibilityRole="tablist"
      style={{ flexDirection: "row", height: 46, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}
    >
      {tabs.map((t) => {
        const on = t.key === selected;
        const Icon = t.icon;
        return (
          <Pressable
            key={t.key}
            onPress={() => {
              if (on) return;
              Haptics.selectionAsync().catch(() => {});
              onChange(t.key);
            }}
            accessibilityRole="tab"
            accessibilityLabel={t.count === undefined ? t.label : `${t.label}, ${t.count}`}
            accessibilityState={{ selected: on }}
            style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", columnGap: 6 }}
          >
            <Icon size={22} color={on ? colors.text : colors.muted} strokeWidth={on ? 2.2 : 1.8} />
            {t.count !== undefined ? (
              <Text weight={on ? "semibold" : "medium"} style={[TYPE.sub, TABULAR, { color: on ? colors.text : colors.muted }]}>
                {t.count}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
      {slot > 0 ? (
        <Animated.View pointerEvents="none" style={[{ position: "absolute", left: 0, bottom: -StyleSheet.hairlineWidth, width: slot, height: 2, backgroundColor: colors.text }, line]} />
      ) : null}
    </View>
  );
}
