import { View } from "@/components/ui";
import { useLocation } from "@/context/LocationProvider";
import { useCreateAccount } from "@/hooks/useCreateAccount";
import { useThemeColors } from "@/hooks/useThemeColors";
import Logger from "@/lib/Logger";
import { appStorage, STORAGE_KEYS } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native";
import { Toast } from "toastify-react-native";

export default function AuthLayout() {
  const colors = useThemeColors();
  const { inServiceArea, loading, serviceAreaChecking } = useLocation();
  const router = useRouter();
  const segments = useSegments();
  const { mutateAsync: createAccount } = useCreateAccount();

  /**
   * Guard against duplicate account creation calls.
   * `onAuthStateChange` can fire multiple times (e.g. token refresh, focus
   * regain). We track whether we've already triggered creation for this
   * session so we don't spam the endpoint.
   */
  const accountCreationAttempted = useRef(false);

  /**
   * Create the backend user account after successful authentication.
   *
   * Uses `mutateAsync` (not `mutate`) so errors actually propagate to the
   * catch block. The old code used `mutate` inside try/catch - `mutate` is
   * fire-and-forget and NEVER throws, so errors were silently swallowed.
   */
  const handleCreateAccount = async (session: Session) => {
    if (accountCreationAttempted.current) return;
    accountCreationAttempted.current = true;

    try {
      await createAccount({
        account_type: "user",
        email: session.user.email,
      });
      Logger.log("User account creation succeeded");
    } catch (error) {
      Logger.error("Error creating account:", error);
      Toast.error("Account setup failed. Please try again.");
      // Reset so the user (or a retry) can try again
      accountCreationAttempted.current = false;
    }
  };

  useEffect(() => {
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // Reset the one-shot guard on sign-out so a DIFFERENT user signing in
      // later in this session also gets their backend account created.
      if (_event === "SIGNED_OUT") {
        accountCreationAttempted.current = false;
        return;
      }
      // If user successfully verified OTP and has a session, create their account
      if (session?.user && session.user.email_confirmed_at !== null) {
        handleCreateAccount(session);
      }
    });

    return () => subscription.unsubscribe();
    // segments only re-triggers on navigation - the listener itself is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || serviceAreaChecking) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Fail-safe gate: only block when the platform-polygon RPC explicitly
  // reports the customer is outside every active service area. Any other
  // state - no location yet, no polygons, or an RPC error (all surface as
  // inServiceArea === null) - never blocks, so a backend hiccup can't lock
  // real users out.
  const reviewerBypass = appStorage.getBoolean(STORAGE_KEYS.REVIEWER_BYPASS);
  // QA: FORCE_OUT_OF_AREA lets the out-of-area screen be tested from inside the
  // service region. Reviewer bypass always wins over it.
  const forceOutOfArea = appStorage.getBoolean(STORAGE_KEYS.FORCE_OUT_OF_AREA);
  const outsideServiceArea =
    (inServiceArea === false || forceOutOfArea) && !reviewerBypass;

  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.tint,
      }}
    >
      <Stack.Protected guard={!outsideServiceArea && !loading}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="email"
          options={{
            title: "",
            headerBackButtonDisplayMode: "minimal",
          }}
        />
        <Stack.Screen
          name="verify-otp"
          options={{
            headerTitle: "Verify Code",
            headerBackTitle: "Back",
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={outsideServiceArea || loading}>
        <Stack.Screen
          name="location-not-active"
          options={{
            headerShown: false,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
