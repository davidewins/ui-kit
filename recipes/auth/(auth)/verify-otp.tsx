import { Button, Text, View } from "@/components/ui";
import { GlassButton } from "@/components/ui/actions/GlassButton";
import { useCreateAccount } from "@/hooks/useCreateAccount";
import { useThemeColors } from "@/hooks/useThemeColors";
import Logger from "@/lib/Logger";
import { appStorage, STORAGE_KEYS } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { otpSchema, parseForm } from "@/lib/validation/schemas";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react-native";

import { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, Pressable } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { Toast } from "toastify-react-native";

export default function VerifyOTP() {
  const router = useRouter();
  const colors = useThemeColors();
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
    router.replace("/(auth)/email");
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
        router.replace("/(protected)/(tabs)/home");
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

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />
      <Pressable
        className="flex-1 p-4 justify-between"
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        <View className="flex-1 justify-center max-w-md mx-auto w-full">
          <View className="items-center mb-12">
            <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-6">
              <Mail size={36} color={colors.text} />
            </View>
            <Text weight="semibold" className="text-3xl tracking-tight mb-3">
              Check Your Email
            </Text>
            <Text className="text-muted text-center tracking-tight text-base px-4">
              We sent a 6-digit verification code to
            </Text>
            <Text weight="semibold" className="text-foreground mt-2 text-base">
              {email}
            </Text>
          </View>

          <Animated.View
            className="gap-6"
            style={{ transform: [{ translateX: shakeAnimation }] }}
          >
            <View>
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
                  // Only clear error if we're actually making progress (not empty)
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
                  },
                  focusStickStyle: {
                    backgroundColor: colors.text,
                  },
                  focusedPinCodeContainerStyle: {
                    borderColor: colors.border,
                    borderWidth: 2,
                  },
                }}
              />

              {/* Error Message Display */}
              {errorMessage ? (
                <View className="flex-row items-center mt-3 px-1">
                  <AlertCircle size={16} color={colors.error} />
                  <Text className="text-error text-sm ml-2 flex-1">
                    {errorMessage}
                  </Text>
                </View>
              ) : (
                <Text className="text-muted text-sm text-center mt-3">
                  Enter the code to verify your account
                </Text>
              )}
            </View>

            <View className="gap-3">
              <GlassButton
                label={verifying ? "Verifying..." : "Verify Code"}
                loading={verifying}
                disabled={
                  verifying ||
                  token.length !== 6 ||
                  failedAttempts >= MAX_ATTEMPTS
                }
                onPress={() => handleVerifyOTP(true)} // true = manual submit
                tone="primary"
                size="lg"
              />
              <View className="py-2 w-full">
                {canResend ? (
                  <Button
                    className="w-full"
                    onPress={handleResendCode}
                    disabled={resending}
                    variant="secondary"
                    size="lg"
                    fullWidth
                    accessibilityLabel="Resend verification code"
                    accessibilityHint="Sends a new code to your email"
                    // className="py-2 rounded-full border border-border"
                  >
                    <Text
                      weight="medium"
                      className={`text-sm ${
                        resending ? "text-muted" : "text-text"
                      }`}
                    >
                      {resending ? "Sending..." : "Resend Code"}
                    </Text>
                  </Button>
                ) : (
                  <View className="flex-row items-center py-2">
                    <Text className="text-muted text-sm">Resend code in </Text>
                    <Text weight="medium" className="text-foreground text-sm">
                      {countdown}s
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-xs text-muted text-center px-4">
                Didn't receive the code? Check your spam folder or resend after
                the timer expires.
              </Text>
            </View>
          </Animated.View>
        </View>

        <GlassButton
          label="Change Email"
          tone="neutral"
          size="md"
          leftIcon={<ArrowLeft size={20} color={colors.text} />}
          onPress={() => router.back()}
        />
      </Pressable>
    </View>
  );
}
