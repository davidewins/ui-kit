import { Platform } from "react-native";
import { createMMKV } from "react-native-mmkv";

// App-level MMKV storage (separate from Supabase storage)
let storage: ReturnType<typeof createMMKV> | null = null;

if (Platform.OS !== "web") {
  storage = createMMKV({ id: "one-app" });
}

export const appStorage = {
  getBoolean: (key: string): boolean => {
    if (!storage) return false;
    return storage.getBoolean(key) ?? false;
  },
  setBoolean: (key: string, value: boolean): void => {
    storage?.set(key, value);
  },
  getString: (key: string): string | undefined => {
    return storage?.getString(key);
  },
  setString: (key: string, value: string): void => {
    storage?.set(key, value);
  },
  remove: (key: string): void => {
    storage?.remove(key);
  },
};

// Storage keys
export const STORAGE_KEYS = {
  HAS_REQUESTED_NOTIFICATIONS: "has_requested_notifications",
  HAS_ASKED_ACQUISITION_SOURCE: "has_asked_acquisition_source",
  HAS_FIRED_LOCATION_GRANTED_EVENT: "has_fired_location_granted_event",
  LOCATION_PERMISSION_GRANTED: "location_permission_granted",
  TERMS_ACCEPTED: "terms_accepted",
  REVIEWER_BYPASS: "reviewer_bypass",
  // QA only: force the out-of-service-area screen while physically in-area, so
  // the geo-gate can be tested without leaving the service region.
  FORCE_OUT_OF_AREA: "force_out_of_area",
  HOME_LIST_LAYOUT: "home_list_layout",
  CACHED_LOCATION: "cached_location",
  CACHED_LOCATION_USER_ID: "cached_location_user_id",
} as const;
