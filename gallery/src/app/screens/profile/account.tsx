import { PickerRow } from "@/components/ui/inputs/PickerRow";
import { Avatar, FactList, useStates } from "@/gallery/demo/parts";
import { Toast } from "@/lib/toast";
import { AccountScreen } from "@/screens/AccountScreen";
import { router } from "expo-router";
import { Bell, CircleHelp, CreditCard, MailWarning, MapPin, MoonStar, Package, Shield, Star } from "lucide-react-native";
import { useState } from "react";

const STATES = ["Signed in", "Email not verified"] as const;
const THEMES = ["System", "Light", "Dark"].map((t) => ({ label: t, value: t }));

// Account home: the kit's AccountScreen (src/screens). Who you are, then your
// stuff, then settings, then help. Sign out is in the header menu.
export default function Account() {
  const { state } = useStates(STATES);
  const [theme, setTheme] = useState("System");

  return (
    <AccountScreen
      identity={{
        leading: <Avatar name="Aoife Byrne" size={60} />,
        title: "Aoife Byrne",
        subtitle: "aoife@example.com",
        caption: "Member since March 2024",
        onPress: () => router.push("/screens/profile/edit-profile"),
        accessibilityLabel: "Edit your details",
      }}
      header={
        <FactList
          items={[
            { label: "Orders", value: "14", delta: "2 on the way", good: true },
            { label: "Bookings", value: "22", delta: "Next: Wed 09:30", good: true },
            { label: "Workouts", value: "61", delta: "5 this week", good: true },
            { label: "Points", value: "1,240", delta: "€12 to spend", good: true },
            { label: "Saved", value: "€212" },
            { label: "Member since", value: "2024" },
          ]}
        />
      }
      sections={[
        {
          key: "verify",
          rows: [
            state === "Email not verified" && {
              label: "Verify your email",
              icon: MailWarning,
              alert: true,
              navigates: true,
              onPress: () => Toast.info("Code sent to aoife@example.com"),
            },
          ],
        },
        {
          key: "stuff",
          rows: [
            { label: "Orders", icon: Package, value: "2 in progress", navigates: true, href: "/screens/orders/list" },
            { label: "Addresses", icon: MapPin, value: "2", navigates: true, onPress: () => Toast.info("Addresses") },
            { label: "Payment methods", icon: CreditCard, value: "Visa 4242", navigates: true, onPress: () => Toast.info("Payment methods") },
          ],
        },
        {
          title: "Settings",
          rows: [
            { label: "Notifications", icon: Bell, navigates: true, href: "/screens/profile/notifications" },
            { label: "Privacy and data", icon: Shield, navigates: true, href: "/screens/profile/privacy" },
            { key: "appearance", element: <PickerRow label="Appearance" Icon={MoonStar} options={THEMES} value={theme} onChange={setTheme} /> },
          ],
        },
        {
          title: "Help",
          rows: [
            { label: "Help and support", icon: CircleHelp, navigates: true, onPress: () => Toast.info("Help") },
            { label: "Rate the app", icon: Star, navigates: true, onPress: () => Toast.info("Thanks") },
          ],
        },
      ]}
      footnote="Version 2.4.0 (318)"
      signOut={{
        message: "Your bag and saved items stay on your account.",
        onConfirm: () => Toast.success("Signed out"),
      }}
    />
  );
}
