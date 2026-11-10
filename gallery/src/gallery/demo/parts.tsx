// Gallery-only: the few blocks the demo apps (Fitness, Shop, Bookings,
// Account) share, so every screen in them is built the same way. Each is a
// thin arrangement of kit pieces at kit metrics (SettingsRow height and
// padding, SettingsGroup hairlines, Tile, Card raised, 24pt radius).
import { Text, View } from "@/components/ui";
import { SETTINGS_ROW } from "@/components/ui/lists/SettingsRow";
import { Tile } from "@/components/ui/surfaces/Tile";
import { useInsetFooterSpace } from "@/components/onboarding/shells/InsetShell";
import { BottomSwitch } from "@/gallery/BottomSwitch";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Image, type ImageProps } from "expo-image";

type ImageSource = ImageProps["source"];
import { type Href, router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { Pressable, ScrollView, useWindowDimensions } from "react-native";

export const GUTTER = 16;
export const RADIUS = 24;
const THUMB = 52;
/** Pass to SettingsGroup when it holds MediaRows: hairlines start at the text. */
export const MEDIA_INSET = SETTINGS_ROW.paddingHorizontal + THUMB + SETTINGS_ROW.gap;

const go = (href?: Href, onPress?: () => void) => () => {
  Haptics.selectionAsync().catch(() => {});
  onPress?.();
  if (href) router.push(href);
};

/** Full-width photo at the top of a detail screen. */
export function Hero({ source, height = 240 }: { source: ImageSource; height?: number }) {
  return (
    <View style={{ marginHorizontal: GUTTER, height, borderRadius: RADIUS, borderCurve: "continuous", overflow: "hidden" }}>
      <Image source={source} style={{ flex: 1 }} contentFit="cover" transition={150} />
    </View>
  );
}

/** Title, one muted line, and an optional big figure (price, time). */
export function TitleBlock({ title, subtitle, figure }: { title: string; subtitle?: string; figure?: string }) {
  const colors = useThemeColors();
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 18, gap: 4 }}>
      <Text weight="semibold" style={{ fontSize: 24, letterSpacing: -0.5 }}>{title}</Text>
      {subtitle ? <Text weight="medium" style={{ fontSize: 15, color: colors.muted }}>{subtitle}</Text> : null}
      {figure ? (
        <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4, marginTop: 8, fontVariant: ["tabular-nums"] }}>{figure}</Text>
      ) : null}
    </View>
  );
}

/** A SettingsRow with a photo: same padding and pressed fill, 72pt tall. */
export function MediaRow({
  image,
  leading,
  title,
  subtitle,
  trailing,
  accessory,
  href,
  onPress,
}: {
  image?: ImageSource;
  /** In place of the photo: an Avatar or a TimeColumn, THUMB wide. */
  leading?: ReactNode;
  title: string;
  subtitle?: string;
  trailing?: string;
  accessory?: ReactNode;
  href?: Href;
  onPress?: () => void;
}) {
  const colors = useThemeColors();
  const tappable = !!(href || onPress);
  return (
    <Pressable
      disabled={!tappable}
      onPress={go(href, onPress)}
      accessibilityRole={tappable ? "button" : undefined}
      accessibilityLabel={[title, subtitle, trailing].filter(Boolean).join(", ")}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        minHeight: 72,
        paddingVertical: 10,
        paddingHorizontal: SETTINGS_ROW.paddingHorizontal,
        columnGap: SETTINGS_ROW.gap,
        backgroundColor: pressed && tappable ? colors.border : "transparent",
      })}
    >
      {image ? <Image source={image} style={{ width: THUMB, height: THUMB, borderRadius: 14 }} contentFit="cover" /> : <View style={{ width: THUMB }}>{leading}</View>}
      <View style={{ flex: 1, gap: 2 }}>
        <Text weight="medium" numberOfLines={1} style={{ fontSize: SETTINGS_ROW.labelFontSize, letterSpacing: SETTINGS_ROW.labelLetterSpacing }}>
          {title}
        </Text>
        {subtitle ? <Text weight="medium" numberOfLines={1} style={{ fontSize: 13, color: colors.muted }}>{subtitle}</Text> : null}
      </View>
      {trailing ? <Text weight="medium" style={{ fontSize: 15, fontVariant: ["tabular-nums"] }}>{trailing}</Text> : null}
      {accessory}
      {href ? <ChevronRight size={SETTINGS_ROW.chevronSize} color={colors.muted} strokeWidth={SETTINGS_ROW.chevronStrokeWidth} /> : null}
    </Pressable>
  );
}

/** A row of small grey Tiles: a figure over a muted label. */
export function StatTiles({ items }: { items: readonly { label: string; value: string }[] }) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: "row", gap: 10, marginHorizontal: GUTTER, marginBottom: 18 }}>
      {items.map((s) => (
        <Tile key={s.label} style={{ flex: 1, gap: 2 }}>
          <Text weight="semibold" numberOfLines={1} style={{ fontSize: 19, letterSpacing: -0.4, fontVariant: ["tabular-nums"] }}>{s.value}</Text>
          <Text weight="medium" numberOfLines={1} style={{ fontSize: 13, color: colors.muted }}>{s.label}</Text>
        </Tile>
      ))}
    </View>
  );
}

