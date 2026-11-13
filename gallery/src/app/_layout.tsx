import "../globals.css";
import { Toaster } from "@/components/Toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ENTRIES, NESTED_STACKS, PAGE_TYPES, SECTIONS } from "@/gallery/catalog";
import { isAnim } from "@/gallery/motion/native";
import { useThemeColors } from "@/hooks/useThemeColors";
import type { NativeStackNavigationOptions } from "expo-router";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

const minimal = { headerBackButtonDisplayMode: "minimal" as const };

// Real app pages (TAK-1491): options copied from each app's layout. SELLERS
// paints its header in the page colour, so its pages are opaque.
const SCREEN_OPTIONS: Record<string, NativeStackNavigationOptions> = {
  "screens/patterns/create": { presentation: "modal", headerTransparent: false },
  "screens/fitness/new-workout": { presentation: "modal", headerTransparent: false },
  "screens/bookings/new-booking": { presentation: "modal", headerTransparent: false },
  "screens/fitness/workout/[id]": { ...minimal, title: "" },
  "screens/shop/product/[id]": { ...minimal, title: "" },
  "screens/bookings/booking/[id]": { ...minimal },
  "screens/patterns/detail": { title: "" },
  "screens/sign-in/welcome": { headerShown: false },
  "screens/sign-in/email": { ...minimal, title: "", headerTransparent: false, headerRight: undefined },
  "screens/sign-in/verify-code": { ...minimal, title: "", headerTransparent: false, headerRight: undefined },
  "screens/sign-in/forgot-password": { ...minimal, title: "", headerTransparent: false, headerRight: undefined },
  "screens/ordering/orders": { ...minimal },
  "screens/ordering/order/[id]": { ...minimal, title: "Order", headerTransparent: false },
  "screens/account/notifications": { ...minimal },
  "screens/account/gdpr": { ...minimal, headerTransparent: false },
  "screens/account/country-code": { presentation: "modal", title: "Country Code", headerTransparent: false },
  "screens/selling/analytics": { ...minimal, headerTransparent: false },
  "screens/selling/product/[id]": { ...minimal, title: "", headerTransparent: false },
  "screens/selling/storefronts": { ...minimal, headerTransparent: false },
  "screens/delivering/earnings": { ...minimal },
  "screens/delivering/delivery/[id]": { ...minimal, title: "Active Delivery", headerTransparent: false },
};

// The src/screens pages: back chevron only, like any pushed page in the apps.
const NEW_SCREENS = new Set([
  "screens/calendar/agenda",
  "screens/calendar/day",
  "screens/calendar/month",
  "screens/calendar/team",
  "screens/calendar/week",
  "screens/fitness/progress",
  "screens/fitness/session",
  "screens/fitness/summary",
  "screens/fitness/today",
  "screens/money/balance",
  "screens/money/earnings",
  "screens/money/sales",
  "screens/money/spending",
  "screens/orders/compact",
  "screens/orders/list",
  "screens/orders/product-editorial",
  "screens/orders/product-gallery",
  "screens/orders/receipt",
  "screens/orders/track-live",
  "screens/orders/track-timeline",
  "screens/profile/plan",
  "screens/social/account-feed",
  "screens/social/account-insights",
  "screens/social/account-profile",
  "screens/social/activity",
  "screens/social/inbox",
  "screens/social/thread",
]);

