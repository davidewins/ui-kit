import useBasketStore from "@/apps/void/context/store/basketStore";
import { useStore } from "@/apps/void/context/store/vendorStore";
import Logger from "@/lib/Logger";
import {
  buildConfigKey,
  isSelectionComplete,
  modifierDeltaCents,
  parseModifierGroups,
  requiresConfiguration,
  type SelectedModifier,
} from "@/apps/void/types/modifiers";
import * as Haptics from "expo-haptics";
import { Alert } from "react-native";

interface ProductLike {
  id?: string;
  productId?: string;
  variantId?: string;
  name?: string | null;
  basePrice?: number;
  base_price?: number | null;
  price?: number | null;
  thumbnail?: string | null;
  image_url?: string | null;
  track_stock?: boolean | null;
  is_out_of_stock?: boolean | null;
  is_available?: boolean;
  current_stock?: number | null;
  modifier_groups?: unknown;
  // Seller identity carried on the product (from the storefront join). When
  // present these win over the global vendorStore, so adding to basket from a
  // deep link / search stamps the correct store instead of an empty/stale one.
  vendor_id?: string | null;
  storefront_id?: string | null;
  fulfillment_location_id?: string | null;
  storefront_name?: string | null;
  storefront_logo?: string | null;
  storefront_address?: string | null;
}

interface UseProductActionsProps {
  product: ProductLike;
  currentStock: number | null | undefined;
  onUpdate?: () => Promise<void>;
  /** When the store is closed (outside opening hours) adds are blocked. */
  storeClosed?: boolean;
}

