// Phone number field in the same filled card as ui/Input: country pill on the
// left, number on the right, tint ring on focus, error underneath.
import { Text, View } from "@/components/ui";
import { useFontFamily } from "@/hooks/useFontFamily";
import { useThemeColors } from "@/hooks/useThemeColors";
import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { CountryCodePicker } from "./CountryCodePicker";
import type { Country } from "./countries";

type Props = {
  country: Country;
  onCountryChange: (country: Country) => void;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  autoFocus?: boolean;
};

export function PhoneInput({
  country,
  onCountryChange,
  value,
  onChangeText,
  error,
  autoFocus,
}: Props) {
  const colors = useThemeColors();
  const fontFamily = useFontFamily();
  const [isFocused, setIsFocused] = useState(false);
  const ringColor = error
    ? colors.error
    : isFocused
      ? colors.tint
      : colors.border;

  return (
    <View>
      <View
        className="rounded-2xl flex-row items-center"
        style={{
          backgroundColor: colors.card,
          borderCurve: "continuous",
          borderWidth: 0.75,
          borderColor: ringColor,
          shadowColor: ringColor,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          minHeight: 48,
          paddingLeft: 16,
        }}
      >
        <CountryCodePicker country={country} onChange={onCountryChange} />
        <View
          style={{
            width: StyleSheet.hairlineWidth,
            alignSelf: "stretch",
            marginVertical: 12,
            marginLeft: 12,
            backgroundColor: colors.border,
          }}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="83 456 7890"
          placeholderTextColor={colors.muted}
          selectionColor={colors.tint}
          inputMode="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          autoCorrect={false}
          autoCapitalize="none"
          autoFocus={autoFocus}
          maxLength={10}
          accessibilityLabel="Phone number"
          accessibilityHint={error}
          style={{
            flex: 1,
            paddingHorizontal: 12,
            paddingVertical: 12,
            fontFamily: fontFamily("regular"),
            fontSize: 17,
            color: colors.text,
          }}
        />
      </View>
      {error ? (
        <Text
          className="text-xs mt-1.5 px-1"
          style={{ color: colors.error }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
