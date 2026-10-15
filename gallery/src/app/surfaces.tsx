import { Card, Divider, Text, View } from "@/components/ui";
import { GlassSurface } from "@/components/GlassSurface";
import { Sparkline } from "@/components/analytics/Sparkline";
import { WizardProgress } from "@/components/onboarding/WizardProgress";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useThemeColors } from "@/hooks/useThemeColors";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import type { ReactNode } from "react";
import { ScrollView, useWindowDimensions } from "react-native";

const SERIES = [12, 18, 15, 22, 19, 28, 26, 31, 29, 36, 34, 41];
const GLASS = { borderRadius: 24, borderCurve: "continuous" as const, overflow: "hidden" as const, padding: 16 };

/** A photo for the glass to sample, with the surface floating over it. */
function OverPhoto({ children }: { children: ReactNode }) {
  return (
    <View style={{ marginHorizontal: 16, borderRadius: 24, borderCurve: "continuous", overflow: "hidden" }}>
      <Image source={require("../assets/images/glass-bg.jpeg")} style={{ height: 200 }} contentFit="cover" />
      <View style={{ position: "absolute", left: 20, right: 20, bottom: 20 }}>{children}</View>
    </View>
  );
}

export default function Surfaces() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const pad = { paddingHorizontal: 16, gap: 12 };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 48 }}>
      <SectionTitle>GlassSurface (Liquid Glass, iOS 26)</SectionTitle>
      <OverPhoto>
        <GlassSurface style={GLASS}>
          <Text weight="semibold">Liquid Glass</Text>
          <Text className="text-muted">expo-glass-effect GlassView, regular.</Text>
        </GlassSurface>
      </OverPhoto>

      <SectionTitle>BlurView fallback (iOS before 26)</SectionTitle>
      <OverPhoto>
        {/* GlassSurface's own fallback branch, forced so it shows on iOS 26 too. */}
        <BlurView intensity={28} tint="systemMaterial" style={GLASS}>
          <Text weight="semibold">BlurView</Text>
          <Text className="text-muted">systemMaterial, intensity 28.</Text>
        </BlurView>
      </OverPhoto>

      <SectionTitle>GlassSurface with fill</SectionTitle>
      <OverPhoto>
        <GlassSurface style={GLASS} fill>
          <Text weight="semibold">Glass + fill 0.72</Text>
          <Text className="text-muted">For glass over busy content.</Text>
        </GlassSurface>
      </OverPhoto>

      <SectionTitle>Card</SectionTitle>
      <View style={pad}>
        <Card>
          <Text weight="semibold">Card</Text>
          <Text className="text-muted">Same fill and radius as SettingsGroup.</Text>
        </Card>
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
