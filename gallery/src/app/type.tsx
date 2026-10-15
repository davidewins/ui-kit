import { Heading, Label, Text, View } from "@/components/ui";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { FontWeight } from "@/hooks/useFontFamily";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ScrollView } from "react-native";

const WEIGHTS: FontWeight[] = ["regular", "medium", "semibold", "bold"];

// Native UI spec §2.2 type roles, each rendered with the kit's Text.
export default function TypeScreen() {
  const colors = useThemeColors();
  const pad = { paddingHorizontal: 20, gap: 10 };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle>Heading</SectionTitle>
      <View style={pad}>
        <Heading level="h1">Heading h1</Heading>
        <Heading level="h2">Heading h2</Heading>
        <Heading level="h3">Heading h3</Heading>
        <Heading level="h4">Heading h4</Heading>
      </View>

      <SectionTitle>Roles</SectionTitle>
      <View style={pad}>
        <Text weight="semibold" style={{ fontSize: 32 }}>Large title 32</Text>
        <Text weight="medium" style={{ fontSize: 15, letterSpacing: -0.2 }}>Row label 15 medium</Text>
        <Text style={{ fontSize: 13, color: colors.muted }}>Row subtitle 13 muted</Text>
        <Text weight="semibold" style={{ fontSize: 18, letterSpacing: -0.4 }}>Identity title 18</Text>
        <Text style={{ fontSize: 15, lineHeight: 21 }}>Body 15/21. The quick brown fox jumps over the lazy dog.</Text>
        <Text style={{ fontSize: 12, color: colors.muted }}>Caption 12 muted</Text>
        <Text weight="bold" style={{ fontSize: 15, letterSpacing: -0.2 }}>Footer CTA 15 bold</Text>
        <Text style={{ fontSize: 40, letterSpacing: -1.2, fontVariant: ["tabular-nums"] }}>€1,284.50</Text>
        <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4, fontVariant: ["tabular-nums"] }}>KPI 21 · 128</Text>
      </View>

      <SectionTitle>Weights</SectionTitle>
      <View style={pad}>
        {WEIGHTS.map((w) => (
          <Text key={w} weight={w} style={{ fontSize: 17 }}>
            Geist {w}
          </Text>
        ))}
      </View>

      <SectionTitle>Label</SectionTitle>
      <View style={pad}>
        <Label>Field label</Label>
        <Label required>Required field label</Label>
      </View>
    </ScrollView>
  );
}
