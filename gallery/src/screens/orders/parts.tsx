// Small arrangements the order screens share, so a row means the same thing
// on every one of them: a 44pt leading slot (photo, brand mark or icon), two
// lines of text starting at x = 72, and one thing at the end.
import { Text, View } from "@/components/ui";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Image, type ImageProps } from "expo-image";
import { type ReactNode, useState } from "react";
import { Pressable } from "react-native";

export const GUTTER = 16;
export const LEAD = 44;
/** Where a row's text starts: pass to SettingsGroup's separatorInset. */
export const TEXT_INSET = GUTTER + LEAD + 12;

export function Thumb({ source, size = LEAD }: { source: ImageProps["source"]; size?: number }) {
  return <Image source={source} style={{ width: size, height: size, borderRadius: size * 0.26 }} contentFit="cover" />;
}

/** Leading slot, a strong line over a muted one, and a trailing figure or control. */
export function Row({
  leading,
  title,
  sub,
  figure,
  trailing,
  lines = 1,
  height = 60,
  inset = GUTTER,
  onPress,
}: {
  leading?: ReactNode;
  title: string;
  sub?: string;
  /** A trailing amount, in tabular figures. */
  figure?: string;
  trailing?: ReactNode;
  /** Lines the muted text may run to. */
  lines?: number;
  height?: number;
  /** Side padding: 16 on the page, the card's own inside a card. */
  inset?: number;
  onPress?: () => void;
}) {
  const colors = useThemeColors();
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      disabled={!onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={[title, sub, figure].filter(Boolean).join(", ")}
      style={{
        flexDirection: "row",
        alignItems: "center",
        minHeight: height,
        paddingVertical: 8,
        paddingHorizontal: inset,
        columnGap: 12,
        backgroundColor: pressed && onPress ? colors.border : "transparent",
      }}
    >
      {leading ? <View style={{ width: LEAD, alignItems: "flex-start" }}>{leading}</View> : null}
      <View style={{ flex: 1, rowGap: 1 }}>
        <Text weight="semibold" numberOfLines={1} style={[TYPE.body, TABULAR]}>{title}</Text>
        {sub ? <Text weight="medium" numberOfLines={lines} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{sub}</Text> : null}
      </View>
      {figure ? <Text weight="semibold" style={[TYPE.body, TABULAR]}>{figure}</Text> : null}
      {trailing}
    </Pressable>
  );
}

export interface MoneyLine {
  label: string;
  value: string;
  /** Draw the value in the success colour ("Free"). */
  good?: boolean;
}

/** The sums: a few lines, the total in bold, and the tax inside it. */
export function Money({
  lines,
  total,
  vat,
  paid,
  inset = GUTTER,
}: {
  lines: readonly MoneyLine[];
  total: string;
  /** The tax inside the total: "€87.14". */
  vat: string;
  /** A brand mark and how it was paid, folded into the VAT line: "Visa ending 4242". */
  paid?: { mark: ReactNode; label: string };
  inset?: number;
}) {
  const colors = useThemeColors();
  return (
    <View style={{ paddingHorizontal: inset, rowGap: 6 }}>
      {lines.map((l) => (
        <View key={l.label} style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text weight="medium" style={[TYPE.body, { color: colors.muted }]}>{l.label}</Text>
          <Text weight="medium" style={[TYPE.body, TABULAR, l.good ? { color: colors.success } : null]}>{l.value}</Text>
        </View>
      ))}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 4 }}>
        <Text weight="semibold" style={TYPE.headline}>Total</Text>
        <Text weight="semibold" style={[TYPE.headline, TABULAR]}>{total}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>
        {paid?.mark}
        <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { flex: 1, color: colors.muted }]}>
          {paid ? `${paid.label}, includes ${vat} VAT` : `Includes ${vat} VAT at 23%`}
        </Text>
      </View>
    </View>
  );
}
