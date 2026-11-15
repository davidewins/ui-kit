// A small filled circle that copies a value: an order number, a tracking
// number, a referral code, a code snippet (top right of the block). The glyph
// cross-fades and scales to a tick for a moment and a haptic fires, so no
// toast is needed. Sits at the end of the row that shows the
// value. Not for sharing a link (ShareLink).
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Check, Copy } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Platform, Pressable, Share } from "react-native";
import Animated, { FadeOut, ZoomIn } from "react-native-reanimated";

export function CopyButton({
  value,
  label,
  size = 30,
  onCopied,
}: {
  /** The exact text put on the clipboard. */
  value: string;
  /** What it is, for VoiceOver: "order number" reads as "Copy order number". */
  label: string;
  /** Diameter of the circle. The tap target is padded out to 44. */
  size?: number;
  onCopied?: () => void;
}) {
  const colors = useThemeColors();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      // expo-clipboard is native: a build made before it was added has no
      // module, so fall back to the share sheet (Copy is its first action).
      const Clipboard = require("expo-clipboard") as typeof import("expo-clipboard");
      await Clipboard.setStringAsync(value);
    } catch {
      Share.share(Platform.OS === "ios" ? { message: value } : { message: value, title: label }).catch(() => {});
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setCopied(true);
    onCopied?.();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  const Glyph = copied ? Check : Copy;
  const slop = Math.max(0, (44 - size) / 2);
  return (
    <Pressable
      onPress={copy}
      hitSlop={slop}
      accessibilityRole="button"
      accessibilityLabel={copied ? `Copied ${label}` : `Copy ${label}`}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        // The one grey that reads on the page and on a raised card, light and dark.
        backgroundColor: colors.secondaryBackground,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      {/* Keyed so each swap runs the enter on the new glyph and the exit on
          the old one, stacked in the same spot. Eased, not sprung. */}
      <Animated.View
        key={copied ? "copied" : "copy"}
        entering={ZoomIn.duration(180)}
        exiting={FadeOut.duration(120)}
        style={{ position: "absolute" }}
      >
        <Glyph size={Math.round(size * 0.48)} color={copied ? colors.success : colors.text} strokeWidth={copied ? 2.6 : 2} />
      </Animated.View>
    </Pressable>
  );
}
