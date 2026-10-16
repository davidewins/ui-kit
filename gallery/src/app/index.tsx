import { SectionTitle } from "@/components/ui/SectionTitle";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { View } from "@/components/ui";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  CircleAlert,
  Columns2,
  Inbox,
  Layers,
  List,
  Loader,
  MousePointerClick,
  Palette,
  PanelBottom,
  Tag,
  TextCursorInput,
  Type,
} from "lucide-react-native";
import { ScrollView, useColorScheme } from "react-native";
import { Uniwind } from "uniwind";

const APPEARANCES = ["system", "light", "dark"] as const;
const LABELS = ["Automatic", "Light", "Dark"];

// Recipe §3.6: unlabelled SettingsGroups of SettingsRows. Appearance control
// copied from VOID profile/appearance.
export default function Index() {
  const mode = useColorScheme() === "dark" ? "dark" : "light";
  const [appearance, setAppearance] = useState<(typeof APPEARANCES)[number]>("system");

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <SectionTitle inset={32}>Appearance</SectionTitle>
      <View style={{ marginHorizontal: 16 }}>
        <SegmentedControl
          values={LABELS}
          selectedIndex={APPEARANCES.indexOf(appearance)}
          onChange={(e) => {
            Haptics.selectionAsync();
            const next = APPEARANCES[e.nativeEvent.selectedSegmentIndex] ?? "system";
            setAppearance(next);
            Uniwind.setTheme(next);
          }}
          appearance={mode}
          fontStyle={{ fontFamily: "Geist-Medium" }}
          activeFontStyle={{ fontFamily: "Geist-SemiBold" }}
          style={{ height: 44 }}
          accessibilityLabel="Appearance"
        />
      </View>

      <SectionTitle inset={32}>Components</SectionTitle>
      <SettingsGroup>
        <SettingsRow label="Colours" Icon={Palette} href="/colours" navigates />
        <SettingsRow label="Type" Icon={Type} href="/type" navigates />
        <SettingsRow label="Buttons" Icon={MousePointerClick} href="/buttons" navigates />
        <SettingsRow label="Settings rows" Icon={List} href="/rows" navigates />
        <SettingsRow label="Inputs" Icon={TextCursorInput} href="/inputs" navigates />
        <SettingsRow label="Empty state" Icon={Inbox} href="/empty" navigates />
        <SettingsRow label="Empty state, icon" Icon={Inbox} href="/empty-icon" navigates />
        <SettingsRow label="Error" Icon={CircleAlert} href="/error" navigates />
        <SettingsRow label="Loading" Icon={Loader} href="/loading" navigates />
        <SettingsRow label="Badges and toasts" Icon={Tag} href="/states" navigates />
        <SettingsRow label="Surfaces" Icon={Layers} href="/surfaces" navigates />
        <SettingsRow label="Sticky footer" Icon={PanelBottom} href="/footer" navigates />
      </SettingsGroup>

      <SectionTitle inset={32}>Compare (every version in the apps)</SectionTitle>
      <SettingsGroup>
        <SettingsRow label="Select rows" Icon={Columns2} href="/compare-select" navigates trailing="6" />
        <SettingsRow label="Buttons" Icon={Columns2} href="/compare-buttons" navigates trailing="4" />
        <SettingsRow label="Status badges" Icon={Columns2} href="/compare-status" navigates trailing="4" />
      </SettingsGroup>
    </ScrollView>
  );
}
