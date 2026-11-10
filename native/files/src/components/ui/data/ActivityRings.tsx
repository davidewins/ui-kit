// Progress toward one to four daily goals as concentric rings, outermost
// first, each in its own colour. A ring sweeps to a new value when the value
// changes. Give each ring a legend beside it: a ring alone says nothing.
// For one reading against a range use Gauge; for a share of a whole use
// DonutChart.
import { type ReactNode, useEffect } from "react";
import { View } from "react-native";
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface Ring {
  /** 0 to 1. Above 1 is drawn as a full ring. */
  value: number;
  color: string;
}

export interface ActivityRingsProps {
  rings: Ring[];
  size?: number;
  thickness?: number;
  /** Space between rings. */
  gap?: number;
  /** Centred inside the rings. */
  children?: ReactNode;
  accessibilityLabel?: string;
}

function RingArc({ ring, size, radius, thickness }: { ring: Ring; size: number; radius: number; thickness: number }) {
  const c = 2 * Math.PI * radius;
  const target = Math.max(0, Math.min(1, ring.value));
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.set(withTiming(target, { duration: 700, easing: Easing.out(Easing.cubic) }));
  }, [progress, target]);
  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: c * (1 - progress.get()) }));
  return (
    <>
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke={ring.color} strokeOpacity={0.2} strokeWidth={thickness} fill="none" />
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={ring.color}
        strokeWidth={thickness}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${c} ${c}`}
        animatedProps={animatedProps}
      />
    </>
  );
}

export function ActivityRings({ rings, size = 132, thickness = 14, gap = 3, children, accessibilityLabel }: ActivityRingsProps) {
  return (
    <View
      style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? rings.map((r) => `${Math.round(r.value * 100)}%`).join(", ")}
    >
      <Svg width={size} height={size} style={{ position: "absolute", transform: [{ rotate: "-90deg" }] }}>
        {rings.map((ring, i) => (
          <RingArc key={i} ring={ring} size={size} thickness={thickness} radius={(size - thickness) / 2 - i * (thickness + gap)} />
        ))}
      </Svg>
      {children}
    </View>
  );
}
