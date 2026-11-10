// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/data/Trend.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A change since last time, beside the figure it belongs to: an arrow and
// the change in the status colour, then what it is compared with in grey.
// Green means better, which is not always up (resting heart rate, refunds):
// say so with `good`.
import { useThemeColors } from "@/hooks/useThemeColors";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";

export interface TrendProps {
  /** The change as written: "12%", "€84", "0.6 kg". */
  value: string;
  direction: "up" | "down" | "flat";
  /** Whether this direction is good news. Defaults to up is good. */
  good?: boolean;
  /** What it is compared with: "vs last week". */
  note?: string;
}

export function Trend({ value, direction, good, note }: TrendProps) {
  const colors = useThemeColors();
  const positive = good ?? direction === "up";
  const color = direction === "flat" ? colors.muted : positive ? colors.success : colors.error;
  const Arrow = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : ArrowRight;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 3 }} accessibilityLabel={`${direction} ${value}${note ? ` ${note}` : ""}`}>
      <Arrow size={15} color={color} strokeWidth={2.6} />
      <Text weight="semibold" style={[TYPE.sub, TABULAR, { color }]}>
        {value}
      </Text>
      {note ? (
        <Text weight="medium" style={[TYPE.sub, { color: colors.muted, marginLeft: 3 }]}>
          {note}
        </Text>
      ) : null}
    </View>
  );
}
