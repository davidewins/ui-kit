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
//
// Back: the native button wherever the stack has history. A stack's first
// screen has none, so when that stack was pushed from another stack its first
// screen gets components/ui/actions/HeaderBack, from here. A stack shown as a
// modal closes with a swipe down, so it says { modal: true } and gets none.
// Layouts never set a back button of their own; ui-kit check fails on one.
import { HeaderBack } from "@/components/ui/actions/HeaderBack";
import { useThemeColors } from "@/hooks/useThemeColors";
import { DarkTheme, DefaultTheme, useNavigation, useRoute, type Theme } from "expo-router";
import { createElement, useMemo } from "react";
import { Platform, useColorScheme } from "react-native";

const headerBack = () => createElement(HeaderBack);

/** The screen this stack sits in, or undefined for the app's root stack. */
function useHostRoute(): { key: string; state?: { index?: number; routes: unknown[] } } | undefined {
  try {
    return useRoute();
  } catch {
    return undefined;
  }
}

/** True while this stack shows its first screen and the stack around it can
 * pop back from it: the one case the native back button is missing. */
function useNeedsBack(modal: boolean) {
  const host = useHostRoute();
  const navigation = useNavigation();
  if (!host || modal) return false;
  const inner = host.state;
  const index = inner ? (inner.index ?? inner.routes.length - 1) : 0;
  if (index !== 0) return false;
  const outer = navigation.getState() as { type?: string; routes: { key: string }[] } | undefined;
  if (outer?.type !== "stack") return false;
  return outer.routes.findIndex((r) => r.key === host.key) > 0;
}

export function useStackScreenOptions({ modal = false }: { modal?: boolean } = {}) {
  const colors = useThemeColors();
  const needsBack = useNeedsBack(modal);
  return useMemo(
    () => ({
      ...(needsBack ? { headerLeft: headerBack } : null),
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
    [needsBack, colors.headerStyle, colors.tint, colors.headerTitleStyle, colors.headerLargeTitleStyle],
  );
}

/** The first screen of a stack that is always pushed onto another (VOID's
 * Account, pushed from the Home header): the kit HeaderBack, set on that one
 * Stack.Screen. Use it where the automatic check in useStackScreenOptions
 * misses (David, 19 Nov: VOID Account lost its back button). Screens pushed
 * after it keep the native back.
 *   <Stack.Screen name="index" options={{ title: "Account", ...PUSHED_ROOT }} /> */
export const PUSHED_ROOT = { headerLeft: headerBack } as const;

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
