// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/lists/SectionTitle.tsx. Edit it there and sync; local edits fail ui-kit:check.
/**
 * SectionTitle - the label above a group of rows. Title Case, 15pt
 * medium, muted: Linear's "In Progress", not an uppercase eyebrow.
 * See DESIGN.md (Eyebrows) before reaching for anything louder.
 *
 * Flush with the content it sits above (David, 6 Nov): rows and cards both
 * start at x=16, so the default inset is 16. Only pass `inset` when the
 * title sits inside an already padded container.
 */
import { useThemeColors } from "@/hooks/useThemeColors";
import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";
import { Text } from "../primitives/Text";
import { View } from "../primitives/View";

export function SectionTitle({
  children,
  inset = 16,
  trailing,
  style,
}: {
  children: string;
  inset?: number;
  /** Right-aligned element on the same line, e.g. an "Add" link. */
  trailing?: ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  const colors = useThemeColors();
  const title = (
    <Text
      weight="medium"
      accessibilityRole="header"
      maxFontSizeMultiplier={1.4}
      style={[
        {
          fontSize: 15,
          lineHeight: 20,
          color: colors.muted,
          paddingHorizontal: trailing ? 0 : inset,
          marginTop: 24,
          marginBottom: 6,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
  if (!trailing) return title;
  return (
    <Row inset={inset}>
      {title}
      {trailing}
    </Row>
  );
}

function Row({ inset, children }: { inset: number; children: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingHorizontal: inset,
      }}
    >
      {children}
    </View>
  );
}
