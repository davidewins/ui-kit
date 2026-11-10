// A person or a brand as a circle: their photo, or their initials on a colour
// picked from the name so the same name is always the same colour. Optional
// status dot (online, away, busy), optional ring (a story to watch, something
// unread) and an optional mark on the corner. AvatarStack overlaps a few and
// counts the rest ("+3"). Not for product or post thumbnails: those are
// square photos.
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image, type ImageProps } from "expo-image";
import type { ReactNode } from "react";
import { View } from "react-native";
import { Text } from "./Text";
import { TABULAR, TYPE } from "./type";

export type AvatarStatus = "online" | "away" | "busy";

export interface AvatarProps {
  /** Used for the initials, the colour and the accessibility label. */
  name: string;
  source?: ImageProps["source"];
  /** Outer diameter, 24 to 96. The ring, when shown, is drawn inside it. */
  size?: number;
  status?: AvatarStatus;
  /** true: a ring in the text colour. "seen": the same ring in grey. */
  ring?: boolean | "seen";
  /** Sits on the bottom right corner (a network mark, a type glyph). */
  badge?: ReactNode;
}

const FILLS = ["blue", "green", "orange", "teal", "pink", "red"] as const;

function initialsOf(name: string) {
  const words = name.replace(/^@/, "").split(/[\s._-]+/).filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

function hueOf(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return FILLS[h % FILLS.length];
}

export function Avatar({ name, source, size = 44, status, ring = false, badge }: AvatarProps) {
  const colors = useThemeColors();
  const hues = useHues();
  const d = Math.min(96, Math.max(24, size));
  const ringWidth = d >= 64 ? 2.5 : 2;
  const inset = ring ? ringWidth + (d >= 64 ? 3 : 2) : 0;
  const inner = d - inset * 2;
  const dot = Math.max(8, Math.round(d * 0.26));
  const statusColor = status === "online" ? colors.success : status === "away" ? colors.warning : colors.error;
  return (
    <View style={{ width: d, height: d }} accessibilityRole="image" accessibilityLabel={status ? `${name}, ${status}` : name}>
      {ring ? (
        <View
          style={{ position: "absolute", width: d, height: d, borderRadius: d / 2, borderWidth: ringWidth, borderColor: ring === "seen" ? colors.border : colors.text }}
        />
      ) : null}
      <View
        style={{
          position: "absolute",
          top: inset,
          left: inset,
          width: inner,
          height: inner,
          borderRadius: inner / 2,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: source ? colors.surface : hues[hueOf(name)],
        }}
      >
        {source ? (
          <Image source={source} style={{ width: inner, height: inner }} contentFit="cover" />
        ) : (
          // White on the saturated fill in both themes, like badge text.
          <Text weight="semibold" style={{ fontSize: Math.round(inner * 0.38), letterSpacing: -0.3, color: "#fff" }}>
            {initialsOf(name)}
          </Text>
        )}
      </View>
      {status ? (
        <View
          style={{ position: "absolute", right: 0, bottom: 0, width: dot, height: dot, borderRadius: dot / 2, backgroundColor: statusColor, borderWidth: 2, borderColor: colors.background }}
        />
      ) : null}
      {badge ? <View style={{ position: "absolute", right: -3, bottom: -3 }}>{badge}</View> : null}
    </View>
  );
}

export interface AvatarStackProps {
  people: readonly { name: string; source?: ImageProps["source"] }[];
  size?: number;
  /** How many faces to draw before counting. */
  max?: number;
  /** Everyone, when `people` only holds the first few. */
  total?: number;
}

/** A few avatars overlapped, with "+N" for the ones not drawn. */
export function AvatarStack({ people, size = 28, max = 3, total }: AvatarStackProps) {
  const colors = useThemeColors();
  const shown = people.slice(0, max);
  const rest = (total ?? people.length) - shown.length;
  const edge = 2;
  const step = Math.round(size * 0.68);
  const cell = size + edge * 2;
  const count = shown.length + (rest > 0 ? 1 : 0);
  return (
    <View
      style={{ width: count ? cell + (count - 1) * step : 0, height: cell }}
      accessibilityRole="image"
      accessibilityLabel={`${shown.map((p) => p.name).join(", ")}${rest > 0 ? ` and ${rest} more` : ""}`}
    >
      {shown.map((p, i) => (
        // The ring in the page colour is what separates one face from the next.
        <View key={`${p.name}${i}`} style={{ position: "absolute", left: i * step, zIndex: count - i, borderRadius: cell / 2, borderWidth: edge, borderColor: colors.background }}>
          <Avatar name={p.name} source={p.source} size={size} />
        </View>
      ))}
      {rest > 0 ? (
        <View
          style={{ position: "absolute", left: shown.length * step, width: cell, height: cell, borderRadius: cell / 2, borderWidth: edge, borderColor: colors.background, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }}
        >
          <Text weight="semibold" numberOfLines={1} style={[size >= 36 ? TYPE.sub : TYPE.caption, TABULAR]}>
            {`+${rest > 99 ? "99" : rest}`}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
