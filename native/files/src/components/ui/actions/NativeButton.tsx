// The small, low buttons: Apple's own SwiftUI Button through @expo/ui, in the
// iOS 26 glass styles, at SwiftUI's mini / small / regular control sizes.
// Use for compact in-content actions ("Add", "Edit", "Filter"), never for a
// screen's main action (that is the big Button / GlassButton at the bottom).
//
// primary = glassProminent tinted with the text colour (black pill, white
// label in light mode; inverted in dark). glass = clear glass pill.
// destructive = clear glass with the red destructive role.
// Android has no SwiftUI: it renders the kit Button at its smallest size.
import { useThemeColors } from "@/hooks/useThemeColors";
import { Button as SwiftButton, Host } from "@expo/ui/swift-ui";
import { buttonBorderShape, buttonStyle, controlSize, disabled as disabledModifier, tint } from "@expo/ui/swift-ui/modifiers";
import type { ComponentProps } from "react";
import { Platform } from "react-native";
import { Button } from "./Button";

export type NativeButtonTone = "primary" | "glass" | "destructive";
export type NativeButtonSize = "mini" | "small" | "regular";

export interface NativeButtonProps {
  label: string;
  onPress: () => void;
  /** SF Symbol shown before the label (iOS). */
  systemImage?: ComponentProps<typeof SwiftButton>["systemImage"];
  tone?: NativeButtonTone;
  size?: NativeButtonSize;
  disabled?: boolean;
}

export function NativeButton({
  label,
  onPress,
  systemImage,
  tone = "glass",
  size = "small",
  disabled = false,
}: NativeButtonProps) {
  const colors = useThemeColors();

  if (Platform.OS !== "ios") {
    return (
      <Button
        size="xs"
        variant={tone === "primary" ? "primary" : tone === "destructive" ? "danger" : "secondary"}
        onPress={onPress}
        disabled={disabled}
      >
        {label}
      </Button>
    );
  }

  return (
    <Host ignoreSafeArea="all" matchContents>
      <SwiftButton
        label={label}
        systemImage={systemImage}
        role={tone === "destructive" ? "destructive" : "default"}
        onPress={onPress}
        modifiers={[
          buttonStyle(tone === "primary" ? "glassProminent" : "glass"),
          buttonBorderShape("capsule"),
          controlSize(size),
          ...(tone === "primary" ? [tint(colors.text)] : []),
          disabledModifier(disabled),
        ]}
      />
    </Host>
  );
}
