// ui-kit: copy of davidewins/ui-kit native/files/src/components/GlassSurface.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { useThemeColors } from "@/hooks/useThemeColors";
import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { FC, ReactNode } from "react";
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  isInteractive?: boolean;
  /**
   * Guarantees legibility. Native Liquid Glass samples whatever is behind it,
   * and over busy, fast-scrolling content (e.g. the home feed's food photos)
   * it frequently under-samples and renders near-transparent. Set this on any
   * glass surface that floats over such content - a themed semi-opaque backing
   * is drawn behind the children so text stays readable regardless of sampling,
   * while the glass still provides the frosted edge. The surface `style` must
   * clip (borderRadius + overflow:"hidden") so the backing takes its shape.
   */
  fill?: boolean;
  /**
   * Opacity of the `fill` backing (default 0.72). Surfaces that float over busy
   * content (home bars) need it high; surfaces over a dimmed backdrop (sheets)
   * want it low (~0.3) so the blur/glass actually reads as frost, not a slab.
   */
  fillOpacity?: number;
  /** Override the default `colors.card` fill backing. */
  fillColor?: string;
  /** BlurView intensity for the non-Liquid-Glass fallback (default 28). */
  blurIntensity?: number;
};

/**
 * Liquid Glass on supported iOS builds; blur/card fallback elsewhere.
 */
export const GlassSurface: FC<Props> = ({
  children,
  style,
  isInteractive,
  fill,
  fillOpacity = 0.72,
  fillColor,
  blurIntensity = 28,
}) => {
  const colors = useThemeColors();

  const fillLayer = fill ? (
    <View
      pointerEvents="none"
      style={[
        styles.fillLayer,
        { backgroundColor: fillColor ?? colors.card, opacity: fillOpacity },
      ]}
    />
  ) : null;

  if (Platform.OS === "ios" && isLiquidGlassAvailable()) {
    return (
      <GlassView
        isInteractive={isInteractive}
        glassEffectStyle="regular"
        style={style}
      >
        {fillLayer}
        {children}
      </GlassView>
    );
  }

  if (Platform.OS === "ios") {
    return (
      <BlurView intensity={blurIntensity} tint="systemMaterial" style={style}>
        {fillLayer}
        {children}
      </BlurView>
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { backgroundColor: fillColor ?? colors.card, borderColor: colors.border },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  fallback: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  // Semi-opaque backing; opacity is caller-controlled via `fillOpacity`.
  fillLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
