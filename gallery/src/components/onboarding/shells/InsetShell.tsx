// ui-kit: copy of davidewins/ui-kit native/files/src/components/onboarding/shells/InsetShell.tsx. Edit it there and sync; local edits fail ui-kit:check.
// Inset shell for onboarding flows - matches the rest-of-app settings style.
// Header large title is owned by the consumer's <Stack.Screen> options.
// Body opens with optional subtitle, then content. Bottom sticky bar:
// WizardProgress (no step text) + symmetric stacked CTA pills (solid).
// The bar has no background: it floats over the content, which scrolls under
// it, so the ScrollView pads its bottom by useInsetFooterSpace().

import { WizardProgress } from "@/components/onboarding/WizardProgress";
import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { ActivityIndicator, Platform, Pressable, ScrollView } from "react-native";
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
};

export function InsetShell({
  step,
  total,
  phase,
  subtitle,
  primaryCta,
  secondaryCta,
  children,
}: Props) {
  const colors = useThemeColors();
  const footerSpace = useInsetFooterSpace({
    secondary: !!secondaryCta,
    progress: typeof step === "number" && typeof total === "number",
    phase: !!phase,
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: 4, paddingBottom: footerSpace }}
        scrollIndicatorInsets={{ bottom: footerSpace - 16 }}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        keyboardShouldPersistTaps="handled"
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

      <InsetFooter step={step} total={total} phase={phase} primaryCta={primaryCta} secondaryCta={secondaryCta} />
    </View>
  );
}

/**
 * Bottom padding a ScrollView needs so its last row clears a floating
 * InsetFooter (pill heights + gaps + home indicator + 16 breathing room).
 * Pass the same shape the footer gets.
 */
export function useInsetFooterSpace({
  secondary = false,
  progress = false,
  phase = false,
}: { secondary?: boolean; progress?: boolean; phase?: boolean } = {}) {
  const insets = useSafeAreaInsets();
  return (
    12 +
    48 +
    (secondary ? 58 : 0) +
    (progress ? 25 + (phase ? 19 : 0) : 0) +
    (insets.bottom || 12) +
    16
  );
}

/**
 * TAK-1396: the sticky footer on its own, for read screens (course, product,
 * booking) whose ScrollView has its own refresh control. Render it as a
 * sibling after the ScrollView, inside a flex:1 parent, and pad the
 * ScrollView's content by useInsetFooterSpace(): the footer is absolutely
 * positioned with a transparent container, so content scrolls under it.
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
  const glassPrimary = Platform.OS === "ios" && isLiquidGlassAvailable();
  // Disabled, not loading: loading keeps the live pill with its spinner.
  const primaryOff = Boolean(primaryCta.disabled) && !primaryCta.loading;
  const primaryLabel = primaryOff ? colors.muted : colors.onTint;
  const insets = useSafeAreaInsets();
  return (
  <View
    pointerEvents="box-none"
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: insets.bottom || 12,
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
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      {/* Black Liquid Glass on iOS 26 (David, 15 Nov): glass tinted the
          theme's primary, so black in light mode and white in dark, label
          on-tint. A half-clear black tint read grey on white and vanished on
          a black page, and fading the whole pill when disabled made it
          disappear; disabled is a grey pill with a grey label instead. A
          solid pill where glass is not available. */}
      {glassPrimary ? (
        <GlassView
          isInteractive={!primaryOff}
          glassEffectStyle="regular"
          tintColor={primaryOff ? colors.secondaryBackground : colors.primary}
          style={{ borderRadius: 999, overflow: "hidden", borderCurve: "continuous" }}
        >
          <View style={{ paddingVertical: 14, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {primaryCta.loading ? (
          <ActivityIndicator size="small" color={primaryLabel} />
        ) : (
          <>
            <Text
              weight="semibold"
              style={{
                fontSize: 15,
                color: primaryLabel,
                letterSpacing: -0.2,
              }}
            >
              {primaryCta.label}
            </Text>
          </>
        )}
          </View>
        </GlassView>
      ) : (
      <View
        style={{
          borderRadius: 999,
          paddingVertical: 14,
          paddingHorizontal: 18,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: primaryOff ? colors.secondaryBackground : colors.primary,
          borderCurve: "continuous",
        }}
      >
        {primaryCta.loading ? (
          <ActivityIndicator size="small" color={primaryLabel} />
        ) : (
          <>
            <Text
              weight="semibold"
              style={{
                fontSize: 15,
                color: primaryLabel,
                letterSpacing: -0.2,
              }}
            >
              {primaryCta.label}
            </Text>
          </>
        )}
      </View>
      )}
    </Pressable>
  </View>
  );
}
