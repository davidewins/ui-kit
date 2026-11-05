// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/overlays/Sheet.tsx. Edit it there and sync; local edits fail ui-kit:check.
// A bottom sheet for short, focused content (a confirm, a quick choice, a
// small form). iOS presents SwiftUI's sheet (sized to its content, drag
// indicator, Liquid Glass background on iOS 26) and hosts your React Native
// children inside it; Android presents Jetpack Compose's Material
// ModalBottomSheet (drag handle, scrim, back press and swipe to dismiss).
// Never react-native's Modal (banned, DESIGN.md §2).
//
// Controlled: `visible` + `onClose`. Render it anywhere in the screen; it takes
// no layout space.
import { View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { BottomSheet, Group, Host, RNHostView, Spacer } from "@expo/ui/swift-ui";
import { frame, presentationDragIndicator } from "@expo/ui/swift-ui/modifiers";
import {
  Host as ComposeHost,
  ModalBottomSheet,
  RNHostView as ComposeRNHostView,
} from "@expo/ui/jetpack-compose";
import type { ReactNode } from "react";
import { Platform } from "react-native";
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

  // The Compose sheet opens when it mounts and animates out on dismiss, so it
  // only exists while visible.
  if (!visible) return null;

  return (
    <ComposeHost style={{ position: "absolute", width: 1, height: 1 }}>
      <ModalBottomSheet onDismissRequest={onClose} containerColor={colors.background} skipPartiallyExpanded>
        <ComposeRNHostView matchContents={{ vertical: true }}>
          <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 16) + 8 }}>
            {children}
          </View>
        </ComposeRNHostView>
      </ModalBottomSheet>
    </ComposeHost>
  );
}
