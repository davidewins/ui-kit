// Three segments so the variants can be compared by tapping rather than by
// going back. This lives only in the variant files and dies with them.
import { SegmentedControl } from "@expo/ui/community/segmented-control";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { FC } from "react";
import { useColorScheme, View } from "react-native";

const LABELS = ["1 Receipt", "2 Status", "3 Native"];

export const VariantSwitcher: FC<{ orderId: string; current: 1 | 2 | 3 }> = ({
  orderId,
  current,
}) => {
  const scheme = useColorScheme();
  return (
    <View style={{ marginBottom: 16 }}>
      <SegmentedControl
        values={LABELS}
        selectedIndex={current - 1}
        onChange={(e) => {
          const next = e.nativeEvent.selectedSegmentIndex + 1;
          if (next === current) return;
          Haptics.selectionAsync();
          router.replace(
            `/void/(protected)/orders/${orderId}/variant/${next}` as never,
          );
        }}
        appearance={scheme === "dark" ? "dark" : "light"}
        style={{ height: 32 }}
      />
    </View>
  );
};
