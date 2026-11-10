import { useTravelModeStore } from "@/apps/void/context/store/travelModeStore";
import { useThemeColors } from "@/hooks/useThemeColors";
import { TravelData } from "@/apps/void/hooks/useTravelData";
import Logger from "@/lib/Logger";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";

interface TravelTimeDisplayProps {
  travelData: TravelData;
  preferredMode: string;
}

export const TravelTimeDisplay = ({
  travelData,
  preferredMode,
}: TravelTimeDisplayProps) => {
  const colors = useThemeColors();
  const setTravelModeData = useTravelModeStore((s) => s.set);

  const handleTap = () => {
    Haptics.selectionAsync();
    setTravelModeData(travelData);
    router.push("/(protected)/(modals)/select-travel-mode");
  };

  if (travelData.loading) {
    return (
      <Text style={{ fontSize: 14, color: colors.text }}>
        Loading travel time...
      </Text>
    );
  }

  if (travelData.error) {
    return (
      <Text style={{ fontSize: 14, color: colors.foreground }}>
        Unable to calculate travel time
      </Text>
    );
  }

  // Get user's preferred travel mode
  let modeData = travelData[preferredMode as keyof typeof travelData];

  // Fallback logic if preferred mode is unavailable
  if (!modeData || typeof modeData !== "object" || !("time" in modeData)) {
    // Try fallback modes in order of preference
    const fallbackModes = ["driving", "walking", "bicycling", "twoWheeler"];
    for (const mode of fallbackModes) {
      const data = travelData[mode as keyof typeof travelData];
      if (data && typeof data === "object" && "time" in data) {
        modeData = data;
        break;
      }
    }
  }

  Logger.log("Debug travel mode:", {
    preferredMode,
    // travelData,
  });

  // Map mode to icon
  const modeIcons = {
    driving: "car",
    twoWheeler: "bicycle",
    bicycling: "bicycle",
    walking: "walk",
  } as const;

  const icon = modeIcons[preferredMode as keyof typeof modeIcons] || "car";

  // Show the preferred mode's travel time
  if (modeData && typeof modeData === "object" && "time" in modeData) {
    return (
      <Pressable
        onPress={handleTap}
        className="flex-row items-center gap-[6px]"
        accessibilityRole="button"
        accessibilityLabel={`Travel time, ${modeData.time}`}
        accessibilityHint="Opens travel mode options"
      >
        <Ionicons name={icon} size={18} color={colors.text} />
        <Text
          className="text-[15px] text-text"
          style={{
            fontSize: 15,
            color: colors.text,
            fontWeight: "600",
          }}
        >
          {modeData.time}
        </Text>
        <Ionicons name="chevron-down" size={14} color="gray" />
      </Pressable>
    );
  }

  return (
    <Text style={{ fontSize: 14, color: colors.muted }}>
      Travel time unavailable
    </Text>
  );
};
