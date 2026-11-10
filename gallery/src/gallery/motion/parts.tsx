// Gallery-only: the blocks the Transitions pages share, so no page picks its
// own numbers. One edge (16), one gap (12), one spacing scale (2, 4, 8, 12,
// 16, 24), one type scale (22 title, 17 headline, 15 body, 13 secondary) and
// two radii (10 for covers, 16 for hero art). Every page draws covers with
// CoverArt, hero art with HeroArt and its header with LabHeader or the native
// header, never by hand.
import { GlassSurface } from "@/components/GlassSurface";
import { Button, Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import { Toast } from "@/lib/toast";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ChevronLeft, Play, Shuffle, X } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Transition from "react-native-screen-transitions";
import { type Playlist, type Track, playlistMeta } from "./data";

export const EDGE = 16;
export const GAP = 12;
export const COVER_RADIUS = 10;
export const HERO_RADIUS = 16;
/** Header bar height under the status bar, as iOS draws it. */
export const BAR = 44;

const ROW = { height: 52, number: 20, gap: 12 };

/** Width of one cover in a two-up grid. */
export function useCoverWidth() {
  const { width } = useWindowDimensions();
  return Math.floor((width - EDGE * 2 - GAP) / 2);
}

/** Hero artwork size on a playlist page: two thirds of the screen. */
export function useHeroWidth() {
  const { width } = useWindowDimensions();
  return Math.round(width * 0.66);
}

/** A square cover at the grid / row size. */
export function CoverArt({ source, size }: { source: number; size: number }) {
  return <Image source={source} style={{ width: size, height: size, borderRadius: COVER_RADIUS }} contentFit="cover" transition={120} />;
}

/** The playlist page's hero cover. */
export function HeroArt({ source }: { source: number }) {
  const size = useHeroWidth();
  return <Image source={source} style={{ width: size, height: size, borderRadius: HERO_RADIUS, borderCurve: "continuous" }} contentFit="cover" />;
}

/** Title and curator under a cover in the grid. */
export function CoverCaption({ p }: { p: Playlist }) {
  const colors = useThemeColors();
  return (
    <View style={{ paddingTop: 8, gap: 2 }}>
      <Text weight="medium" numberOfLines={1} style={styles.body}>{p.title}</Text>
      <Text weight="medium" numberOfLines={1} style={[styles.secondary, { color: colors.muted }]}>{p.curator}</Text>
    </View>
  );
}

/** Artwork slot, title block and Play / Shuffle. The art is passed in so each
 *  page can wrap HeroArt in its own transition target. */
export function PlaylistHeader({ p, art }: { p: Playlist; art: ReactNode }) {
  const colors = useThemeColors();
  // Button already fires its press haptic.
  const play = (shuffle: boolean) => () => Toast.success(shuffle ? `Shuffling ${p.title}` : `Playing ${p.title}`);
  return (
    <View style={{ alignItems: "center", paddingTop: 8 }}>
      {art}
      <Text weight="semibold" style={[styles.title, { marginTop: 16 }]}>{p.title}</Text>
      <Text weight="medium" style={[styles.body, { color: colors.muted, marginTop: 2 }]}>{p.curator}</Text>
      <Text weight="medium" style={[styles.secondary, { color: colors.muted, marginTop: 2 }]}>{playlistMeta(p)}</Text>
      <View style={{ flexDirection: "row", gap: GAP, alignSelf: "stretch", paddingHorizontal: EDGE, marginTop: 16, marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Button fullWidth leftIcon={<Play fill={colors.onTint} />} onPress={play(false)}>Play</Button>
        </View>
        <View style={{ flex: 1 }}>
          <Button fullWidth variant="secondary" leftIcon={<Shuffle />} onPress={play(true)}>Shuffle</Button>
        </View>
      </View>
    </View>
  );
}

/** Numbered two-line rows, 52pt, hairlines start at the title. */
export function TrackList({ tracks }: { tracks: readonly Track[] }) {
  const colors = useThemeColors();
  return (
    <View style={{ paddingBottom: 24 }}>
      {tracks.map((t, i) => (
        <View key={`${i}-${t.title}`}>
          {i > 0 ? <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: EDGE + ROW.number + ROW.gap }} /> : null}
          <Pressable
            onPress={() => {
              haptic("selection");
              Toast.success(`Playing ${t.title}`);
            }}
            accessibilityRole="button"
            accessibilityLabel={`${t.title} by ${t.artist}, ${t.time}`}
            style={({ pressed }) => ({
              height: ROW.height,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: EDGE,
              columnGap: ROW.gap,
              backgroundColor: pressed ? colors.border : "transparent",
            })}
          >
            <Text weight="medium" style={[styles.secondary, styles.nums, { width: ROW.number, textAlign: "right", color: colors.muted }]}>{i + 1}</Text>
            <View style={{ flex: 1, gap: 2 }}>
              <Text weight="medium" numberOfLines={1} style={styles.body}>{t.title}</Text>
              <Text weight="medium" numberOfLines={1} style={[styles.secondary, { color: colors.muted }]}>{t.artist}</Text>
            </View>
            <Text weight="medium" style={[styles.secondary, styles.nums, { color: colors.muted }]}>{t.time}</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

/**
 * Header for pages in the transition lab, which has no native header: a 44pt
 * bar under the status bar with a glass button on the left and the title
 * centred on the bar. `close` draws an X (for cards that dismiss downward);
 * `onDark` draws white for pages on black.
 */
export function LabHeader({
  title,
  close = false,
  onDark = false,
  inset = true,
}: {
  title?: string;
  close?: boolean;
  onDark?: boolean;
  /** False when the page already sits below the status bar (a card). */
  inset?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const top = inset ? insets.top : 0;
  const ink = onDark ? "#fff" : colors.text;
  const Icon = close ? X : ChevronLeft;
  return (
    <View style={{ height: top + BAR, paddingTop: top }}>
      {title ? (
        <View style={{ position: "absolute", top, left: 72, right: 72, height: BAR, justifyContent: "center" }}>
          <Text weight="semibold" numberOfLines={1} style={[styles.headline, { textAlign: "center", color: ink }]}>{title}</Text>
        </View>
      ) : null}
      <View style={{ height: BAR, justifyContent: "center", paddingHorizontal: EDGE }}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel={close ? "Close" : "Back"} hitSlop={8} style={{ alignSelf: "flex-start" }}>
          <GlassSurface isInteractive style={styles.back}>
            <Icon size={close ? 18 : 22} color={ink} strokeWidth={2} />
          </GlassSurface>
        </Pressable>
      </View>
    </View>
  );
}

/** A page in the transition lab: page colour, LabHeader, scrolling body. */
export function LabPage({ title, children }: { title?: string; children: ReactNode }) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LabHeader title={title} />
      <Transition.ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>{children}</Transition.ScrollView>
    </View>
  );
}

export const styles = StyleSheet.create({
  title: { fontSize: 22, lineHeight: 28, letterSpacing: -0.4, textAlign: "center" },
  headline: { fontSize: 17, lineHeight: 22, letterSpacing: -0.4 },
  body: { fontSize: 15, lineHeight: 20, letterSpacing: -0.2 },
  secondary: { fontSize: 13, lineHeight: 17 },
  nums: { fontVariant: ["tabular-nums"] },
  back: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", overflow: "hidden" },
});
