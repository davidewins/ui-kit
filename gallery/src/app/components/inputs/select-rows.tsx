import { GlassSurface } from "@/components/GlassSurface";
import { View } from "@/components/ui";
import { CheckRow } from "@/components/onboarding/CheckRow";
import { SelectRow } from "@/components/onboarding/SelectRow";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GlassGroup } from "@/components/ui/GlassGroup";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { Chip } from "@/components/ui/Chip";
import { VoidOptionRow, VoidPickerRow } from "@/compare/select/VoidRows";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image } from "expo-image";
import { Bike, Car, Footprints } from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";

const OPTIONS = [
  { id: "bike", label: "Bicycle", description: "No licence needed", icon: Bike },
  { id: "car", label: "Car", description: "Licence and insurance", icon: Car },
  { id: "foot", label: "On foot", description: "City centre only", icon: Footprints },
];

const GLASS = { marginHorizontal: 16, borderRadius: 24, borderCurve: "continuous" as const, overflow: "hidden" as const };

// The single-choice rows left after David's 15 Oct pass, same data in each.
export default function CompareSelect() {
  const colors = useThemeColors();
  const [sel, setSel] = useState("bike");
  const [agreed, setAgreed] = useState([true, false]);
  const icon = (o: (typeof OPTIONS)[number]) => <o.icon size={20} strokeWidth={1.8} color={colors.muted} />;

  const selectRows = OPTIONS.map((o, i) => (
    <SelectRow key={o.id} icon={o.icon} label={o.label} description={o.description} selected={sel === o.id} isLast={i === OPTIONS.length - 1} onPress={() => setSel(o.id)} />
  ));

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle>A. SelectRow (SELLERS + RIDERS merged) on Liquid Glass</SectionTitle>
      <GlassSurface style={GLASS}>{selectRows}</GlassSurface>

      <SectionTitle>A. Same, glass over a photo</SectionTitle>
      <View style={{ marginHorizontal: 16, borderRadius: 24, borderCurve: "continuous", overflow: "hidden" }}>
        <Image source={require("@/assets/images/glass-bg.jpeg")} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" />
        <View style={{ padding: 16 }}>
          <GlassSurface style={{ borderRadius: 20, borderCurve: "continuous", overflow: "hidden" }}>{selectRows}</GlassSurface>
        </View>
      </View>

      <SectionTitle>A. GlassGroup (glass; grey card on phones without it)</SectionTitle>
      <GlassGroup style={{ marginHorizontal: 16 }}>{selectRows}</GlassGroup>

      <SectionTitle inset={32}>C. VOID picker row (dropoff options)</SectionTitle>
      <SettingsGroup>
        {OPTIONS.map((o, i) => (
          <VoidPickerRow key={o.id} label={o.label} description={o.description} isSelected={sel === o.id} isLast={i === OPTIONS.length - 1} onPress={() => setSel(o.id)} />
        ))}
      </SettingsGroup>

      <SectionTitle inset={32}>C2. VOID picker row with an icon</SectionTitle>
      <SettingsGroup>
        {OPTIONS.map((o, i) => (
          <VoidPickerRow key={o.id} label={o.label} description={o.description} isSelected={sel === o.id} isLast={i === OPTIONS.length - 1} onPress={() => setSel(o.id)} leading={icon(o)} />
        ))}
      </SettingsGroup>

      <SectionTitle inset={32}>D. VOID option row with icon (appearance)</SectionTitle>
      <SettingsGroup>
        {OPTIONS.map((o, i) => (
          <VoidOptionRow key={o.id} label={o.label} selected={sel === o.id} isLast={i === OPTIONS.length - 1} onPress={() => setSel(o.id)} leading={icon(o)} />
        ))}
      </SettingsGroup>

      <SectionTitle>F. Chip (kit): glass, solid when selected</SectionTitle>
      <View style={{ paddingHorizontal: 16, flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {OPTIONS.map((o) => (
          <Chip key={o.id} label={o.label} icon={o.icon} selected={sel === o.id} onPress={() => setSel(o.id)} />
        ))}
      </View>

      <SectionTitle>F. Same chips over a photo</SectionTitle>
      <View style={{ marginHorizontal: 16, borderRadius: 24, borderCurve: "continuous", overflow: "hidden" }}>
        <Image source={require("@/assets/images/glass-bg.jpeg")} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} contentFit="cover" />
        <View style={{ padding: 16, flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {OPTIONS.map((o) => (
            <Chip key={o.id} label={o.label} icon={o.icon} selected={sel === o.id} onPress={() => setSel(o.id)} />
          ))}
        </View>
      </View>

      <SectionTitle inset={32}>G. CheckRow (agree to statements)</SectionTitle>
      <SettingsGroup>
        {["I have valid insurance for deliveries", "I'm over 18 and allowed to work in Ireland"].map((t, i) => (
          <CheckRow key={t} text={t} checked={agreed[i]} isLast={i === 1} onPress={() => setAgreed((a) => a.map((v, j) => (j === i ? !v : v)))} />
        ))}
      </SettingsGroup>
    </ScrollView>
  );
}
