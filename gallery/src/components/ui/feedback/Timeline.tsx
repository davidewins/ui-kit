// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/feedback/Timeline.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A vertical list of events joined by a line: a parcel's scans, an order's
// history, the steps of a claim. Each event is done (filled node with a tick),
// current (a ring in the tone colour, title emphasised) or upcoming (muted).
// Events draw in the order given, so pass newest first or oldest first as the
// screen needs. Not for progress through a fixed set of steps on one line
// (StepTracker) and not for a schedule with durations.
import { useThemeColors } from "@/hooks/useThemeColors";
import { Check } from "lucide-react-native";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";
import { View } from "../primitives/View";

export interface TimelineEvent {
  title: string;
  /** Sits on the title's line, in tabular figures. */
  time?: string;
  /** One or two muted lines under the title. */
  detail?: string;
  state: "done" | "current" | "upcoming";
}

const NODE = 20;

export function Timeline({
  events,
  tone,
}: {
  events: readonly TimelineEvent[];
  /** Colour of the current node: a status colour or a hue. Defaults to the text colour. */
  tone?: string;
}) {
  const colors = useThemeColors();
  const accent = tone ?? colors.text;
  return (
    <View accessibilityRole="list">
      {events.map((e, i) => {
        const next = events[i + 1];
        const last = i === events.length - 1;
        // The line is solid only between two things that have happened.
        const solid = !!next && e.state !== "upcoming" && next.state !== "upcoming";
        return (
          <View
            key={`${e.title}-${i}`}
            accessible
            accessibilityLabel={[e.title, e.time, e.detail, e.state === "current" ? "now" : e.state === "upcoming" ? "not yet" : null].filter(Boolean).join(", ")}
            style={{ flexDirection: "row", columnGap: 12 }}
          >
            <View style={{ width: NODE, alignItems: "center" }}>
              <View style={{ width: NODE, height: NODE, alignItems: "center", justifyContent: "center" }}>
                {e.state === "done" ? (
                  <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: colors.text, alignItems: "center", justifyContent: "center" }}>
                    <Check size={11} color={colors.background} strokeWidth={3.5} />
                  </View>
                ) : e.state === "current" ? (
                  <View style={{ width: NODE, height: NODE, borderRadius: NODE / 2, borderWidth: 2.5, borderColor: accent, alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: accent }} />
                  </View>
                ) : (
                  <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.muted, opacity: 0.6 }} />
                )}
              </View>
              {last ? null : (
                <View style={{ flex: 1, width: 2, borderRadius: 1, marginVertical: 2, backgroundColor: solid ? colors.text : colors.border }} />
              )}
            </View>
            <View style={{ flex: 1, paddingBottom: last ? 0 : 16, rowGap: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 8 }}>
                <Text
                  weight={e.state === "current" ? "semibold" : "medium"}
                  numberOfLines={1}
                  style={[TYPE.body, { flex: 1, color: e.state === "upcoming" ? colors.muted : colors.text }]}
                >
                  {e.title}
                </Text>
                {e.time ? (
                  <Text weight="medium" style={[TYPE.body, TABULAR, { color: e.state === "upcoming" ? colors.muted : colors.text }]}>
                    {e.time}
                  </Text>
                ) : null}
              </View>
              {e.detail ? (
                <Text weight="medium" style={[TYPE.sub, { color: colors.muted }]}>
                  {e.detail}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
