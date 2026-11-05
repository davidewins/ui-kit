import { Text, View } from "@/apps/sellers/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { useMemo } from "react";

export type DonutSlice = { value: number; color: string; label?: string };

export function buildArcPath(
  size: number,
  radius: number,
  startAngle: number,
  sweep: number,
) {
  const p = Skia.PathBuilder.Make();
  const x = (size - radius * 2) / 2;
  const y = (size - radius * 2) / 2;
  const w = radius * 2;
  p.addArc({ x, y, width: w, height: w }, startAngle, Math.max(0.0001, sweep));
  return p.build();
}

export function Donut({
  slices,
  size = 140,
  strokeWidth = 18,
  startAngle = -90,
  trackColor,
  centerLabel,
  centerSublabel,
  centerColor,
}: {
  slices: DonutSlice[];
  size?: number;
  strokeWidth?: number;
  startAngle?: number;
  trackColor?: string;
  centerLabel?: string;
  centerSublabel?: string;
  centerColor?: string;
}) {
  const colors = useThemeColors();
  const radius = (size - strokeWidth) / 2;
  const total = slices.reduce((s, d) => s + d.value, 0) || 1;

  const segments = useMemo(() => {
    let cursor = startAngle;
    return slices.map((s) => {
      const sweep = (s.value / total) * 360;
      const seg = {
        path: buildArcPath(size, radius, cursor, sweep),
        color: s.color,
      };
      cursor += sweep;
      return seg;
    });
  }, [slices, total, startAngle, size, radius]);

  const trackPath = useMemo(() => {
    const p = Skia.PathBuilder.Make();
    p.addCircle(size / 2, size / 2, radius);
    return p.build();
  }, [size, radius]);

  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={{ width: size, height: size }}>
        <Path
          path={trackPath}
          style="stroke"
          strokeWidth={strokeWidth}
          color={trackColor ?? colors.border}
        />
        {segments.map((s, i) => (
          <Path
            key={i}
            path={s.path}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="butt"
            color={s.color}
          />
        ))}
      </Canvas>
      {(centerLabel || centerSublabel) && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {centerLabel && (
            <Text
              weight="bold"
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              style={{
                color: centerColor ?? colors.text,
                fontSize: size * 0.18,
                letterSpacing: -0.6,
                maxWidth: size - strokeWidth * 2 - 8,
                textAlign: "center",
                fontVariant: ["tabular-nums"],
              }}
            >
              {centerLabel}
            </Text>
          )}
          {centerSublabel && (
            <Text
              style={{
                color: colors.muted,
                fontSize: size * 0.075,
                marginTop: 2,
                letterSpacing: 0.3,
              }}
              weight="medium"
            >
              {centerSublabel}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