// Page types: the root screenOptions above paint every page and give it a
// header. Sheets and overlays undo both, so the native sheet material (or the
// page underneath) shows through a transparent root and the copy carries the
// title instead.
const SEE_THROUGH = { headerShown: false, contentStyle: { backgroundColor: "transparent" } };
// formSheets keep their header title, like RIDERS' Report sheet; only the
// screen behind it is transparent so the iOS 26 sheet material shows.
const SHEET_SEE_THROUGH = { headerShown: true, contentStyle: { backgroundColor: "transparent" } };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  // Same Geist set as RIDERS' root layout.
  const [loaded, error] = useFonts({
    "Geist-Thin": require("../assets/fonts/Geist/static/Geist-Thin.ttf"),
    "Geist-ExtraLight": require("../assets/fonts/Geist/static/Geist-ExtraLight.ttf"),
    "Geist-Light": require("../assets/fonts/Geist/static/Geist-Light.ttf"),
    "Geist-Regular": require("../assets/fonts/Geist/static/Geist-Regular.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist/static/Geist-Medium.ttf"),
    "Geist-SemiBold": require("../assets/fonts/Geist/static/Geist-SemiBold.ttf"),
    "Geist-Bold": require("../assets/fonts/Geist/static/Geist-Bold.ttf"),
    "Geist-ExtraBold": require("../assets/fonts/Geist/static/Geist-ExtraBold.ttf"),
    "Geist-Black": require("../assets/fonts/Geist/static/Geist-Black.ttf"),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  if (!loaded && !error) return null;

  const screen = {
    headerShadowVisible: false,
    // RIDERS onboarding layout: transparent on iOS so the header blends with
    // the page; opaque on Android, where a transparent header lets the content
    // slide up under the title and the status bar.
    headerTransparent: Platform.OS === "ios",
    headerStyle: { backgroundColor: Platform.OS === "ios" ? "transparent" : colors.background },
    headerTintColor: colors.tint,
    headerTitleStyle: colors.headerTitleStyle,
    // iOS 26 pops a page on a swipe anywhere by default, so swiping the
    // calendar's month or week back a period left the calendar instead (as
    // TKVR's useStackOptions). The edge swipe still goes back.
    fullScreenGestureEnabled: false,
    contentStyle: { backgroundColor: colors.background },
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={screen}>
            <Stack.Screen name="index" options={{ title: "ZESTY" }} />
            {SECTIONS.map((sec) => (
              <Stack.Screen key={sec.route} name={sec.route} options={{ title: sec.title }} />
            ))}
            {ENTRIES.filter((e) => !NESTED_STACKS.some((n) => e.route.startsWith(`${n}/`))).map((e) => (
              <Stack.Screen key={e.route} name={e.route} options={{ title: e.header ?? e.title, ...(e.route in SCREEN_OPTIONS ? SCREEN_OPTIONS[e.route] : NEW_SCREENS.has(e.route) ? minimal : null) }} />
            ))}
            {NESTED_STACKS.map((n) => (
              // The lab pops its own pages; a native edge swipe would pop the
              // whole lab instead, so it is off here.
              <Stack.Screen key={n} name={n} options={{ headerShown: false, gestureEnabled: false }} />
            ))}
            <Stack.Screen name="screens/motion/playlist/[id]" options={{ ...minimal, title: "" }} />
            <Stack.Screen
              name="screens/motion/push-target"
              options={({ route }) => {
                const anim = (route.params as { anim?: string } | undefined)?.anim;
                return { ...minimal, title: "", animation: isAnim(anim) ? anim : "default", animationDuration: anim === "fade" ? 200 : undefined };
              }}
            />
            <Stack.Screen name={PAGE_TYPES.card.route} options={{ title: PAGE_TYPES.card.title, presentation: "card" }} />
            <Stack.Screen name={PAGE_TYPES.modal.route} options={{ title: PAGE_TYPES.modal.title, presentation: "modal" }} />
            <Stack.Screen name={PAGE_TYPES.formSheet.route} options={{ ...SHEET_SEE_THROUGH, title: PAGE_TYPES.formSheet.title, presentation: "formSheet", sheetGrabberVisible: true, sheetAllowedDetents: [0.3, 0.5, 1], sheetInitialDetentIndex: 0 }} />
            <Stack.Screen name={PAGE_TYPES.fittedFormSheet.route} options={{ ...SHEET_SEE_THROUGH, title: PAGE_TYPES.fittedFormSheet.title, presentation: "formSheet", sheetGrabberVisible: true, sheetAllowedDetents: "fitToContents" }} />
            <Stack.Screen name={PAGE_TYPES.pageSheet.route} options={{ title: PAGE_TYPES.pageSheet.title, presentation: "pageSheet" }} />
            <Stack.Screen name={PAGE_TYPES.fullScreenModal.route} options={{ title: PAGE_TYPES.fullScreenModal.title, presentation: "fullScreenModal" }} />
            <Stack.Screen name={PAGE_TYPES.transparentModal.route} options={{ ...SEE_THROUGH, title: PAGE_TYPES.transparentModal.title, presentation: "transparentModal", animation: "fade" }} />
            <Stack.Screen name={PAGE_TYPES.containedModal.route} options={{ title: PAGE_TYPES.containedModal.title, presentation: "containedModal" }} />
            <Stack.Screen name={PAGE_TYPES.containedTransparentModal.route} options={{ ...SEE_THROUGH, title: PAGE_TYPES.containedTransparentModal.title, presentation: "containedTransparentModal", animation: "fade" }} />
          </Stack>
        </ThemeProvider>
        <StatusBar style="auto" />
        <Toaster />
      </GestureHandlerRootView>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
