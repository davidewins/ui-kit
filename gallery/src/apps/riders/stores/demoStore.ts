import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const demoStorage = createMMKV({ id: "demo-store" });

const mmkvStorage = {
  getItem: (name: string) => demoStorage.getString(name) ?? null,
  setItem: (name: string, value: string) => demoStorage.set(name, value),
  removeItem: (name: string) => demoStorage.remove(name),
};

interface DemoState {
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      isDemoMode: false,
      setDemoMode: (enabled) => set({ isDemoMode: enabled }),
    }),
    {
      name: "demo-state",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
