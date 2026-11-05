// Fixture data for the VOID pages in the gallery (TAK-1491). Shapes are VOID's
// own API types; store names and logo paths are real public storefronts.
import { registerTables } from "@/gallery/fixtureTables";
import type { OrderLive } from "@/apps/void/lib/orderLive";
import type { OrderListItem } from "@/apps/void/hooks/useOrders";
import type { OrderResponse, VendorOrderResponse } from "@/apps/void/types/order";

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
const ahead = (minutes: number) => new Date(Date.now() + minutes * 60_000).toISOString();

const STORES = {
  cloonKeen: {
    id: "s-cloon-keen",
    name: "Cloon Keen",
    logo_path: "concierge/035bcdbf-a0eb-4f5d-8a99-60bcdba4fea8/logo.png",
    description: "Perfumery",
    address: "3 Victoria Place",
    lat: 53.2741,
    lng: -9.0487,
  },
  fonez: {
    id: "s-fonez",
    name: "Fonez 4u",
    logo_path: "concierge/32fc97ae-0790-4860-9c72-a32caadcbe5d/logo.png",
    description: "Phones and accessories",
    address: "12 Shop Street",
    lat: 53.2729,
    lng: -9.0523,
  },
  cunniffe: {
    id: "s-cunniffe",
    name: "Cunniffe Electrical",
    logo_path: "concierge/61000bb5-72af-4523-9add-743de7adf586/logo.png",
    description: "Electrical",
    address: "Unit 4, Liosban",
    lat: 53.2905,
    lng: -9.0264,
  },
  claracrafts: {
    id: "s-claracrafts",
    name: "Claracrafts",
    logo_path: "concierge/29e13739-358b-4ad5-85d0-b1ea634e5e42/logo.jpg",
    description: "Handmade crafts",
    address: "8 Quay Street",
    lat: 53.2706,
    lng: -9.0541,
  },
};
type Store = (typeof STORES)[keyof typeof STORES];

const DROPOFF = {
  address: "14 Raleigh Row, Salthill, Galway",
  location: { latitude: 53.2602, longitude: -9.0766 },
};

function vendorOrder(
  n: number,
  store: Store,
  status: string,
  items: [string, number, number][],
  placedMinutesAgo: number,
): VendorOrderResponse {
  const order_items = items.map(([product_name, quantity, unit_price], i) => ({
    id: `oi-${n}-${i}`,
    product_id: `p-${n}-${i}`,
    variant_id: null,
    product_name,
    quantity,
    unit_price,
    subtotal: quantity * unit_price,
  }));
  return {
    id: `vo-${n}`,
    vendor_id: `v-${store.id}`,
    vendor_order_number: 1000 + n,
    display_id: ["1FCB", "2A7D", "3K9Q", "4M2X", "5T8R"][n - 1],
    status,
    subtotal: order_items.reduce((s, i) => s + i.subtotal, 0),
    platform_commission_amount: 0,
    delivery_method: "platform_delivery",
    vendor_delivery_fee: 0,
    acceptance_deadline: ago(placedMinutesAgo - 5),
    accepted_at: ago(placedMinutesAgo - 2),
    prep_time: 15,
    vendor_storefronts: {
      id: store.id,
      name: store.name,
      logo_path: store.logo_path,
      description: store.description,
    },
    vendor_locations: {
      id: `l-${store.id}`,
      address: store.address,
      city: "Galway",
      postcode: "H91",
      latitude: store.lat,
      longitude: store.lng,
      phone_number: "+353 91 000 000",
    },
    order_items,
  };
}

function order(
  n: number,
  status: string,
  fulfillment_type: string,
  placedMinutesAgo: number,
  vo: VendorOrderResponse,
  extra: Partial<OrderResponse> = {},
): OrderResponse {
  const deliveryFee = fulfillment_type === "pickup" ? 0 : 399;
  return {
    id: `order-${n}`,
    status,
    fulfillment_type,
    delivery_address: fulfillment_type === "pickup" ? null : DROPOFF.address,
    rider_id: null,
    rider_tip: 200,
    delivery_instructions: "Blue door, ring twice",
    dropoff_location: DROPOFF,
    payment_status: "succeeded",
    payment_intent_id: `pi_${n}`,
    created_at: ago(placedMinutesAgo),
    cancellable_until: null,
    promo_code: null,
    discount_amount_cents: null,
    delivery_fee: deliveryFee,
    service_fee: 99,
    total_paid: vo.subtotal + deliveryFee + 99 + 200,
    vendor_orders: [vo],
    ...extra,
  };
}

