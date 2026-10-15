import { SectionTitle } from "@/components/ui/SectionTitle";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { Switch } from "@/components/ui/Switch";
import {
  CircleAlert,
  Layers,
  List,
  Moon,
  MousePointerClick,
  Palette,
  PanelBottom,
  TextCursorInput,
  Type,
} from "lucide-react-native";
import { ScrollView, useColorScheme } from "react-native";
import { Uniwind } from "uniwind";

// Recipe §3.6: unlabelled SettingsGroups of SettingsRows.
export default function Index() {
  const dark = useColorScheme() === "dark";

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <SectionTitle inset={32}>Appearance</SectionTitle>
      <SettingsGroup>
        <SettingsRow
          label="Dark mode"
          Icon={Moon}
          accessory={
            <Switch value={dark} onValueChange={(v) => Uniwind.setTheme(v ? "dark" : "light")} />
          }
        />
      </SettingsGroup>

      <SectionTitle inset={32}>Components</SectionTitle>
      <SettingsGroup>
        <SettingsRow label="Colours" Icon={Palette} href="/colours" navigates />
        <SettingsRow label="Type" Icon={Type} href="/type" navigates />
        <SettingsRow label="Buttons" Icon={MousePointerClick} href="/buttons" navigates />
        <SettingsRow label="Settings rows" Icon={List} href="/rows" navigates />
        <SettingsRow label="Inputs" Icon={TextCursorInput} href="/inputs" navigates />
        <SettingsRow label="Empty, error, loading" Icon={CircleAlert} href="/states" navigates />
        <SettingsRow label="Surfaces" Icon={Layers} href="/surfaces" navigates />
        <SettingsRow label="Sticky footer" Icon={PanelBottom} href="/footer" navigates />
      </SettingsGroup>
    </ScrollView>
  );
}
