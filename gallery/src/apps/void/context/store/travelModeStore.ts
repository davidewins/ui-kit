import { TravelData } from "@/apps/void/hooks/useTravelData";
import { create } from "zustand";

interface TravelModeState {
  /** Already-fetched multi-mode travel data, stashed before opening the
   * select-travel-mode modal so it can render every mode's time immediately
   * instead of re-fetching or making the user pick blind. */
  travelData: TravelData | null;
  set: (travelData: TravelData) => void;
  clear: () => void;
}

export const useTravelModeStore = create<TravelModeState>((set) => ({
  travelData: null,
  set: (travelData) => set({ travelData }),
  clear: () => set({ travelData: null }),
}));
