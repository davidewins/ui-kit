// Four beats of the order as a thin rule. Not a dashboard, not a stepper with
// circles and connecting lines: one line that fills as the order advances.
import { Text } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { FC } from "react";
import { View } from "react-native";

export const StageRail: FC<{
  steps: string[];
  /** Index of the current beat. Negative means the order stopped. */
  index: number;
  /** The status colour, used only on the beat the order is on. */
  toneColor: string;
  showLabels?: boolean;
}> = ({ steps, index, toneColor, showLabels = true }) => {
  const colors = useThemeColors();
  const stopped = index < 0;

  return (
    <View>
      <View style={{ flexDirection: "row", gap: 5 }}>
        {steps.map((step, i) => {
          const done = !stopped && i < index;
          const current = !stopped && i === index;
          return (
            <View
              key={step}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                backgroundColor: stopped
                  ? i === 0
                    ? colors.error
                    : colors.border
                  : done
                    ? colors.text
                    : current
                      ? toneColor
                      : colors.border,
              }}
            />
          );
        })}
      </View>

      {showLabels ? (
        <View style={{ flexDirection: "row", gap: 5, marginTop: 8 }}>
          {steps.map((step, i) => {
            const current = !stopped && i === index;
            return (
              <Text
                key={step}
                weight={current ? "semibold" : "regular"}
                numberOfLines={1}
                style={{
                  flex: 1,
                  fontSize: 11,
                  letterSpacing: -0.1,
                  color: current ? colors.text : colors.muted,
                }}
              >
                {step}
              </Text>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};
