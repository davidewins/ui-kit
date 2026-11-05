import GoogleSignInButton from "@/apps/void/components/GoogleSignInButton";
import { SafeAreaView, Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import Logger from "@/lib/Logger";
import { appStorage, STORAGE_KEYS } from "@/apps/void/lib/storage";
import { supabase } from "@/lib/supabase";
import * as AppleAuthentication from "expo-apple-authentication";
import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import { Link, useRouter } from "expo-router";
import { MailIcon, PlayIcon } from "lucide-react-native";
import { usePostHog } from "posthog-react-native";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Platform, Pressable, useColorScheme } from "react-native";
import { Uniwind } from "uniwind";

export default function Welcome() {
  const colors = useThemeColors();
  const colorScheme = useColorScheme();
  const posthog = usePostHog();
  const router = useRouter();
  const x = Uniwind.currentTheme;
  const [demoLoading, setDemoLoading] = useState(false);
  // 5-tap the logo → reveal the demo login button (and skip the location gate).
  // This is the App Reviewer's way in: no email OTP, no personal Apple ID.
  const [reviewerUnlocked, setReviewerUnlocked] = useState(() =>
    appStorage.getBoolean(STORAGE_KEYS.REVIEWER_BYPASS),
  );
  const logoTapCount = useRef(0);
  const logoTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoTap = () => {
    logoTapCount.current += 1;
    if (logoTapTimer.current) clearTimeout(logoTapTimer.current);
    logoTapTimer.current = setTimeout(() => {
      logoTapCount.current = 0;
    }, 1200);
    if (logoTapCount.current >= 5) {
      logoTapCount.current = 0;
      Haptics.selectionAsync();
      appStorage.setBoolean(STORAGE_KEYS.REVIEWER_BYPASS, true);
      setReviewerUnlocked(true); // re-renders → demo login button appears
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "demo@takeover.software",
        password: "gallery", // VOID's reviewer login, blanked: the gallery client never signs in
      });
      if (error) {
        Logger.error("Demo login failed:", error);
      } else if (data.user) {
        appStorage.setBoolean(STORAGE_KEYS.TERMS_ACCEPTED, true);
        posthog?.identify(data.user.id, {
          email: data.user.email ?? "",
          app: `VOID ${Platform.OS} ${Platform.Version}`,
          device: Constants.deviceId,
        });
      }
    } catch (e) {
      Logger.error("Demo login error:", e);
    } finally {
      setDemoLoading(false);
    }
  };

  useEffect(() => {
    Logger.log("Uniwind theme:", Uniwind.currentTheme);
    Logger.log(`Welcome Screen mounted - Platform: ${Platform.OS}`);
  }, []);

  const renderImage = () => {
    try {
      return (
        <Pressable
          onPress={handleLogoTap}
          accessibilityRole="button"
          accessibilityLabel="VOID"
          accessibilityHint="App reviewer unlock gesture"
        >
          <Image
            source={
              x === "light"
                ? require("@/apps/void/assets/images/splash-icon-light.png")
                : require("@/apps/void/assets/images/splash-icon-dark.png")
            }
            className="h-70 w-70"
            onError={(error) => Logger.log("Image loading error:", error)}
          />
        </Pressable>
      );
    } catch (error) {
      Logger.error("Error rendering image:", error);
      return <Text>Failed to load image</Text>;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center">
        <View className="items-center">
          <Text weight="medium" className="text-2xl tracking-tight">
            Welcome.
          </Text>
          <Text weight="regular" className="text-sm tracking-tight text-muted">
            Create an account or sign in below
          </Text>
        </View>
        {renderImage()}

        <View className="items-center gap-4 mt-4">
          <Link asChild href="/void/(auth)/email">
            <Pressable
              onPress={() => Haptics.selectionAsync()}
              accessibilityRole="button"
              accessibilityLabel="Continue with Email"
              className="bg-secondary-background px-3 py-[8px] flex-row rounded-full w-90 items-center justify-center border border-border gap-2"
            >
              <MailIcon color={colors.text} size={14} />

              <Text weight="medium" className="text-[16px] text-text">
                Continue with Email
              </Text>
            </Pressable>
          </Link>

          <GoogleSignInButton accountType="user" appName="VOID" />

          {Platform.OS === "ios" && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
              }
              buttonStyle={
                colorScheme === "dark"
                  ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                  : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={50}
              style={{ width: 360, height: 40 }}
              onPress={async () => {
                try {
                  Haptics.selectionAsync();
                  Logger.log("🍎 Starting Apple authentication...");

                  const credential = await AppleAuthentication.signInAsync({
                    requestedScopes: [
                      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                      AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                  });

                  // Sign in via Supabase Auth
                  if (credential.identityToken) {
                    const {
                      error,
                      data: { user },
                    } = await supabase.auth.signInWithIdToken({
                      provider: "apple",
                      token: credential.identityToken,
                    });

                    if (error) {
                      Logger.error("❌ Apple auth error:", error);
                      // Error handling is done by auth state listener
                      return;
                    }

                    if (user) {
                      Logger.log(
                        "✅ Signed in with Apple:",
                        user.email || user.id
                      );

                      // Update user metadata after sign-in if this is a new user
                      if (!user.user_metadata?.account_created) {
                        appStorage.setBoolean(STORAGE_KEYS.TERMS_ACCEPTED, true);
                        // Save name to user metadata
                        // Update metadata immediately
                        await supabase.auth.updateUser({
                          data: {
                            account_created: true,
                            account_type: "user",
                            ...(credential.fullName && {
                              first_name: credential.fullName.givenName || null,
                              last_name: credential.fullName.familyName || null,
                            }),
                          },
                        });

                        // ALSO save name directly to database so it persists
                        if (
                          credential.fullName?.givenName &&
                          credential.fullName?.familyName
                        ) {
                          Logger.log("💾 Saving Apple name to database");
                          const { updateUserProfile } = await import(
                            "@/apps/void/hooks/useUserProfile"
                          );
                          await updateUserProfile({
                            first_name: credential.fullName.givenName,
                            last_name: credential.fullName.familyName,
                          }).catch((err) => {
                            Logger.error(
                              "Failed to save name to database:",
                              err
                            );
                          });
                        }
                      }

                      // Track in PostHog
                      posthog?.identify(user.id, {
                        email: user.email ?? "",
                        app: `VOID ${Platform.OS} ${Platform.Version}`,
                        device: Constants.deviceId,
                      });

                      // Backend account creation will be handled automatically by
                      // the auth state listener in _layout.tsx when SIGNED_IN event fires
                      Logger.log(
                        "🍎 Apple auth successful, backend account creation will start"
                      );
                    }
                  } else {
                    throw new Error("No identityToken from Apple");
                  }
                } catch (e: unknown) {
                  if (e instanceof Error && (e as Error & { code?: string }).code === "ERR_REQUEST_CANCELED") {
                    // User canceled - don't show error, this is expected
                    Logger.log("ℹ️ User canceled Apple sign-in");
                  } else {
                    Logger.error("❌ Apple auth error:", e);
                    // Error will be handled by auth state listener or shown via toast
                  }
                }
              }}
            />
          )}

          {/* Demo login (password, no OTP). Revealed by the 5-tap-logo unlock -
              this is how an App Store reviewer signs in without a personal Apple
              ID or an email code they can't receive. */}
          {reviewerUnlocked && (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                handleDemoLogin();
              }}
              disabled={demoLoading}
              accessibilityRole="button"
              accessibilityLabel="Sign in as Demo User"
              accessibilityHint="For app reviewers and QA"
              accessibilityState={{ busy: demoLoading }}
              className="bg-text px-3 py-[8px] flex-row rounded-full w-90 items-center justify-center gap-2"
            >
              {demoLoading ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <>
                  <PlayIcon color={colors.background} size={14} />
                  <Text weight="medium" className="text-[16px] text-background">
                    Sign in as Demo User
                  </Text>
                </>
              )}
            </Pressable>
          )}
        </View>

        {/* Two fixed lines: the lead-in, then both links together, so the
            links never split across a wrap. */}
        <View className="items-center px-8 mt-6">
          <Text
            weight="regular"
            className="text-xs text-center text-muted leading-5"
          >
            By continuing, you agree to our
          </Text>
          {/* A row rather than nested Text so each link can take a hitSlop. */}
          <View className="flex-row items-center">
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Terms of Service"
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
              onPress={() => router.push("/void/(aux)/terms")}
            >
              <Text
                weight="medium"
                className="text-xs text-tint underline leading-5"
              >
                Terms of Service
              </Text>
            </Pressable>
            <Text weight="regular" className="text-xs text-muted leading-5">
              {" "}and{" "}
            </Text>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Privacy Policy"
              hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
              onPress={() => router.push("/void/(aux)/privacy")}
            >
              <Text
                weight="medium"
                className="text-xs text-tint underline leading-5"
              >
                Privacy Policy
              </Text>
            </Pressable>
            <Text weight="regular" className="text-xs text-muted leading-5">
              .
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
