// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/inputs/StepperRow.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A SettingsRow holding a whole-number quantity: the value as trailing text,
// SwiftUI's Stepper (- / +) as the accessory on iOS, two small surface
// buttons elsewhere. Clamped to min/max; one selection haptic per step.
import { Pressable, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Host, Stepper } from "@expo/ui/swift-ui";
import { disabled as disabledModifier, labelsHidden } from "@expo/ui/swift-ui/modifiers";
import * as Haptics from "expo-haptics";
import { Minus, Plus } from "lucide-react-native";
import { Platform } from "react-native";
import { SettingsRow, type SettingsIcon } from "../lists/SettingsRow";

export interface StepperRowProps {
  label: string;
  Icon: SettingsIcon;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Trailing text, e.g. (n) => `${n} min`. Defaults to the number. */
  format?: (value: number) => string;
  disabled?: boolean;
}

export function StepperRow({
  label,
  Icon,
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  format = String,
  disabled = false,
}: StepperRowProps) {
  const set = (next: number) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (clamped === value) return;
    Haptics.selectionAsync().catch(() => {});
    onChange(clamped);
  };

  return (
    <SettingsRow
      label={label}
      Icon={Icon}
      trailing={format(value)}
      disabled={disabled}
      accessory={
        Platform.OS === "ios" ? (
          <Host matchContents>
            <Stepper
              label={label}
              value={value}
              min={min}
              max={max}
              step={step}
              onValueChange={set}
              modifiers={[labelsHidden(), disabledModifier(disabled)]}
            />
          </Host>
        ) : (
          <StepButtons
            label={label}
            onDecrement={() => set(value - step)}
            onIncrement={() => set(value + step)}
            canDecrement={!disabled && value > min}
            canIncrement={!disabled && value < max}
          />
        )
      }
    />
  );
}

/** The non-iOS - / + pair. Also used by SliderRow's fallback. */
export function StepButtons({
  label,
  onDecrement,
  onIncrement,
  canDecrement,
  canIncrement,
}: {
  label: string;
  onDecrement: () => void;
  onIncrement: () => void;
  canDecrement: boolean;
  canIncrement: boolean;
}) {
  const colors = useThemeColors();
  const button = (Icon: typeof Plus, onPress: () => void, enabled: boolean, a11y: string) => (
    <Pressable
      onPress={onPress}
      disabled={!enabled}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      hitSlop={6}
      style={{ width: 44, height: 32, alignItems: "center", justifyContent: "center", opacity: enabled ? 1 : 0.35 }}
    >
      <Icon size={16} strokeWidth={2} color={colors.text} />
    </Pressable>
  );
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        backgroundColor: colors.background,
      }}
    >
      {button(Minus, onDecrement, canDecrement, `Decrease ${label}`)}
      <View style={{ width: 1, height: 16, backgroundColor: colors.border }} />
      {button(Plus, onIncrement, canIncrement, `Increase ${label}`)}
    </View>
  );
}
