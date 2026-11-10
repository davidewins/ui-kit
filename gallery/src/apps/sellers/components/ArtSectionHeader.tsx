// A page section header with a Thiings icon (David, 9 Nov: "use thiings icons
// in eyebrows"). Title in the text colour at 16pt, the row's own inset, with
// an optional muted trailing note (a period, a count). Used by Today and
// Account so both pages read as sections, not one long list.
import { Image, Text, View } from "@/components/ui";

export function ArtSectionHeader({
  title,
  art,
  trailing,
}: {
  title: string;
  // A require()d image (the gallery's Image takes expo-image sources).
  art: number;
  trailing?: string;
}) {
  return (
    <View
      className="flex-row items-center"
      style={{ paddingHorizontal: 16, marginTop: 28, marginBottom: 10, gap: 10 }}
      accessibilityRole="header"
    >
      <Image source={art} style={{ width: 28, height: 28 }} contentFit="contain" />
      <Text weight="semibold" className="flex-1" style={{ fontSize: 17, letterSpacing: -0.2 }}>
        {title}
      </Text>
      {trailing ? (
        <Text className="text-muted" style={{ fontSize: 13 }}>
          {trailing}
        </Text>
      ) : null}
    </View>
  );
}
