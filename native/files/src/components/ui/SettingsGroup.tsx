import { View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { SETTINGS_ROW } from "./SettingsRow";

/**
 * One inset-grouped card of SettingsRows, with the hairline separators
 * inserted for you so no screen can get the inset wrong.
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

let look: "inset" | "flat" = "inset";
/**
 * Per-app group look. "inset" (default): the surface card with rounded
 * corners, as VOID, SELLERS and TKVR ship. "flat": no fill, edge to edge, and
 * hairlines that start at the text and run to the right edge, like an iOS
 * plain list (PREPPERS). Call once at startup, before first render.
 */
export function setSettingsGroupLook(value: "inset" | "flat") {
  look = value;
}

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
  const colors = useThemeColors();
  const rows = Children.toArray(children);

  if (rows.length === 0) return null;

  const flat = look === "flat";

  return (
    <View
      style={[
        flat
          ? { marginBottom: SETTINGS_GROUP.marginBottom }
          : {
              backgroundColor: colors.surface,
              borderRadius: SETTINGS_GROUP.radius,
              borderCurve: "continuous",
              overflow: "hidden",
              marginHorizontal: SETTINGS_GROUP.marginHorizontal,
              marginBottom: SETTINGS_GROUP.marginBottom,
            },
        style,
      ]}
    >
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
