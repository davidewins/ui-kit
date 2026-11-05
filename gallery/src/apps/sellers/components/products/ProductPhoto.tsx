// Product image with graceful fallback.
//
// Flow trace:
//   1. Goal: render a product photo without dead-pixel rectangles when the
//      URL 404s (seed data, expired signed URLs, deleted storage objects).
//   2. State change: expo-image emits onError → component swaps to a muted
//      placeholder with an ImageOff glyph.
//   3. Next: nothing; user keeps scrolling. In __DEV__ the bad URL is logged.

import { Image, type ImageProps, type ImageStyle } from "expo-image";
import { useState } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { ImageOff } from "lucide-react-native";

import { useThemeColors } from "@/hooks/useThemeColors";

type ProductPhotoProps = {
  uri: string | null | undefined;
  style: StyleProp<ViewStyle> | StyleProp<ImageStyle>;
  contentFit?: ImageProps["contentFit"];
  transition?: number;
  testID?: string;
};

export function ProductPhoto({
  uri,
  style,
  contentFit = "cover",
  transition = 150,
  testID,
}: ProductPhotoProps) {
  const [failed, setFailed] = useState(false);
  const colors = useThemeColors();

  if (!uri || failed) {
    return (
      <View
        testID={testID}
        style={[
          style,
          {
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
            borderCurve: "continuous",
          },
        ]}
      >
        <ImageOff size={20} color={colors.muted} strokeWidth={1.6} />
      </View>
    );
  }

  return (
    <Image
      testID={testID}
      source={{ uri }}
      style={style as StyleProp<ImageStyle>}
      contentFit={contentFit}
      transition={transition}
      onError={() => {
        if (__DEV__) console.warn(`[ProductPhoto] failed to load: ${uri}`);
        setFailed(true);
      }}
    />
  );
}
