import { GraySurface } from "@/components/GraySurface";
import { COUNTRIES, flagEmoji } from "@/components/phone/countries";
import { Text, TextInput, View } from "@/components/ui";
import { usePhoneCountryStore } from "@/context/store/phoneCountryStore";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { Check, Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Searchable country-code picker, presented as a modal route (see
 * (modals)/_layout). The chosen ISO2 is handed back to the phone form via
 * phoneCountryStore before dismissing.
 */
export default function CountryCodeModal() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { current } = useLocalSearchParams<{ current?: string }>();
  const select = usePhoneCountryStore((s) => s.select);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.iso2.toLowerCase() === q,
    );
  }, [query]);

  const handleSelect = (iso2: string) => {
    Haptics.selectionAsync();
    select(iso2);
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 pt-3 pb-3">
        <GraySurface style={styles.searchCard}>
          <View className="flex-row items-center px-3.5 py-2.5">
            <Search size={16} color={colors.muted} />
            <TextInput
              className="flex-1 ml-2 text-base text-foreground"
              placeholder="Search countries"
              placeholderTextColor={colors.muted}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              autoCapitalize="none"
              autoFocus
            />
          </View>
        </GraySurface>
      </View>

      <FlatList
        data={results}
        keyExtractor={(c) => c.iso2}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        renderItem={({ item }) => {
          const selected = item.iso2 === current;
          return (
            <Pressable
              onPress={() => handleSelect(item.iso2)}
              className="flex-row items-center px-4 py-3"
              accessibilityRole="button"
              accessibilityLabel={`${item.name}, +${item.dialCode}`}
              accessibilityState={{ selected }}
            >
              <Text style={{ fontSize: 20 }}>{flagEmoji(item.iso2)}</Text>
              <Text
                weight={selected ? "semibold" : "medium"}
                className="flex-1 text-base ml-3"
              >
                {item.name}
              </Text>
              <Text className="text-sm text-muted mr-2">+{item.dialCode}</Text>
              {selected ? (
                <Check size={16} color={colors.tint} strokeWidth={2.6} />
              ) : null}
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: colors.separator,
              marginLeft: 52,
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchCard: {
    borderRadius: 14,
    borderCurve: "continuous",
    overflow: "hidden",
  },
});
