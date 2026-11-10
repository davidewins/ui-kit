import { API_URL } from "@/apps/void/constants/keys";
import { useLocation } from "@/apps/void/context/LocationProvider";
import Logger from "@/lib/Logger";
import { supabase } from "@/lib/supabase";
import { fetchWithTimeout } from "@/apps/void/lib/utils/fetchWithTimeout";
import { useEffect, useState } from "react";

export interface TravelInfo {
  time: string;
  distance: string;
  staticTime?: string;
  trafficDelay?: string;
  coordinates: [number, number][]; // [lng, lat] for Mapbox GeoJSON
}

export interface TravelData {
  driving: TravelInfo | null;
  walking: TravelInfo | null;
  bicycling: TravelInfo | null;
  twoWheeler: TravelInfo | null;
  loading: boolean;
  error: string | null;
}

export const useTravelData = (
  destinationLat?: number,
  destinationLng?: number,
  refreshTrigger?: number,
): TravelData => {
  const { location } = useLocation();
  const [travelData, setTravelData] = useState<TravelData>({
    driving: null,
    walking: null,
    bicycling: null,
    twoWheeler: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (
      !location?.latitude ||
      !location?.longitude ||
      !destinationLat ||
      !destinationLng
    ) {
      return;
    }

    const fetchTravelData = async () => {
      setTravelData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const params = new URLSearchParams({
          originLat: location.latitude.toString(),
          originLng: location.longitude.toString(),
          destLat: destinationLat.toString(),
          destLng: destinationLng.toString(),
        });
        const response = await fetchWithTimeout(
          `${API_URL}/api/travel?${params}`,
          {
            headers: session?.access_token
              ? { Authorization: `Bearer ${session.access_token}` }
              : {},
          },
          10000,
        );
        if (!response.ok) throw new Error("Failed to fetch travel data");
        const data = await response.json();
        setTravelData({ ...data, loading: false, error: null });
      } catch (err) {
        Logger.error("Error fetching travel data:", err);
        setTravelData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load travel times",
        }));
      }
    };

    fetchTravelData();
  }, [
    location?.latitude,
    location?.longitude,
    destinationLat,
    destinationLng,
    refreshTrigger,
  ]);

  return travelData;
};
