// The two @expo/ui hosts, themed for ZESTY. Every SwiftUI or Jetpack Compose
// view in an app sits in one of these, so it follows the app's light / dark
// mode and the black and white look instead of system blue (iOS) or the
// Material purple palette (Android).
//
//   <SwiftHost matchContents>…SwiftUI views…</SwiftHost>      iOS only
//   <ComposeHost matchContents>…Compose views…</ComposeHost>  Android only
//
// Never render a SwiftHost on Android or a ComposeHost on iOS: branch on
// Platform.OS first. Hosts can't nest; one per native island.
import { useThemeColors } from "@/hooks/useThemeColors";
import {
  Host as ComposeUIHost,
  type HostProps as ComposeUIHostProps,
  type MaterialColors,
} from "@expo/ui/jetpack-compose";
import { Host as SwiftUIHost, type HostProps as SwiftUIHostProps } from "@expo/ui/swift-ui";
import { tint } from "@expo/ui/swift-ui/modifiers";
import { useMemo } from "react";
import { useColorScheme } from "react-native";

type Hex = `#${string}`;

export function SwiftHost({ modifiers = [], ...props }: SwiftUIHostProps) {
  const colors = useThemeColors();
  return <SwiftUIHost {...props} modifiers={[tint(colors.text), ...modifiers]} />;
}

/** Material 3 roles mapped onto the kit tokens: black and white, red for errors. */
export function useComposeColors(): Partial<MaterialColors> {
  const c = useThemeColors();
  return useMemo(() => {
    const h = (v: string) => v as Hex;
    return {
      primary: h(c.text),
      onPrimary: h(c.background),
      primaryContainer: h(c.secondaryBackground),
      onPrimaryContainer: h(c.text),
      inversePrimary: h(c.background),
      secondary: h(c.text),
      onSecondary: h(c.background),
      secondaryContainer: h(c.secondaryBackground),
      onSecondaryContainer: h(c.text),
      tertiary: h(c.text),
      onTertiary: h(c.background),
      tertiaryContainer: h(c.secondaryBackground),
      onTertiaryContainer: h(c.text),
      background: h(c.background),
      onBackground: h(c.text),
      surface: h(c.background),
      onSurface: h(c.text),
      surfaceVariant: h(c.secondaryBackground),
      onSurfaceVariant: h(c.muted),
      surfaceTint: h(c.background),
      inverseSurface: h(c.text),
      inverseOnSurface: h(c.background),
      error: h(c.error),
      onError: "#ffffff",
      errorContainer: h(c.errorBg),
      onErrorContainer: h(c.errorText),
      outline: h(c.muted),
      outlineVariant: h(c.border),
      scrim: "#000000",
      surfaceBright: h(c.background),
      surfaceDim: h(c.secondaryBackground),
      surfaceContainerLowest: h(c.background),
      surfaceContainerLow: h(c.surface),
      surfaceContainer: h(c.surface),
      surfaceContainerHigh: h(c.surface),
      surfaceContainerHighest: h(c.secondaryBackground),
    };
  }, [c]);
}

export function ComposeHost(props: ComposeUIHostProps) {
  const scheme = useColorScheme();
  const colorOverrides = useComposeColors();
  return <ComposeUIHost colorScheme={scheme ?? undefined} colorOverrides={colorOverrides} {...props} />;
}
