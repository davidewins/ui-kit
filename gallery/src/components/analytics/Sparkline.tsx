// ui-kit: copy of davidewins/ui-kit native/files/src/components/analytics/Sparkline.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { View } from "@/components/ui";
import { useMemo } from "react";
import Svg, { Path } from "react-native-svg";

// The same smoothed line as before, drawn with react-native-svg instead of
// Skia: Skia 2.14 crashed Android builds on Expo SDK 58 (TAK-1493), and this
// was its only use in the apps.
export function Sparkline({
  values,
  width,
  height = 28,
  color,
}: {
  values: number[];
  width: number;
  height?: number;
  color: string;
}) {
  const d = useMemo(() => {
    if (values.length < 2 || width <= 0) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const stepX = width / (values.length - 1);
    const padY = 3;
    const usable = height - padY * 2;
    const yOf = (v: number) => padY + usable - ((v - min) / span) * usable;
    return values
      .map((v, i) => {
        const x = i * stepX;
        const y = yOf(v);
        if (i === 0) return `M${x} ${y}`;
        const prevX = (i - 1) * stepX;
        const cx = (prevX + x) / 2;
        const prevY = yOf(values[i - 1]);
        return `C${cx} ${prevY} ${cx} ${y} ${x} ${y}`;
      })
      .join(" ");
  }, [values, width, height]);

  if (!d) return <View style={{ width, height }} />;

  return (
    <Svg width={width} height={height}>
      <Path d={d} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}
