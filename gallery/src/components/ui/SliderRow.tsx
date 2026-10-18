// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/SliderRow.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A SettingsGroup block for a continuous value: icon + label + formatted value
// on the row line, SwiftUI's Slider full width underneath (iOS). Taller than a
// SettingsRow on purpose: a slider squeezed into 52pt is unusable. Elsewhere
// the value line keeps a - / + pair stepping by `step`.
import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Host, Slider } from "@expo/ui/swift-ui";
import { disabled as disabledModifier } from "@expo/ui/swift-ui/modifiers";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { SETTINGS_ROW, type SettingsIcon } from "./SettingsRow";
import { StepButtons } from "./StepperRow";

export interface SliderRowProps {
  label: string;
  Icon: SettingsIcon;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Snap interval. Also the fallback's - / + step. */
  step?: number;
  /** e.g. (v) => `${Math.round(v * 100)}%`. */
  format?: (value: number) => string;
  disabled?: boolean;
}

export function SliderRow({
  label,
  Icon,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.05,
  format = (v) => v.toFixed(2),
  disabled = false,
}: SliderRowProps) {
  const colors = useThemeColors();
  const ios = Platform.OS === "ios";
  const nudge = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta));
    Haptics.selectionAsync().catch(() => {});
    onChange(next);
  };

  return (
    <View
      accessible={!ios}
      accessibilityLabel={label}
      accessibilityValue={{ text: format(value) }}
      style={{ paddingHorizontal: SETTINGS_ROW.paddingHorizontal, paddingVertical: 14, rowGap: 6 }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", columnGap: SETTINGS_ROW.gap, minHeight: 24 }}>
        <View style={{ width: SETTINGS_ROW.glyphWidth, alignItems: "center" }}>
          <Icon size={SETTINGS_ROW.iconSize} color={colors.muted} strokeWidth={SETTINGS_ROW.iconStrokeWidth} />
        </View>
        <Text
          weight="medium"
          numberOfLines={1}
          maxFontSizeMultiplier={SETTINGS_ROW.labelMaxFontSizeMultiplier}
          style={{ flex: 1, fontSize: SETTINGS_ROW.labelFontSize, letterSpacing: SETTINGS_ROW.labelLetterSpacing }}
        >
          {label}
        </Text>
        <Text className="text-muted text-xs" style={{ fontVariant: ["tabular-nums"] }}>
          {format(value)}
        </Text>
        {ios ? null : (
          <StepButtons
            label={label}
            onDecrement={() => nudge(-step)}
            onIncrement={() => nudge(step)}
            canDecrement={!disabled && value > min}
            canIncrement={!disabled && value < max}
          />
        )}
      </View>
      {ios ? (
        <Host
          matchContents={{ vertical: true }}
          seedColor={colors.tint}
          style={{ marginLeft: SETTINGS_ROW.glyphWidth + SETTINGS_ROW.gap }}
        >
          <Slider
            value={value}
            min={min}
            max={max}
            step={step}
            onValueChange={onChange}
            onEditingChanged={(editing) => {
              if (!editing) Haptics.selectionAsync().catch(() => {});
            }}
            modifiers={[disabledModifier(disabled)]}
          />
        </Host>
      ) : null}
    </View>
  );
}
