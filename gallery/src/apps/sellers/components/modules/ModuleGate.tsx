import { EnableModuleScreen } from "@/apps/sellers/components/modules/EnableModuleScreen";
import { View } from "@/apps/sellers/components/ui";
import { useCurrentVendor, useCurrentVendorId } from "@/apps/sellers/hooks/useCurrentVendor";
import { useVendorModules } from "@/apps/sellers/hooks/useVendorModules";
import type { ModuleKey } from "@/apps/sellers/lib/onboardingCatalog";
import type { ReactNode } from "react";
import { ActivityIndicator } from "react-native";

interface ModuleGateProps {
  moduleKey: ModuleKey;
  /** Extra module keys that should also open this screen. */
  alsoAllow?: ModuleKey[];
  /** Path to return to once enabled. Passed to EnableModuleScreen. */
  returnTo?: string;
  children: ReactNode;
}

export function ModuleGate({
  moduleKey,
  alsoAllow,
  returnTo,
  children,
}: ModuleGateProps) {
  const { data: vendorId } = useCurrentVendorId();
  const { data: vendor } = useCurrentVendor();
  const { data: modules, isLoading } = useVendorModules(vendorId);

  const stripeReady = !!(vendor as { stripe_payouts_enabled?: boolean } | null)
    ?.stripe_payouts_enabled;

  if (isLoading || !modules) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  const allowedKeys = [moduleKey, ...(alsoAllow ?? [])];
  const active = allowedKeys.some((k) => {
    const m = modules.find((x) => x.module_key === k);
    return m?.status === "enabled" || m?.status === "setup_pending";
  });

  if (!active) {
    return (
      <EnableModuleScreen
        moduleKey={moduleKey}
        vendorId={vendorId}
        stripeReady={stripeReady}
        returnTo={returnTo}
      />
    );
  }

  return <>{children}</>;
}
