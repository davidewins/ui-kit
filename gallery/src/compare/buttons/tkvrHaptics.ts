// Verbatim copy of TKVR src/lib/haptics.ts.
import * as Haptics from "expo-haptics";

// One place to tune how the whole app feels. Press feedback lives in the shared
// primitives (PressScale, Button), so screens should not fire their own on a
// plain tap — that double-buzzes. Call these directly only for outcomes a press
// cannot express: a save landing, a validation failing, a long-press arming.
export type HapticFeel =
  | "selection"
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error";

// Fire-and-forget. Haptics are decoration: a failure here must never surface to
// the user or reject into an unhandled promise.
export function haptic(feel: HapticFeel = "selection"): void {
  const run = () => {
    switch (feel) {
      case "selection":
        return Haptics.selectionAsync();
      case "light":
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      case "medium":
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      case "heavy":
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      case "success":
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      case "warning":
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      case "error":
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };
  try {
    run()?.catch(() => {});
  } catch {
    // device without a taptic engine, or the module failing — ignore
  }
}
