import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SETTINGS_GROUP } from "@/components/ui/lists/SettingsGroup";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SETTINGS_ROW, SettingsRow } from "@/components/ui/lists/SettingsRow";
import type { HapticFeel } from "@/lib/haptics";
import { DemoPage } from "@/gallery/DemoPage";
import { Hand, Ruler, Square } from "lucide-react-native";

// haptic(feel) from "@/lib/haptics"; what each one is for in the kit.
const FEELS: [HapticFeel, string][] = [
  ["selection", "Picker, segment, toggle"],
  ["light", "Small press"],
  ["medium", "Long press opens a menu"],
  ["heavy", "Rare, strong press"],
  ["success", "A save landed"],
  ["warning", "Destructive confirm"],
  ["error", "Validation failed"],
];
const pt = (n: number) => `${n} pt`;

// The numbers the kit is built on, read from the kit itself where it exports
// them (SETTINGS_ROW, SETTINGS_GROUP), so this page can't drift.
export default function TokensPage() {
  return (
    <DemoPage usage='Colours come from tokens.json via useThemeColors(). Geometry is exported by the kit: SETTINGS_ROW, SETTINGS_GROUP. Haptics: haptic() from "@/lib/haptics".'>
      <SectionTitle>Radius</SectionTitle>
      <SettingsGroup>
        <SettingsRow label="Group and raised card" Icon={Square} trailing={pt(SETTINGS_GROUP.radius)} />
        <SettingsRow label="Tile and input" Icon={Square} trailing="16 pt" />
        <SettingsRow label="Buttons and chips" Icon={Square} trailing="Full (capsule)" />
        <SettingsRow label="Corners over 12 pt" Icon={Square} trailing="Continuous" />
      </SettingsGroup>
      <SectionTitle>Spacing</SectionTitle>
      <SettingsGroup>
        <SettingsRow label="Page gutter (groups)" Icon={Ruler} trailing={pt(SETTINGS_GROUP.marginHorizontal)} />
        <SettingsRow label="Page gutter (content)" Icon={Ruler} trailing="20 pt" />
        <SettingsRow label="Space under a group" Icon={Ruler} trailing={pt(SETTINGS_GROUP.marginBottom)} />
        <SettingsRow label="Row height" Icon={Ruler} trailing={pt(SETTINGS_ROW.height)} />
        <SettingsRow label="Row padding" Icon={Ruler} trailing={pt(SETTINGS_ROW.paddingHorizontal)} />
        <SettingsRow label="Separator inset" Icon={Ruler} trailing={pt(SETTINGS_ROW.separatorInset)} />
        <SettingsRow label="Row icon" Icon={Ruler} trailing={pt(SETTINGS_ROW.iconSize)} />
        <SettingsRow label="Row label" Icon={Ruler} trailing={pt(SETTINGS_ROW.labelFontSize)} />
      </SettingsGroup>
      <SectionTitle>Haptics</SectionTitle>
      <SettingsGroup>
        {FEELS.map(([feel, use]) => (
          <SettingsRow key={feel} label={feel} Icon={Hand} trailing={use} />
        ))}
      </SettingsGroup>
    </DemoPage>
  );
}