/** Two-up grid of photo tiles (products, workouts). */
export function PhotoGrid<T>({
  data,
  keyOf,
  render,
}: {
  data: readonly T[];
  keyOf: (item: T) => string;
  render: (item: T, width: number) => ReactNode;
}) {
  const { width } = useWindowDimensions();
  const w = (width - GUTTER * 2 - 12) / 2;
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginHorizontal: GUTTER, rowGap: 20, marginBottom: 24 }}>
      {data.map((item) => (
        <View key={keyOf(item)} style={{ width: w }}>{render(item, w)}</View>
      ))}
    </View>
  );
}

/** A photo with a title and a muted line under it; pushes `href`. */
export function PhotoTile({
  image,
  title,
  subtitle,
  width,
  ratio = 1,
  href,
  badge,
}: {
  image: ImageSource;
  title: string;
  subtitle?: string;
  width: number;
  ratio?: number;
  href?: Href;
  badge?: ReactNode;
}) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={go(href)}
      accessibilityRole="button"
      accessibilityLabel={[title, subtitle].filter(Boolean).join(", ")}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1, gap: 8 })}
    >
      <View style={{ width, height: width / ratio, borderRadius: 20, borderCurve: "continuous", overflow: "hidden", backgroundColor: colors.surface }}>
        <Image source={image} style={{ flex: 1 }} contentFit="cover" transition={150} />
        {badge ? <View style={{ position: "absolute", top: 10, left: 10 }}>{badge}</View> : null}
      </View>
      <View style={{ gap: 1, paddingHorizontal: 2 }}>
        <Text weight="medium" numberOfLines={1} style={{ fontSize: 15, letterSpacing: -0.2 }}>{title}</Text>
        {subtitle ? <Text weight="medium" numberOfLines={1} style={{ fontSize: 13, color: colors.muted, fontVariant: ["tabular-nums"] }}>{subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}

/** Label / value lines with a bold total under a hairline (basket, checkout, receipt). */
export function Summary({ lines, total }: { lines: readonly [string, string][]; total: [string, string] }) {
  const colors = useThemeColors();
  const line = (l: string, v: string, strong = false) => (
    <View key={l} style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text weight={strong ? "semibold" : "medium"} style={{ fontSize: strong ? 17 : 15, color: strong ? colors.text : colors.muted }}>{l}</Text>
      <Text weight={strong ? "semibold" : "medium"} style={{ fontSize: strong ? 17 : 15, fontVariant: ["tabular-nums"] }}>{v}</Text>
    </View>
  );
  return (
    <View style={{ marginHorizontal: 20, marginBottom: 24, gap: 10 }}>
      {lines.map(([l, v]) => line(l, v))}
      <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 2 }} />
      {line(total[0], total[1], true)}
    </View>
  );
}

/** A horizontal row of kit Chips (filters, sizes, days) that scrolls. */
export function ChipRow({ children }: { children: ReactNode }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: GUTTER, gap: 8 }}>
        {children}
      </ScrollView>
    </View>
  );
}

/** The state switch every demo screen has at the bottom (Loaded / Loading / Empty, and so on). */
export function useStates<T extends readonly string[]>(values: T) {
  const [i, setI] = useState(0);
  return {
    state: values[i] as T[number],
    bar: <BottomSwitch values={values} selectedIndex={i} onChange={setI} accessibilityLabel="Screen state" />,
  };
}

/**
 * Every demo screen's frame: scrolling content, an optional sticky footer
 * (InsetFooter, which floats over the content) and the state switch under it.
 */
export function DemoScreen({
  children,
  footer,
  secondary = false,
  bar,
  scroll = true,
}: {
  children: ReactNode;
  footer?: ReactNode;
  /** The footer has a second button. */
  secondary?: boolean;
  bar?: ReactNode;
  /** False for a screen that fills itself (EmptyState). */
  scroll?: boolean;
}) {
  const space = useInsetFooterSpace({ secondary });
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {scroll ? (
          <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingTop: 8, paddingBottom: footer ? space : 32 }}>
            {children}
          </ScrollView>
        ) : (
          children
        )}
        {footer}
      </View>
      {bar}
    </View>
  );
}

/** Initials in a grey circle, for people with no photo. */
export function Avatar({ name, size = THUMB }: { name: string; size?: number }) {
  const colors = useThemeColors();
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }}>
      <Text weight="semibold" style={{ fontSize: size * 0.34, letterSpacing: -0.3 }}>{initials}</Text>
    </View>
  );
}

/** Start over end time, for schedule rows. */
export function TimeColumn({ start, end, struck = false }: { start: string; end: string; struck?: boolean }) {
  const colors = useThemeColors();
  const line = struck ? ("line-through" as const) : undefined;
  return (
    <View style={{ gap: 2 }}>
      <Text weight="semibold" style={{ fontSize: 15, fontVariant: ["tabular-nums"], textDecorationLine: line }}>{start}</Text>
      <Text weight="medium" style={{ fontSize: 13, color: colors.muted, fontVariant: ["tabular-nums"], textDecorationLine: line }}>{end}</Text>
    </View>
  );
}
