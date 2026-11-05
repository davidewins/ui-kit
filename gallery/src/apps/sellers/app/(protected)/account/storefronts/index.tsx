import { ModuleGate } from "@/apps/sellers/components/modules/ModuleGate";
import {
  EmptyState,
  Pressable,
  ScrollView,
  Text,
  View,
} from "@/apps/sellers/components/ui";
import { useCurrentVendorId } from "@/apps/sellers/hooks/useCurrentVendor";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useGroupSurface } from "@/gallery/groupStyle";
import { supabase } from "@/lib/supabase";
import type { VendorLocation, VendorStorefront } from "@/apps/sellers/types/simple";
import { router, Stack } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  AlertCircle,
  ChevronRight,
  Download,
  MapPin,
  Plus,
} from "lucide-react-native";
import { ActivityIndicator, RefreshControl } from "react-native";

export default function StorefrontsGated() {
  return (
    <ModuleGate moduleKey="online_ordering" alsoAllow={["pos", "qr_ordering"]}>
      <Storefronts />
    </ModuleGate>
  );
}

function Storefronts() {
  const colors = useThemeColors();
  const { card, titleInset } = useGroupSurface();
  const { data: vendorId } = useCurrentVendorId();
  const {
    data: storefronts,
    error,
    isPending,
    refetch,
    isRefetching,
  } = useSafeQuery({
    name: "vendorStorefronts",
    queryKey: ["vendor_storefronts"],
    requiresAuth: true,
    queryFn: () => fetchVendorStorefronts(vendorId || ""),
    enabled: !!vendorId,
  });

  const onRefresh = () => {
    refetch();
  };

  async function fetchVendorStorefronts(
    vendorId: string,
  ): Promise<VendorStorefront[]> {
    const { data, error } = await supabase
      .from("vendor_storefronts")
      .select(
        `
        *,
        vendor_category_groups(name),
        vendor_categories(name),
        vendor_sub_categories(name),
        storefront_locations(
          vendor_locations(id, address, city, country, postcode, latitude, longitude, address_json)
        )
      `,
      )
      .eq("vendor_id", vendorId);

    if (error) {
      throw new Error(error.message);
    }

    const storefronts: VendorStorefront[] = data.map((item) => ({
      ...item,
      vendor_category_groups: item.vendor_category_groups,
      vendor_categories: item.vendor_categories,
      vendor_sub_categories: item.vendor_sub_categories,
      linked_locations:
        (item.storefront_locations
          ?.map((sl) => sl.vendor_locations)
          .filter(
            (loc): loc is NonNullable<typeof loc> => loc != null,
          ) as VendorLocation[]) ?? [],
    }));
    return storefronts;
  }

  if (isPending) {
    return (
      <View className="items-center justify-center flex-1 bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center flex-1 bg-background px-4">
        <View className="w-16 h-16 rounded-full bg-secondary-background items-center justify-center mb-4">
          <AlertCircle size={32} color={colors.error} />
        </View>
        <Text weight="medium" className="text-error text-center">
          Error loading storefronts
        </Text>
        <Text className="text-muted text-center mt-2 text-sm">
          {error.message}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          tintColor={colors.text}
        />
      }
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          title: "Storefronts",
          headerRight: () => (
            <View className="flex-row items-center gap-4 px-2">
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  router.push("/import-gbp");
                }}
                hitSlop={12}
                style={({ pressed }) => ({
                  paddingHorizontal: 12,
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Download size={20} color={colors.text} />
              </Pressable>
              <Pressable
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  router.push("/create-storefront");
                }}
                hitSlop={12}
                style={({ pressed }) => ({
                  paddingHorizontal: 12,
                  opacity: pressed ? 0.5 : 1,
                })}
              >
                <Plus size={20} color={colors.text} />
              </Pressable>
            </View>
          ),
        }}
      />

      <View className="px-0 py-4" style={{ flexGrow: 1 }}>
        {storefronts && storefronts.length > 0 ? (
          <>
            {/* Summary line - total + live count. Import / New live in the
                headerRight icons above. */}
            <View className="mb-2" style={{ marginHorizontal: titleInset }}>
              <Text
                weight="semibold"
                className="text-[13px]"
                style={{ color: colors.muted }}
              >
                {storefronts.length} storefront
                {storefronts.length === 1 ? "" : "s"} ·{" "}
                {storefronts.filter((s) => s.is_active).length} live
              </Text>
            </View>

            <View style={card(18)}>
              {storefronts.map((storefront, index) => {
                const rail = storefront.is_active
                  ? colors.success
                  : colors.muted;
                const firstLoc = storefront.linked_locations?.[0];
                const category =
                  storefront.vendor_categories?.name ||
                  storefront.vendor_category_groups?.name ||
                  storefront.vendor_sub_categories?.name ||
                  null;
                const locLabel = firstLoc
                  ? [firstLoc.address, firstLoc.city]
                      .filter(Boolean)
                      .join(", ")
                  : "No location linked";
                const metaLine = [locLabel, category]
                  .filter(Boolean)
                  .join(" · ");
                const isLast = index === storefronts.length - 1;
                return (
                  <View key={storefront.id}>
                    <Pressable
                      onPress={() => {
                        Haptics.selectionAsync().catch(() => {});
                        router.push(`/account/storefronts/${storefront.id}`);
                      }}
                      className="flex-row items-center px-4 active:bg-surface-elevated"
                      style={{ paddingVertical: 11, minHeight: 44 }}
                    >
                      <View
                        style={{
                          width: 3,
                          alignSelf: "stretch",
                          marginVertical: 6,
                          marginRight: 11,
                          borderRadius: 2,
                          backgroundColor: rail,
                        }}
                      />
                      <View className="flex-1 pr-2">
                        <View className="flex-row items-center gap-2">
                          <Text
                            weight="semibold"
                            className="text-[15px] text-text"
                            numberOfLines={1}
                            style={{ letterSpacing: -0.2 }}
                          >
                            {storefront.name}
                          </Text>
                          <Text
                            weight="semibold"
                            className="text-[13px]"
                            style={{ color: rail }}
                          >
                            {storefront.is_active ? "Live" : "Inactive"}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1 mt-0.5">
                          <MapPin
                            size={11}
                            color={colors.muted}
                            strokeWidth={2}
                          />
                          <Text
                            className="text-[12px] flex-1"
                            style={{ color: colors.muted }}
                            numberOfLines={1}
                          >
                            {metaLine || locLabel}
                          </Text>
                        </View>
                      </View>
                      <ChevronRight
                        size={15}
                        color={colors.muted}
                        strokeWidth={2}
                      />
                    </Pressable>
                    {isLast ? null : (
                      <View
                        style={{
                          height: 1,
                          backgroundColor: colors.border,
                          marginLeft: 30,
                        }}
                      />
                    )}
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <EmptyState
            art={{ image: require("@/apps/sellers/assets/images/empty/shop.png") }}
            title="No storefronts yet"
            body="Create your first storefront to start taking orders."
            action={{
              label: "Create storefront",
              plus: true,
              onPress: () => router.push("/create-storefront"),
            }}
          />
        )}
      </View>
    </ScrollView>
  );
}
