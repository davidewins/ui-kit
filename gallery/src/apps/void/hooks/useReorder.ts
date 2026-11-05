import { API_URL } from "@/apps/void/constants/keys";
import useBasketStore from "@/apps/void/context/store/basketStore";
import { supabase } from "@/lib/supabase";
import { fetchWithTimeout } from "@/apps/void/lib/utils/fetchWithTimeout";
import { OrderResponse } from "@/apps/void/types/order";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export const useReorder = () => {
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const { clearBasket, addItem } = useBasketStore();

  const reorder = useCallback(
    async (orderId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setReorderingId(orderId);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) throw new Error("Not authenticated");

        const response = await fetchWithTimeout(
          `${API_URL}/api/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${session.access_token}` } },
          10000,
        );
        if (!response.ok) throw new Error("Failed to fetch order");
        const data = await response.json();
        const order: OrderResponse = data.order;

        clearBasket();

        for (const vendorOrder of order.vendor_orders) {
          for (const item of vendorOrder.order_items) {
            const basketItem = {
              productId: item.product_id,
              variantId: item.variant_id ?? undefined,
              name: item.product_name,
              price: item.unit_price,
              basePrice: item.unit_price,
              thumbnail: "",
              current_stock: null,
              track_stock: null,
              is_out_of_stock: null,
              vendorId: vendorOrder.vendor_id,
              storefrontId: vendorOrder.vendor_storefronts.id,
              fulfillmentLocationId: vendorOrder.vendor_locations.id,
              storefrontName: vendorOrder.vendor_storefronts.name,
              storefrontLogo:
                vendorOrder.vendor_storefronts.logo_path ?? undefined,
              locationAddress: [
                vendorOrder.vendor_locations.address,
                vendorOrder.vendor_locations.city,
              ]
                .filter(Boolean)
                .join(", "),
            };
            for (let q = 0; q < item.quantity; q++) {
              addItem(basketItem);
            }
          }
        }

        router.push("/basket");
      } catch {
        Alert.alert(
          "Reorder failed",
          "Could not load order items. Please try again.",
        );
      } finally {
        setReorderingId(null);
      }
    },
    [addItem, clearBasket],
  );

  return { reorder, reorderingId };
};