export const ORDERS: OrderResponse[] = [
  order(
    1,
    "rider_picked_up",
    "platform_delivery",
    24,
    vendorOrder(1, STORES.fonez, "rider_picked_up", [
      ["USB-C fast charger 30W", 1, 2499],
      ["Tempered glass screen protector", 2, 999],
    ], 24),
    {
      rider_id: "rider-1",
      rider: { id: "rider-1", name: "Cian" },
      estimated_delivery_at: ahead(9),
    },
  ),
  order(
    2,
    "preparing",
    "platform_delivery",
    8,
    vendorOrder(2, STORES.cloonKeen, "preparing", [
      ["Eau de parfum 50ml", 1, 9500],
      ["Scented candle", 1, 3800],
    ], 8),
    { estimated_delivery_at: ahead(32), cancellable_until: ahead(2) },
  ),
  order(
    3,
    "delivered",
    "platform_delivery",
    60 * 26,
    vendorOrder(3, STORES.cunniffe, "delivered", [
      ["LED bulb, warm white (4 pack)", 2, 1299],
      ["Extension lead, 4 way", 1, 1899],
    ], 60 * 26),
    { delivered_at: ago(60 * 25), rider: { id: "rider-2", name: "Niamh" } },
  ),
  order(
    4,
    "refunded",
    "platform_delivery",
    60 * 24 * 4,
    vendorOrder(4, STORES.claracrafts, "vendor_declined", [
      ["Hand-thrown mug", 2, 2200],
    ], 60 * 24 * 4),
    { parent_status: "refunded" },
  ),
  order(
    5,
    "completed",
    "pickup",
    60 * 24 * 9,
    vendorOrder(5, STORES.fonez, "completed", [["Phone case, clear", 1, 1499]], 60 * 24 * 9),
  ),
];

export const ORDER_LIST: OrderListItem[] = ORDERS.map((o) => ({
  id: o.id,
  status: o.status,
  parent_status: o.parent_status,
  fulfillment_type: o.fulfillment_type,
  created_at: o.created_at,
  vendor_orders: o.vendor_orders.map((vo) => ({
    id: vo.id,
    display_id: vo.display_id,
    status: vo.status,
    subtotal: vo.subtotal,
    vendor_storefronts: {
      name: vo.vendor_storefronts.name,
      logo_path: vo.vendor_storefronts.logo_path,
    },
    vendor_locations: { address: vo.vendor_locations.address, city: "Galway" },
    order_items: vo.order_items.map((i) => ({
      product_name: i.product_name,
      quantity: i.quantity,
    })),
  })),
}));

export function orderLive(orderId: string): OrderLive {
  const o = ORDERS.find((x) => x.id === orderId) ?? ORDERS[0];
  return {
    orderId: o.id,
    status: o.status,
    storeName: o.vendor_orders[0].vendor_storefronts.name,
    estimatedDeliveryAt: o.estimated_delivery_at ?? null,
    readyAt: ago(6),
    rider: {
      id: "rider-1",
      firstName: "Cian",
      position: { lat: 53.2668, lng: -9.0652, updatedAt: ago(0.5) },
    },
    customer: { firstName: "Aoife" },
  };
}

export const NOTIFICATION_SETTINGS = {
  order_updates: true,
  chat_messages: true,
  chat_reactions: false,
  promotions: false,
  basket_reminders: true,
  security_alerts: true,
  email_receipts: true,
  email_order_updates: false,
  email_promotions: false,
  email_weekly_summary: false,
};

registerTables({
  users: [
    {
      id: "00000000-0000-4000-8000-000000000001",
      first_name: "Aoife",
      last_name: "Byrne",
      email: "aoife@example.com",
      phone_number: "+353 87 000 0000",
    },
  ],
  notification_settings: [{ user_id: "00000000-0000-4000-8000-000000000001", ...NOTIFICATION_SETTINGS }],
});
