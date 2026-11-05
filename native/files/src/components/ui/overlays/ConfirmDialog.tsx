// A confirm that names the consequence ("Refund €42.50 to Sarah? This can't
// be undone."), never a bare "Are you sure?" (DESIGN.md §2).
// iOS: SwiftUI Alert, or ConfirmationDialog (the action sheet from the bottom)
// with variant="sheet". Android: Material 3 AlertDialog in both variants.
//
// Controlled: `visible` + `onClose`. Render it anywhere; it takes no layout
// space. Confirm closes the dialog, then calls onConfirm.
import {
  AlertDialog,
  Button as ComposeButton,
  Text as ComposeText,
  FilledTonalButton,
} from "@expo/ui/jetpack-compose";
import { Alert, Button, ConfirmationDialog, Spacer, Text } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { useThemeColors } from "@/hooks/useThemeColors";
import { haptic } from "@/lib/haptics";
import { Platform } from "react-native";
import { ComposeHost, SwiftHost } from "../native/NativeHost";

export interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  /** The question, with the consequence: "Cancel order #1042?" */
  title: string;
  /** One sentence on what happens next. */
  message?: string;
  confirmLabel: string;
  onConfirm: () => void;
  /** Red confirm, for deletes and refunds. */
  destructive?: boolean;
  cancelLabel?: string;
  /** "alert": centred dialog. "sheet": iOS action sheet (Android shows the dialog). */
  variant?: "alert" | "sheet";
}

const OFFSCREEN = { position: "absolute", width: 1, height: 1 } as const;

export function ConfirmDialog({
  visible,
  onClose,
  title,
  message,
  confirmLabel,
  onConfirm,
  destructive = false,
  cancelLabel = "Cancel",
  variant = "alert",
}: ConfirmDialogProps) {
  const colors = useThemeColors();
  const confirm = () => {
    haptic(destructive ? "warning" : "success");
    onClose();
    onConfirm();
  };

  if (Platform.OS === "ios") {
    const actions = (
      <>
        <Button label={confirmLabel} role={destructive ? "destructive" : "default"} onPress={confirm} />
        <Button label={cancelLabel} role="cancel" onPress={onClose} />
      </>
    );
    // SwiftUI presents from a real view; the 1pt spacer is that view.
    const trigger = <Spacer modifiers={[frame({ width: 1, height: 1 })]} />;
    const onChange = (presented: boolean) => {
      if (!presented) onClose();
    };
    return (
      <SwiftHost style={OFFSCREEN}>
        {variant === "sheet" ? (
          <ConfirmationDialog title={title} titleVisibility="visible" isPresented={visible} onIsPresentedChange={onChange}>
            <ConfirmationDialog.Trigger>{trigger}</ConfirmationDialog.Trigger>
            <ConfirmationDialog.Actions>{actions}</ConfirmationDialog.Actions>
            {message ? (
              <ConfirmationDialog.Message>
                <Text>{message}</Text>
              </ConfirmationDialog.Message>
            ) : null}
          </ConfirmationDialog>
        ) : (
          <Alert title={title} isPresented={visible} onIsPresentedChange={onChange}>
            <Alert.Trigger>{trigger}</Alert.Trigger>
            <Alert.Actions>{actions}</Alert.Actions>
            {message ? (
              <Alert.Message>
                <Text>{message}</Text>
              </Alert.Message>
            ) : null}
          </Alert>
        )}
      </SwiftHost>
    );
  }

  // The Compose dialog shows while mounted.
  if (!visible) return null;
  return (
    <ComposeHost style={OFFSCREEN}>
      <AlertDialog onDismissRequest={onClose}>
        <AlertDialog.Title>
          <ComposeText>{title}</ComposeText>
        </AlertDialog.Title>
        {message ? (
          <AlertDialog.Text>
            <ComposeText>{message}</ComposeText>
          </AlertDialog.Text>
        ) : null}
        <AlertDialog.ConfirmButton>
          <ComposeButton
            onClick={confirm}
            colors={destructive ? { containerColor: colors.error, contentColor: "#ffffff" } : undefined}
          >
            <ComposeText>{confirmLabel}</ComposeText>
          </ComposeButton>
        </AlertDialog.ConfirmButton>
        <AlertDialog.DismissButton>
          <FilledTonalButton onClick={onClose}>
            <ComposeText>{cancelLabel}</ComposeText>
          </FilledTonalButton>
        </AlertDialog.DismissButton>
      </AlertDialog>
    </ComposeHost>
  );
}
