// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/feedback/CountBadge.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { Text } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { FC } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

type Props = {
  count: number;
  /** sm: over a header glyph. md: in a list row, left of the chevron. */
  size?: "sm" | "md";
  style?: StyleProp<ViewStyle>;
};

const DIMS = {
  sm: { height: 15, minWidth: 15, paddingHorizontal: 4, fontSize: 9, cap: 9 },
  md: { height: 20, minWidth: 20, paddingHorizontal: 6, fontSize: 12, cap: 99 },
} as const;

/** The one unread count. Renders nothing at zero. */
export const CountBadge: FC<Props> = ({ count, size = "md", style }) => {
  const colors = useThemeColors();
  if (count <= 0) return null;
  const d = DIMS[size];
  const label = count > d.cap ? `${d.cap}+` : String(count);
  return (
    <View
      accessibilityLabel={`${count} unread`}
      style={[
        {
          height: d.height,
          minWidth: d.minWidth,
          paddingHorizontal: d.paddingHorizontal,
          borderRadius: d.height / 2,
          backgroundColor: colors.error,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text
        weight="medium"
        style={{ fontSize: d.fontSize, lineHeight: d.fontSize + 3, color: "#fff" }}
      >
        {label}
      </Text>
    </View>
  );
};
