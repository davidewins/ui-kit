// The toast itself, rendered by sonner-native (see Toaster.tsx), which owns
// position, stacking, swipe-up to dismiss and the enter/exit motion. Pulling
// the toast down holds it (like an iOS notification): it stays until swiped
// up or tapped.
// Layout and icons from the old SELLERS CustomToast; the surface is the kit's
// GlassSurface (interactive Liquid Glass with a solid backing, so it is never
// see-through; BlurView, then card, on older phones); press feedback is the
// kit's PressableScale plus a light haptic.
import { GlassSurface } from "@/components/GlassSurface";
import { PressableScale } from "@/components/PressableScale";
import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react-native";
import { useRef } from "react";
import { Platform } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { toast } from "sonner-native";

const HOLD_PULL = 24;

export type ToastKind = "success" | "error" | "warning" | "info";

const SYMBOLS: Record<ToastKind, SymbolViewProps["name"]> = {
  success: "checkmark.circle.fill",
  error: "xmark.octagon.fill",
  warning: "exclamationmark.triangle.fill",
  info: "info.circle.fill",
};

const LUCIDE = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

export function ToastCard({
  id,
  kind,
  title,
  description,
}: {
  id: string | number;
  kind: ToastKind;
  title: string;
  description?: string;
}) {
  const colors = useThemeColors();
  const tint = colors[kind];
  const LucideIcon = LUCIDE[kind];
  const held = useRef(false);

  // Watches the finger without ever activating, so sonner's own swipe still
  // runs (it rubber-bands a downward pull). Past HOLD_PULL the same toast is
  // re-issued with no timeout.
  const startY = useRef(0);
  const watchPull = Gesture.Pan()
    .manualActivation(true)
    .runOnJS(true)
    .onTouchesDown((e) => {
      startY.current = e.allTouches[0]?.absoluteY ?? 0;
    })
    .onTouchesMove((e) => {
      const y = e.allTouches[0]?.absoluteY ?? 0;
      if (held.current || y - startY.current < HOLD_PULL) return;
      held.current = true;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      toast.custom(<ToastCard id={id} kind={kind} title={title} description={description} />, {
        id,
        duration: Infinity,
      });
    });

  return (
    <GestureDetector gesture={watchPull}>
    <PressableScale
      onPressIn={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }}
      onPress={() => toast.dismiss(id)}
      accessibilityRole="alert"
      accessibilityLabel={[title, description].filter(Boolean).join(". ")}
      accessibilityHint="Tap or swipe up to dismiss"
      style={{ marginHorizontal: 16 }}
    >
      <GlassSurface
        isInteractive
        fill
        // Light backing only: the glass samples the screen behind (Toaster.tsx
        // draws in the app window), the backing just keeps text legible over
        // busy content.
        fillOpacity={0.35}
        style={{
          borderRadius: 24,
          borderCurve: "continuous",
          overflow: "hidden",
          shadowColor: "#000",
          shadowOpacity: 0.14,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            paddingVertical: 12,
            paddingLeft: 12,
            paddingRight: 16,
            minHeight: 52,
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: tint + "26",
            }}
          >
            {Platform.OS === "ios" ? (
              <SymbolView name={SYMBOLS[kind]} size={19} type="hierarchical" tintColor={tint} />
            ) : (
              <LucideIcon size={17} color={tint} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text weight="medium" style={{ fontSize: 15, lineHeight: 20, letterSpacing: -0.2, color: colors.text }}>
              {title}
            </Text>
            {description ? (
              <Text weight="medium" style={{ fontSize: 13, lineHeight: 18, color: colors.muted, marginTop: 1 }}>
                {description}
              </Text>
            ) : null}
          </View>
        </View>
      </GlassSurface>
    </PressableScale>
    </GestureDetector>
  );
}
