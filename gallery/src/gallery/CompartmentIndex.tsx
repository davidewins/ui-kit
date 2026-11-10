// Gallery-only: a compartment's own page, listing everything in it. One row
// per page; a page with states (empty, loading, sold out...) opens in its
// first state on tap, and press and hold lists the others in a native menu.
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { entriesIn, hrefOf } from "@/gallery/catalog";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { type Href, router } from "expo-router";
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
        {entriesIn(id).map((e) =>
          e.states ? (
            // Kit ContextMenu: tap opens the first state, press and hold lists
            // every state. The row itself has no action, so nothing doubles up.
            <ContextMenu
              key={e.route}
              onPress={() => router.push(hrefOf(e) as Href)}
              actions={e.states.map((st) => ({ label: st, onPress: () => router.push(hrefOf(e, st) as Href) }))}
            >
              <SettingsRow label={e.title} Icon={e.Icon} trailing={`${e.states.length} states`} navigates />
            </ContextMenu>
          ) : (
            <SettingsRow key={e.route} label={e.title} Icon={e.Icon} href={hrefOf(e) as Href} navigates />
          ),
        )}
      </SettingsGroup>
    </ScrollView>
  );
}
