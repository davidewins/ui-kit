// Gallery-only: the variant switch every demo page uses, pinned to the bottom
// of the page (David, 3 Nov: segmented controls go at the bottom in ZESTY).
import { View } from "@/components/ui";
import { SegmentedControl } from "@/components/ui/inputs/SegmentedControl";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function BottomSwitch({
  values,
  selectedIndex,
  onChange,
  accessibilityLabel,
}: {
  values: readonly string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  accessibilityLabel: string;
}) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: (insets.bottom || 16) + 4,
        backgroundColor: colors.background,
      }}
    >
      <SegmentedControl
        values={values}
        selectedIndex={selectedIndex}
        onChange={onChange}
        size="large"
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
}
