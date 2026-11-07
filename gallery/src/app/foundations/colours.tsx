import { View } from "@/components/ui";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow, type SettingsIcon } from "@/components/ui/lists/SettingsRow";
import { ScrollView, StyleSheet, useColorScheme } from "react-native";
import tokens from "../../../../tokens.json";

const STATUS = ["success", "warning", "error", "danger", "info"];
const ALIASES = new Set(["danger", "primary-text", "on-primary", "text-muted", "foreground"]);

/** Relative luminance, 0 (black) to 1 (white). */
function luminance(hex: string) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return 1.1; // "transparent" sorts first
  const n = parseInt(m[1], 16);
  const ch = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch((n >> 16) & 255) + 0.7152 * ch((n >> 8) & 255) + 0.0722 * ch(n & 255);
}

const lightToDark = (a: [string, string], b: [string, string]) => luminance(b[1]) - luminance(a[1]);

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

// tokens.json for the current mode. Chrome runs light to dark; each status
// colour keeps its fill, tint and text together; aliases go last.
export default function Colours() {
  const mode = useColorScheme() === "dark" ? "dark" : "light";
  const all = Object.entries(tokens[mode] as Record<string, string>);

  const chrome = all
    .filter(([k]) => !ALIASES.has(k) && !k.startsWith("hue-") && !STATUS.some((s) => k.startsWith(s)))
    .sort(lightToDark);
  const groups: { title: string; rows: [string, string][] }[] = [
    { title: "Chrome, light to dark", rows: chrome },
    ...STATUS.filter((s) => s !== "danger").map((s) => ({
      title: s[0].toUpperCase() + s.slice(1),
      rows: all.filter(([k]) => k === s || k.startsWith(`${s}-`)),
    })),
    { title: "Aliases (old names)", rows: all.filter(([k]) => ALIASES.has(k)) },
    { title: "ADMIN status palette", rows: all.filter(([k]) => k.startsWith("hue-")).sort(lightToDark) },
  ];

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      {groups.map((g) => (
        <View key={g.title}>
          <SectionTitle>{g.title}</SectionTitle>
          <SettingsGroup>
            {g.rows.map(([k, v]) => (
              <SettingsRow key={k} label={k} Icon={swatch(v)} trailing={v} />
            ))}
          </SettingsGroup>
        </View>
      ))}
    </ScrollView>
  );
}
