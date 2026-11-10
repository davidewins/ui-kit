// Gallery-only: a compartment's own page, listing everything in it.
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
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
        {entriesIn(id).flatMap((e) =>
          e.states
            ? e.states.map((st) => (
                <SettingsRow key={`${e.route}-${st}`} label={e.title} trailing={st} Icon={e.Icon} href={hrefOf(e, st) as Href} navigates />
              ))
            : [<SettingsRow key={e.route} label={e.title} Icon={e.Icon} href={hrefOf(e) as Href} navigates />],
        )}
      </SettingsGroup>
    </ScrollView>
  );
}
