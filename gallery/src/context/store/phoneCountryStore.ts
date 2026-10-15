import { create } from "zustand";

interface PhoneCountryState {
  /**
   * ISO2 of the country chosen in the country-code picker modal. The phone
   * form reads it once on return, then clears it. `null` = nothing pending.
   */
  selectedIso2: string | null;
  select: (iso2: string) => void;
  clear: () => void;
}

export const usePhoneCountryStore = create<PhoneCountryState>((set) => ({
  selectedIso2: null,
  select: (iso2) => set({ selectedIso2: iso2 }),
  clear: () => set({ selectedIso2: null }),
}));
