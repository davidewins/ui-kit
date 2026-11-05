// Gallery (TAK-1491): VOID's rider calls run on Stream Video, a native module
// Expo Go doesn't ship. Same hook; calling says so instead of ringing.
import { PropsWithChildren } from "react";
import { Alert } from "react-native";

export function useRiderCall() {
  return {
    startRiderCall: async (_orderId: string, _opts?: { video?: boolean }) => {
      Alert.alert("Calls aren't in the gallery", "VOID rings the rider here.");
    },
    starting: false,
  };
}

export function VideoCallWrapper({ children }: PropsWithChildren<{ userId: string | null }>) {
  return <>{children}</>;
}
