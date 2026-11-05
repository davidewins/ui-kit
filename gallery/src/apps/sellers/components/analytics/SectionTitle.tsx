import { Text, View } from "@/apps/sellers/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useGroupSurface } from "@/gallery/groupStyle";

export function SectionTitle({
  text,
  trailing,
}: {
  text: string;
  trailing?: React.ReactNode;
}) {
  const colors = useThemeColors();
  const { titlePadInGutter } = useGroupSurface();
  return (
    <View
      className="flex-row items-center justify-between mb-1.5 mt-1"
      style={{ paddingHorizontal: titlePadInGutter }}
    >
      <Text
        weight="medium"
        accessibilityRole="header"
        style={{ fontSize: 15, lineHeight: 20, color: colors.muted }}
      >
        {text}
      </Text>
      {trailing}
    </View>
  );
}
