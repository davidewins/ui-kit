import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { SettingsGroup } from "@/components/ui/SettingsGroup";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { BottomSwitch } from "@/gallery/BottomSwitch";
import { SECTIONS, entriesIn, hrefOf, search, sectionById, sectionHref, type Kind } from "@/gallery/catalog";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Stack, type Href } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { Uniwind } from "uniwind";

const TABS = ["Foundations", "Components", "Screens"] as const;
const KINDS: Kind[] = ["foundations", "components", "screens"];
const APPEARANCES = ["system", "light", "dark"] as const;
const LABELS = ["Automatic", "Light", "Dark"];

// ZESTY home (David, 5 Nov): Foundations | Components | Screens at the bottom,
// each listing its compartments; the header search finds any page by name or
// by the @expo/ui / kit component it shows.
export default function Index() {
  const colors = useThemeColors();
  const [tab, setTab] = useState(1);
  const [query, setQuery] = useState("");
  const results = search(query);
  const kind = KINDS[tab];

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Search components and screens",
            hideWhenScrolling: false,
            autoCapitalize: "none",
            onChangeText: (e) => setQuery(e.nativeEvent.text),
            onCancelButtonPress: () => setQuery(""),
          },
        }}
      />
      {/* Appearance lives in the header "..." menu, not as a lone action row. */}
      <ActionMenu
        accessibilityLabel="Appearance"
        title="Appearance"
        actions={APPEARANCES.map((a, i) => ({
          label: LABELS[i],
          systemImage: a === "dark" ? "moon" : a === "light" ? "sun.max" : "circle.lefthalf.filled",
          onPress: () => Uniwind.setTheme(a),
        }))}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
      >
        {query.trim() ? (
          results.length > 0 ? (
            <SettingsGroup>
              {results.map((e) => (
                <SettingsRow
                  key={e.route}
                  label={e.title}
                  Icon={e.Icon}
                  trailing={sectionById(e.section).title}
                  href={hrefOf(e) as Href}
                  navigates
                />
              ))}
            </SettingsGroup>
          ) : (
            <Text weight="medium" style={{ fontSize: 15, color: colors.muted, paddingHorizontal: 20, paddingTop: 16 }}>
              Nothing in ZESTY matches "{query.trim()}". Try a component name like Menu or Gauge.
            </Text>
          )
        ) : kind === "foundations" ? (
          <SettingsGroup>
            {entriesIn("foundations").map((e) => (
              <SettingsRow key={e.route} label={e.title} Icon={e.Icon} href={hrefOf(e) as Href} navigates />
            ))}
          </SettingsGroup>
        ) : (
          <SettingsGroup>
            {SECTIONS.filter((sec) => sec.kind === kind).map((sec) => (
              <SettingsRow
                key={sec.id}
                label={sec.title}
                Icon={sec.Icon}
                trailing={String(entriesIn(sec.id).length)}
                href={sectionHref(sec) as Href}
                navigates
              />
            ))}
          </SettingsGroup>
        )}
      </ScrollView>
      {query.trim() ? null : (
        <BottomSwitch values={TABS} selectedIndex={tab} onChange={setTab} accessibilityLabel="Foundations, components or screens" />
      )}
    </View>
  );
}
