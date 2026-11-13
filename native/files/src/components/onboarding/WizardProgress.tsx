// Wizard progress bars with optional phase label.
// Layer 1 = "Setup" (4 steps). Layer 2 = "Verification" (~10 steps).
// Phase resets bars and labels above so users see "Verification · 1 of 10",
// not a confusing jump from 4/4 to 2/12.

import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = {
  step: number;
  total: number;
  phase?: string;
};

export function WizardProgress({ step, total, phase }: Props) {
  const colors = useThemeColors();

  return (
    <View style={{ paddingBottom: 12, gap: 6 }}>
      {phase ? (
        <Text
          weight="semibold"
          className="text-muted text-[11px] uppercase tracking-tight"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {phase}, {step} of {total}
        </Text>
      ) : null}
      <View style={{ flexDirection: "row", gap: 4 }}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              backgroundColor: i < step ? colors.tint : colors.border,
            }}
          />
        ))}
      </View>
    </View>
  );
}
