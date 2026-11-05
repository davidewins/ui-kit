import { Text } from "@/components/ui";
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "@/apps/void/constants/keys";
import { useThemeColors } from "@/hooks/useThemeColors";
import Logger from "@/lib/Logger";
import { appStorage, STORAGE_KEYS } from "@/apps/void/lib/storage";
import { supabase } from "@/lib/supabase";
import AntDesign from "@expo/vector-icons/AntDesign";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { usePostHog } from "posthog-react-native";
import React, { useEffect } from "react";
import { Platform, Pressable } from "react-native";

interface GoogleSignInButtonProps {
  /** Account type to set in user metadata. "user" for One app, "vendor" for Vendors app */
  accountType?: "user" | "vendor";
  /** App name for PostHog tracking */
  appName?: string;
}

export default function GoogleSignInButton({
  accountType = "user",
  appName = "VOID",
}: GoogleSignInButtonProps) {
  const colors = useThemeColors();
  const posthog = usePostHog();

  useEffect(() => {
    if (!GOOGLE_WEB_CLIENT_ID || !GOOGLE_IOS_CLIENT_ID) {
      Logger.error(
        "Google Sign-In misconfigured: missing client IDs in env bundle",
        { web: !!GOOGLE_WEB_CLIENT_ID, ios: !!GOOGLE_IOS_CLIENT_ID },
      );
      return;
    }
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
    });
    Logger.log("Google Sign-In configured", { iosClientId: GOOGLE_IOS_CLIENT_ID });
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      Haptics.selectionAsync();
      Logger.log("🔵 Starting Google authentication...");

      // Check Play Services on Android
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // Sign in with Google
      const response = await GoogleSignin.signIn();

      if (!response.data?.idToken) {
        throw new Error("No ID token returned from Google");
      }

      const idToken = response.data.idToken;

      // Sign in with Supabase using the Google ID token
      const {
        error,
        data: { user },
      } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) {
        Logger.error("❌ Google auth error:", error);
        return;
      }

      if (user) {
        Logger.log("✅ Signed in with Google:", user.email || user.id);

        // Update user metadata if this is a new user
        if (!user.user_metadata?.account_created) {
          appStorage.setBoolean(STORAGE_KEYS.TERMS_ACCEPTED, true);
          const fullName = user.user_metadata?.full_name || "";
          const nameParts = fullName.split(" ");
          const firstName = nameParts[0] || null;
          const lastName = nameParts.slice(1).join(" ") || null;

          await supabase.auth.updateUser({
            data: {
              account_created: true,
              account_type: accountType,
              first_name: firstName,
              last_name: lastName,
            },
          });

          // Also save name directly to database
          if (firstName && lastName) {
            Logger.log("💾 Saving Google name to database");
            const { updateUserProfile } = await import(
              "@/apps/void/hooks/useUserProfile"
            );
            await updateUserProfile({
              first_name: firstName,
              last_name: lastName,
            }).catch((err) => {
              Logger.error("Failed to save name to database:", err);
            });
          }
        }

        // Track in PostHog
        posthog?.identify(user.id, {
          email: user.email ?? "",
          app: `${appName} ${Platform.OS} ${Platform.Version}`,
          device: Constants.deviceId,
        });

        // Backend account creation will be handled automatically by
        // the auth state listener in (auth)/_layout.tsx when SIGNED_IN event fires
        Logger.log(
          "🔵 Google auth successful, backend account creation will start"
        );
      }
    } catch (e: unknown) {
      // User cancelled
      const err = e as Error & { code?: string };
      if (
        err.code === "SIGN_IN_CANCELLED" ||
        err.code === "ERR_REQUEST_CANCELED" ||
        err.message?.includes("canceled")
      ) {
        Logger.log("ℹ️ User canceled Google sign-in");
        return;
      }

      Logger.error("❌ Google auth error:", e);
    }
  };

  return (
    <Pressable
      onPress={handleGoogleSignIn}
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      className="bg-secondary-background px-3 py-[8px] flex-row rounded-full w-90 items-center justify-center border border-border gap-2"
    >
      <AntDesign name="google" size={16} color={colors.text} />
      <Text weight="medium" className="text-[16px] text-text">
        Continue with Google
      </Text>
    </Pressable>
  );
}
