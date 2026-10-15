import { View } from "@/components/ui";
import { SelectRow } from "@/components/onboarding/SelectRow";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { CheckRow } from "@/compare/select/RidersCheckRow";
import { LargeMultiSelect } from "@/compare/select/RidersLargeMultiSelect";
import { RidersSelectRow } from "@/compare/select/RidersSelectRow";
import { VoidOptionRow, VoidPickerRow, VoidSourceChip } from "@/compare/select/VoidRows";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Bike, Car, Footprints } from "lucide-react-native";
import { useState } from "react";
import { ScrollView } from "react-native";

const OPTIONS = [
  { id: "bike", label: "Bicycle", description: "No licence needed", icon: Bike, ion: "bicycle-outline" as const },
  { id: "car", label: "Car", description: "Licence and insurance", icon: Car, ion: "car-outline" as const },
  { id: "foot", label: "On foot", description: "City centre only", icon: Footprints, ion: "walk-outline" as const },
];

// Every single-choice row in the six apps, same data, so they can be compared.
export default function CompareSelect() {
  const colors = useThemeColors();
  const [sel, setSel] = useState("bike");
  const [multi, setMulti] = useState<string[]>(["bike"]);
  const [agreed, setAgreed] = useState([true, false]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle inset={32}>A. SELLERS SelectRow (kit now)</SectionTitle>
      <SettingsGroup>
        {OPTIONS.map((o, i) => (
          <SelectRow key={o.id} icon={o.icon} label={o.label} description={o.description} selected={sel === o.id} isLast={i === OPTIONS.length - 1} onPress={() => setSel(o.id)} />
        ))}
      </SettingsGroup>

      <SectionTitle inset={32}>B. RIDERS SelectRow (onboarding)</SectionTitle>
      <SettingsGroup>
        {OPTIONS.map((o, i) => (
          <RidersSelectRow key={o.id} icon={o.icon} label={o.label} description={o.description} selected={sel === o.id} isLast={i === OPTIONS.length - 1} onPress={() => setSel(o.id)} />
        ))}
      </SettingsGroup>

      <SectionTitle inset={32}>C. VOID picker row (dropoff options)</SectionTitle>
      <SettingsGroup>
        {OPTIONS.map((o, i) => (
          <VoidPickerRow key={o.id} label={o.label} description={o.description} isSelected={sel === o.id} isLast={i === OPTIONS.length - 1} onPress={() => setSel(o.id)} />
        ))}
      </SettingsGroup>

      <SectionTitle inset={32}>D. VOID option row with icon (appearance)</SectionTitle>
      <SettingsGroup>
        {OPTIONS.map((o, i) => (
          <VoidOptionRow
            key={o.id}
            label={o.label}
            selected={sel === o.id}
            isLast={i === OPTIONS.length - 1}
            onPress={() => setSel(o.id)}
            leading={<o.icon size={20} strokeWidth={1.8} color={colors.muted} />}
          />
        ))}
      </SettingsGroup>

      <SectionTitle>E. RIDERS LargeMultiSelect (cards)</SectionTitle>
      <View style={{ paddingHorizontal: 16 }}>
        <LargeMultiSelect
          options={OPTIONS.map((o) => ({ id: o.id, title: o.label, description: o.description, icon: o.icon }))}
          selectedIds={multi}
          onSelectedIdsChange={setMulti}
        />
      </View>

      <SectionTitle>F. VOID chips (acquisition source)</SectionTitle>
      <View style={{ paddingHorizontal: 16, flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {OPTIONS.map((o) => (
          <VoidSourceChip key={o.id} label={o.label} icon={o.ion} active={sel === o.id} disabled={false} onPress={() => setSel(o.id)} />
        ))}
      </View>

      <SectionTitle inset={32}>G. RIDERS CheckRow (agree to statements)</SectionTitle>
      <SettingsGroup>
        {["I have valid insurance for deliveries", "I'm over 18 and allowed to work in Ireland"].map((t, i) => (
          <CheckRow key={t} text={t} checked={agreed[i]} isLast={i === 1} onPress={() => setAgreed((a) => a.map((v, j) => (j === i ? !v : v)))} />
        ))}
      </SettingsGroup>
    </ScrollView>
  );
}
