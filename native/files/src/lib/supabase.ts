import { SUPABASE_PK, SUPABASE_URL } from "@/constants/keys";
import { Database } from "@/types/index";
import { createClient } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";
import { createMMKV } from "react-native-mmkv";

// Only initialize MMKV on native platforms
let MMKVAdapter;

if (Platform.OS !== "web") {
  // Initialize MMKV storage
  const mmkvStorage = createMMKV({ id: "supabase" });

  // Create an adapter that implements the storage interface Supabase expects
  MMKVAdapter = {
    getItem: async (key: string): Promise<string | null> => {
      return mmkvStorage.getString(key) ?? null;
    },
    setItem: async (key: string, value: string): Promise<void> => {
      mmkvStorage.set(key, value);
    },
    removeItem: async (key: string): Promise<void> => {
      mmkvStorage.remove(key);
    },
  };
} else {
  // Use localStorage for web persistence
  MMKVAdapter = {
    getItem: async (key: string): Promise<string | null> => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(key);
    },
    setItem: async (key: string, value: string): Promise<void> => {
      if (typeof window === "undefined") return;
      localStorage.setItem(key, value);
    },
    removeItem: async (key: string): Promise<void> => {
      if (typeof window === "undefined") return;
      localStorage.removeItem(key);
    },
  };
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PK, {
  auth: {
    storage: MMKVAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web", // Enable for web only
  },
});

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
