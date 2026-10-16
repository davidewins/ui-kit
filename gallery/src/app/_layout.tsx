import "../globals.css";
import { toastConfig } from "@/components/CustomToast";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ToastManager from "toastify-react-native";

SplashScreen.preventAutoHideAsync().catch(() => {});

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
    headerTransparent: true,
    headerTintColor: colors.tint,
    headerTitleStyle: colors.headerTitleStyle,
    headerLargeTitleStyle: colors.headerLargeTitleStyle,
    contentStyle: { backgroundColor: colors.background },
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={screen}>
            <Stack.Screen name="index" options={{ title: "UI kit", headerLargeTitle: true }} />
            <Stack.Screen name="colours" options={{ title: "Colours" }} />
            <Stack.Screen name="type" options={{ title: "Type" }} />
            <Stack.Screen name="buttons" options={{ title: "Buttons" }} />
            <Stack.Screen name="rows" options={{ title: "Settings rows" }} />
            <Stack.Screen name="inputs" options={{ title: "Inputs" }} />
            <Stack.Screen name="states" options={{ title: "Badges and toasts" }} />
            <Stack.Screen name="empty" options={{ title: "Empty state" }} />
            <Stack.Screen name="empty-icon" options={{ title: "Empty state, icon" }} />
            <Stack.Screen name="empty-list" options={{ title: "Empty state, list" }} />
            <Stack.Screen name="error" options={{ title: "Error" }} />
            <Stack.Screen name="loading" options={{ title: "Loading" }} />
            <Stack.Screen name="surfaces" options={{ title: "Surfaces" }} />
            <Stack.Screen name="footer" options={{ title: "Sticky footer" }} />
            <Stack.Screen name="compare-select" options={{ title: "Select rows" }} />
            <Stack.Screen name="compare-status" options={{ title: "Status badges" }} />
            <Stack.Screen name="compare-buttons" options={{ title: "Buttons" }} />
            <Stack.Screen
              name="(protected)/profile/personal-info/country-code"
              options={{ presentation: "modal", headerTitle: "Country Code", headerTransparent: false }}
            />
          </Stack>
        </ThemeProvider>
        <StatusBar style="auto" />
        <ToastManager
          config={toastConfig}
          useModal={false}
          duration={3500}
          position="top"
          topOffset={0}
          minHeight={0}
          showProgressBar={false}
          showCloseIcon={false}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
