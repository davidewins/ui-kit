import { Text } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { PickerRow } from "@/components/ui/inputs/PickerRow";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsIdentity } from "@/components/ui/lists/SettingsIdentity";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { Avatar, DemoScreen, MetricGrid, useStates } from "@/gallery/demo/parts";
import { Toast } from "@/lib/toast";
import { router } from "expo-router";
import { Bell, CircleHelp, CreditCard, MailWarning, MapPin, MoonStar, Package, Shield, Star } from "lucide-react-native";
import { useState } from "react";

const STATES = ["Signed in", "Email not verified"] as const;
const THEMES = ["System", "Light", "Dark"].map((t) => ({ label: t, value: t }));

// Account home for any of the demo apps: who you are, then your stuff, then
// settings, then help. Sign out is in the header menu, never a lone row.
export default function Account() {
  const { state } = useStates(STATES);
  const [theme, setTheme] = useState("System");
  const [signingOut, setSigningOut] = useState(false);

  return (
    <>
      <ActionMenu
        accessibilityLabel="Account actions"
        actions={[{ label: "Sign out", systemImage: "rectangle.portrait.and.arrow.right", destructive: true, onPress: () => setSigningOut(true) }]}
      />
      <DemoScreen>
        <SettingsIdentity
          leading={<Avatar name="Aoife Byrne" size={60} />}
          title="Aoife Byrne"
          subtitle="aoife@example.com"
          caption="Member since March 2024"
          onPress={() => router.push("/screens/profile/edit-profile")}
          accessibilityLabel="Edit your details"
        />
        <MetricGrid
          items={[
            { label: "Orders", value: "14", delta: "2 on the way", good: true },
            { label: "Bookings", value: "22", delta: "Next: Wed 09:30", good: true },
            { label: "Workouts", value: "61", delta: "5 this week", good: true },
            { label: "Points", value: "1,240", delta: "€12 to spend", good: true },
            { label: "Saved", value: "€212" },
            { label: "Member since", value: "2024" },
          ]}
        />
        {state === "Email not verified" ? (
          <SettingsGroup>
            <SettingsRow label="Verify your email" Icon={MailWarning} alert navigates onPress={() => Toast.info("Code sent to aoife@example.com")} />
          </SettingsGroup>
        ) : null}
        <SettingsGroup>
          <SettingsRow label="Orders" Icon={Package} trailing="2 in progress" navigates href="/screens/shop/orders" />
          <SettingsRow label="Addresses" Icon={MapPin} trailing="2" navigates onPress={() => Toast.info("Addresses")} />
          <SettingsRow label="Payment methods" Icon={CreditCard} trailing="Visa 4242" navigates onPress={() => Toast.info("Payment methods")} />
        </SettingsGroup>
        <SectionTitle>Settings</SectionTitle>
        <SettingsGroup>
          <SettingsRow label="Notifications" Icon={Bell} navigates href="/screens/profile/notifications" />
          <SettingsRow label="Privacy and data" Icon={Shield} navigates href="/screens/profile/privacy" />
          <PickerRow label="Appearance" Icon={MoonStar} options={THEMES} value={theme} onChange={setTheme} />
        </SettingsGroup>
        <SectionTitle>Help</SectionTitle>
        <SettingsGroup>
          <SettingsRow label="Help and support" Icon={CircleHelp} navigates onPress={() => Toast.info("Help")} />
          <SettingsRow label="Rate the app" Icon={Star} navigates onPress={() => Toast.info("Thanks")} />
        </SettingsGroup>
        <Text weight="medium" className="text-muted" style={{ fontSize: 13, textAlign: "center", marginTop: 4 }}>Version 2.4.0 (318)</Text>
      </DemoScreen>
      <ConfirmDialog
        visible={signingOut}
        onClose={() => setSigningOut(false)}
        title="Sign out of this phone?"
        message="Your bag and saved items stay on your account."
        confirmLabel="Sign out"
        destructive
        onConfirm={() => Toast.success("Signed out")}
      />
    </>
  );
}
