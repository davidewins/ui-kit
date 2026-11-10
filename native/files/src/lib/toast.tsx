// Toasts for every app: `Toast.success("Saved")`, same calls as the
// toastify-react-native API it replaces. Each toast fires one haptic for its
// kind, then hands a ToastCard to sonner-native. Results (success, error,
// warning) also play a short sound; info toasts are silent, so a tap that
// only tells you something never makes a noise (David, 10 Nov).
import { ToastCard, type ToastKind } from "@/components/ToastCard";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";

const HAPTIC: Record<ToastKind, () => Promise<void>> = {
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  info: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
};

const SOUND: Partial<Record<ToastKind, number>> = {
  success: require("@/assets/sounds/toast-success.wav"),
  error: require("@/assets/sounds/toast-error.wav"),
  warning: require("@/assets/sounds/toast-info.wav"),
};

// expo-audio mixes with other audio and respects the mute switch by default.
// Builds without its native module skip the sound and keep the haptic.
type Player = { volume: number; seekTo: (s: number) => unknown; play: () => void };
const players: Partial<Record<ToastKind, Player | null>> = {};
function playSound(kind: ToastKind) {
  if (!SOUND[kind]) return;
  try {
    if (players[kind] === undefined) {
      const { createAudioPlayer } = require("expo-audio");
      const p = createAudioPlayer(SOUND[kind]) as Player;
      p.volume = 0.6;
      players[kind] = p;
    }
    const p = players[kind];
    p?.seekTo(0);
    p?.play();
  } catch {
    players[kind] = null;
  }
}

function show(kind: ToastKind, title: string, description?: string): void {
  HAPTIC[kind]().catch(() => {});
  playSound(kind);
  const id = `${Date.now()}-${Math.random()}`;
  toast.custom(<ToastCard id={id} kind={kind} title={title} description={description} />, { id });
}

type ShowParams = { type?: "success" | "error" | "warn" | "info"; text1?: string; text2?: string };

export const Toast = {
  // The second argument (toastify's position) is ignored: toasts sit at the top.
  success: (message: string, _position?: string) => show("success", message),
  error: (message: string, _position?: string) => show("error", message),
  warn: (message: string, _position?: string) => show("warning", message),
  info: (message: string, _position?: string) => show("info", message),
  show: ({ type = "info", text1 = "", text2 }: ShowParams) =>
    show(type === "warn" ? "warning" : type, text1, text2),
  hide: () => toast.dismiss(),
};
