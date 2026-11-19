// A bottom sheet for short, focused content (a confirm, a quick choice, a
// small form). iOS presents SwiftUI's sheet (sized to its content, drag
// indicator, Liquid Glass background on iOS 26) and hosts your React Native
// children inside it; Android presents Jetpack Compose's Material
// ModalBottomSheet (drag handle, scrim, back press and swipe to dismiss).
// Never react-native's Modal (banned, DESIGN.md §2).
//
// Controlled: `visible` + `onClose`. Render it anywhere in the screen; it takes
// no layout space. `dismissible={false}` is for a sheet that needs an answer
// (the RIDERS offer: David, 19 Nov, "i shouldnt be able to swipe down an
// order modal"): no drag handle, no swipe down, and on Android no back press
// or scrim tap either. Only the sheet's own buttons close it.
import { View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { BottomSheet, Group, Host, RNHostView, Spacer } from "@expo/ui/swift-ui";
import { frame, interactiveDismissDisabled, presentationDragIndicator } from "@expo/ui/swift-ui/modifiers";
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
  /** false: swipe, back and scrim can't close it. Default true. */
  dismissible?: boolean;
}

export function Sheet({ visible, onClose, children, dismissible = true }: SheetProps) {
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
          <Group
            modifiers={[
              presentationDragIndicator(dismissible ? "visible" : "hidden"),
              interactiveDismissDisabled(!dismissible),
            ]}
          >
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
      <ModalBottomSheet
        onDismissRequest={onClose}
        containerColor={colors.background}
        skipPartiallyExpanded
        showDragHandle={dismissible}
        sheetGesturesEnabled={dismissible}
        properties={{ shouldDismissOnBackPress: dismissible, shouldDismissOnClickOutside: dismissible }}
      >
        <ComposeRNHostView matchContents={{ vertical: true }}>
          <View style={{ paddingHorizontal: 24, paddingTop: dismissible ? 8 : 24, paddingBottom: Math.max(insets.bottom, 16) + 8 }}>
            {children}
          </View>
        </ComposeRNHostView>
      </ModalBottomSheet>
    </ComposeHost>
  );
}
