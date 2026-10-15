// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/Text.tsx. Edit it there and sync; local edits fail ui-kit:check.
import { useFontFamily } from "@/hooks/useFontFamily";
import React from "react";
import { Text as RNText, TextProps as RNTextProps } from "react-native";
import { withUniwind } from "uniwind";

const StyledText = withUniwind(RNText);

import type { FontWeight } from "@/hooks/useFontFamily";

interface TextProps extends RNTextProps {
  className?: string;
  children?: React.ReactNode;
  weight?: FontWeight;
}

export const Text: React.FC<TextProps> = ({
  style,
  weight = "regular",
  className = "",
  ...props
}) => {
  const fontFamily = useFontFamily();
  // Check if className already has a text color class (text-error, text-muted, etc.)
  // Match patterns like: text-error, text-muted, text-success, text-[#fff], etc.
  //
  // Arbitrary values are ambiguous: `text-[#fff]` is a colour but `text-[15px]`
  // is a font SIZE. Treating any `text-[` as a colour meant every element sized
  // with `text-[Npx]` never got the default `text-text` and rendered
  // black-on-black in dark mode (TAK-955 bug #1), so bracket values only count
  // as a colour when they actually look like one.
  const hasColorClass =
    /\btext-(?:error|muted|success|primary|secondary|tint|background|text|border|warning|info|destructive|on-variant|red|blue|green|yellow|orange|purple|pink|indigo|gray|black|white)\b/.test(
      className
    ) || /\btext-\[(?:#|rgb|hsl|var\()/.test(className);

  // If no color class is present, add the default text-text class
  const finalClassName = hasColorClass
    ? className
    : `${className} text-text`.trim();

  return (
    <StyledText
      {...props}
      className={finalClassName}
      style={[
        {
          fontFamily: fontFamily(weight),
        },
        style, // style prop takes final precedence
      ]}
    />
  );
};
