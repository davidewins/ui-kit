// Inset shell for onboarding flows - matches the rest-of-app settings style.
// Header large title is owned by the consumer's <Stack.Screen> options.
// Body opens with optional subtitle, then content. Bottom sticky bar:
// WizardProgress (no step text) + symmetric stacked CTA pills (solid).

import { WizardProgress } from "@/components/onboarding/WizardProgress";
import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, KeyboardAvoidingView, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Cta = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

type Props = {
  /** Progress bar position. Omit both to hide the bar (e.g. on the
   * pre-wizard welcome screen). */
  step?: number;
  total?: number;
  /** Optional phase label rendered above the bars: "Setup" / "Verification".
   * Pass on layer-2 screens so the user understands they entered a new
   * phase rather than jumping back to step 1 for no visible reason. */
  phase?: string;
  subtitle?: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  children?: React.ReactNode;
  /** TKVR addition: false for single-field steps. Plain View, and the bottom
   * bar rides above the keyboard. Everything else is SELLERS verbatim. */
  scroll?: boolean;
  /** TKVR addition (TAK-1375 Studio editors): the scroll view makes room for
   * the keyboard, so a long field stays visible while typing. */
  keyboardInsets?: boolean;
};

export function InsetShell({
  step,
  total,
  phase,
  subtitle,
  primaryCta,
  secondaryCta,
  children,
  scroll = true,
  keyboardInsets = false,
}: Props) {
  const colors = useThemeColors();

  const subtitleBlock = subtitle ? (
    <View className="px-5 mb-5">
      <Text className="text-sm text-muted leading-tight tracking-tight">
        {subtitle}
      </Text>
    </View>
  ) : null;

  const Root = scroll ? React.Fragment : FlatRoot;

  return (
    <Root>
      {scroll ? (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={keyboardInsets}
        alwaysBounceVertical
      >
        {subtitle && (
          <View className="px-5 mb-5">
            <Text className="text-sm text-muted leading-tight tracking-tight">
              {subtitle}
            </Text>
          </View>
        )}
        {children}
      </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingTop: 16, backgroundColor: colors.background }}>
          {subtitleBlock}
          {children}
        </View>
      )}

      <InsetFooter step={step} total={total} phase={phase} primaryCta={primaryCta} secondaryCta={secondaryCta} />
    </Root>
  );
}

/**
 * TAK-1396: the sticky footer on its own, for read screens (course, product,
 * booking) whose ScrollView has its own refresh control. Render it as a
 * sibling after the ScrollView, as InsetShell does. Unchanged SELLERS markup.
 */
export function InsetFooter({
  step,
  total,
  phase,
  primaryCta,
  secondaryCta,
}: Pick<Props, "step" | "total" | "phase" | "primaryCta" | "secondaryCta">) {
  const showProgress = typeof step === "number" && typeof total === "number";
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  return (
  <View
    style={{
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: insets.bottom || 12,
      backgroundColor: colors.background,
      gap: 10,
    }}
  >
    {showProgress && (
      <WizardProgress step={step!} total={total!} phase={phase} />
    )}

    {secondaryCta && (
      <Pressable
        onPress={() => {
          Haptics.selectionAsync().catch(() => {});
          secondaryCta.onPress?.();
        }}
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        <View
          style={{
            borderRadius: 999,
            paddingVertical: 14,
            paddingHorizontal: 18,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderCurve: "continuous",
          }}
        >
          <Text
            weight="semibold"
            style={{
              fontSize: 15,
              color: colors.text,
              letterSpacing: -0.2,
            }}
          >
            {secondaryCta.label}
          </Text>
        </View>
      </Pressable>
    )}

    <Pressable
      onPress={() => {
        if (primaryCta.disabled || primaryCta.loading) return;
        Haptics.selectionAsync().catch(() => {});
        primaryCta.onPress?.();
      }}
      disabled={primaryCta.disabled || primaryCta.loading}
      style={({ pressed }) => ({
        opacity:
          primaryCta.disabled || primaryCta.loading
            ? 0.45
            : pressed
              ? 0.85
              : 1,
      })}
    >
      <View
        style={{
          borderRadius: 999,
          paddingVertical: 14,
          paddingHorizontal: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: colors.tint,
          borderCurve: "continuous",
        }}
      >
        {primaryCta.loading ? (
          <ActivityIndicator size="small" color={colors.background} />
        ) : (
          <>
            <Text
              weight="bold"
              style={{
                fontSize: 15,
                color: colors.background,
                letterSpacing: -0.2,
              }}
            >
              {primaryCta.label}
            </Text>
            <ArrowRight
              size={16}
              color={colors.background}
              strokeWidth={2.4}
            />
          </>
        )}
      </View>
    </Pressable>
  </View>
  );
}

// TKVR addition for scroll={false}: keeps the bottom bar above the keyboard.
function FlatRoot({ children }: { children?: React.ReactNode }) {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      {children}
    </KeyboardAvoidingView>
  );
}