export const useProductActions = ({
  product,
  currentStock,
  onUpdate,
  storeClosed = false,
}: UseProductActionsProps) => {
  const { addItem, removeItem, findItemById, items } =
    useBasketStore();

  // Get current vendor context from vendorStore
  const {
    vendorId,
    storefrontId,
    locationId,
    trading_name,
    logo_url,
    address,
  } = useStore();

  // Prefer seller identity carried on the product; fall back to the global
  // vendorStore (set by the storefront screen). This keeps the storefront-menu
  // add path unchanged while fixing add-from-search / add-from-deep-link, where
  // vendorStore is empty or holds a previously-browsed (wrong) store.
  const sellerVendorId = product.vendor_id ?? vendorId ?? "";
  const sellerStorefrontId = product.storefront_id ?? storefrontId ?? "";
  const sellerLocationId = product.fulfillment_location_id ?? locationId ?? "";
  const sellerName = product.storefront_name ?? trading_name ?? "";
  const sellerLogo = product.storefront_logo ?? logo_url ?? undefined;
  const sellerAddress = product.storefront_address ?? address ?? "";

  const productId = product.productId || product.id || "";
  const variantId = product.variantId;
  const trackStock = product.track_stock ?? true;

  // Plain (unconfigured) line only - a configured line for the same product
  // must not feed the list stepper's quantity.
  const itemInBasket = findItemById(productId, variantId, "");
  const quantity = itemInBasket ? itemInBasket.quantity : 0;

  // Stock calculations
  const isStockDepleted =
    (trackStock && currentStock === 0) ||
    product.is_available === false ||
    product.is_out_of_stock === true;

  const isAtStockLimit =
    trackStock &&
    currentStock !== null &&
    currentStock !== undefined &&
    quantity >= currentStock;

  // Helper to add item with vendor info
  const addItemWithVendorInfo = async () => {
    Haptics.selectionAsync();

    const basketItem = {
      productId: productId,
      variantId: variantId,
      name: product.name ?? "",
      price: product.basePrice ?? product.base_price ?? product.price ?? 0,
      basePrice: product.basePrice ?? product.base_price ?? product.price ?? 0,
      thumbnail: product.thumbnail ?? product.image_url ?? "",
      current_stock: currentStock ?? null,
      track_stock: product.track_stock ?? null,
      is_out_of_stock: product.is_out_of_stock ?? null,
      // Vendor info (product-carried, falling back to vendorStore)
      vendorId: sellerVendorId,
      storefrontId: sellerStorefrontId,
      fulfillmentLocationId: sellerLocationId,
      storefrontName: sellerName,
      storefrontLogo: sellerLogo,
      locationAddress: sellerAddress,
    };

    Logger.log("🛒 Adding to basket (via hook):", {
      name: basketItem.name,
      track_stock: basketItem.track_stock,
      is_out_of_stock: basketItem.is_out_of_stock,
      vendorId: basketItem.vendorId,
      storefrontId: basketItem.storefrontId,
      locationId: basketItem.fulfillmentLocationId,
      storefrontName: basketItem.storefrontName,
      storefrontLogo: basketItem.storefrontLogo,
      locationAddress: basketItem.locationAddress,
    });

    addItem(basketItem);

    if (onUpdate) {
      await onUpdate();
    }
  };

  const handleAddToBasket = async () => {
    if (storeClosed) {
      Alert.alert(
        "Store closed",
        "This store isn't accepting orders right now.",
      );
      return;
    }
    if (isStockDepleted || isAtStockLimit) return;

    // Never allow inline add when product requires options (side/drink/size).
    if (requiresConfiguration(product.modifier_groups)) {
      Logger.warn(
        "Blocked add without configuration for product",
        productId,
        product.name,
      );
      return;
    }

    try {
      // Multi-shop basket (TAK-1559): another store's items stay put.
      await addItemWithVendorInfo();
    } catch (error) {
      Logger.error("Error adding to basket:", error);
    }
  };

  const handleRemoveFromBasket = async () => {
    if (!productId) return;

    try {
      Haptics.selectionAsync();
      removeItem(productId, variantId, "");

      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      Logger.error("Error removing from basket:", error);
    }
  };

  /**
   * Add a *configured* product (with selected modifiers) as its own basket line.
   * Unlike the inline +/- add, distinct configurations are distinct lines, and
   * the unit price already includes the modifier deltas.
   */
  const addConfiguredToBasket = async ({
    selectedModifiers,
    quantity: qty = 1,
  }: {
    selectedModifiers: SelectedModifier[];
    quantity?: number;
  }): Promise<boolean> => {
    if (storeClosed) {
      Alert.alert(
        "Store closed",
        "This store isn't accepting orders right now.",
      );
      return false;
    }
    if (isStockDepleted) return false;

    const groups = parseModifierGroups(product.modifier_groups);
    if (groups.length > 0 && !isSelectionComplete(groups, selectedModifiers)) {
      Logger.warn("Blocked incomplete configuration for", product.name);
      Alert.alert(
        "Choose options",
        "Please complete the required choices before adding this item.",
      );
      return false;
    }

    const basePrice =
      product.basePrice ?? product.base_price ?? product.price ?? 0;
    const delta = modifierDeltaCents(selectedModifiers);
    const configKey = buildConfigKey(selectedModifiers);

    const basketItem = {
      productId,
      variantId,
      name: product.name ?? "",
      price: basePrice + delta,
      basePrice,
      thumbnail: product.thumbnail ?? product.image_url ?? "",
      current_stock: currentStock ?? null,
      track_stock: product.track_stock ?? null,
      is_out_of_stock: product.is_out_of_stock ?? null,
      selectedModifiers,
      modifierDelta: delta,
      configKey,
      vendorId: sellerVendorId,
      storefrontId: sellerStorefrontId,
      fulfillmentLocationId: sellerLocationId,
      storefrontName: sellerName,
      storefrontLogo: sellerLogo,
      locationAddress: sellerAddress,
    };

    const doAdd = (): boolean => {
      // Clamp against stock across ALL lines of this product (plain + any
      // configuration) - configured adds previously bypassed every stock cap.
      let toAdd = Math.max(1, qty);
      if (trackStock && currentStock != null) {
        const inBasket = items
          .filter(
            (i) => i.productId === productId && i.variantId === variantId,
          )
          .reduce((sum, i) => sum + i.quantity, 0);
        toAdd = Math.max(0, Math.min(toAdd, currentStock - inBasket));
      }
      if (toAdd === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return false;
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      for (let n = 0; n < toAdd; n++) addItem(basketItem);
      return true;
    };

    return doAdd();
  };

  return {
    quantity,
    isAtStockLimit,
    isStockDepleted,
    isStoreClosed: storeClosed,
    handleAddToBasket,
    handleRemoveFromBasket,
    addConfiguredToBasket,
  };
};
