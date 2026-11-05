// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/inputs/FilterChip.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A toggle chip for filters: "Open now", "Vegan", "Under 30 min". Lay a few
// out in a wrapping row; each one switches on and off on its own.
// iOS: a small SwiftUI glass capsule button, filled black (white in dark
// mode) with a checkmark when on. Android: Material 3 FilterChip.
import { FilterChip as ComposeFilterChip, Text as ComposeText } from "@expo/ui/jetpack-compose";
import { Button } from "@expo/ui/swift-ui";
import { buttonBorderShape, buttonStyle, controlSize, tint } from "@expo/ui/swift-ui/modifiers";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import { Platform } from "react-native";
import { ComposeHost, SwiftHost } from "../native/NativeHost";

export interface FilterChipProps {
  label: string;
  selected: boolean;
  onChange: (selected: boolean) => void;
}

export function FilterChip({ label, selected, onChange }: FilterChipProps) {
  const colors = useThemeColors();
  const flip = () => {
    haptic("selection");
    onChange(!selected);
  };

  if (Platform.OS === "ios") {
    return (
      <SwiftHost matchContents>
        <Button
          label={label}
          systemImage={selected ? "checkmark" : undefined}
          onPress={flip}
          modifiers={[
            buttonStyle(selected ? "glassProminent" : "glass"),
            buttonBorderShape("capsule"),
            controlSize("small"),
            ...(selected ? [tint(colors.text)] : []),
          ]}
        />
      </SwiftHost>
    );
  }

  return (
    <ComposeHost matchContents>
      <ComposeFilterChip selected={selected} onClick={flip}>
        <ComposeFilterChip.Label>
          <ComposeText>{label}</ComposeText>
        </ComposeFilterChip.Label>
      </ComposeFilterChip>
    </ComposeHost>
  );
}
