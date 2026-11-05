// Same layout, type and spacing as (auth)/email (the RIDERS email screen):
// heading + muted body, then the field and the glass button. The header
// title is "" in (auth)/_layout so the heading is the only title.
import { Input, Text, View } from "@/apps/sellers/components/ui";
import { GlassButton } from "@/components/ui/GlassButton";
import Logger from "@/lib/Logger";
import { supabase } from "@/lib/supabase";

import React, { useState } from "react";
import { Keyboard, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "@/lib/toast";

export default function ForgotPassword() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function handleSend() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(email ? "Enter a valid email" : "Enter your email");
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
      Toast.success("Check your email for the code");
    } catch (err: unknown) {
      Logger.error("Reset password error:", err);
      Toast.error(err instanceof Error ? err.message : "Couldn't send the code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Pressable
      style={{ paddingBottom: insets.bottom || 16 }}
      className="flex-1 bg-background px-5"
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <View className="max-w-md mx-auto w-full" style={{ marginTop: 12 }}>
        <View className="mb-5">
          <Text weight="semibold" className="text-2xl">
            Forgot your password?
          </Text>
          <Text className="text-muted text-sm tracking-tight">
            Enter the email you sign in with. We&apos;ll send you a code to set
            a new password.
          </Text>
        </View>

        <View className="gap-4">
          <Input
            autoFocus
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError(undefined);
            }}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="send"
            onSubmitEditing={handleSend}
            error={error}
          />

          <GlassButton
            label="Send code"
            onPress={handleSend}
            loading={loading}
            disabled={loading}
            tone="primary"
            size="lg"
          />
        </View>
      </View>
    </Pressable>
  );
}
