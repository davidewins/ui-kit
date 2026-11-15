// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/lists/RowPanel.tsx. Edit it there and sync; local edits fail ui-kit:check.
// The one tappable list row and the panel it sits on, for every app (David,
// 15 Nov: "4 maybe 5, 6 ... different version of the SAME FUCKING COMPONENT").
// Moved from SELLERS' Staff screen, the reference: a pressed row fills edge to
// edge and the fill stops at the panel's rounded corners. Any row inside a
// RowPanel (Row, ExpandRow, SettingsRow) gets that clip, so no screen draws a
// square highlight at a rounded edge again.
//
//   <RowPanel>
//     <Row leading={<Avatar />} title="Aoife" sub="Manager" onPress={...} />
//     <ExpandRow title="How do refunds work?" body="..." />
//   </RowPanel>
//
// A row is a 44pt leading slot (photo, brand mark or icon), a strong line over
// a muted one starting at x = 72, and one thing at the end. A line of text is
// one size and one colour, and is never truncated.
import { Text, View } from "@/components/ui";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SETTINGS_ROW } from "@/components/ui/lists/SettingsRow";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { Pressable, type StyleProp, type ViewStyle } from "react-native";

export const GUTTER = 16;
export const LEAD = 44;
/** Where a row's text starts, from the edge of its panel: where hairlines begin. */
export const TEXT_INSET = GUTTER + LEAD + 12;

/** The inner clip of a RowPanel: a pressed row's fill stops at the panel's
 *  corners, and the panel itself stays unclipped so its shadow shows. */
const CLIP = { marginBottom: 0, borderRadius: 23, borderCurve: "continuous", overflow: "hidden" } as const;

/** A raised panel of rows, with a hairline between them starting at the text.
 *  12 below it, like a SettingsGroup, so the next section header sits the same.
 *  Rows without a leading slot pass inset={GUTTER}. */
export function RowPanel({ children, inset = TEXT_INSET, style }: { children: ReactNode; inset?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <Panel flush style={[{ marginBottom: 12 }, style]}>
      <SettingsGroup separatorInset={inset} style={CLIP}>
        {children}
      </SettingsGroup>
    </Panel>
  );
}

/** Leading slot, a strong line over a muted one, and a trailing figure or control. */
export function Row({
  leading,
  title,
  sub,
  figure,
  figureColor,
  muted = false,
  trailing,
  height,
  inset = GUTTER,
  onPress,
  onLongPress,
  accessibilityState,
}: {
  leading?: ReactNode;
  title: string;
  sub?: string;
  /** A trailing amount, in tabular figures. */
  figure?: string;
  /** A state colour for the figure (stock out = error, low = warning). */
  figureColor?: string;
  /** The thing is off, hidden or over: its title goes muted. */
  muted?: boolean;
  trailing?: ReactNode;
  height?: number;
  /** Side padding: 16 on the page, the card's own inside a card. */
  inset?: number;
  onPress?: () => void;
  onLongPress?: () => void;
  accessibilityState?: { expanded?: boolean; selected?: boolean };
}) {
  const colors = useThemeColors();
  const [pressed, setPressed] = useState(false);
  const tappable = !!(onPress || onLongPress);
  return (
    <Pressable
      disabled={!tappable}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      onLongPress={onLongPress}
      accessibilityRole={tappable ? "button" : undefined}
      accessibilityLabel={[title, sub, figure].filter(Boolean).join(", ")}
      accessibilityState={accessibilityState}
      style={{
        flexDirection: "row",
        alignItems: "center",
        // One line is a 48pt row, two lines 60 (David, 13 Nov: one-line rows were fat).
        minHeight: height ?? (sub ? 60 : 48),
        paddingVertical: 8,
        paddingHorizontal: inset,
        columnGap: 12,
        backgroundColor: pressed && tappable ? colors.border : "transparent",
      }}
    >
      {leading ? <View style={{ width: LEAD, alignItems: "center" }}>{leading}</View> : null}
      <View style={{ flex: 1, rowGap: 1 }}>
        {/* Semibold only when the row carries a second line; one-line rows and
            figures read at medium, like SettingsRow. Never truncated. */}
        <Text weight={sub ? "semibold" : "medium"} style={[TYPE.body, TABULAR, muted ? { color: colors.muted } : null]}>{title}</Text>
        {sub ? <Text weight="medium" style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{sub}</Text> : null}
      </View>
      {figure ? <Text weight="medium" style={[TYPE.body, TABULAR, figureColor ? { color: figureColor } : null]}>{figure}</Text> : null}
      {trailing}
    </Pressable>
  );
}

/** A question that opens its answer in place (Help & Support, FAQs). The
 *  answer appears at once under it, no animation: SwiftUI's DisclosureGroup
 *  opened with a bounce (David, 15 Nov). Put these on a RowPanel with
 *  inset={GUTTER}. */
export function ExpandRow({
  title,
  body,
  open,
  onOpenChange,
  defaultOpen = false,
}: {
  title: string;
  body: string;
  /** Controlled when passed. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}) {
  const colors = useThemeColors();
  const [own, setOwn] = useState(defaultOpen);
  const isOpen = open ?? own;
  const Chevron = isOpen ? ChevronUp : ChevronDown;
  return (
    <View>
      <Row
        title={title}
        accessibilityState={{ expanded: isOpen }}
        onPress={() => {
          if (open === undefined) setOwn(!isOpen);
          onOpenChange?.(!isOpen);
        }}
        trailing={<Chevron size={SETTINGS_ROW.chevronSize} color={colors.muted} strokeWidth={SETTINGS_ROW.chevronStrokeWidth} />}
      />
      {isOpen ? (
        <Text weight="medium" style={[TYPE.body, { color: colors.muted, paddingHorizontal: GUTTER, paddingBottom: 14 }]}>
          {body}
        </Text>
      ) : null}
    </View>
  );
}
