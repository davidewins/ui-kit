import { Image, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { GlassButton } from "@/components/ui/GlassButton";
import { Sheet } from "@/components/ui/Sheet";
import { useCreateAccount } from "@/apps/void/hooks/useCreateAccount";
import { useThemeColors } from "@/hooks/useThemeColors";
import Logger from "@/lib/Logger";
import { appStorage, STORAGE_KEYS } from "@/apps/void/lib/storage";
import { supabase } from "@/lib/supabase";
import { otpSchema, parseForm } from "@/apps/void/lib/validation/schemas";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, Info, Lock } from "lucide-react-native";

import { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Pressable } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "@/lib/toast";

export default function VerifyOTP() {
  const router = useRouter();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [helpOpen, setHelpOpen] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>();
  const [token, setToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const MAX_ATTEMPTS = 5;
  const { mutateAsync: createAccount } = useCreateAccount();

  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Redirect if no email provided
  if (!email) {
    Toast.error("No email provided");
    router.replace("/screens/sign-in/email");
    return null;
  }

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleVerifyOTP = async (
    isManualSubmit = false,
    explicitToken?: string,
  ) => {
    // Use the explicit token if provided, otherwise fallback to state
    const tokenToVerify = explicitToken || token;

    if (isManualSubmit) {
      const result = parseForm(otpSchema, { code: tokenToVerify ?? "" });
      if (!result.success) {
        setErrorMessage(
          result.errors.code ?? "Please enter a valid 6-digit code",
        );
        shake();
        return;
      }
    }

    if (failedAttempts >= MAX_ATTEMPTS) {
      setErrorMessage("Too many failed attempts. Please request a new code.");
      shake();
      return;
    }

    setVerifying(true);
    setErrorMessage("");

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.verifyOtp({
        email,
        token: tokenToVerify, // <--- Use the variable here
        type: "email",
      });

      if (error) {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        // Provide specific error messages
        if (error.message.includes("expired")) {
          setErrorMessage("This code has expired. Please request a new one.");
        } else if (
          error.message.includes("invalid") ||
          error.message.includes("Token")
        ) {
          const remaining = MAX_ATTEMPTS - newAttempts;
          setErrorMessage(
            remaining > 0
              ? `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
              : "Too many failed attempts. Please request a new code.",
          );
        } else {
          setErrorMessage(error.message);
        }
        shake();
        setToken(""); // Clear the input for retry
        throw error;
      }

      if (session) {
        const isNewSignup = !session.user.user_metadata?.account_created;
        if (isNewSignup) {
          appStorage.setBoolean(STORAGE_KEYS.TERMS_ACCEPTED, true);
        }
        // Await account creation here rather than relying on the
        // (auth)/_layout SIGNED_IN listener - that listener can lose the
        // race against the router.replace below and unmount before the
        // backend call ever fires, leaving no public.users row behind.
        try {
          await createAccount({
            account_type: "user",
            email: session.user.email,
          });
        } catch (accountError) {
          Logger.error(
            "Account creation failed after OTP verify:",
            accountError,
          );
        }
        Toast.success("Email verified successfully!");
        router.replace("/");
      }
    } catch (error: unknown) {
      Logger.error("OTP verification error:", error);
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!email || !canResend) {
      return;
    }

    setResending(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) throw error;

      Toast.success("New code sent to your email!");
      setCountdown(60);
      setCanResend(false);
      setToken("");
      setFailedAttempts(0);
    } catch (error: unknown) {
      Logger.error("Resend error:", error);
      const msg =
        error instanceof Error ? error.message : "Failed to resend code";
      setErrorMessage(msg);
      Toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  // Layout (David, 3 Nov): just the envelope, one line, the code and the
  // buttons. The header back button is "change email"; the header info button
  // opens a short sheet with the help text that used to crowd the page.
  // Resend is always there, locked with its countdown until it can be used.
  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{ headerShown: true, title: "", headerBackButtonDisplayMode: "minimal" }}
      />
      <ActionMenu
        accessibilityLabel="Help"
        actions={[]}
        buttons={[
          {
            label: "About the code",
            systemImage: "info.circle",
            icon: Info,
            onPress: () => setHelpOpen(true),
          },
        ]}
      />
      <Pressable
        className="flex-1 px-5 justify-between"
        style={{ paddingBottom: (insets.bottom || 16) + 8 }}
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        <View className="max-w-md mx-auto w-full" style={{ marginTop: 12 }}>
          <View className="items-center mb-8">
            <Image
              source={require("@/assets/images/empty/envelope.png")}
              style={{ width: 88, height: 88 }}
              contentFit="contain"
              accessibilityIgnoresInvertColors
            />
            <Text weight="semibold" className="text-2xl mt-4">
              Check your email
            </Text>
            <Text className="text-[15px] text-muted text-center mt-1">
              Code sent to{" "}
              <Text weight="semibold" className="text-[15px] text-foreground">
                {email}
              </Text>
            </Text>
          </View>

          <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
            <OtpInput
              numberOfDigits={6}
              focusColor={colors.text}
              autoFocus={true}
              hideStick={false}
              blurOnFilled={false}
              disabled={verifying || failedAttempts >= MAX_ATTEMPTS}
              type="numeric"
              secureTextEntry={false}
              focusStickBlinkingDuration={400}
              onTextChange={(text) => {
                setToken(text);
                if (errorMessage && text.length > 0) {
                  setErrorMessage("");
                }
              }}
              onFilled={(text) => {
                setToken(text);
                setErrorMessage("");
                setTimeout(() => handleVerifyOTP(false, text), 1000); // Pass text directly to avoid stale closure
              }}
              theme={{
                pinCodeContainerStyle: {
                  borderColor: errorMessage ? colors.error : colors.border,
                  borderWidth: 2,
                  borderRadius: 12,
                  height: 56,
                  width: 48,
                  backgroundColor: colors.background,
                },
                pinCodeTextStyle: {
                  fontSize: 24,
                  fontWeight: "600",
                  color: colors.foreground,
                  fontVariant: ["tabular-nums"],
                },
                focusStickStyle: {
                  backgroundColor: colors.text,
                },
                focusedPinCodeContainerStyle: {
                  borderColor: colors.text,
                  borderWidth: 2,
                },
              }}
            />
            {errorMessage ? (
              <View className="flex-row items-center mt-3 px-1">
                <AlertCircle size={16} color={colors.error} />
                <Text className="text-error text-sm ml-2 flex-1">{errorMessage}</Text>
              </View>
            ) : null}
          </Animated.View>
        </View>

        <View className="gap-3 max-w-md mx-auto w-full">
          <GlassButton
            label={canResend ? (resending ? "Sending..." : "Resend code") : `Resend in ${countdown}s`}
            onPress={handleResendCode}
            loading={resending}
            disabled={!canResend || resending}
            tone="neutral"
            size="lg"
            leftIcon={canResend ? undefined : <Lock size={18} color={colors.muted} />}
            accessibilityLabel={canResend ? "Resend code" : `Resend available in ${countdown} seconds`}
          />
          <GlassButton
            label={verifying ? "Verifying..." : "Verify"}
            loading={verifying}
            disabled={verifying || token.length !== 6 || failedAttempts >= MAX_ATTEMPTS}
            onPress={() => handleVerifyOTP(true)} // true = manual submit
            tone="primary"
            size="lg"
          />
        </View>
      </Pressable>

      <Sheet visible={helpOpen} onClose={() => setHelpOpen(false)}>
        <Text weight="semibold" style={{ fontSize: 21, letterSpacing: -0.4 }}>
          About your code
        </Text>
        <Text className="text-[15px] text-muted mt-2 leading-relaxed">
          We emailed a 6-digit code to {email}. Type it in and you&apos;re
          signed in; there&apos;s no password to remember.
        </Text>
        <Text className="text-[15px] text-muted mt-3 leading-relaxed">
          Can&apos;t find it? Check your spam or junk folder. You can ask for a
          new code once the timer runs out, and each new code replaces the old
          one. Wrong address? Go back and change it.
        </Text>
      </Sheet>
    </View>
  );
}
