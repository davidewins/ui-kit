import { ComposeHost } from "@/components/ui/native/NativeHost";
import { Demo, DemoPage, Note, isIOS } from "@/gallery/DemoPage";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import {
  Button as MButton,
  FlowRow,
  Snackbar,
  SnackbarHost,
  Text as MText,
  type SnackbarHostRef,
} from "@expo/ui/jetpack-compose";
import { useRef } from "react";
import { View } from "react-native";

// Material snackbars, for reference. ZESTY's fire-and-forget feedback is
// Toast (sonner) on both platforms; failures the user must act on are never
// a toast or a snackbar.
export default function SnackbarPage() {
  if (isIOS) {
    return (
      <DemoPage usage='Compose only. iOS has no snackbar; apps use Toast from "@/lib/toast" on both platforms.'>
        <Note>iOS: no snackbar. Use Toast.success for fire-and-forget confirmations; it works the same on Android.</Note>
      </DemoPage>
    );
  }
  return <ComposeSnackbars />;
}

function ComposeSnackbars() {
  const colors = useThemeColors();
  const host = useRef<SnackbarHostRef>(null);
  const show = async (message: string, actionLabel?: string) => {
    const result = await host.current?.showSnackbar({ message, actionLabel, withDismissAction: !actionLabel, duration: "short" });
    if (result === "actionPerformed") Toast.info("Undone");
  };
  return (
    <DemoPage usage='Compose: import { SnackbarHost, Snackbar } from "@expo/ui/jetpack-compose". Apps use Toast from "@/lib/toast".'>
      <Demo title="Show one">
        <ComposeHost matchContents={{ vertical: true }}>
          <FlowRow horizontalArrangement={{ spacedBy: 8 }}>
            <MButton onClick={() => show("Order #1042 marked ready", "Undo")}>
              <MText>Mark ready</MText>
            </MButton>
            <MButton onClick={() => show("Kitchen ticket printed")}>
              <MText>Print ticket</MText>
            </MButton>
          </FlowRow>
        </ComposeHost>
      </Demo>
      <Demo title="Snackbar host">
        <View style={{ height: 96 }}>
          <ComposeHost style={{ flex: 1 }}>
            <SnackbarHost ref={host}>
              <Snackbar containerColor={colors.text} contentColor={colors.background} actionContentColor={colors.background} />
            </SnackbarHost>
          </ComposeHost>
        </View>
      </Demo>
      <Note>iOS: no snackbar; apps use Toast on both platforms.</Note>
    </DemoPage>
  );
}
