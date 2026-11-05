// The order screen. David picked the receipt-led variant on 2026-09-24
// ("going with #1: receipt FOR NOW"), so it is no longer a showroom entry:
// this IS the screen. Variants 2 and 3 stay at /orders/[id]/variant/[n] for
// comparison, and the previous screen is preserved at
// components/orders/LegacyOrderDetails.tsx until the receipt has had a device
// pass.
//
// Taste anchor is TAK-1178, in his words: Apple Maps minimal, a muted
// monochrome map, one thin route, pins only, a sheet over the map, pickup and
// drop-off always rendered, the rider shown with a freshness label when a
// recent location exists, and no endless "Locating rider".
import { LoadErrorState } from "@/components/LoadErrorState";
import { VariantOneReceipt } from "@/apps/void/components/orders/variants/VariantOneReceipt";
import { useVariantOrder } from "@/apps/void/components/orders/variants/useVariantOrder";
import { View } from "@/components/ui";
import { useThemeColors } from "@/hooks/useThemeColors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function OrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();

  // Every hook runs before any early return. Putting the model behind a guard
  // would make it a conditional hook, which typecheck does not catch and which
  // crashes at runtime.
  const model = useVariantOrder(id ?? "");

  // A bad or stale id lands on a dead route: bounce to the list rather than
  // trapping the customer on a spinner.
  const notFound =
    !id ||
    (!model.isLoading && !model.isRefetching && !model.error && !model.order);
  useEffect(() => {
    if (notFound) router.replace("/void/(protected)/orders");
  }, [notFound]);

  if (model.isLoading || notFound) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (model.error) {
    return (
      <LoadErrorState
        title="Couldn't load order"
        message="Check your connection and try again."
        onRetry={model.refetch}
        retrying={model.isRefetching}
        secondaryLabel="View all orders"
        onSecondary={() => router.replace("/void/(protected)/orders")}
      />
    );
  }

  if (!model.order) return null;

  return <VariantOneReceipt model={model} />;
}
