// Gallery: MMKV is a native module Expo Go doesn't ship. In-memory instead.
type Value = string | number | boolean;
export function createMMKV(_options?: { id?: string }) {
  const map = new Map<string, Value>();
  return {
    set: (key: string, value: Value) => void map.set(key, value),
    getString: (key: string) => { const v = map.get(key); return typeof v === "string" ? v : undefined; },
    getBoolean: (key: string) => { const v = map.get(key); return typeof v === "boolean" ? v : undefined; },
    getNumber: (key: string) => { const v = map.get(key); return typeof v === "number" ? v : undefined; },
    contains: (key: string) => map.has(key),
    remove: (key: string) => map.delete(key),
    delete: (key: string) => void map.delete(key),
    clearAll: () => map.clear(),
    getAllKeys: () => [...map.keys()],
  };
}
export type MMKV = ReturnType<typeof createMMKV>;
