import { Text, View } from "@/components/ui";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ComposeHost } from "@/components/ui/NativeHost";
import { NativeButton } from "@/components/ui/NativeButton";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { BasicAlertDialog, Button as MButton, Column, Text as MText } from "@expo/ui/jetpack-compose";
import { paddingAll } from "@expo/ui/jetpack-compose/modifiers";
import { useState } from "react";

type Open = "cancel" | "refund" | "accept" | "basic" | null;

export default function ConfirmDialogPage() {
  const [open, setOpen] = useState<Open>(null);
  const close = () => setOpen(null);
  return (
    <DemoPage usage='import { ConfirmDialog } from "@/components/ui/ConfirmDialog". iOS: SwiftUI Alert / ConfirmationDialog. Android: Compose AlertDialog. Name the consequence, never "Are you sure?".'>
      <Demo title="Alert, destructive">
        <Row>
          <NativeButton label="Cancel order" tone="destructive" onPress={() => setOpen("cancel")} />
        </Row>
      </Demo>
      <Demo title="Action sheet (iOS), dialog (Android)">
        <Row>
          <NativeButton label="Refund €24.50" onPress={() => setOpen("refund")} />
        </Row>
      </Demo>
      <Demo title="Alert, not destructive">
        <Row>
          <NativeButton label="Accept order" tone="primary" onPress={() => setOpen("accept")} />
        </Row>
      </Demo>
      {isIOS ? null : (
        <Demo title="BasicAlertDialog (custom content)">
          <Row>
            <NativeButton label="Rider arrived" onPress={() => setOpen("basic")} />
          </Row>
        </Demo>
      )}
      <Note>{isIOS ? "Android: Compose AlertDialog for both variants; BasicAlertDialog for custom content." : "iOS: SwiftUI Alert, and ConfirmationDialog for the sheet variant."}</Note>

      <ConfirmDialog
        visible={open === "cancel"}
        onClose={close}
        title="Cancel order #1042?"
        message="Aoife gets a full refund of €24.50 and a message that the kitchen cancelled. This can't be undone."
        confirmLabel="Cancel order"
        destructive
        cancelLabel="Keep order"
        onConfirm={() => Toast.success("Order #1042 cancelled and refunded")}
      />
      <ConfirmDialog
        visible={open === "refund"}
        onClose={close}
        variant="sheet"
        title="Refund €24.50 to Aoife Byrne?"
        message="It reaches her card in 5 to 10 days."
        confirmLabel="Refund €24.50"
        destructive
        onConfirm={() => Toast.success("Refund sent")}
      />
      <ConfirmDialog
        visible={open === "accept"}
        onClose={close}
        title="Accept order #1043?"
        message="Cian is told it will be ready in 15 minutes."
        confirmLabel="Accept"
        onConfirm={() => Toast.success("Order accepted")}
      />
      {!isIOS && open === "basic" ? <BasicDialog onClose={close} /> : null}
    </DemoPage>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: "row" }}>{children}</View>;
}

function BasicDialog({ onClose }: { onClose: () => void }) {
  const colors = useThemeColors();
  return (
    <ComposeHost style={{ position: "absolute", width: 1, height: 1 }}>
      <BasicAlertDialog onDismissRequest={onClose}>
        <Column verticalArrangement={{ spacedBy: 12 }} modifiers={[paddingAll(24)]}>
          <MText style={{ fontFamily: "Geist-SemiBold", fontSize: 20 }}>Ciarán is outside</MText>
          <MText color={colors.muted}>Order #1044 is at your door. He waits for 5 minutes, then calls you.</MText>
          <MButton
            onClick={() => {
              onClose();
              Toast.success("Ciarán knows you're coming");
            }}
          >
            <MText>I'm coming</MText>
          </MButton>
        </Column>
      </BasicAlertDialog>
    </ComposeHost>
  );
}
