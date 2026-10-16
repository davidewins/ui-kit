// Mount once in the root layout. Toasts drop in at the top, stack up to three
// (tap a stack to fan it out), swipe up to dismiss, and sit above native modals.
import type { ReactNode } from "react";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FullWindowOverlay } from "react-native-screens";
import { Toaster as SonnerToaster } from "sonner-native";

// iOS draws toasts in their own window (so they sit above modals). Gestures in
// that window need a gesture root of their own, or swipe-to-dismiss does nothing;
// elsewhere a full-screen root does the same job wherever the Toaster is mounted.
// box-none lets every touch outside a toast reach the app underneath.
function Overlay({ children }: { children: ReactNode }) {
  if (Platform.OS !== "ios") {
    return (
      <GestureHandlerRootView style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {children}
      </GestureHandlerRootView>
    );
  }
  return (
    <FullWindowOverlay>
      <GestureHandlerRootView style={{ flex: 1 }} pointerEvents="box-none">
        {children}
      </GestureHandlerRootView>
    </FullWindowOverlay>
  );
}

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      swipeToDismissDirection="up"
      enableStacking
      visibleToasts={3}
      gap={8}
      duration={4000}
      autoWiggleOnUpdate="toast-change"
      ToasterOverlayWrapper={Overlay}
    />
  );
}
