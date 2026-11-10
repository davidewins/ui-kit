// Browser preview root (ZESTY_WEB=1, see app.config.js). Same fonts, theme
// and header as src/app/_layout.tsx, minus everything native-only.
import "../globals.css";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function PreviewLayout() {
  const colorScheme = useColorScheme();
  const colors = useThemeColors();
  const [loaded, error] = useFonts({
    "Geist-Regular": require("../assets/fonts/Geist/static/Geist-Regular.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist/static/Geist-Medium.ttf"),
    "Geist-SemiBold": require("../assets/fonts/Geist/static/Geist-SemiBold.ttf"),
    "Geist-Bold": require("../assets/fonts/Geist/static/Geist-Bold.ttf"),
  });
  if (!loaded && !error) return null;
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack
            screenOptions={{
              headerShadowVisible: false,
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.tint,
              headerTitleStyle: colors.headerTitleStyle,
              contentStyle: { backgroundColor: colors.background },
            }}
          />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
