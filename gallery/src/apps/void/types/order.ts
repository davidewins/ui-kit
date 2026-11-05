/**
 * API contract types for order creation.
 *
 * These MUST match the Zod schema in hq-node/src/controllers/orders/createOrder.ts.
 * NOT database table types (those live in simple.ts via TableRow<>).
 *
 * Item fields like `name` and `price` are required by the backend for:
 * - `name`: point-in-time snapshot (product names can change after order)
 * - `price`: server-side price verification (backend re-checks from DB, logs mismatches)
 * Thumbnails are NOT included because the backend doesn't store them on order items -
 * product images are resolved via product_id when displaying orders.
 */

import type { DropoffLocation } from "./simple";

// =====================================
// ORDER CREATE - REQUEST
// =====================================

export interface CreateOrderRequest {
  vendorOrders: VendorOrderRequest[];
  paymentIntentId: string | null;
  stripePaymentMethodId: string | null;
  fulfillmentType: "pickup" | "platform_delivery" | "vendor_delivery";
  tip: number;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  totalPaid: number;
  /** General delivery instructions (e.g. "gate code 1234") */
  deliveryInstructions: string | null;
  /** Free-text note the customer leaves for the vendor */
  noteForVendor: string | null;
  /** Free-text note the customer leaves for the rider */
  noteForRider: string | null;
  promoCode: string | null;
  discountAmountCents: number;
  /** Store credit applied at checkout (TAK-1218). hq-node recomputes and
   * clamps this - it is never the authority. */
  creditApplied: number;
  dropoffLocation: DropoffLocation | null;
  pickupLocation: string | null;
  /**
   * Staff test order. hq-node waives the platform delivery and service fee
   * after re-checking app_testers; payment is unaffected (TAK-1229).
   */
  testOrder?: boolean;
}

export interface VendorOrderRequest {
  vendorId: string;
  storefrontId: string;
  fulfillmentLocationId: string;
  items: OrderItemRequest[];
  subtotal: number;
  deliveryFee: number;
  fulfillmentType: "pickup" | "platform_delivery" | "vendor_delivery";
}

/** A chosen modifier option, flattened for the order record (the rider reads this). */
export interface OrderItemCustomization {
  group: string;
  option: string;
  price_delta_cents: number;
}

export interface OrderItemRequest {
  productId: string;
  variantId?: string;
  /** Snapshot - backend uses this as display name on the order record */
  name: string;
  /** Client-side price in cents - backend verifies against DB and logs mismatches */
  price: number;
  quantity: number;
  /** Selected item configuration (pizza size/toppings, drink, meal deal). */
  customizations?: OrderItemCustomization[];
}

// =====================================
// ORDER CREATE - RESPONSE
// =====================================

export interface OrderResponse {
  id: string;
  status: string;
  /** The parent order's own status, before /api/orders/:id swapped the
   * store's in. See resolveOrderStatus in hooks/useOrders. */
  parent_status?: string;
  fulfillment_type: string;
  delivery_address?: string | null;
  rider_id?: string | null;
  rider_tip: number;
  delivery_instructions: string | null;
  dropoff_location: DropoffLocation;
  rider?: {
    id: string;
    name: string;
  };
  estimated_delivery_at?: string | null;
  delivered_at?: string | null;
  payment_status: string;
  payment_intent_id: string | null;
  created_at: string;
  cancellable_until: string | null;
  promo_code: string | null;
  discount_amount_cents: number | null;
  // Charged on the order, not the vendor_order: a platform delivery's fee,
  // the service fee, and what the customer actually paid.
  delivery_fee?: number | null;
  service_fee?: number | null;
  total_paid?: number | null;
  vendor_orders: VendorOrderResponse[];
  users?: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
}

export interface VendorOrderResponse {
  id: string;
  vendor_id: string;
  vendor_order_number: number;
  display_id: string;
  status: string;
  subtotal: number;
  platform_commission_amount: number;
  delivery_method: string;
  vendor_delivery_fee: number;
  acceptance_deadline: string;
  accepted_at: string | null;
  prep_time: number | null;
  vendor_storefronts: {
    id: string;
    name: string;
    logo_path: string | null;
    description: string | null;
  };
  vendor_locations: {
    id: string;
    address: string;
    city: string;
    postcode: string;
    latitude: number;
    longitude: number;
    phone_number: string | null;
  };
  order_items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}
