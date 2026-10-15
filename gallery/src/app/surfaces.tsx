import { Card, Divider, Text, View } from "@/components/ui";
import { GlassSurface } from "@/components/GlassSurface";
import { Sparkline } from "@/components/analytics/Sparkline";
import { WizardProgress } from "@/components/onboarding/WizardProgress";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ScrollView, useWindowDimensions } from "react-native";

const SERIES = [12, 18, 15, 22, 19, 28, 26, 31, 29, 36, 34, 41];

export default function Surfaces() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const pad = { paddingHorizontal: 16, gap: 12 };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle>Card</SectionTitle>
      <View style={pad}>
        <Card>
          <Text weight="semibold">Card</Text>
          <Text className="text-muted">Grouped card fill on the page background.</Text>
        </Card>
      </View>

      <SectionTitle>GlassSurface</SectionTitle>
      <View style={pad}>
        <GlassSurface style={{ borderRadius: 24, overflow: "hidden", padding: 16 }}>
          <Text weight="semibold">Liquid Glass</Text>
          <Text className="text-muted">expo-glass-effect, BlurView fallback.</Text>
        </GlassSurface>
      </View>

      <SectionTitle>Sparkline</SectionTitle>
      <View style={pad}>
        <Sparkline values={SERIES} width={width - 32} height={40} color={colors.text} />
        <Sparkline values={SERIES} width={width - 32} height={40} color={colors.success} />
      </View>

      <SectionTitle>WizardProgress</SectionTitle>
      <View style={pad}>
        <WizardProgress step={2} total={5} />
        <WizardProgress step={1} total={10} phase="Verification" />
      </View>

      <SectionTitle>Divider</SectionTitle>
      <View style={pad}>
        <Text>Above</Text>
        <Divider />
        <Text>Below</Text>
      </View>
    </ScrollView>
  );
}
