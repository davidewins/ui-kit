// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/lists/SettingsGroup.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { SETTINGS_ROW } from "./SettingsRow";

/**
 * One group of SettingsRows, with the hairline separators inserted for you so
 * no screen can get the inset wrong. ZESTY has one look (David, 4 Nov): the
 * group sits flat on the page, no fill and no card, rows edge to edge, the
 * hairline starting at the label. Grey fills belong to small controls only.
 *
 * Children that render null (a permission-gated or module-gated row) are
 * dropped by Children.toArray, so a hidden row never leaves a stray separator
 * or a double hairline behind it.
 *
 * Groups carry no heading. Six unlabelled groups separated by a gap is the
 * iOS Settings pattern and is what VOID's profile already ships.
 */
export const SETTINGS_GROUP = {
  radius: 24,
  marginHorizontal: 16,
  marginBottom: 18,
} as const;

export function SettingsGroup({
  children,
  style,
  separatorInset = SETTINGS_ROW.separatorInset,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Where hairlines start; rows without an icon pass their text's x (16). */
  separatorInset?: number;
}) {
  const rows = Children.toArray(children);

  if (rows.length === 0) return null;

  return (
    <View style={[{ marginBottom: SETTINGS_GROUP.marginBottom }, style]}>
      {rows.map((row, index) => (
        <Fragment
          key={isValidElement(row) && row.key != null ? row.key : index}
        >
          {index > 0 ? <SettingsSeparator inset={separatorInset} /> : null}
          {row}
        </Fragment>
      ))}
    </View>
  );
}

/**
 * The hairline. Inset to the label's x by default; pass a smaller inset when
 * separating unlike blocks rather than two rows (e.g. a stats footer).
 */
export function SettingsSeparator({ inset = 0 }: { inset?: number }) {
  const colors = useThemeColors();
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.border,
        marginLeft: inset,
      }}
    />
  );
}
