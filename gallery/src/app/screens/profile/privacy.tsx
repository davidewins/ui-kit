import { Card, Text, View } from "@/components/ui";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ProgressBar } from "@/components/ui/feedback/ProgressBar";
import { Switch } from "@/components/ui/inputs/Switch";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { DemoScreen, useStates } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Bug, ChartNoAxesColumn, FileText, Scale, Sparkles } from "lucide-react-native";
import { useState } from "react";

const STATES = ["Default", "Preparing export", "Export ready"] as const;

// Privacy and your data (GDPR): what we collect, with a switch each; your
// copy of the data as the footer action, with its progress in a card; delete
// account in the header menu behind a confirm that names the consequence.
export default function Privacy() {
  const colors = useThemeColors();
  const { state, bar } = useStates(STATES);
  const [analytics, setAnalytics] = useState(true);
  const [personal, setPersonal] = useState(false);
  const [crashes, setCrashes] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const footer =
    state === "Default" ? (
      <InsetFooter primaryCta={{ label: "Download my data", onPress: () => Toast.success("We'll email you when it's ready") }} />
    ) : state === "Export ready" ? (
      <InsetFooter primaryCta={{ label: "Save file, 4.2 MB", onPress: () => Toast.success("Saved to Files") }} />
    ) : undefined;

  return (
    <>
      <ActionMenu
        accessibilityLabel="Account data actions"
        actions={[{ label: "Delete account", systemImage: "trash", destructive: true, onPress: () => setDeleting(true) }]}
      />
      <DemoScreen bar={bar} footer={footer}>
        {state !== "Default" ? (
          <View style={{ marginHorizontal: 16, marginBottom: 18 }}>
            <Card raised>
              <Text weight="medium" style={{ fontSize: 15, color: colors.muted }}>Your data</Text>
              <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4, marginTop: 2 }}>
                {state === "Export ready" ? "Ready to download" : "Getting it ready"}
              </Text>
              <Text weight="medium" style={{ fontSize: 15, color: colors.muted, marginTop: 2, marginBottom: 14 }}>
                {state === "Export ready" ? "Orders, bookings, workouts and settings. The link works for 7 days." : "Usually about 10 minutes. We'll email you too."}
              </Text>
              <ProgressBar value={state === "Export ready" ? 1 : 0.4} color={state === "Export ready" ? colors.success : undefined} accessibilityLabel="Export progress" />
            </Card>
          </View>
        ) : null}

        <SectionTitle>What we collect</SectionTitle>
        <SettingsGroup>
          <SettingsRow label="Usage analytics" Icon={ChartNoAxesColumn} accessory={<Switch value={analytics} onValueChange={setAnalytics} />} />
          <SettingsRow label="Personalised offers" Icon={Sparkles} accessory={<Switch value={personal} onValueChange={setPersonal} />} />
          <SettingsRow label="Crash reports" Icon={Bug} accessory={<Switch value={crashes} onValueChange={setCrashes} />} />
        </SettingsGroup>
        <Text weight="medium" style={{ fontSize: 13, lineHeight: 18, color: colors.muted, marginHorizontal: 20, marginTop: -8, marginBottom: 18 }}>
          Analytics never include your name or email. Changes apply from your next visit.
        </Text>

        <SectionTitle>Policies</SectionTitle>
        <SettingsGroup>
          <SettingsRow label="Privacy policy" Icon={FileText} navigates onPress={() => Toast.info("Privacy policy")} />
          <SettingsRow label="Terms of use" Icon={Scale} navigates onPress={() => Toast.info("Terms of use")} />
        </SettingsGroup>
      </DemoScreen>
      <ConfirmDialog
        visible={deleting}
        onClose={() => setDeleting(false)}
        title="Delete your account?"
        message="Your orders, bookings and workouts are erased in 30 days. You can't undo this after that."
        confirmLabel="Delete account"
        destructive
        onConfirm={() => Toast.success("Account will be deleted in 30 days")}
      />
    </>
  );
}
