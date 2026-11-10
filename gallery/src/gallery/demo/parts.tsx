// Gallery-only: the few blocks the demo apps (Fitness, Shop, Bookings,
// Account) share, so every screen in them is built the same way. Each is a
// thin arrangement of kit pieces at kit metrics (SettingsRow height and
// padding, SettingsGroup hairlines, Tile, Card raised, 24pt radius).
import { Text, View } from "@/components/ui";
import { SETTINGS_ROW } from "@/components/ui/lists/SettingsRow";
import { ArtSectionHeader } from "@/apps/sellers/components/ArtSectionHeader";
import { useInsetFooterSpace } from "@/components/onboarding/shells/InsetShell";
import { ART } from "@/gallery/demo/data";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Image, type ImageProps } from "expo-image";

type ImageSource = ImageProps["source"];
import { type Href, Link, useLocalSearchParams } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { Pressable, ScrollView, StyleSheet, useWindowDimensions } from "react-native";

export const GUTTER = 16;
export const RADIUS = 24;
const THUMB = 44;
/** Pass to SettingsGroup when it holds MediaRows: hairlines start at the text. */
export const MEDIA_INSET = SETTINGS_ROW.paddingHorizontal + THUMB + SETTINGS_ROW.gap;

/** Full-width photo at the top of a detail screen. It is the landing spot
 *  of the Apple zoom from whichever tile opened the page. */
export function Hero({ source, height = 240 }: { source: ImageSource; height?: number }) {
  return (
    <Link.AppleZoomTarget>
      <View style={{ marginHorizontal: GUTTER, height, borderRadius: RADIUS, borderCurve: "continuous", overflow: "hidden" }}>
        <Image source={source} style={{ flex: 1 }} contentFit="cover" transition={150} />
      </View>
    </Link.AppleZoomTarget>
  );
}

/** Title, one muted line, and an optional big figure (price, time). */
export function TitleBlock({ title, subtitle, figure }: { title: string; subtitle?: string; figure?: string }) {
  const colors = useThemeColors();
  return (
    <View style={{ paddingHorizontal: GUTTER, paddingTop: 16, paddingBottom: 12, gap: 4 }}>
      <Text weight="semibold" style={{ fontSize: 24, letterSpacing: -0.5 }}>{title}</Text>
      {subtitle ? <Text weight="medium" style={{ fontSize: 15, color: colors.muted }}>{subtitle}</Text> : null}
      {figure ? (
        <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4, marginTop: 8, fontVariant: ["tabular-nums"] }}>{figure}</Text>
      ) : null}
    </View>
  );
}

