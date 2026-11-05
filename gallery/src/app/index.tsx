import { ActionMenu } from "@/components/ui/ActionMenu";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { View } from "@/components/ui";
import { BottomSwitch } from "@/gallery/BottomSwitch";
import { useState } from "react";
import {
  Bell,
  Bike,
  ChartLine,
  Columns2,
  Inbox,
  KeyRound,
  Layers,
  List,
  Mail,
  MousePointerClick,
  Package,
  Palette,
  PanelBottom,
  Receipt,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Store,
  Tag,
  TextCursorInput,
  Type,
  Volume2,
  Wallet,
} from "lucide-react-native";
import { ScrollView } from "react-native";
import { Uniwind } from "uniwind";

const HALVES = ["Components", "Screens"] as const;
const APPEARANCES = ["system", "light", "dark"] as const;
const LABELS = ["Automatic", "Light", "Dark"];

// ZESTY is two things (David, 4 Nov): components, the parts every app imports
// as they are, and screens, whole pages built from them. Each half is grouped
// by what you are looking for; the switch sits at the bottom like every page.
export default function Index() {
  const [half, setHalf] = useState(0);
  // Appearance lives in the header "..." menu, not as a lone action row.
  return (
    <View style={{ flex: 1 }}>
      <ActionMenu
        accessibilityLabel="Appearance"
        title="Appearance"
        actions={APPEARANCES.map((a, i) => ({
          label: LABELS[i],
          systemImage: a === "dark" ? "moon" : a === "light" ? "sun.max" : "circle.lefthalf.filled",
          onPress: () => Uniwind.setTheme(a),
        }))}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 24 }}>
        {HALVES[half] === "Components" ? (
          <>
            <SectionTitle>Foundations</SectionTitle>
            <SettingsGroup>
              <SettingsRow label="Colours" Icon={Palette} href="/colours" navigates />
              <SettingsRow label="Type" Icon={Type} href="/type" navigates />
            </SettingsGroup>

            <SectionTitle>Actions</SectionTitle>
            <SettingsGroup>
              <SettingsRow label="Buttons" Icon={MousePointerClick} href="/buttons" navigates />
              <SettingsRow label="Header menus and native controls" Icon={SlidersHorizontal} href="/native" navigates />
            </SettingsGroup>

            <SectionTitle>Lists and inputs</SectionTitle>
            <SettingsGroup>
              <SettingsRow label="Settings rows" Icon={List} href="/rows" navigates />
              <SettingsRow label="Select rows" Icon={Columns2} href="/compare-select" navigates />
              <SettingsRow label="Inputs" Icon={TextCursorInput} href="/inputs" navigates />
            </SettingsGroup>

            <SectionTitle>Feedback</SectionTitle>
            <SettingsGroup>
              <SettingsRow label="Empty, loading and error" Icon={Inbox} href="/empty" navigates />
              <SettingsRow label="Badges and toasts" Icon={Tag} href="/states" navigates />
              <SettingsRow label="Status badges" Icon={Tag} href="/compare-status" navigates />
              <SettingsRow label="Toast sounds" Icon={Volume2} href="/compare-sounds" navigates />
            </SettingsGroup>

            <SectionTitle>Surfaces</SectionTitle>
            <SettingsGroup>
              <SettingsRow label="Card, Tile and glass" Icon={Layers} href="/surfaces" navigates />
              <SettingsRow label="Liquid Glass" Icon={Sparkles} href="/glass" navigates />
              <SettingsRow label="Sticky footer" Icon={PanelBottom} href="/footer" navigates />
            </SettingsGroup>

          </>
        ) : (
          <>
            <SectionTitle>Patterns</SectionTitle>
            <SettingsGroup>
              <SettingsRow label="List" Icon={List} href="/examples/list" navigates />
              <SettingsRow label="Detail with sticky footer" Icon={Type} href="/examples/detail" navigates />
              <SettingsRow label="Edit" Icon={TextCursorInput} href="/examples/edit" navigates />
              <SettingsRow label="Create (modal)" Icon={PanelBottom} href="/examples/create" navigates />
            </SettingsGroup>

            <SectionTitle>Sign in</SectionTitle>
            <SettingsGroup>
              <SettingsRow label="Welcome" Icon={Sparkles} href="/void" navigates />
              <SettingsRow label="Email" Icon={Mail} href="/void/email" navigates />
              <SettingsRow label="Verify code" Icon={KeyRound} href="/void/verify-otp?email=aoife%40example.com" navigates />
              <SettingsRow label="Forgot password" Icon={KeyRound} href="/sellers/forgot-password" navigates />
            </SettingsGroup>

            <SectionTitle>Account</SectionTitle>
            <SettingsGroup>
              <SettingsRow label="Notifications" Icon={Bell} href="/void/profile/notifications" navigates />
              <SettingsRow label="GDPR" Icon={ShieldCheck} href="/sellers/gdpr" navigates />
            </SettingsGroup>

            <SectionTitle>Selling (SELLERS)</SectionTitle>
            <SettingsGroup>
              <SettingsRow label="Product details" Icon={Package} href="/sellers/products/6b6c5dd2-5920-4a5e-b6d9-0d6ef8b11288" navigates />
              <SettingsRow label="Analytics" Icon={ChartLine} href="/sellers/analytics" navigates />
              <SettingsRow label="Storefronts" Icon={Store} href="/sellers/account/storefronts" navigates />
            </SettingsGroup>

            <SectionTitle>Ordering (VOID)</SectionTitle>
            <SettingsGroup>
              <SettingsRow label="Orders" Icon={Receipt} href="/void/orders" navigates />
              <SettingsRow label="Order on the way" Icon={Bike} href="/void/orders/order-1" navigates />
            </SettingsGroup>

            <SectionTitle>Delivering (RIDERS)</SectionTitle>
            <SettingsGroup>
              <SettingsRow label="Earnings" Icon={Wallet} href="/riders/profile/earnings" navigates />
              <SettingsRow label="Active delivery" Icon={Bike} href="/riders/delivery/demo" navigates />
            </SettingsGroup>
          </>
        )}
      </ScrollView>
      <BottomSwitch values={HALVES} selectedIndex={half} onChange={setHalf} accessibilityLabel="Components or screens" />
    </View>
  );
}
