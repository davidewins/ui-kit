// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/lists/CheckForUpdatesRow.tsx. Edit it there and sync; local edits fail ui-kit:check.
// The one "Check for Updates" row every app shows (About / Settings): app
// version on the right, "New" badge once an update is found, spinner while
// checking. onLongPress is for an app's hidden menu (e.g. VOID's reviewer menu).
import Constants from "expo-constants";
import { Download } from "lucide-react-native";
import { useCheckForUpdates } from "@/hooks/useCheckForUpdates";
import { Badge } from "../feedback/Badge";
import { SettingsRow } from "./SettingsRow";

export function CheckForUpdatesRow({ onLongPress }: { onLongPress?: () => void }) {
  const { checking, updateAvailable, checkForUpdates } = useCheckForUpdates();
  return (
    <SettingsRow
      label="Check for Updates"
      Icon={Download}
      trailing={`v${Constants.expoConfig?.version}`}
      loading={checking}
      accessory={updateAvailable ? <Badge variant="success">New</Badge> : undefined}
      onPress={checkForUpdates}
      onLongPress={onLongPress}
    />
  );
}
