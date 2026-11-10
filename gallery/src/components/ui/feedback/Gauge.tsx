// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/feedback/Gauge.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A reading against a range: kitchen load, a rider's shift target, stock
// left. Not for loading (that is a Skeleton) and not for a task's progress
// (that is ProgressBar).
// iOS: SwiftUI Gauge, "ring" = circularCapacity, "bar" =
// linearCapacity. Android: Material 3 circular / linear progress
// indicator with the same labels.
import {
  Box,
  CircularProgressIndicator,
  Column,
  LinearProgressIndicator,
  Row,
  Text as ComposeText,
} from "@expo/ui/jetpack-compose";
import { fillMaxWidth, size } from "@expo/ui/jetpack-compose/modifiers";
import { Gauge as SwiftGauge, Text } from "@expo/ui/swift-ui";
import { Animation, animation, contentTransition, font, foregroundStyle, gaugeStyle, tint } from "@expo/ui/swift-ui/modifiers";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Platform } from "react-native";
import { ComposeHost, SwiftHost } from "../native/NativeHost";

export interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  /** What is measured, e.g. "Kitchen load". */
  label: string;
  /** The reading as text, e.g. "62%". Shown in the ring / beside the bar. */
  valueLabel?: string;
  variant?: "ring" | "bar";
  /** Status colour only when the reading needs attention. */
  tone?: "default" | "warning" | "error";
}

export function Gauge({ value, min = 0, max = 1, label, valueLabel, variant = "ring", tone = "default" }: GaugeProps) {
  const colors = useThemeColors();
  const color = tone === "error" ? colors.error : tone === "warning" ? colors.warning : colors.text;
  const fraction = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));

  if (Platform.OS === "ios") {
    return (
      <SwiftHost matchContents={variant === "ring" ? true : { vertical: true }}>
        <SwiftGauge
          value={value}
          min={min}
          max={max}
          currentValueLabel={
            valueLabel ? (
              // The number rolls to its new value (SwiftUI numeric text).
              <Text modifiers={[font({ family: "Geist-SemiBold" }), contentTransition("numericText"), animation(Animation.spring({ duration: 0.6 }), value)]}>
                {valueLabel}
              </Text>
            ) : undefined
          }
          // The fill springs to a new reading instead of jumping.
          modifiers={[gaugeStyle(variant === "ring" ? "circularCapacity" : "linearCapacity"), tint(color), animation(Animation.spring({ duration: 0.6 }), value)]}
        >
          <Text modifiers={[font({ family: "Geist-Medium", size: 13 }), foregroundStyle(colors.muted)]}>{label}</Text>
        </SwiftGauge>
      </SwiftHost>
    );
  }

  const textStyle = { fontFamily: "Geist-Medium", fontSize: 13 } as const;
  if (variant === "ring") {
    return (
      <ComposeHost matchContents>
        <Column horizontalAlignment="center" verticalArrangement={{ spacedBy: 6 }}>
          <Box contentAlignment="center" modifiers={[size(64, 64)]}>
            <CircularProgressIndicator progress={fraction} color={color} trackColor={colors.border} modifiers={[size(64, 64)]} />
            {valueLabel ? <ComposeText style={{ fontFamily: "Geist-SemiBold", fontSize: 14 }}>{valueLabel}</ComposeText> : null}
          </Box>
          <ComposeText color={colors.muted} style={textStyle}>{label}</ComposeText>
        </Column>
      </ComposeHost>
    );
  }
  return (
    <ComposeHost matchContents={{ vertical: true }}>
      <Column modifiers={[fillMaxWidth()]} verticalArrangement={{ spacedBy: 8 }}>
        <Row modifiers={[fillMaxWidth()]} horizontalArrangement="spaceBetween">
          <ComposeText color={colors.muted} style={textStyle}>{label}</ComposeText>
          {valueLabel ? <ComposeText style={{ fontFamily: "Geist-SemiBold", fontSize: 13 }}>{valueLabel}</ComposeText> : null}
        </Row>
        <LinearProgressIndicator progress={fraction} color={color} trackColor={colors.border} modifiers={[fillMaxWidth()]} />
      </Column>
    </ComposeHost>
  );
}
