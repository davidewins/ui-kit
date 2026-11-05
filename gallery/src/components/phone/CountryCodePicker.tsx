import { Text } from "@/components/ui";
import { usePhoneCountryStore } from "@/context/store/phoneCountryStore";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { ChevronDown } from "lucide-react-native";
import React, { FC, useEffect } from "react";
import { Pressable } from "react-native";
import { COUNTRIES, Country, flagEmoji } from "./countries";

type Props = {
  country: Country;
  onChange: (country: Country) => void;
};

/**
 * Compact flag + dial-code pill. Tapping opens the searchable country-code
 * modal route; the selection comes back via phoneCountryStore (mirrors the
 * app's modal-route + store pattern).
 */
export const CountryCodePicker: FC<Props> = ({ country, onChange }) => {
  const colors = useThemeColors();
  const selectedIso2 = usePhoneCountryStore((s) => s.selectedIso2);
  const clear = usePhoneCountryStore((s) => s.clear);

  // Apply a selection returned from the picker modal, then clear it so it
  // isn't re-applied on the next mount.
  useEffect(() => {
    if (!selectedIso2) return;
    const picked = COUNTRIES.find((c) => c.iso2 === selectedIso2);
    if (picked) onChange(picked);
    clear();
  }, [selectedIso2]);

  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync();
        router.push({
          pathname: "/screens/account/country-code",
          params: { current: country.iso2 },
        });
      }}
      className="flex-row items-center"
      accessibilityRole="button"
      accessibilityLabel={`Country: ${country.name}, +${country.dialCode}. Tap to change.`}
    >
      <Text style={{ fontSize: 20 }}>{flagEmoji(country.iso2)}</Text>
      <Text weight="medium" className="text-base ml-1.5">
        +{country.dialCode}
      </Text>
      <ChevronDown
        size={14}
        color={colors.muted}
        strokeWidth={2.4}
        style={{ marginLeft: 2 }}
      />
    </Pressable>
  );
};
