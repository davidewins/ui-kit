import { Button, Input, Text, View } from "@/components/ui";
import Logger from "@/lib/Logger";
import { supabase } from "@/lib/supabase";
import { emailSchema, parseForm } from "@/apps/void/lib/validation/schemas";
import { useRouter } from "expo-router";

import React, { useState } from "react";
import { Keyboard, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "@/lib/toast";

export default function Email() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleContinue() {
    const result = parseForm(emailSchema, { email });
    if (!result.success) {
      setError(result.errors.email);
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true, // Allow new user creation and existing user sign-in
        },
      });

      if (error) throw error;

      Toast.success("Check your email for the verification code!");

      router.push({
        pathname: "/screens/sign-in/verify-code",
        params: { email },
      });
    } catch (err: unknown) {
      Logger.error("Email OTP error:", err);
      Toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Pressable
      style={{ paddingBottom: insets.bottom }}
      className="flex-1 bg-background px-4 justify-between"
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <View className="gap-2 max-w-md mx-auto w-full">
        <View className="">
          <Text weight="semibold" className="text-2xl">
            Welcome.
          </Text>
          <Text className="text-muted text-sm tracking-tight">
            Enter your email to continue - We'll send you a verification code to
            confirm your account.
          </Text>
          <Text className="text-muted text-sm tracking-tight"></Text>
        </View>

        <View className="gap-4">
          <Input
              autoFocus
              label="Email"
              required
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError(undefined);
              }}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={error}
              hint="We'll send a verification code to this address"
            />

          <Button
            loading={loading}
            disabled={loading}
            onPress={handleContinue}
            fullWidth={true}
            size="md"
            variant="primary"
            accessibilityLabel="Continue"
            accessibilityHint="Sends a verification code to your email"
          >
            Continue
          </Button>
        </View>
      </View>
    </Pressable>
  );
}
