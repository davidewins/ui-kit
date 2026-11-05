// Gallery-only: a compartment's own page, listing everything in it.
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { entriesIn, hrefOf } from "@/gallery/catalog";
import type { Href } from "expo-router";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CompartmentIndex({ id }: { id: string }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingTop: 8, paddingBottom: insets.bottom + 32 }}
    >
      <SettingsGroup>
        {entriesIn(id).map((e) => (
          <SettingsRow key={e.route} label={e.title} Icon={e.Icon} href={hrefOf(e) as Href} navigates />
        ))}
      </SettingsGroup>
    </ScrollView>
  );
}
