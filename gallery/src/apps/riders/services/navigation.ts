import { Linking, Platform } from "react-native";
import Logger from "@/lib/Logger";

type NavigationApp = "google_maps" | "waze" | "apple_maps";

export function openNavigationApp(
  lat: number,
  lng: number,
  label?: string,
  preferredApp: NavigationApp = "google_maps",
) {
  const encodedLabel = label ? encodeURIComponent(label) : "";

  const urls: Record<NavigationApp, string> = {
    google_maps: Platform.select({
      ios: `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`,
      android: `google.navigation:q=${lat},${lng}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    })!,
    waze: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
    apple_maps: `maps://app?daddr=${lat},${lng}&dirflg=d`,
  };

  const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const tryOpen = async () => {
    const url = urls[preferredApp];

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return;
      }
    } catch (e) {
      Logger.log(`Could not open ${preferredApp}:`, e);
    }

    // Fallback: try Google Maps web
    try {
      await Linking.openURL(fallbackUrl);
    } catch (e) {
      Logger.error("Could not open any navigation app:", e);
    }
  };

  tryOpen();
}

export function openNavigationPicker(lat: number, lng: number, label?: string) {
  // On iOS, try Apple Maps first since it's always available
  if (Platform.OS === "ios") {
    openNavigationApp(lat, lng, label, "apple_maps");
  } else {
    openNavigationApp(lat, lng, label, "google_maps");
  }
}
