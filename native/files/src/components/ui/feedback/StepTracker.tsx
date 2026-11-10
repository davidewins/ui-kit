// Progress through a short, fixed run of steps on one line: segments that
// fill as steps are reached, with a label under each and the current one
// emphasised. Small enough for a card or a list row (pass labels={false} to
// keep only the bar). Not for a history of events with times (Timeline) and
// not for a continuous amount (ProgressBar).
import { useThemeColors } from "@/hooks/useThemeColors";
import { Text } from "../primitives/Text";
import { TYPE } from "../primitives/type";
import { View } from "../primitives/View";

export function StepTracker({
  steps,
  current,
  tone,
  labels = true,
}: {
  /** Two to five short labels, in order. */
  steps: readonly string[];
  /** Index of the step in progress. Earlier steps are done; the last index means finished. */
  current: number;
  /** Fill of the reached segments: a status colour or a hue. Defaults to the text colour. */
  tone?: string;
  /** False draws the bar alone, for inside a list row. */
  labels?: boolean;
}) {
  const colors = useThemeColors();
  const fill = tone ?? colors.text;
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${current + 1} of ${steps.length}, ${steps[current] ?? ""}`}
      accessibilityValue={{ min: 0, max: steps.length, now: current + 1 }}
      style={{ flexDirection: "row", columnGap: 4 }}
    >
      {steps.map((label, i) => (
        <View key={label} style={{ flex: 1, rowGap: 6 }}>
          <View style={{ height: 4, borderRadius: 2, backgroundColor: i <= current ? fill : colors.border }} />
          {labels ? (
            <Text
              weight={i === current ? "semibold" : "medium"}
              numberOfLines={1}
              style={[TYPE.caption, { color: i === current ? colors.text : colors.muted }]}
            >
              {label}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
