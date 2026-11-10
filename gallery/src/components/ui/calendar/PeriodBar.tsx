// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/calendar/PeriodBar.tsx. Edit it there and sync; local edits fail ui-kit:check.
// The line that names the period a calendar is showing ("November 2026",
// "9 to 15 Nov") with previous and next as glass round buttons. Sits directly
// above a month grid, week grid or timeline. Not a page title: the navigation
// bar keeps its own.
import { useThemeColors } from "@/hooks/useThemeColors";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { View } from "react-native";
import { RoundButton } from "../actions/RoundButton";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";

export interface PeriodBarProps {
  /** The whole period in one style: "November 2026", "9 to 15 Nov". */
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  /** Spoken as "Previous <unit>" and "Next <unit>". */
  unit?: string;
}

export function PeriodBar({ title, onPrevious, onNext, unit = "period" }: PeriodBarProps) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", minHeight: 36, columnGap: 8 }}>
      <Text weight="semibold" numberOfLines={1} accessibilityRole="header" style={[TYPE.title, TABULAR, { flex: 1 }]}>
        {title}
      </Text>
      <RoundButton size={34} accessibilityLabel={`Previous ${unit}`} onPress={onPrevious}>
        <ChevronLeft size={18} color={colors.text} strokeWidth={2.2} />
      </RoundButton>
      <RoundButton size={34} accessibilityLabel={`Next ${unit}`} onPress={onNext}>
        <ChevronRight size={18} color={colors.text} strokeWidth={2.2} />
      </RoundButton>
    </View>
  );
}
