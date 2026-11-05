import { Button, Card, Text, View } from "@/apps/sellers/components/ui";
import {
  useSetVendorModuleStatus,
  useVendorModules,
} from "@/apps/sellers/hooks/useVendorModules";
import {
  MODULE_CATALOG,
  STRIPE_MODULES,
  type ModuleKey,
} from "@/apps/sellers/lib/onboardingCatalog";
import type { ModuleStatus } from "@/apps/sellers/lib/vendorModulesApi";
import { router } from "expo-router";
import { AlertTriangle, Grid3x3 } from "lucide-react-native";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { Toast } from "@/lib/toast";
import { useCSSVariable } from "uniwind";

interface EnableModuleScreenProps {
  moduleKey: ModuleKey;
  vendorId: string | null | undefined;
  stripeReady: boolean;
  /** Path to return to once enabled. */
  returnTo?: string;
}

export function EnableModuleScreen({
  moduleKey,
  vendorId,
  stripeReady,
  returnTo,
}: EnableModuleScreenProps) {
  const { data: modules } = useVendorModules(vendorId);
  const setStatus = useSetVendorModuleStatus(vendorId);
  const posthog = usePostHog();
  const warningColor = useCSSVariable("--color-warning-text") as string;
  const muted = useCSSVariable("--color-muted") as string;

  const meta = MODULE_CATALOG[moduleKey];
  const current = modules?.find((m) => m.module_key === moduleKey);
  const triggersStripe = (STRIPE_MODULES as readonly string[]).includes(
    moduleKey,
  );
  const isPending = current?.status === "setup_pending";

  const [submitting, setSubmitting] = useState(false);

  const handleEnable = async () => {
    setSubmitting(true);
    const nextStatus: ModuleStatus =
      triggersStripe && !stripeReady ? "setup_pending" : "enabled";
    try {
      await setStatus.mutateAsync({ moduleKey, status: nextStatus });
    } catch (e) {
      console.warn("[modules] enable failed", e);
      Toast.error(`Couldn't turn on ${meta.label}`);
      setSubmitting(false);
      return;
    }
    posthog?.capture("module_enabled_post_onboarding", {
      module_key: moduleKey,
      source: "url_gate",
      status: nextStatus,
    });
    if (nextStatus === "setup_pending") {
      router.replace("/sellers/(protected)/account/payments" as never);
    } else if (returnTo) {
      router.replace(returnTo as never);
    } else {
      router.back();
    }
    setSubmitting(false);
  };

  return (
    <View className="flex-1 bg-background p-4 justify-center">
      <Card>
        <View className="items-center gap-4 py-4">
          <View
            className="h-14 w-14 rounded-full items-center justify-center"
            style={{ backgroundColor: muted }}
          >
            <Grid3x3 size={28} strokeWidth={1.8} />
          </View>

          <View className="gap-1 items-center">
            <Text weight="semibold" className="text-xl">
              {meta.label}
            </Text>
            <Text className="text-sm text-muted text-center px-4">
              {meta.description}
            </Text>
          </View>

          {isPending && (
            <View className="flex-row items-start gap-2 p-3 rounded-md border border-warning-border bg-warning-bg/20">
              <AlertTriangle size={16} color={warningColor} strokeWidth={2} />
              <Text className="text-xs flex-1">
                This module is half-configured. Finish Stripe setup to start
                taking payments.
              </Text>
            </View>
          )}

          {triggersStripe && !stripeReady && !isPending && (
            <Text className="text-xs text-muted text-center px-4">
              Turning this on will put it in &ldquo;Finish setup&rdquo; until
              your Stripe payouts are enabled.
            </Text>
          )}

          <View className="flex-row gap-2 w-full mt-2">
            <View className="flex-1">
              <Button
                variant="outline"
                onPress={() =>
                  router.replace(
                    "/sellers/(protected)/account/modules" as never,
                  )
                }
                fullWidth
              >
                Browse modules
              </Button>
            </View>
            <View className="flex-1">
              <Button
                onPress={handleEnable}
                disabled={submitting}
                loading={submitting}
                fullWidth
              >
                {isPending
                  ? "Finish setup"
                  : triggersStripe && !stripeReady
                    ? "Start setup"
                    : `Enable ${meta.label}`}
              </Button>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
}
