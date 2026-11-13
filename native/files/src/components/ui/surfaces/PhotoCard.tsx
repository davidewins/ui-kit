// A photo that carries its own caption: the image fills the card, a scrim
// darkens its foot and a glass panel floats there with a title, one line and
// an optional figure (a price, a count). For a hero at the top of a page or a
// row of things to open. Not for a thumbnail in a list row and not for text
// that needs more than two lines.
import { GlassSurface } from "@/components/GlassSurface";
import { PressableScale } from "@/components/PressableScale";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Image, type ImageProps } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";
import { View } from "../primitives/View";

export function PhotoCard({
  source,
  title,
  subtitle,
  figure,
  badge,
  width,
  height,
  compact = false,
  contentPosition,
  onPress,
}: {
  source: ImageProps["source"];
  title: string;
  subtitle?: string;
  /** Trailing value on the caption, in tabular figures: "€135". */
  figure?: string;
  /** Pinned top-left over the photo, e.g. a kit Badge. */
  badge?: ReactNode;
  /** Omit to fill the parent's width. */
  width?: number;
  height: number;
  /** Smaller caption for cards in a row: the figure moves under the title. */
  compact?: boolean;
  /** Which part of the photo to keep when it is cropped. */
  contentPosition?: ImageProps["contentPosition"];
  onPress?: () => void;
}) {
  const colors = useThemeColors();
  const radius = compact ? 20 : 28;
  const inset = compact ? 6 : 10;
  const card = (
    <View style={{ width, height, borderRadius: radius, borderCurve: "continuous", overflow: "hidden", backgroundColor: colors.surface }}>
      <Image source={source} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" contentPosition={contentPosition} transition={150} />
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.32)"]}
        style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "45%" }}
      />
      {badge ? <View style={{ position: "absolute", top: inset + 4, left: inset + 4 }}>{badge}</View> : null}
      <View style={{ position: "absolute", left: inset, right: inset, bottom: inset }}>
        <GlassSurface
          fill
          fillOpacity={0.25}
          style={{ borderRadius: radius - inset, borderCurve: "continuous", overflow: "hidden", paddingHorizontal: compact ? 10 : 14, paddingVertical: compact ? 8 : 12 }}
        >
          {compact ? (
            <View style={{ rowGap: 1 }}>
              <Text weight="semibold" numberOfLines={1} style={TYPE.sub}>{title}</Text>
              <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>
                {[figure, subtitle].filter(Boolean).join(", ")}
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
              <View style={{ flex: 1, rowGap: 1 }}>
                {/* Never cut: the title is usually the seller's own product name. */}
                <Text weight="semibold" style={TYPE.headline}>{title}</Text>
                {subtitle ? <Text weight="medium" numberOfLines={1} style={[TYPE.sub, { color: colors.muted }]}>{subtitle}</Text> : null}
              </View>
              {figure ? <Text weight="semibold" style={[TYPE.headline, TABULAR]}>{figure}</Text> : null}
            </View>
          )}
        </GlassSurface>
      </View>
    </View>
  );
  const label = [title, subtitle, figure].filter(Boolean).join(", ");
  if (!onPress) {
    return <View accessible accessibilityRole="image" accessibilityLabel={label}>{card}</View>;
  }
  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
    >
      {card}
    </PressableScale>
  );
}