/** A SettingsRow with a photo: same padding and pressed fill, 60pt tall.
 *  With `href` it is a Link like SettingsRow's (asChild, Trigger, plain-object
 *  pressed style), its photo zooms into the page's Hero and press and hold
 *  peeks. With only `onPress` it is a plain row. */
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
  const [pressed, setPressed] = useState(false);
  const tappable = !!(href || onPress);
  const thumb = image ? (
    <Image source={image} style={{ width: THUMB, height: THUMB, borderRadius: 10 }} contentFit="cover" />
  ) : (
    <View style={{ width: THUMB }}>{leading}</View>
  );
  const row = (
    <Pressable
      disabled={!tappable}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      accessibilityRole={href ? "link" : tappable ? "button" : undefined}
      accessibilityLabel={[title, subtitle, trailing].filter(Boolean).join(", ")}
      style={{
        flexDirection: "row",
        alignItems: "center",
        minHeight: 60,
        paddingVertical: 8,
        paddingHorizontal: SETTINGS_ROW.paddingHorizontal,
        columnGap: SETTINGS_ROW.gap,
        backgroundColor: pressed && tappable ? colors.border : "transparent",
      }}
    >
      {href && image ? <Link.AppleZoom>{thumb}</Link.AppleZoom> : thumb}
      <View style={{ flex: 1, gap: 2 }}>
        <Text weight="medium" numberOfLines={1} style={{ fontSize: SETTINGS_ROW.labelFontSize, letterSpacing: SETTINGS_ROW.labelLetterSpacing }}>
          {title}
        </Text>
        {subtitle ? <Text weight="medium" numberOfLines={1} style={{ fontSize: 13, color: colors.muted }}>{subtitle}</Text> : null}
      </View>
      {trailing && accessory ? (
        // Figure over badge, so the title keeps the row's width.
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <Text weight="semibold" style={{ fontSize: 15, fontVariant: ["tabular-nums"] }}>{trailing}</Text>
          {accessory}
        </View>
      ) : (
        <>
          {trailing ? <Text weight="medium" style={{ fontSize: 15, fontVariant: ["tabular-nums"] }}>{trailing}</Text> : null}
          {accessory}
        </>
      )}
      {href ? <ChevronRight size={SETTINGS_ROW.chevronSize} color={colors.muted} strokeWidth={SETTINGS_ROW.chevronStrokeWidth} /> : null}
    </Pressable>
  );
  if (!href) return row;
  return (
    <Link href={href} asChild>
      <Link.Trigger>{row}</Link.Trigger>
      {image ? <Link.Preview /> : null}
    </Link>
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

/** A photo with a title and a muted line under it. With `href` it opens the
 *  page with Apple's zoom (iOS 18+: the photo grows into the page's Hero and
 *  shrinks back), and press and hold peeks at it. */
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
  const [pressed, setPressed] = useState(false);
  const photo = (
    <View style={{ width, height: width / ratio, borderRadius: 20, borderCurve: "continuous", overflow: "hidden", backgroundColor: colors.surface }}>
      <Image source={image} style={{ flex: 1 }} contentFit="cover" transition={150} />
      {badge ? <View style={{ position: "absolute", top: 10, left: 10 }}>{badge}</View> : null}
    </View>
  );
  const caption = (
    <View style={{ gap: 2, paddingHorizontal: 2 }}>
      <Text weight="medium" numberOfLines={1} style={{ fontSize: 15, letterSpacing: -0.2 }}>{title}</Text>
      {subtitle ? <Text weight="medium" numberOfLines={1} style={{ fontSize: 13, color: colors.muted, fontVariant: ["tabular-nums"] }}>{subtitle}</Text> : null}
    </View>
  );
  if (!href) return <View style={{ gap: 8 }}>{photo}{caption}</View>;
  // SettingsRow's Link pattern: asChild, Trigger, a Pressable that owns onPress
  // (the Link navigates; onPress only adds the haptic). Only the photo zooms.
  return (
    <Link href={href} asChild>
      <Link.Trigger>
        <Pressable
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          onPress={() => Haptics.selectionAsync().catch(() => {})}
          accessibilityRole="link"
          accessibilityLabel={[title, subtitle].filter(Boolean).join(", ")}
          // Plain-object style: Link's clone drops function styles.
          style={{ gap: 8, transform: [{ scale: pressed ? 0.97 : 1 }] }}
        >
          <Link.AppleZoom>{photo}</Link.AppleZoom>
          {caption}
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
    </Link>
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
    <View style={{ marginHorizontal: GUTTER, marginBottom: 24, gap: 10 }}>
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

/** The page's state (loaded, empty, sold out...) from the link the gallery
 *  opened it with (?state=). Nothing is drawn on the page: it looks exactly as
 *  it would in an app. */
export function useStates<T extends readonly string[]>(values: T, fromData?: T[number]) {
  const { state } = useLocalSearchParams<{ state?: string }>();
  if (__DEV__ && state && !values.includes(state)) console.warn(`useStates: unknown state "${state}"`);
  // Opened from a row (no ?state=): show what that row's data says.
  return {
    state: (values.includes(state ?? "") ? state : (fromData ?? values[0])) as T[number],
  };
}

/**
 * Every demo screen's frame, the same as an app screen: scrolling content
 * and, when the page has one, the kit's sticky InsetFooter floating over it.
 */
export function DemoScreen({
  children,
  footer,
  secondary = false,
  scroll = true,
}: {
  children: ReactNode;
  footer?: ReactNode;
  /** The footer has a second button. */
  secondary?: boolean;
  /** False for a screen that fills itself (EmptyState). */
  scroll?: boolean;
}) {
  const space = useInsetFooterSpace({ secondary });
  return (
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

/** Facts as label / value rows, the way Health and Settings list them:
 *  label left, the change since last time beside the value, value right in
 *  tabular figures, 36pt rows on hairlines. One column, every row readable. */
export function FactList({
  items,
}: {
  items: readonly { label: string; value: string; unit?: string; delta?: string; good?: boolean }[];
}) {
  const colors = useThemeColors();
  return (
    <View style={{ marginHorizontal: GUTTER, marginBottom: 18 }}>
      {items.map((m, i) => (
        <View
          key={m.label}
          style={{ flexDirection: "row", alignItems: "center", height: 36, columnGap: 8, borderTopWidth: i ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}
        >
          <Text weight="medium" numberOfLines={1} style={{ flex: 1, fontSize: 15, color: colors.muted }}>{m.label}</Text>
          {m.delta ? (
            <Text weight="medium" numberOfLines={1} style={{ fontSize: 13, color: m.good ? colors.success : colors.error, fontVariant: ["tabular-nums"] }}>{m.delta}</Text>
          ) : null}
          <Text numberOfLines={1} style={{ fontVariant: ["tabular-nums"] }}>
            <Text weight="semibold" style={{ fontSize: 15 }}>{m.value}</Text>
            {m.unit ? <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>{` ${m.unit}`}</Text> : null}
          </Text>
        </View>
      ))}
    </View>
  );
}

export interface Column {
  key: string;
  label: string;
  /** Fixed width for number columns; omit for the one flexible column. */
  width?: number;
  align?: "left" | "right" | "center";
}

/** An aligned table: muted 12pt header, 40pt rows (32 dense), numbers in tabular
 *  figures, hairlines between rows. For set logs, weekly totals and the like. */
export function DataTable({
  columns,
  rows,
  highlight,
  muted,
  dense = false,
}: {
  columns: readonly Column[];
  rows: readonly Record<string, ReactNode>[];
  /** Row index drawn bold (the current set). */
  highlight?: number;
  /** Row indexes drawn muted (done, or not yet). */
  muted?: readonly number[];
  /** 13pt text in 32pt rows, for tables with many columns. */
  dense?: boolean;
}) {
  const colors = useThemeColors();
  const size = dense ? 13 : 15;
  const rowHeight = dense ? 32 : 40;
  const cell = (c: Column) => ({
    width: c.width,
    flex: c.width ? undefined : 1,
    textAlign: c.align ?? (c.width ? "right" : "left"),
  });
  return (
    <View style={{ marginHorizontal: GUTTER, marginBottom: 18 }}>
      <View style={{ flexDirection: "row", columnGap: 8, paddingBottom: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.border }}>
        {columns.map((c) => (
          <Text key={c.key} weight="medium" numberOfLines={1} style={[{ fontSize: 12, color: colors.muted }, cell(c) as object]}>{c.label}</Text>
        ))}
      </View>
      {rows.map((r, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", columnGap: 8, height: rowHeight, borderBottomWidth: i < rows.length - 1 ? StyleSheet.hairlineWidth : 0, borderColor: colors.border }}>
          {columns.map((c) => {
            const v = r[c.key];
            return typeof v === "string" || typeof v === "number" ? (
              <Text
                key={c.key}
                weight={highlight === i ? "semibold" : "medium"}
                numberOfLines={1}
                style={[{ fontSize: size, fontVariant: ["tabular-nums"], color: muted?.includes(i) ? colors.muted : colors.text }, cell(c) as object]}
              >
                {v}
              </Text>
            ) : (
              <View key={c.key} style={{ width: c.width, flex: c.width ? undefined : 1, alignItems: c.align === "left" ? "flex-start" : c.align === "center" ? "center" : "flex-end" }}>{v}</View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

/** A display page's section header: SELLERS Today's ArtSectionHeader (Thiings
 *  icon, 17pt title, optional muted note on the right). */
export function Section({ title, art, trailing }: { title: string; art: keyof typeof ART; trailing?: string }) {
  return <ArtSectionHeader title={title} art={ART[art]} trailing={trailing} />;
}
