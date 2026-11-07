// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/inputs/Input.tsx. Edit it there and sync; local edits fail ui-kit:check.
// RIDERS' filled-card Input (canonical SELLERS Option B, TAK-581): the whole
// rounded-2xl card block IS the field, focus = tint ring, error/hint below.
// VOID keeps its own sentence-case label with the required asterisk.
import { useFontFamily } from "@/hooks/useFontFamily";
import React, { useState } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from "react-native";
import { useCSSVariable, withUniwind } from "uniwind";
import { Text } from "../primitives/Text";
import { View } from "../primitives/View";

const StyledTextInput = withUniwind(RNTextInput);

interface InputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  containerClassName?: string;
  accessibilityLabel?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  required = false,
  className = "",
  containerClassName = "",
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const fontFamily = useFontFamily();
  const textColor = useCSSVariable("--color-text") as string;
  const cardColor = useCSSVariable("--color-card") as string;
  const tintColor = useCSSVariable("--color-tint") as string;
  const errorColor = useCSSVariable("--color-error") as string;
  const mutedColor = useCSSVariable("--color-muted") as string;
  const borderColor = useCSSVariable("--color-border") as string;

  const ringColor = error ? errorColor : isFocused ? tintColor : borderColor;

  return (
    <View className={containerClassName}>
      {label ? (
        <Text weight="medium" className="text-[13px] text-muted mb-1.5 px-1">
          {label}
          {required && (
            <Text weight="medium" className="text-error">
              {" "}
              *
            </Text>
          )}
        </Text>
      ) : null}

      <View
        className="rounded-2xl"
        style={{
          backgroundColor: cardColor,
          borderCurve: "continuous",
          borderWidth: 0.75,
          shadowColor: ringColor,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          borderColor: ringColor,
        }}
      >
        <StyledTextInput
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={className}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityHint={accessibilityHint ?? error ?? hint}
          accessibilityState={accessibilityState}
          style={{
            paddingHorizontal: 16,
            // Single line: fixed height, no vertical padding, so iOS centres
            // the line from the font's metrics. With padding, Geist's text and
            // placeholder sat low in the box (David, 6 Nov).
            ...(props.multiline
              ? { paddingVertical: 12, minHeight: 100 }
              : { paddingVertical: 0, height: 48 }),
            fontFamily: fontFamily("regular"),
            fontSize: 17,
            color: textColor,
            textAlignVertical: props.multiline ? "top" : "center",
          }}
          placeholderTextColor={mutedColor}
        />
      </View>

      {error ? (
        <Text className="text-xs mt-1.5 px-1" style={{ color: errorColor }}>
          {error}
        </Text>
      ) : hint ? (
        <Text className="text-xs mt-1.5 px-1 text-muted">{hint}</Text>
      ) : null}
    </View>
  );
};
