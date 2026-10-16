// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/EmptyState.tsx. Edit it there and sync; local edits fail ui-kit:check.
/**
 * EmptyState - the one empty state for SELLERS.
 *
 * Small art, a short bold title, one or two muted lines, and at most one
 * pill action. Quiet on purpose: an empty list is a normal state, not an
 * error, so nothing here is red, oversized or boxed in a tinted tile.
 *
 *   art={{ emoji: "🎁" }}      Apple's 3D emoji at 56pt. Pick one object
 *                              that names the thing (📦 orders, 🚚
 *                              suppliers, 🧾 receipts), not a mood.
 *   art={{ image: require("@/assets/images/empty/box.png") }}
 *                              a 3D icon PNG at 88pt, for the same job as
 *                              the emoji once real art is in the repo.
 *   art="list"                 three faded placeholder rows: for inboxes
 *                              and lists that will fill up on their own.
 *   art="grid"                 four faded placeholder tiles: for catalogues
 *                              and galleries.
 *
 * Layout: `fill` (default) centres in the space it is given, for a whole
 * screen or pane. `inline` sits inside a section with modest padding.
 *
 * Copy: title says what is missing in a few words ("No suppliers yet"),
 * body says what will appear or what to do ("Add one to start ordering").
 * No exclamation marks, no "Oops".
 */
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Plus, type LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { Image } from "expo-image";
import { Pressable, StyleSheet, View as RNView, type ImageSourcePropType } from "react-native";
import { Text } from "./Text";
import { View } from "./View";

export type EmptyStateArt =
  | { emoji: string }
  /** A lucide icon in a 72pt circle (VOID's chip), when there's no 3D art. */
  | { icon: LucideIcon }
  /** A 3D icon PNG (transparent, square, ideally 512px), e.g. from Thiings. */
  | { image: ImageSourcePropType }
  | "list"
  | "grid"
  | "none";

export interface EmptyStateAction {
  label: string;
  onPress: () => void;
  /** Leading plus, for "create" actions. */
  plus?: boolean;
}

export interface EmptyStateProps {
  title: string;
  body?: string;
  art?: EmptyStateArt;
  action?: EmptyStateAction;
  /** A second action, e.g. "Clear filters": a filled grey pill (never a ghost link). */
  secondary?: EmptyStateAction;
  /** `fill` centres in the available space; `inline` sits in a section. */
  layout?: "fill" | "inline";
  /** Extra content under the actions (rare). */
  children?: ReactNode;
}

export function EmptyState({
  title,
  body,
  art = "none",
  action,
  secondary,
  layout = "fill",
  children,
}: EmptyStateProps) {
  const colors = useThemeColors();
  const fill = layout === "fill";

  return (
    <View
      style={
        fill
          ? { flexGrow: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingVertical: 48 }
          : { alignItems: "center", paddingHorizontal: 24, paddingVertical: 28 }
      }
      accessible={!action && !secondary}
      accessibilityLabel={[title, body].filter(Boolean).join(". ")}
    >
      <EmptyArt art={art} />

      <Text
        weight="semibold"
        className="text-center"
        maxFontSizeMultiplier={1.4}
        style={{ fontSize: 17, letterSpacing: -0.3, color: colors.text, maxWidth: 280 }}
      >
        {title}
      </Text>
      {body ? (
        <Text
          className="text-center mt-1.5"
          maxFontSizeMultiplier={1.4}
          style={{ fontSize: 14, lineHeight: 20, color: colors.muted, maxWidth: 280 }}
        >
          {body}
        </Text>
      ) : null}

      {action ? <EmptyStatePill {...action} /> : null}
      {secondary ? <EmptyStatePill {...secondary} tone="secondary" stacked={!!action} /> : null}
      {children}
    </View>
  );
}

// Secondary uses InsetShell's secondary CTA colours (surface fill + border).
function EmptyStatePill({
  label,
  onPress,
  plus,
  tone = "primary",
  stacked = false,
}: EmptyStateAction & { tone?: "primary" | "secondary"; stacked?: boolean }) {
  const colors = useThemeColors();
  const secondary = tone === "secondary";
  const labelColor = secondary ? colors.text : colors.primaryText;
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        marginTop: stacked ? 10 : 20,
        height: 38,
        paddingHorizontal: 18,
        borderRadius: 19,
        borderCurve: "continuous",
        backgroundColor: secondary ? colors.surface : colors.primary,
        borderWidth: secondary ? 1 : 0,
        borderColor: colors.border,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        opacity: pressed ? 0.85 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {plus ? <Plus size={15} strokeWidth={2.4} color={labelColor} /> : null}
      <Text weight="semibold" style={{ fontSize: 14, color: labelColor }}>
        {label}
      </Text>
    </Pressable>
  );
}

function EmptyArt({ art }: { art: EmptyStateArt }) {
  const colors = useThemeColors();
  if (art === "none") return null;

  if (typeof art === "object" && "icon" in art) {
    const Icon = art.icon;
    return (
      <View
        className="rounded-full items-center justify-center"
        style={{
          width: 72,
          height: 72,
          marginBottom: 14,
          backgroundColor: colors.secondaryBackground,
        }}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <Icon size={32} color={colors.muted} strokeWidth={1.8} />
      </View>
    );
  }

  if (typeof art === "object" && "image" in art) {
    return (
      <Image
        source={art.image}
        style={{ width: 88, height: 88, marginBottom: 12 }}
        contentFit="contain"
        accessible={false}
      />
    );
  }

  if (typeof art === "object") {
    return (
      <Text
        style={{ fontSize: 56, lineHeight: 68, marginBottom: 14 }}
        allowFontScaling={false}
        accessible={false}
      >
        {art.emoji}
      </Text>
    );
  }

  // Placeholder shapes: the surface colour on the background, fading out
  // row by row, so they read as "this is where things will go".
  const shape = colors.surfaceElevated;
  if (art === "list") {
    return (
      <RNView style={styles.listArt} accessible={false}>
        {[1, 0.6, 0.3].map((opacity, i) => (
          <RNView key={i} style={[styles.listRow, { opacity }]}>
            <RNView style={[styles.dot, { backgroundColor: shape }]} />
            <RNView style={{ flex: 1, gap: 6 }}>
              <RNView style={[styles.bar, { width: i === 1 ? "55%" : "70%", backgroundColor: shape }]} />
              <RNView style={[styles.bar, { width: i === 1 ? "80%" : "45%", height: 6, backgroundColor: shape }]} />
            </RNView>
          </RNView>
        ))}
      </RNView>
    );
  }

  return (
    <RNView style={styles.gridArt} accessible={false}>
      {[1, 0.7, 0.5, 0.3].map((opacity, i) => (
        <RNView key={i} style={[styles.tile, { opacity, backgroundColor: shape }]} />
      ))}
    </RNView>
  );
}

const styles = StyleSheet.create({
  listArt: { width: 200, gap: 14, marginBottom: 24 },
  listRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  dot: { width: 28, height: 28, borderRadius: 14 },
  bar: { height: 8, borderRadius: 4 },
  gridArt: {
    width: 128,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  tile: { width: 60, height: 60, borderRadius: 14, borderCurve: "continuous" },
});
