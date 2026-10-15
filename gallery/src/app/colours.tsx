import { View } from "@/components/ui";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { SettingsRow, type SettingsIcon } from "@/components/ui/SettingsRow";
import { ScrollView, StyleSheet, useColorScheme } from "react-native";
import tokens from "../../../tokens.json";

const GROUPS: { title: string; match: (k: string) => boolean }[] = [
  { title: "Chrome", match: (k) => !/^(success|error|warning|info|danger|hue-|tab-|input-)/.test(k) },
  { title: "Status", match: (k) => /^(success|error|warning|info|danger)/.test(k) },
  { title: "Tabs and inputs", match: (k) => /^(tab-|input-)/.test(k) },
  { title: "ADMIN status palette", match: (k) => k.startsWith("hue-") },
];

function swatch(color: string): SettingsIcon {
  return function Swatch() {
    return (
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          backgroundColor: color,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "#8e8e93",
        }}
      />
    );
  };
}

// tokens.json for the current mode; one row per token, value trailing.
export default function Colours() {
  const mode = useColorScheme() === "dark" ? "dark" : "light";
  const values = tokens[mode] as Record<string, string>;

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {GROUPS.map((g) => (
        <View key={g.title}>
          <SectionTitle inset={32}>{g.title}</SectionTitle>
          <SettingsGroup>
            {Object.entries(values)
              .filter(([k]) => g.match(k))
              .map(([k, v]) => (
                <SettingsRow key={k} label={k} Icon={swatch(v)} trailing={v} />
              ))}
          </SettingsGroup>
        </View>
      ))}
    </ScrollView>
  );
}
