// The line that names the period a calendar is showing ("November 2026",
// "9 to 15 Nov") with previous and next as filled round buttons. Sits directly
// above a month grid, week grid or timeline. Not a page title: the navigation
// bar keeps its own.
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";

export interface PeriodBarProps {
  title: string;
  /** Muted, beside the title: the year, the week number, a count. */
  detail?: string;
  onPrevious: () => void;
  onNext: () => void;
  /** Spoken as "Previous <unit>" and "Next <unit>". */
  unit?: string;
}

export function PeriodBar({ title, detail, onPrevious, onNext, unit = "period" }: PeriodBarProps) {
  const colors = useThemeColors();
  const round = (label: string, Icon: typeof ChevronLeft, onPress: () => void) => (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => ({ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: pressed ? colors.border : colors.surface })}
    >
      <Icon size={18} color={colors.text} strokeWidth={2.2} />
    </Pressable>
  );
  return (
    <View style={{ flexDirection: "row", alignItems: "center", minHeight: 36, columnGap: 8 }}>
      <View accessibilityRole="header" style={{ flex: 1, flexDirection: "row", alignItems: "baseline", columnGap: 6 }}>
        <Text weight="semibold" numberOfLines={1} style={[TYPE.title, TABULAR, { flexShrink: 1 }]}>
          {title}
        </Text>
        {detail ? (
          <Text weight="semibold" numberOfLines={1} style={[TYPE.title, TABULAR, { color: colors.muted }]}>
            {detail}
          </Text>
        ) : null}
      </View>
      {round(`Previous ${unit}`, ChevronLeft, onPrevious)}
      {round(`Next ${unit}`, ChevronRight, onNext)}
    </View>
  );
}
