// AccountScreen: the one Account page for every app. Remixed from ZESTY
// gallery screens/profile/account: who you are (identity row, taps through to
// Personal details), your stuff, settings, help, version. Sign out lives in
// the header menu behind a ConfirmDialog, never as a lone row.
//
// The screen sets no header options. The app's route:
//   tab root:     <Stack.Screen options={{ title: "Account", ...LARGE_TITLE }} />
//   pushed page:  <Stack.Screen options={{ title: "Account" }} />
// LARGE_TITLE comes from lib/stackHeader.
import type { MenuAction } from "@/components/ui/actions/ActionMenu";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { useState } from "react";
import {
  SettingsScreen,
  type SettingsScreenIdentity,
  type SettingsScreenProps,
} from "./SettingsScreen";

export interface AccountSignOut {
  onConfirm: () => void;
  /** Default "Sign out of this phone?". */
  title?: string;
  /** What stays and what goes, e.g. "Your bag and saved items stay on your account." */
  message?: string;
  /** Default "Sign out". */
  confirmLabel?: string;
}

export interface AccountScreenProps extends Omit<SettingsScreenProps, "identity" | "menu"> {
  identity: SettingsScreenIdentity;
  /** Header menu Sign out, confirmed in a dialog. */
  signOut?: AccountSignOut;
  /** More header menu actions, listed before Sign out. */
  menuActions?: readonly MenuAction[];
}

export function AccountScreen({ signOut, menuActions = [], ...rest }: AccountScreenProps) {
  const [signingOut, setSigningOut] = useState(false);
  const actions: MenuAction[] = [
    ...menuActions,
    ...(signOut
      ? [{ label: "Sign out", systemImage: "rectangle.portrait.and.arrow.right" as const, destructive: true, onPress: () => setSigningOut(true) }]
      : []),
  ];
  return (
    <>
      <SettingsScreen {...rest} menu={actions.length ? { accessibilityLabel: "Account actions", actions } : undefined} />
      {signOut ? (
        <ConfirmDialog
          visible={signingOut}
          onClose={() => setSigningOut(false)}
          title={signOut.title ?? "Sign out of this phone?"}
          message={signOut.message}
          confirmLabel={signOut.confirmLabel ?? "Sign out"}
          destructive
          onConfirm={signOut.onConfirm}
        />
      ) : null}
    </>
  );
}
