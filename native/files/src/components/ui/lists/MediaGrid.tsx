// A grid of square photos, three across with hairline gaps, the way a
// profile shows what was posted. Each tile can carry one small figure in the
// bottom corner (views, a time) and glyphs in the top corners for what kind
// of thing it is (video, several photos, pinned). Fills the width it is
// given; put it edge to edge. Not for products with titles and prices: that
// is a two-up grid of photo tiles with captions.
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Image, type ImageProps } from "expo-image";
import { Clock, Eye, Heart, Layers, PencilLine, Pin, Play } from "lucide-react-native";
import { useId, useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";

const GLYPH = { play: Play, eye: Eye, heart: Heart, clock: Clock, pencil: PencilLine } as const;

export interface MediaGridItem {
  key: string;
  source: ImageProps["source"];
  /** What a screen reader says for the tile. */
  label: string;
  /** The one figure over the bottom left corner: "4.2k", "Today 18:00". */
  stat?: string;
  /** Glyph before the figure. */
  statGlyph?: keyof typeof GLYPH;
  /** Top right: a video, or more than one photo. */
  kind?: "video" | "carousel";
  /** Top left pin. */
  pinned?: boolean;
}

export interface MediaGridProps {
  items: readonly MediaGridItem[];
  columns?: number;
  /** Space between tiles. */
  gap?: number;
  onPress?: (item: MediaGridItem, index: number) => void;
}

// Over a photo, so white in both themes.
const ON_PHOTO = "#fff";

export function MediaGrid({ items, columns = 3, gap = 2, onPress }: MediaGridProps) {
  const colors = useThemeColors();
  const [width, setWidth] = useState(0);
  const scrim = useId().replace(/:/g, "");
  const tile = width > 0 ? (width - gap * (columns - 1)) / columns : 0;
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ flexDirection: "row", flexWrap: "wrap", gap }}>
      {tile > 0
        ? items.map((item, index) => {
            const Glyph = item.statGlyph ? GLYPH[item.statGlyph] : null;
            return (
              <Pressable
                key={item.key}
                disabled={!onPress}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  onPress?.(item, index);
                }}
                accessibilityRole={onPress ? "button" : "image"}
                accessibilityLabel={[item.label, item.stat].filter(Boolean).join(", ")}
                style={{ width: tile, height: tile, backgroundColor: colors.surface }}
              >
                {({ pressed }) => (
                  <>
                    <Image source={item.source} style={{ width: tile, height: tile }} contentFit="cover" transition={120} />
                    {/* Darkens only the edges that carry something, so white
                        glyphs read on a white product shot. */}
                    {item.stat || item.kind || item.pinned ? (
                      <Svg width={tile} height={tile} style={{ position: "absolute", left: 0, top: 0 }}>
                        <Defs>
                          <LinearGradient id={`${scrim}${index}`} x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#000" stopOpacity={item.kind || item.pinned ? 0.38 : 0} />
                            <Stop offset="0.3" stopColor="#000" stopOpacity={0} />
                            <Stop offset="0.6" stopColor="#000" stopOpacity={0} />
                            <Stop offset="1" stopColor="#000" stopOpacity={item.stat ? 0.55 : 0} />
                          </LinearGradient>
                        </Defs>
                        <Rect width={tile} height={tile} fill={`url(#${scrim}${index})`} />
                      </Svg>
                    ) : null}
                    {item.pinned ? (
                      <View style={{ position: "absolute", top: 7, left: 7 }}>
                        <Pin size={15} color={ON_PHOTO} fill={ON_PHOTO} strokeWidth={2} />
                      </View>
                    ) : null}
                    {item.kind ? (
                      <View style={{ position: "absolute", top: 7, right: 7 }}>
                        {item.kind === "video" ? (
                          <Play size={15} color={ON_PHOTO} fill={ON_PHOTO} strokeWidth={2} />
                        ) : (
                          <Layers size={16} color={ON_PHOTO} strokeWidth={2.2} />
                        )}
                      </View>
                    ) : null}
                    {item.stat ? (
                      <View style={{ position: "absolute", left: 7, right: 7, bottom: 6, flexDirection: "row", alignItems: "center", columnGap: 4 }}>
                        {Glyph ? <Glyph size={12} color={ON_PHOTO} strokeWidth={2.4} /> : null}
                        <Text weight="semibold" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: ON_PHOTO, flexShrink: 1 }]}>
                          {item.stat}
                        </Text>
                      </View>
                    ) : null}
                    {pressed ? <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(255,255,255,0.22)" }} /> : null}
                  </>
                )}
              </Pressable>
            );
          })
        : null}
    </View>
  );
}
