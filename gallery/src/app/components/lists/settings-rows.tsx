import { Image, View } from "@/components/ui";
import { CountBadge } from "@/components/ui/CountBadge";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { SettingsIdentity } from "@/components/ui/SettingsIdentity";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { Switch } from "@/components/ui/Switch";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Bell, CreditCard, Info, LogOut, Shield, Trash2, Wallet } from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";

const noop = () => {};

// Recipe §3.6 account screen: identity on top, unlabelled groups, destructive last.
export default function Rows() {
  const colors = useThemeColors();
  const [on, setOn] = useState(true);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle inset={32}>SettingsIdentity</SectionTitle>
      <SettingsIdentity
        leading={
          <View style={{ width: 50, height: 50, borderRadius: 25, overflow: "hidden", backgroundColor: colors.secondaryBackground }}>
            <Image source={require("@/assets/images/empty/box.png")} style={{ width: 50, height: 50 }} />
          </View>
        }
        title="Alex Rider"
        subtitle="alex@example.com"
        caption="+353 87 123 4567"
        onPress={noop}
        accessibilityLabel="Edit profile"
      />

      <SectionTitle inset={32}>SettingsRow</SectionTitle>
      <SettingsGroup>
        <SettingsRow label="Navigates" Icon={Shield} onPress={noop} navigates />
        <SettingsRow label="Trailing text" Icon={Info} trailing="v1.4.2" />
        <SettingsRow label="Needs attention" Icon={Wallet} onPress={noop} navigates alert />
        <SettingsRow label="Count badge" Icon={Bell} onPress={noop} navigates accessory={<CountBadge count={3} />} />
        <SettingsRow label="Switch" Icon={Bell} accessory={<Switch value={on} onValueChange={setOn} />} />
        <SettingsRow label="Loading" Icon={CreditCard} onPress={noop} loading />
        <SettingsRow label="Disabled" Icon={CreditCard} onPress={noop} disabled />
      </SettingsGroup>

      <SettingsGroup>
        <SettingsRow label="Log out" Icon={LogOut} onPress={noop} destructive />
        <SettingsRow label="Delete account" Icon={Trash2} onPress={noop} destructive />
      </SettingsGroup>
    </ScrollView>
  );
}
