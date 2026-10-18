// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/Sheet.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A bottom sheet for short, focused content (a confirm, a quick choice, a
// small form). iOS presents SwiftUI's sheet (sized to its content, drag
// indicator, Liquid Glass background on iOS 26) and hosts your React Native
// children inside it; elsewhere a slide-up Modal card over a dimmed backdrop.
//
// Controlled: `visible` + `onClose`. Render it anywhere in the screen; it takes
// no layout space.
import { Pressable, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { BottomSheet, Group, Host, RNHostView, Spacer } from "@expo/ui/swift-ui";
import { frame, presentationDragIndicator } from "@expo/ui/swift-ui/modifiers";
import type { ReactNode } from "react";
import { Modal, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Sheet({ visible, onClose, children }: SheetProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  if (Platform.OS === "ios") {
    return (
      <Host style={{ position: "absolute", width: 1, height: 1 }}>
        <BottomSheet
          isPresented={visible}
          onIsPresentedChange={(presented) => {
            if (!presented) onClose();
          }}
          fitToContents
          // SwiftUI only presents a sheet attached to a real view; this 1pt
          // spacer is that view.
          anchor={<Spacer modifiers={[frame({ width: 1, height: 1 })]} />}
        >
          <Group modifiers={[presentationDragIndicator("visible")]}>
            <RNHostView matchContents={{ vertical: true }}>
              <View style={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: 16 }}>{children}</View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(0,0,0,0.35)" }}
        />
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
          }}
        >
          <View style={{ alignSelf: "center", width: 36, height: 5, borderRadius: 3, backgroundColor: colors.border, marginBottom: 16 }} />
          {children}
        </View>
      </View>
    </Modal>
  );
}
