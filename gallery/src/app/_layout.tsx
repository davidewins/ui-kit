import "../globals.css";
import { Toaster } from "@/components/Toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useThemeColors } from "@/hooks/useThemeColors";
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
    contentStyle: { backgroundColor: colors.background },
  };
  const minimal = { headerBackButtonDisplayMode: "minimal" as const };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={screen}>
            <Stack.Screen name="index" options={{ title: "ZESTY" }} />
            <Stack.Screen name="colours" options={{ title: "Colours" }} />
            <Stack.Screen name="type" options={{ title: "Type" }} />
            <Stack.Screen name="buttons" options={{ title: "Buttons" }} />
            <Stack.Screen name="rows" options={{ title: "Settings rows" }} />
            <Stack.Screen name="inputs" options={{ title: "Inputs" }} />
            <Stack.Screen name="states" options={{ title: "Badges and toasts" }} />
            <Stack.Screen name="empty" options={{ title: "States" }} />
            <Stack.Screen name="surfaces" options={{ title: "Surfaces" }} />
            <Stack.Screen name="footer" options={{ title: "Sticky footer" }} />
            <Stack.Screen name="compare-select" options={{ title: "Select rows" }} />
            <Stack.Screen name="compare-status" options={{ title: "Status badges" }} />
            <Stack.Screen name="compare-sounds" options={{ title: "Toast sounds" }} />
            <Stack.Screen name="glass" options={{ title: "Liquid Glass" }} />
            <Stack.Screen name="native" options={{ title: "Store settings" }} />
            <Stack.Screen name="examples/list" options={{ title: "Orders" }} />
            <Stack.Screen name="examples/create" options={{ title: "New product", presentation: "modal", headerTransparent: false }} />
            <Stack.Screen name="examples/edit" options={{ title: "Edit product" }} />
            <Stack.Screen name="examples/detail" options={{ title: "" }} />
            {/* Real app pages (TAK-1491). Options copied from each app's layout. */}
            <Stack.Screen name="void/(auth)/index" options={{ headerShown: false }} />
            <Stack.Screen name="void/(auth)/email" options={{ ...minimal, title: "", headerTransparent: false, headerRight: undefined }} />
            <Stack.Screen name="void/(auth)/verify-otp" options={{ ...minimal, title: "", headerTransparent: false, headerRight: undefined }} />
            <Stack.Screen name="void/(protected)/orders/index" options={{ ...minimal, headerTitle: "Orders" }} />
            <Stack.Screen name="void/(protected)/orders/[id]/index" options={{ ...minimal, headerTitle: "Order", headerTransparent: false }} />
            <Stack.Screen name="void/(protected)/(tabs)/profile/notifications/index" options={{ ...minimal, headerTitle: "Notifications" }} />
            {/* SELLERS paints its header in the page colour, so these are opaque. */}
            <Stack.Screen name="sellers/(auth)/forgot-password" options={{ ...minimal, title: "", headerTransparent: false, headerRight: undefined }} />
            <Stack.Screen name="sellers/(aux)/gdpr" options={{ ...minimal, title: "GDPR", headerTransparent: false }} />
            <Stack.Screen name="sellers/(protected)/(tabs)/analytics/index" options={{ ...minimal, title: "Analytics", headerTransparent: false }} />
            <Stack.Screen name="sellers/(protected)/products/[id]/index" options={{ ...minimal, title: "", headerTransparent: false }} />
            <Stack.Screen name="sellers/(protected)/account/storefronts/index" options={{ ...minimal, title: "Storefronts", headerTransparent: false }} />
            <Stack.Screen name="riders/(protected)/profile/earnings/index" options={{ ...minimal, headerTitle: "Earnings" }} />
            <Stack.Screen name="riders/(protected)/delivery/[id]" options={{ ...minimal, headerTitle: "Active Delivery", headerTransparent: false }} />
            <Stack.Screen
              name="(protected)/profile/personal-info/country-code"
              options={{ presentation: "modal", headerTitle: "Country Code", headerTransparent: false }}
            />
          </Stack>
        </ThemeProvider>
        <StatusBar style="auto" />
        <Toaster />
      </GestureHandlerRootView>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
