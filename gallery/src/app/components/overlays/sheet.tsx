import { Button, Text, View } from "@/components/ui";
import { NativeButton } from "@/components/ui/actions/NativeButton";
import { Sheet } from "@/components/ui/overlays/Sheet";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { useState } from "react";

export default function SheetPage() {
  const colors = useThemeColors();
  const [closing, setClosing] = useState(false);
  const [tip, setTip] = useState(false);
  return (
    <DemoPage usage='import { Sheet } from "@/components/ui/overlays/Sheet". iOS: SwiftUI sheet sized to its content. Android: Compose ModalBottomSheet. Never React Native Modal.'>
      <Demo title="Confirm with consequence">
        <View style={{ flexDirection: "row" }}>
          <NativeButton label="Close for the day" systemImage="xmark.circle" tone="destructive" onPress={() => setClosing(true)} />
        </View>
      </Demo>
      <Demo title="Quick choice">
        <View style={{ flexDirection: "row" }}>
          <NativeButton label="Add a tip" systemImage="eurosign.circle" onPress={() => setTip(true)} />
        </View>
      </Demo>
      <Note>{isIOS ? "Android: Compose ModalBottomSheet with a drag handle and scrim." : "iOS: SwiftUI sheet with Liquid Glass on iOS 26."}</Note>

      <Sheet visible={closing} onClose={() => setClosing(false)}>
        <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4 }}>Close Bao House for the day?</Text>
        <Text weight="medium" style={{ fontSize: 15, color: colors.muted, marginTop: 6, marginBottom: 20 }}>
          New orders stop straight away. The 3 orders in the kitchen still go out.
        </Text>
        <View style={{ gap: 10 }}>
          <Button
            variant="danger"
            fullWidth
            onPress={() => {
              setClosing(false);
              Toast.success("Closed until tomorrow at 11:00");
            }}
          >
            Close store
          </Button>
          <Button variant="secondary" fullWidth onPress={() => setClosing(false)}>
            Keep open
          </Button>
        </View>
      </Sheet>

      <Sheet visible={tip} onClose={() => setTip(false)}>
        <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4 }}>Tip your rider</Text>
        <Text weight="medium" style={{ fontSize: 15, color: colors.muted, marginTop: 6, marginBottom: 20 }}>
          All of it goes to Ciarán, who is bringing order #1044.
        </Text>
        <View style={{ gap: 10 }}>
          <Button
            fullWidth
            onPress={() => {
              setTip(false);
              Toast.success("€2 tip added");
            }}
          >
            Add €2 tip
          </Button>
          <Button variant="secondary" fullWidth onPress={() => setTip(false)}>
            Not now
          </Button>
        </View>
      </Sheet>
    </DemoPage>
  );
}
