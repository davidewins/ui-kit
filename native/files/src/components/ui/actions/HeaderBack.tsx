// The back button for the first screen of a stack that was pushed from
// another stack (Account, Products, Customers... opened from Today). The
// native back button only shows when the stack it sits in has history, and a
// stack's first screen has none, so useStackScreenOptions puts this there and
// nowhere else. Every other screen keeps the native one. Drawn like the
// native one: SF Symbol chevron.backward in tint, and iOS 26 draws the glass.
// On Android it is the Material arrow with the round ripple, the same as the
// native back on every other Android screen (David, 19 Nov: the iOS chevron
// on Android "looks like shit"). David, 15 Nov: "this should be FUCKING
// STANDARDISED".
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { ArrowLeft } from "lucide-react-native";
import { Platform, Pressable } from "react-native";

export function HeaderBack() {
  const colors = useThemeColors();
  if (Platform.OS === "android") {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Navigate up"
        onPress={() => router.back()}
        android_ripple={{ color: colors.border, borderless: true, radius: 20 }}
        style={{ width: 40, height: 40, marginLeft: -8, marginRight: 8, alignItems: "center", justifyContent: "center" }}
      >
        <ArrowLeft size={24} strokeWidth={2} color={colors.tint} />
      </Pressable>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        router.back();
      }}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={({ pressed }) => ({
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
        opacity: pressed ? 0.4 : 1,
      })}
    >
      <SymbolView name="chevron.backward" size={20} weight="semibold" tintColor={colors.tint} resizeMode="scaleAspectFit" />
    </Pressable>
  );
}
