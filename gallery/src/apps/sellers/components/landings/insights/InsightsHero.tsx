// Generative chart hero. Two layered area-curves with glowing fills,
// a faint grid, and three floating "competitor" chips. Reads like a
// teaser screenshot of the unbuilt module.

import { Text, View } from "@/apps/sellers/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowUpRight, Star } from "lucide-react-native";

const CURVE_HIGH =
  "M0 95 C 30 80, 50 50, 80 55 S 130 30, 160 38 S 210 14, 240 18 S 290 38, 320 42";
const CURVE_LOW =
  "M0 110 C 30 100, 50 90, 80 88 S 130 78, 160 70 S 210 70, 240 60 S 290 64, 320 58";

// Hand-rolled SVG-like rendering using positioned dots - keeps us off
// react-native-svg (not installed by default for SELLERS landing screens).
// The curve is a discretised polyline of small rounded dots that overlap
// to read as a single stroke at viewing distance. Cheap, expressive,
// no extra dep.
function curvePoints(
  width: number,
  amplitude: number,
  baseline: number,
  phase: number,
  steps = 64,
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = t * width;
    const wave =
      Math.sin(t * Math.PI * 2 + phase) * amplitude * 0.55 +
      Math.sin(t * Math.PI * 4 + phase * 0.5) * amplitude * 0.25;
    const y = baseline - amplitude * (1 - t) * 0.4 + wave;
    pts.push({ x, y });
  }
  return pts;
}

export function InsightsHero() {
  const colors = useThemeColors();

  const W = 343;
  const H = 220;

  const upper = curvePoints(W, 26, 96, 0.6);
  const lower = curvePoints(W, 18, 134, 1.4);

  return (
    <View
      className="overflow-hidden"
      style={{
        height: H,
        marginHorizontal: 16,
        borderRadius: 28,
        borderCurve: "continuous",
        backgroundColor: colors.surface,
      }}
    >
      {/* Mood gradient - navy → blue → teal (no purple) */}
      <LinearGradient
        colors={["#0F172A", "#1D4ED8", "#0F766E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", inset: 0, opacity: 1 }}
      />
      {/* Light wash */}
      <LinearGradient
        colors={["rgba(255,255,255,0.18)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Grid */}
      <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View
            key={`gh-${i}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 32 + i * 32,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.14)",
            }}
          />
        ))}
      </View>

      {/* Glow under upper curve */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 60,
          height: 100,
          opacity: 0.55,
        }}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.28)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        />
      </View>

      {/* Lower curve (your store, faint) */}
      {lower.map((p, i) => (
        <View
          key={`l-${i}`}
          style={{
            position: "absolute",
            left: p.x - 1.5,
            top: p.y - 1.5,
            width: 3,
            height: 3,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.55)",
          }}
        />
      ))}

      {/* Upper curve (the market, bold) */}
      {upper.map((p, i) => (
        <View
          key={`u-${i}`}
          style={{
            position: "absolute",
            left: p.x - 2,
            top: p.y - 2,
            width: 4,
            height: 4,
            borderRadius: 3,
            backgroundColor: "#fff",
          }}
        />
      ))}

      {/* Floating chip - price */}
      <View
        style={{
          position: "absolute",
          top: 28,
          left: 22,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.92)",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Text
          weight="bold"
          style={{ fontSize: 11, color: "#1A1A1A", letterSpacing: -0.2 }}
        >
          €9.50
        </Text>
        <Text
          weight="medium"
          style={{ fontSize: 10, color: "#7A7A7A" }}
        >
          nearby avg
        </Text>
      </View>

      {/* Floating chip - rating */}
      <View
        style={{
          position: "absolute",
          top: 78,
          right: 24,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: "rgba(255,255,255,0.92)",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Star size={11} color="#F5A623" fill="#F5A623" strokeWidth={0} />
        <Text
          weight="bold"
          style={{ fontSize: 11, color: "#1A1A1A", letterSpacing: -0.2 }}
        >
          4.6
        </Text>
        <Text
          weight="medium"
          style={{ fontSize: 10, color: "#7A7A7A" }}
        >
          you · 4.4 area
        </Text>
      </View>

      {/* Floating chip - trend */}
      <View
        style={{
          position: "absolute",
          bottom: 22,
          left: 78,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 999,
          backgroundColor: "rgba(34,197,94,0.95)",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <ArrowUpRight size={11} color="#fff" strokeWidth={2.4} />
        <Text
          weight="bold"
          style={{ fontSize: 11, color: "#fff", letterSpacing: -0.2 }}
        >
          +12%
        </Text>
        <Text
          weight="medium"
          style={{ fontSize: 10, color: "rgba(255,255,255,0.85)" }}
        >
          ramen, this month
        </Text>
      </View>

      {/* Eyebrow corner tag */}
      <View
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 6,
          backgroundColor: "rgba(0,0,0,0.28)",
        }}
      >
        <Text
          weight="bold"
          style={{
            fontSize: 9,
            color: "#fff",
            letterSpacing: 1.4,
          }}
        >
          PREVIEW
        </Text>
      </View>
    </View>
  );
}
