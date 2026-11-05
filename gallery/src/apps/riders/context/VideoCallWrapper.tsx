// Gallery (TAK-1491): RIDERS' customer calls run on Stream Video, a native
// module Expo Go doesn't ship. Same hook; calling says so instead of ringing.
import { PropsWithChildren } from "react";
import { Alert } from "react-native";

export function useCustomerCall() {
  return {
    startCustomerCall: async (_orderId: string, _opts?: { video?: boolean }) => {
      Alert.alert("Calls aren't in the gallery", "RIDERS rings the customer here.");
    },
    starting: false,
  };
}

export function VideoCallWrapper({ children }: PropsWithChildren<{ userId: string | null }>) {
  return <>{children}</>;
}
