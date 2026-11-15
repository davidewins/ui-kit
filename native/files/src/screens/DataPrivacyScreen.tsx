// DataPrivacyScreen: "Privacy and your data" for every app. Remixed from ZESTY
// gallery screens/profile/privacy: what we collect, a Switch each, with a
// muted note under the group; the policies; your copy of the data as the
// footer action (InsetFooter), its progress in a raised Card; Delete account
// in the header menu behind a ConfirmDialog that names the consequence.
//
// The screen sets no header options. The app's route:
//   <Stack.Screen options={{ title: "Privacy and data", ...LARGE_TITLE }} />
// LARGE_TITLE comes from lib/stackHeader. The ScrollView is the first child
// with contentInsetAdjustmentBehavior="automatic", so the large title works.
import { ScrollView, Text, View } from "@/components/ui";
import { InsetFooter, useInsetFooterSpace } from "@/components/onboarding/shells/InsetShell";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ProgressBar } from "@/components/ui/feedback/ProgressBar";
import { Switch } from "@/components/ui/inputs/Switch";
import type { SettingsIcon } from "@/components/ui/lists/SettingsRow";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { Card } from "@/components/ui/surfaces/Card";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useState } from "react";
import { SettingsSections, type SettingsScreenRow, type SettingsScreenSection } from "./SettingsScreen";

export interface DataPrivacyToggle {
  key: string;
  label: string;
  icon?: SettingsIcon;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export type DataExportStatus = "idle" | "preparing" | "ready";

export interface DataExport {
  status: DataExportStatus;
  /** Footer button while idle. */
  onRequest: () => void;
  /** Default "Download my data". */
  requestLabel?: string;
  /** Footer button once ready; without it the ready state has no footer. */
  onSave?: () => void;
  /** Default "Save file". Put the size in it: "Save file, 4.2 MB". */
  saveLabel?: string;
  /** 0 to 1 while preparing; null (the default) for an indeterminate bar. */
  progress?: number | null;
  /** Card copy. Defaults: "Your data", "Getting it ready" / "Ready to download". */
  label?: string;
  preparingTitle?: string;
  /** Default "Usually about 10 minutes. We'll email you too." */
  preparingMessage?: string;
  readyTitle?: string;
  /** What is in the file and how long the link lasts. Default "The link works for 7 days." */
  readyMessage?: string;
}

export interface DataPrivacyDelete {
  onConfirm: () => void;
  /** Default "Delete your account?". */
  title?: string;
  /** The consequence, e.g. "Your orders are erased in 30 days. You can't undo this after that." */
  message: string;
  /** Default "Delete account". */
  confirmLabel?: string;
}

export interface DataPrivacyScreenProps {
  toggles: readonly DataPrivacyToggle[];
  /** Default "What we collect". */
  togglesTitle?: string;
  /** Muted line under the switches. */
  togglesNote?: string;
  /** Privacy policy, Terms: rows that push the LegalScreen routes. */
  policies?: readonly SettingsScreenRow[];
  /** Default "Policies". */
  policiesTitle?: string;
  /** More groups after the policies. */
  sections?: readonly SettingsScreenSection[];
  dataExport?: DataExport;
  /** Header menu Delete account, confirmed in a dialog. */
  deleteAccount?: DataPrivacyDelete;
}

export function DataPrivacyScreen({
  toggles,
  togglesTitle = "What we collect",
  togglesNote,
  policies = [],
  policiesTitle = "Policies",
  sections = [],
  dataExport,
  deleteAccount,
}: DataPrivacyScreenProps) {
  const colors = useThemeColors();
  const space = useInsetFooterSpace();
  const [deleting, setDeleting] = useState(false);
  const status = dataExport?.status ?? "idle";

  const footer = !dataExport ? null : status === "idle" ? (
    <InsetFooter primaryCta={{ label: dataExport.requestLabel ?? "Download my data", onPress: dataExport.onRequest }} />
  ) : status === "ready" && dataExport.onSave ? (
    <InsetFooter primaryCta={{ label: dataExport.saveLabel ?? "Save file", onPress: dataExport.onSave }} />
  ) : null;

  return (
    <>
      {deleteAccount ? (
        <ActionMenu
          accessibilityLabel="Account data actions"
          actions={[{ label: deleteAccount.confirmLabel ?? "Delete account", systemImage: "trash", destructive: true, onPress: () => setDeleting(true) }]}
        />
      ) : null}
      <View style={{ flex: 1 }}>
        <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingTop: 8, paddingBottom: footer ? space : 32 }}>
          {dataExport && status !== "idle" ? (
            <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
              <Card raised>
                <Text weight="medium" style={{ fontSize: 15, color: colors.muted }}>{dataExport.label ?? "Your data"}</Text>
                <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4, marginTop: 2 }}>
                  {status === "ready" ? dataExport.readyTitle ?? "Ready to download" : dataExport.preparingTitle ?? "Getting it ready"}
                </Text>
                <Text weight="medium" style={{ fontSize: 15, color: colors.muted, marginTop: 2, marginBottom: 14 }}>
                  {status === "ready"
                    ? dataExport.readyMessage ?? "The link works for 7 days."
                    : dataExport.preparingMessage ?? "Usually about 10 minutes. We'll email you too."}
                </Text>
                <ProgressBar
                  value={status === "ready" ? 1 : dataExport.progress ?? null}
                  color={status === "ready" ? colors.success : undefined}
                  accessibilityLabel="Export progress"
                />
              </Card>
            </View>
          ) : null}

          <SettingsSections
            sections={[
              {
                key: "collect",
                title: togglesTitle,
                note: togglesNote,
                rows: toggles.map((t) => ({
                  key: t.key,
                  label: t.label,
                  icon: t.icon,
                  accessory: <Switch value={t.value} onValueChange={t.onValueChange} disabled={t.disabled} />,
                })),
              },
              { key: "policies", title: policiesTitle, rows: policies },
              ...sections,
            ]}
          />
        </ScrollView>
        {footer}
      </View>
      {deleteAccount ? (
        <ConfirmDialog
          visible={deleting}
          onClose={() => setDeleting(false)}
          title={deleteAccount.title ?? "Delete your account?"}
          message={deleteAccount.message}
          confirmLabel={deleteAccount.confirmLabel ?? "Delete account"}
          destructive
          onConfirm={deleteAccount.onConfirm}
        />
      ) : null}
    </>
  );
}
