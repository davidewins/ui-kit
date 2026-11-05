// Gallery: Google Sign-In is a native module Expo Go doesn't ship. The button
// renders as in the app; pressing it ends in the app's own "no ID token" error.
export const GoogleSignin = {
  configure: (_options: Record<string, unknown>) => {},
  hasPlayServices: async (_options?: Record<string, unknown>) => true,
  signIn: async () => ({ type: "cancelled" as const, data: null as { idToken: string | null } | null }),
  signOut: async () => null,
};
export const statusCodes = {
  SIGN_IN_CANCELLED: "SIGN_IN_CANCELLED",
  IN_PROGRESS: "IN_PROGRESS",
  PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES_NOT_AVAILABLE",
};
export const isErrorWithCode = (e: unknown): e is { code: string } =>
  typeof e === "object" && e !== null && "code" in e;
