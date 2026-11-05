// ui-kit: copy of davidewins/ui-kit native/files/src/components/Toaster.tsx. Edit it there and sync; local edits fail ui-kit:check.
// Mount once in the root layout, last, so it draws over the screens. Toasts
// drop in at the top, stack up to three (tap a stack to fan it out), swipe up
// to dismiss, pull down to keep one on screen (ToastCard).
import type { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster as SonnerToaster } from "sonner-native";

// Drawn in the app's own window, not a FullWindowOverlay: Liquid Glass samples
// what is behind it in the same window, and in an overlay window there was
// nothing behind it, so the toast read as a flat slab with no glass. The cost:
// a toast fired while a native modal is up shows under that modal.
// box-none lets every touch outside a toast reach the app underneath.
function Overlay({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {children}
    </GestureHandlerRootView>
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
