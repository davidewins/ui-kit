import Logger from "@/lib/Logger";
import type { SelectedModifier } from "@/apps/void/types/modifiers";
import { create } from "zustand";

// Item in basket with vendor info
interface BasketItem {
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  basePrice: number;
  variantPriceAdjustment?: number;
  quantity: number;
  thumbnail: string;
  current_stock: number | null;
  track_stock: boolean | null;
  is_out_of_stock: boolean | null;
  // Item configuration (pizza size/toppings, drink flavor, meal deal). A distinct
  // `configKey` = a distinct basket line; simple items have "" and behave as before.
  selectedModifiers?: SelectedModifier[];
  modifierDelta?: number;
  configKey?: string;
  // Vendor info
  vendorId: string;
  storefrontId: string;
  fulfillmentLocationId: string;
  storefrontName: string;
  storefrontLogo?: string;
  locationAddress: string;
}

// Group of items from one storefront at one location
interface VendorBasket {
  vendorId: string;
  storefrontId: string;
  fulfillmentLocationId: string;
  storefrontName: string;
  storefrontLogo?: string;
  locationAddress: string;
  items: BasketItem[];
}

interface BasketStore {
  items: BasketItem[];
  tip: number;
  promoCode: string | null;
  discountAmountCents: number;

  // Actions
  addItem: (item: Omit<BasketItem, "quantity">) => void;
  removeItem: (productId: string, variantId?: string, configKey?: string) => void;
  updateItemQuantity: (
    productId: string,
    variantId: string | undefined,
    quantity: number,
    configKey?: string
  ) => void;
  clearBasket: () => void;
  setTip: (amount: number) => void;
  setPromo: (code: string, discountCents: number) => void;
  clearPromo: () => void;

  // Getters
  findItemById: (
    productId: string,
    variantId?: string,
    configKey?: string
  ) => BasketItem | undefined;
  totalCost: () => number;
  totalCount: () => number;

  // Multi-vendor helpers
  getVendorBaskets: () => VendorBasket[];
  getVendorCount: () => number;
  getBasketForVendor: (
    storefrontId: string,
    locationId: string
  ) => VendorBasket | undefined;
}

const useBasketStore = create<BasketStore>((set, get) => ({
  items: [],
  tip: 0,
  promoCode: null,
  discountAmountCents: 0,

  addItem: (newItem) =>
    set((state) => {
      Logger.log("Adding item to basket:", newItem);

      // Single-vendor enforcement: clear cart if switching storefronts
      const existingStorefrontId = state.items[0]?.storefrontId;
      if (
        existingStorefrontId &&
        existingStorefrontId !== newItem.storefrontId
      ) {
        Logger.log(
          "Switching vendor, clearing basket",
          existingStorefrontId,
          "→",
          newItem.storefrontId,
        );
        // Single-vendor enforcement: clear cart if switching storefronts -
        // and drop any promo with it (vendor-scoped codes must not leak
        // into the new vendor's order).
        return {
          items: [{ ...newItem, quantity: 1 }],
          tip: 0,
          promoCode: null,
          discountAmountCents: 0,
        };
      }

      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.variantId === newItem.variantId &&
          item.storefrontId === newItem.storefrontId &&
          item.fulfillmentLocationId === newItem.fulfillmentLocationId &&
          (item.configKey ?? "") === (newItem.configKey ?? "")
      );

      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
          track_stock:
            newItem.track_stock ?? updatedItems[existingIndex].track_stock,
          is_out_of_stock:
            newItem.is_out_of_stock ??
            updatedItems[existingIndex].is_out_of_stock,
        };
        return { items: updatedItems };
      }

      return { items: [...state.items, { ...newItem, quantity: 1 }] };
    }),

  removeItem: (productId, variantId, configKey) =>
    set((state) => {
      const itemIndex = state.items.findIndex(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId &&
          (configKey === undefined || (item.configKey ?? "") === configKey)
      );
      if (itemIndex === -1) return state;

      const updatedItems = [...state.items];
      if (updatedItems[itemIndex].quantity > 1) {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: updatedItems[itemIndex].quantity - 1,
        };
      } else {
        updatedItems.splice(itemIndex, 1);
      }
      return { items: updatedItems };
    }),

  updateItemQuantity: (productId, variantId, quantity, configKey) =>
    set((state) => {
      const itemIndex = state.items.findIndex(
        (item) =>
          item.productId === productId &&
          item.variantId === variantId &&
          (configKey === undefined || (item.configKey ?? "") === configKey)
      );
      if (itemIndex === -1) return state;

      const updatedItems = [...state.items];
      if (quantity > 0) {
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], quantity };
      } else {
        updatedItems.splice(itemIndex, 1);
      }
      return { items: updatedItems };
    }),

  clearBasket: () => set({ items: [], tip: 0, promoCode: null, discountAmountCents: 0 }),

  setTip: (amount) => set({ tip: amount }),

  setPromo: (code, discountCents) => set({ promoCode: code, discountAmountCents: discountCents }),
  clearPromo: () => set({ promoCode: null, discountAmountCents: 0 }),

  findItemById: (productId, variantId, configKey) =>
    get().items.find(
      (item) =>
        item.productId === productId &&
        item.variantId === variantId &&
        (configKey === undefined || (item.configKey ?? "") === configKey)
    ),

  totalCost: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),

  totalCount: () =>
    get().items.reduce((count, item) => count + item.quantity, 0),

  // Group items by storefront + location
  getVendorBaskets: () => {
    const items = get().items;
    const baskets: Record<string, VendorBasket> = {};

    for (const item of items) {
      const key = `${item.storefrontId}-${item.fulfillmentLocationId}`;

      if (!baskets[key]) {
        baskets[key] = {
          vendorId: item.vendorId,
          storefrontId: item.storefrontId,
          fulfillmentLocationId: item.fulfillmentLocationId,
          storefrontName: item.storefrontName,
          storefrontLogo: item.storefrontLogo,
          locationAddress: item.locationAddress,
          items: [],
        };
      }

      baskets[key].items.push(item);
    }

    return Object.values(baskets);
  },

  getVendorCount: () => get().getVendorBaskets().length,

  getBasketForVendor: (storefrontId, locationId) =>
    get()
      .getVendorBaskets()
      .find(
        (b) =>
          b.storefrontId === storefrontId &&
          b.fulfillmentLocationId === locationId
      ),
}));

export default useBasketStore;
