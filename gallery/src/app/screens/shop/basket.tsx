// VOID's basket screen, remixed for the Shop demo: VOID's own components
// (BasketItem, BasketSectionHeader, BasketFooter, CreditToggleRow,
// BasketEmptyState), laid out exactly as VOID's (protected)/basket.tsx, with
// checkout in the same screen. Data is the Shop's products in VOID's basket store.
import { BasketFooter } from "@/apps/void/components/basket/BasketFooter";
import { BasketSectionHeader } from "@/apps/void/components/basket/BasketSectionHeader";
import { CreditToggleRow } from "@/apps/void/components/basket/CreditToggleRow";
import BasketItem from "@/apps/void/components/BasketItem";
import useBasketStore from "@/apps/void/context/store/basketStore";
import type { BasketItemInterface } from "@/apps/void/types/basket";
import { EmptyState, View } from "@/components/ui";
import { PRODUCTS } from "@/gallery/demo/data";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { Image, Pressable, SectionList } from "react-native";

type FulfillmentType = "pickup" | "platform_delivery" | "vendor_delivery";

const STORE = {
  vendorId: "v-kinetic",
  storefrontId: "s-kinetic",
  fulfillmentLocationId: "l-grafton",
  storefrontName: "Kinetic Running",
  locationAddress: "41 Grafton Street, Dublin 2",
};

// The Shop's bag: three products, VOID's item shape, prices in cents.
const SEED = (["pace", "studio", "shades"] as const).map((id, i) => {
  const p = PRODUCTS.find((x) => x.id === id)!;
  return {
    ...STORE,
    productId: p.id,
    name: p.name,
    price: p.price * 100,
    basePrice: p.price * 100,
    quantity: i === 2 ? 2 : 1,
    thumbnail: Image.resolveAssetSource(p.photos[0] as number)?.uri ?? "",
    current_stock: 12,
    track_stock: true,
    is_out_of_stock: false,
    configKey: "",
  };
});

const SERVICE_FEE = 99;
const DELIVERY_FEE = 349;

export default function ShopBasket() {
  const colors = useThemeColors();
  const items = useBasketStore((s) => s.items);
  const tip = useBasketStore((s) => s.tip);
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("platform_delivery");

  // Before the first paint, so the bag never flashes empty.
  useLayoutEffect(() => {
    if (useBasketStore.getState().items.length === 0) useBasketStore.setState({ items: SEED });
  }, []);

  const subtotalCents = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const deliveryFeeCents = fulfillmentType === "pickup" ? 0 : DELIVERY_FEE;
  const total = subtotalCents + SERVICE_FEE + tip + deliveryFeeCents;

  const sections =
    items.length > 0
      ? [{ key: "store", title: STORE.storefrontName, address: STORE.locationAddress, data: items as BasketItemInterface[] }]
      : [];

  return (
    <View className="bg-background flex-1">
      <Stack.Screen
        options={{
          headerRight: () =>
            items.length > 0 ? (
              <Pressable
                onPress={() => Toast.info("Notes, dropoff and promo code")}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Order options"
              >
                <Ionicons name="options-outline" size={22} color={colors.tint} />
              </Pressable>
            ) : null,
        }}
      />
      {sections.length > 0 ? (
        <SectionList
          style={{ flex: 1 }}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 12 }}
          sections={sections}
          keyExtractor={(item, index) => `${item.productId}-${index}`}
          renderItem={({ item }) => <BasketItem item={item} currentStock={item.current_stock ?? 0} onUpdate={async () => {}} />}
          renderSectionHeader={({ section }) => (
            <BasketSectionHeader
              section={section}
              fulfillment={{
                items,
                fulfillmentType,
                deliveryAvailable: true,
                vendorUsesOwnDelivery: false,
                pickupAvailable: true,
                onFulfillmentTypeChange: setFulfillmentType,
              }}
              arrival={fulfillmentType === "pickup" ? "Ready in 15 min" : "25-35 min"}
            />
          )}
          stickySectionHeadersEnabled={false}
          className="bg-background"
        />
      ) : (
        // VOID's BasketEmptyState, with its button pointed at the Shop (VOID's
        // own goes to its home tab, which the gallery doesn't have).
        <EmptyState
          art={{ image: require("@/apps/void/assets/images/empty/shopping-cart.png") }}
          action={{ label: "Browse the shop", onPress: () => router.dismissTo("/screens/shop/home") }}
          title="Your basket is empty"
          body="Browse the shop and add items to get started."
        />
      )}

      <CreditToggleRow availableCredit={null} />

      <BasketFooter
        items={items}
        totalCost={subtotalCents}
        serviceFee={SERVICE_FEE}
        tip={tip}
        deliveryFee={deliveryFeeCents}
        fulfillmentType={fulfillmentType}
        deliveryAvailable
        vendorUsesOwnDelivery={false}
        deliveryStatusMessage={null}
        onFulfillmentTypeChange={setFulfillmentType}
        storeStatus={{ isOpen: true, statusText: "Open until 20:00" }}
        openingHoursData={null}
        vendorNote=""
        riderNote=""
        paymentSheetInitialized
        isLoading={false}
        hasOutOfStockItems={false}
        canUseStripe
        canAcceptCards
        initError={null}
        deliveryEta={fulfillmentType === "pickup" ? null : "25-35 min"}
        prepTimeMins={15}
        handlePlaceOrder={() => {
          useBasketStore.setState({ items: [] });
          router.push("/screens/orders/track-timeline");
        }}
        onRetryPaymentSetup={() => {}}
        promoCode={null}
        discountAmountCents={0}
        creditApplied={0}
        amountDueOnCard={total}
      />
    </View>
  );
}
