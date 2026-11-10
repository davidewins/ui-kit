/**
 * Client-side basket types.
 *
 * These represent the in-memory basket state, not database tables.
 */

import type { SelectedModifier } from "@/apps/void/types/modifiers";

export interface BasketItemInterface {
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
  // Item configuration (see basketStore). "" configKey = simple item.
  selectedModifiers?: SelectedModifier[];
  modifierDelta?: number;
  configKey?: string;
}
