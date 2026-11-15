// ZESTY headers, one source for every app (David, 15 Nov: headers kept
// changing app by app). Apps never set header styling themselves; ui-kit
// check fails on raw header keys outside the kit.
//
//   <ThemeProvider value={useNavTheme()}>          root layout, once
//   <Stack screenOptions={useStackScreenOptions()}> every stack
//   <Stack.Screen options={{ title, ...LARGE_TITLE }} />  tab roots, Terms, Privacy, GDPR
//   <Stack.Screen options={{ ...SEE_THROUGH }} />   pages whose content runs under the bar
//   <Stack.Screen options={{ ...OPAQUE }} />        pages with fixed content at the top
//
// iOS: the system bar with no background of its own, so it is transparent
// and large titles show (a headerStyle background hides them on iOS 26).
// Small-title bars take the nav theme's card colour, which useNavTheme sets to
// the page colour. Android paints the page colour (useThemeColors.headerStyle).
import { useThemeColors } from "@/hooks/useThemeColors";
import { DarkTheme, DefaultTheme, type Theme } from "expo-router";
import { useMemo } from "react";
import { Platform, useColorScheme } from "react-native";

export function useStackScreenOptions() {
  const colors = useThemeColors();
  return useMemo(
    () => ({
      headerBackButtonDisplayMode: "minimal" as const,
      headerStyle: colors.headerStyle ?? undefined,
      headerTintColor: colors.tint,
      headerTitleStyle: colors.headerTitleStyle,
      headerLargeTitleStyle: colors.headerLargeTitleStyle,
      headerShadowVisible: false,
      headerLargeTitleShadowVisible: false,
      // iOS 26 pops on a swipe anywhere by default, which steals sideways
      // swipes from calendars, charts and tabs. Edge swipe still goes back.
      fullScreenGestureEnabled: false,
    }),
    [colors.headerStyle, colors.tint, colors.headerTitleStyle, colors.headerLargeTitleStyle],
  );
}

/** Large title: tab roots and the legal screens. The page's ScrollView must be
 * its first child with contentInsetAdjustmentBehavior="automatic". */
export const LARGE_TITLE = {
  headerLargeTitle: true,
  headerLargeTitleShadowVisible: false,
} as const;

/** Content scrolls under a see-through Liquid Glass bar (iOS only). */
export const SEE_THROUGH = {
  headerTransparent: Platform.OS === "ios",
} as const;

/** Page-coloured bar. Expo SDK 58 makes a bar with no background see-through
 * glass, so a page with fixed content at the top (a search field, a segmented
 * control, a store row) takes this and nothing sits under the bar. On SDK 57
 * this is already how small-title bars draw. */
export const OPAQUE = {
  headerTransparent: false,
} as const;

/** Navigation theme with card and background on the page colour, so no bar
 * falls back to the stock grey card. */
export function useNavTheme(): Theme {
  const colors = useThemeColors();
  const scheme = useColorScheme();
  return useMemo(() => {
    const base = scheme === "dark" ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: { ...base.colors, card: colors.background, background: colors.background },
    };
  }, [scheme, colors.background]);
}
