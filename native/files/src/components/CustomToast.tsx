import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react-native";
import { useEffect } from "react";
import { Platform, Pressable } from "react-native";
import Animated, { Easing, FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastConfigParams } from "toastify-react-native/utils/interfaces";

type ToastVariant = "success" | "error" | "warning" | "info";

const VARIANT_SYMBOLS: Record<ToastVariant, SymbolViewProps["name"]> = {
  success: "checkmark.circle.fill",
  error: "xmark.octagon.fill",
  warning: "exclamationmark.triangle.fill",
  info: "info.circle.fill",
};

const VARIANT_LUCIDE = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

const HAPTIC: Record<ToastVariant, () => Promise<void>> = {
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  info: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
};

// A soft 110ms chime. expo-audio mixes with other audio and respects the mute
// switch by default. Builds without the native module just skip the sound.
type Player = { volume: number; seekTo: (s: number) => unknown; play: () => void };
let player: Player | null | undefined;
function playChime() {
  try {
    if (player === undefined) {
      const { createAudioPlayer } = require("expo-audio");
      player = createAudioPlayer(require("@/assets/sounds/toast.wav")) as Player;
      player.volume = 0.5;
    }
    player?.seekTo(0);
    player?.play();
  } catch {
    player = null;
  }
}

const CustomToast = ({
  text1,
  text2,
  hide,
  variant,
}: ToastConfigParams & { variant: ToastVariant }) => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const tint = colors[variant];
  const liquidGlass = Platform.OS === "ios" && isLiquidGlassAvailable();
  const LucideIcon = VARIANT_LUCIDE[variant];

  // Every new message: one haptic for its kind, plus the chime.
  useEffect(() => {
    HAPTIC[variant]().catch(() => {});
    playChime();
  }, [variant, text1, text2]);

  const inner = (
    <>
      <View
        className="items-center justify-center"
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          marginRight: 10,
          backgroundColor: tint + "26",
        }}
      >
        {Platform.OS === "ios" ? (
          <SymbolView
            name={VARIANT_SYMBOLS[variant]}
            size={18}
            type="hierarchical"
            tintColor={tint}
          />
        ) : (
          <LucideIcon size={16} color={tint} />
        )}
      </View>
      <View style={{ flex: 1, flexShrink: 1, paddingRight: 4 }}>
        <Text
          weight="semibold"
          className="text-foreground text-[14px] leading-[18px]"
          numberOfLines={3}
        >
          {text1}
        </Text>
        {text2 ? (
          <Text
            className="text-muted-foreground text-[12px] leading-[16px] mt-0.5"
            numberOfLines={4}
          >
            {text2}
          </Text>
        ) : null}
      </View>
    </>
  );

  const pillStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 10,
    paddingHorizontal: 14,
    // A pill on one line (48pt tall), a rounded card when the text wraps.
    borderRadius: 24,
    borderCurve: "continuous" as const,
    width: "100%" as const,
    overflow: "hidden" as const,
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(260).easing(Easing.out(Easing.cubic))}
      exiting={FadeOutUp.duration(200)}
      style={{ width: "92%", marginTop: insets.top + 6 }}
    >
    <Pressable onPress={hide} hitSlop={6}>
      {liquidGlass ? (
        <GlassView glassEffectStyle="regular" style={pillStyle}>
          {inner}
        </GlassView>
      ) : (
        <View
          style={{
            ...pillStyle,
            backgroundColor: colors.card,
            shadowColor: colors.foreground,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.18,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          {inner}
        </View>
      )}
    </Pressable>
    </Animated.View>
  );
};

export const toastConfig = {
  success: (props: ToastConfigParams) => (
    <CustomToast {...props} variant="success" />
  ),
  error: (props: ToastConfigParams) => (
    <CustomToast {...props} variant="error" />
  ),
  warn: (props: ToastConfigParams) => (
    <CustomToast {...props} variant="warning" />
  ),
  info: (props: ToastConfigParams) => <CustomToast {...props} variant="info" />,
  default: (props: ToastConfigParams) => (
    <CustomToast {...props} variant="info" />
  ),
};
