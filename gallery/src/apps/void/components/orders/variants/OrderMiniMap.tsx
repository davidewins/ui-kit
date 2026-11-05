// Gallery (TAK-1491): VOID draws this with Mapbox, a native module Expo Go
// doesn't ship. Same props and footprint; the map area is left blank.
import { useThemeColors } from "@/hooks/useThemeColors";
import type { LatLng } from "@/apps/void/types/geo";
import type { FC } from "react";
import { View } from "react-native";

interface Props {
  store: LatLng | null;
  dropoff: LatLng | null;
  rider: LatLng | null;
  user?: LatLng | null;
  riderIsStale?: boolean;
  waypoints: [number, number][];
  interactive?: boolean;
}

export const OrderMiniMap: FC<Props> = () => {
  const colors = useThemeColors();
  return <View style={{ flex: 1, backgroundColor: colors.secondaryBackground }} />;
};
