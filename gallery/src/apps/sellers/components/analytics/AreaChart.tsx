import { View } from "@/apps/sellers/components/ui";
import {
  Canvas,
  Circle,
  LinearGradient,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import { useMemo, useState } from "react";
import { type LayoutChangeEvent } from "react-native";
import { alpha } from "./utils";

export function AreaChart({
  values,
  height = 140,
  color,
  fillTopOpacity = 0.34,
}: {
  values: number[];
  height?: number;
  color: string;
  fillTopOpacity?: number;
}) {
  const [width, setWidth] = useState(0);

  const points = useMemo(() => {
    if (!width || values.length === 0) return [];
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const stepX = values.length > 1 ? width / (values.length - 1) : 0;
    const padTop = 8;
    const padBottom = 8;
    const usable = height - padTop - padBottom;
    return values.map((v, i) => ({
      x: i * stepX,
      y: padTop + usable - ((v - min) / span) * usable,
    }));
  }, [values, width, height]);

  const peakIdx = useMemo(() => {
    if (values.length === 0) return -1;
    let idx = 0;
    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[idx]) idx = i;
    }
    return idx;
  }, [values]);

  const path = useMemo(() => {
    if (points.length === 0) return null;
    const p = Skia.PathBuilder.Make();
    p.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const cx = (prev.x + cur.x) / 2;
      p.cubicTo(cx, prev.y, cx, cur.y, cur.x, cur.y);
    }
    return p.build();
  }, [points]);

  const fillPath = useMemo(() => {
    if (points.length === 0 || !path) return null;
    const fp = Skia.PathBuilder.MakeFromPath(path);
    fp.lineTo(points[points.length - 1].x, height);
    fp.lineTo(points[0].x, height);
    fp.close();
    return fp.build();
  }, [points, path, height]);

  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  return (
    <View
      onLayout={onLayout}
      style={{ width: "100%", height }}
      className="overflow-hidden"
    >
      {width > 0 && fillPath && path && (
        <Canvas style={{ width, height }}>
          <Path path={fillPath}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, height)}
              colors={[color + alpha(fillTopOpacity), color + "00"]}
            />
          </Path>
          <Path
            path={path}
            style="stroke"
            strokeWidth={2.5}
            strokeJoin="round"
            strokeCap="round"
            color={color}
          />
          {peakIdx >= 0 && points[peakIdx] && (
            <>
              <Circle
                cx={points[peakIdx].x}
                cy={points[peakIdx].y}
                r={5.5}
                color={color + "55"}
              />
              <Circle
                cx={points[peakIdx].x}
                cy={points[peakIdx].y}
                r={3}
                color={color}
              />
            </>
          )}
        </Canvas>
      )}
    </View>
  );
}
