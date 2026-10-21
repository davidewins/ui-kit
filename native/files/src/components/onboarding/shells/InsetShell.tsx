// Inset shell for onboarding flows - matches the rest-of-app settings style.
// Header large title is owned by the consumer's <Stack.Screen> options.
// Body opens with optional subtitle, then content. Bottom sticky bar:
// WizardProgress (no step text) + symmetric stacked CTA pills (solid).
// The bar has no background: it floats over the content, which scrolls under
// it, so the ScrollView pads its bottom by useInsetFooterSpace().

import { WizardProgress } from "@/components/onboarding/WizardProgress";
import { Text, View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { ArrowRight } from "lucide-react-native";
import { ActivityIndicator, Pressable, ScrollView } from "react-native";
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
