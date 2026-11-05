// "Check for Updates": fetch and apply an EAS update, with a clear message in
// dev builds and Expo Go where expo-updates is off.
import Logger from "@/lib/Logger";
import * as Haptics from "expo-haptics";
import * as Updates from "expo-updates";
import { useState } from "react";
import { Toast } from "@/lib/toast";

export function useCheckForUpdates() {
  const [checking, setChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkForUpdates = async () => {
    try {
      setChecking(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // expo-updates throws in dev/Expo Go builds - mirror the startup guard in
      // _layout.tsx so we show a clear message instead of "Failed to check".
      if (__DEV__ || !Updates.isEnabled) {
        Toast.info("Updates aren't available in development builds.");
        return;
      }

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateAvailable(true);
        Toast.info("Update available! Downloading...");
        await Updates.fetchUpdateAsync();
        Toast.success("Update downloaded! Restarting...");
        await Updates.reloadAsync();
      } else {
        Toast.success("You're on the latest version!");
      }
    } catch (error) {
      Toast.error("Failed to check for updates");
      Logger.error("Update check failed:", error);
    } finally {
      setChecking(false);
    }
  };

  return { checking, updateAvailable, checkForUpdates };
}
