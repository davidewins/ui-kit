// ui-kit: copy of davidewins/ui-kit native/files/src/components/analytics/Sparkline.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { View } from "@/components/ui";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { useMemo } from "react";

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
  const path = useMemo(() => {
    if (values.length < 2 || width <= 0) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const stepX = width / (values.length - 1);
    const padY = 3;
    const usable = height - padY * 2;
    const p = Skia.PathBuilder.Make();
    values.forEach((v, i) => {
      const x = i * stepX;
      const y = padY + usable - ((v - min) / span) * usable;
      if (i === 0) p.moveTo(x, y);
      else {
        const prevX = (i - 1) * stepX;
        const cx = (prevX + x) / 2;
        const prevV = values[i - 1];
        const prevY = padY + usable - ((prevV - min) / span) * usable;
        p.cubicTo(cx, prevY, cx, y, x, y);
      }
    });
    return p.build();
  }, [values, width, height]);

  if (!path) return <View style={{ width, height }} />;

  return (
    <Canvas style={{ width, height }}>
      <Path
        path={path}
        style="stroke"
        strokeWidth={1.6}
        strokeJoin="round"
        strokeCap="round"
        color={color}
      />
    </Canvas>
  );
}
