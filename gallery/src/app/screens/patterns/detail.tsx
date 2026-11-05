import { Text, View } from "@/components/ui";
import { InsetFooter } from "@/components/onboarding/shells/InsetShell";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Clock, MapPin, SquarePen } from "lucide-react-native";
import { ScrollView } from "react-native";

// Recipe §3.8: detail / read screen. Content scrolls; the one main action sits
// in the sticky footer (InsetFooter), never mid-content.
export default function ExampleDetail() {
  const colors = useThemeColors();
  return (
    <>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ marginHorizontal: 16, height: 200, borderRadius: 24, borderCurve: "continuous", overflow: "hidden" }}>
          <Image source={require("@/assets/images/glass-bg.jpeg")} style={{ flex: 1 }} contentFit="cover" />
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 18, gap: 4 }}>
          <Text weight="semibold" style={{ fontSize: 24, letterSpacing: -0.5 }}>Chicken burger</Text>
          <Text weight="medium" style={{ fontSize: 15, color: colors.muted }}>Buttermilk chicken, slaw, pickles</Text>
          <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4, marginTop: 8, fontVariant: ["tabular-nums"] }}>€12.50</Text>
        </View>
        <SettingsGroup>
          <SettingsRow label="Ready in" Icon={Clock} trailing="15 min" />
          <SettingsRow label="Collect from" Icon={MapPin} trailing="Dublin 8" />
          <SettingsRow label="Edit product" Icon={SquarePen} navigates href="/screens/patterns/edit" />
        </SettingsGroup>
      </ScrollView>
      <InsetFooter primaryCta={{ label: "Add to basket  €12.50", onPress: () => Toast.success("Added to basket") }} />
    </>
  );
}
