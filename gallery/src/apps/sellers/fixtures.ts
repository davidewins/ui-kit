// Fixture data for the SELLERS pages in the gallery (TAK-1491). The product is
// a real public listing (G Furniture & Carpets Galway); analytics numbers are
// made up.
import { registerRpcs, registerTables } from "@/gallery/fixtureTables";
import { MODULE_KEYS } from "@/apps/sellers/lib/onboardingCatalog";
import type { ChannelAnalytics } from "@/apps/sellers/hooks/useAnalyticsChannels";
import type { CustomerAnalytics } from "@/apps/sellers/hooks/useAnalyticsCustomers";
import type { RevenueAnalytics } from "@/apps/sellers/hooks/useAnalyticsRevenue";

const ago = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString();
const VENDOR_ID = "v-g-furniture";
const IMG = "concierge/fccb317b-d64d-4f7e-86c0-2c3c2c6e066a";

export const VENDOR = {
  id: VENDOR_ID,
  name: "G Furniture & Carpets Galway",
  stripe_payouts_enabled: true,
};

const LOCATIONS = [
  { id: "l-headford", address: "Headford Road Retail Park", city: "Galway", state: null, country: "IE", postcode: "H91 R6TK", latitude: 53.2856, longitude: -9.0473, address_json: null },
  { id: "l-oranmore", address: "Oranmore Business Park", city: "Oranmore", state: null, country: "IE", postcode: "H91 W2N3", latitude: 53.2687, longitude: -8.9285, address_json: null },
];

export const STOREFRONTS = [
  {
    id: "sf-1",
    vendor_id: VENDOR_ID,
    name: "G Furniture & Carpets Galway",
    is_active: true,
    vendor_category_groups: { name: "Home" },
    vendor_categories: { name: "Furniture" },
    vendor_sub_categories: { name: "Bedroom" },
    storefront_locations: [{ vendor_locations: LOCATIONS[0] }, { vendor_locations: LOCATIONS[1] }],
  },
  {
    id: "sf-2",
    vendor_id: VENDOR_ID,
    name: "G Carpets Outlet",
    is_active: false,
    vendor_category_groups: { name: "Home" },
    vendor_categories: { name: "Flooring" },
    vendor_sub_categories: null,
    storefront_locations: [{ vendor_locations: LOCATIONS[1] }],
  },
];

const images = ["343bd956", "0f3c378d", "146c62b7", "0eeb03b7", "42e73aaf"];

export const PRODUCT = {
  id: "6b6c5dd2-5920-4a5e-b6d9-0d6ef8b11288",
  name: "Mescal Cheval Mirror",
  description:
    "Mescal Cheval Mirror, a design exuding timeless elegance. This mirror boasts a painted matte finish for a sleek appearance. The polished silver handles add sophistication, while classic decorative moulding enhances its charm. With elegant curves throughout, it complements any bedroom decor with grace and style.",
  base_price: 36900,
  compare_at_price: 42900,
  thumbnail: `${IMG}/343bd956.jpg`,
  track_stock: true,
  current_stock: 6,
  is_live: true,
  is_featured: true,
  is_on_sale: true,
  is_manufactured: true,
  is_eighteen_plus: false,
  has_variants: false,
  manufacturer: "Mescal",
  country_of_origin: "Ireland",
  barcode: "5391234567890",
  created_by: "u-owner",
  created_at: ago(40),
  updated_at: ago(2),
  storefront_id: "sf-1",
  vendor_id: VENDOR_ID,
  product_categories: [{ categories: { id: "c-1", name: "Mirrors" } }, { categories: { id: "c-2", name: "Bedroom" } }],
  product_variants: [],
  variant_groups: [],
  product_inventory: [
    { id: "inv-1", location_id: "l-headford", quantity: 4, low_stock_threshold: 2, vendor_locations: LOCATIONS[0] },
    { id: "inv-2", location_id: "l-oranmore", quantity: 2, low_stock_threshold: 2, vendor_locations: LOCATIONS[1] },
  ],
  product_allergens: [],
  product_certifications: [],
  product_ingredients: [],
  product_attribute_values: [
    { attribute_id: "a-1", value: "600 x 1750 mm", category_attributes: { name: "Size" } },
    { attribute_id: "a-2", value: "30 kg", category_attributes: { name: "Weight" } },
    { attribute_id: "a-3", value: "Painted matte", category_attributes: { name: "Finish" } },
  ],
  product_tags: [{ tags: { id: "t-1", name: "Free delivery" } }, { tags: { id: "t-2", name: "Assembly needed" } }],
  product_images: images.map((h, i) => ({ id: `img-${i}`, path: `${IMG}/${h}.jpg`, is_primary: i === 0, order_index: i })),
  product_media: [],
  product_discounts: [{ id: "d-1", discount_type: "percentage", value: 14, start_date: ago(3), end_date: null }],
  product_ratings: [{ id: "r-1", thumbs_up: 18, thumbs_down: 1 }],
  product_questions: [],
  related_products: [
    { related_product: { id: "a96c39d8-3c44-495f-897a-c5949adcd79e", name: "Artemis Blue/Silver B9076A Rug", slug: "artemis-rug" } },
  ],
  vendor_storefronts: {
    id: "sf-1",
    name: "G Furniture & Carpets Galway",
    vendor_categories: { name: "Furniture" },
    storefront_locations: [{ vendor_locations: LOCATIONS[0] }],
  },
};

const spark = (base: number, days: number) =>
  Array.from({ length: days }, (_, i) => Math.round(base * (0.7 + 0.6 * Math.abs(Math.sin(i * 1.3)))));

export function revenue(days: number): RevenueAnalytics {
  return {
    todayCents: 184_300,
    changePct: 12.4,
    periodDays: days,
    weekRevenue: spark(160_000, days),
    ordersCount: 23 * days,
    ordersChangePct: 8.1,
    ordersSpark: spark(23, days),
    aovCents: 7_840,
    aovChangePct: 3.9,
    aovSpark: spark(7_800, days),
    customersCount: 17 * days,
    customersChangePct: -2.3,
    customersSpark: spark(17, days),
    refundsCount: 3,
    refundsChangePct: -40,
    refundsSpark: spark(1, days),
    topProducts: [
      { id: "p1", name: "Mescal Cheval Mirror", sold: 14, revenue: 516_600 },
      { id: "p2", name: "Artemis Blue/Silver Rug", sold: 22, revenue: 151_778 },
      { id: "p3", name: "Oslo Bedside Locker", sold: 19, revenue: 113_810 },
      { id: "p4", name: "Hallway Runner 80x300", sold: 11, revenue: 54_890 },
    ],
    peakHours: ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19"].map((hour, i) => ({
      hour,
      count: [4, 7, 11, 9, 8, 10, 14, 12, 6, 3][i],
    })),
    peakHourLabel: "4pm",
    fulfillmentMix: [
      { type: "platform_delivery", percentage: 58, amount: 1_068_940 },
      { type: "pickup", percentage: 31, amount: 571_330 },
      { type: "vendor_delivery", percentage: 11, amount: 202_730 },
    ],
  };
}

export function channels(days: number): ChannelAnalytics {
  return {
    totalCents: 1_843_000,
    channels: {
      storefront: { cents: 1_012_000, spark: spark(140_000, days), changePct: 14.2 },
      pos: { cents: 541_000, spark: spark(77_000, days), changePct: -3.1 },
      qr: { cents: 98_000, spark: spark(14_000, days), changePct: 22.8 },
      marketplace: { cents: 192_000, spark: spark(27_000, days), changePct: 5.5 },
    },
    storefronts: STOREFRONTS.map((s, i) => ({
      id: s.id,
      name: s.name,
      totalOrders: [148, 23][i],
      totalRevenue: [1_651_000, 192_000][i],
      averageRating: [4.8, 4.5][i],
      isActive: s.is_active,
    })),
  };
}

export const CUSTOMERS: CustomerAnalytics = {
  totalCustomers: 412,
  newThisWeek: 27,
  newChangePct: 18.0,
  repeatRatePct: 34,
  avgLifetimeCents: 21_450,
  retentionCurve: [100, 46, 34, 29, 25, 22, 20, 19],
  topSpenders: [
    { id: "c1", initials: "SM", name: "Sinéad M.", visits: 9, total: 184_200 },
    { id: "c2", initials: "PK", name: "Pádraig K.", visits: 6, total: 129_900 },
    { id: "c3", initials: "EL", name: "Emma L.", visits: 5, total: 96_400 },
  ],
  newSpark: [3, 5, 2, 6, 4, 3, 4],
};

registerTables({
  vendor_owners: [{ vendor_id: VENDOR_ID, user_id: "00000000-0000-4000-8000-000000000001" }],
  vendors: [VENDOR],
  vendor_storefronts: STOREFRONTS,
  products: [PRODUCT],
  order_items: Array.from({ length: 14 }, (_, i) => ({ quantity: 1, subtotal: 36900, created_at: ago(i * 2 + 1) })),
  product_audit_logs: [{ action: "updated", created_at: ago(2), user_id: "u-owner" }],
});
registerRpcs({
  vendor_analytics_revenue: (a) => revenue(Number(a.p_days) || 7),
  vendor_analytics_channels: (a) => channels(Number(a.p_days) || 7),
  vendor_analytics_customers: () => CUSTOMERS,
});

export const MODULES = MODULE_KEYS.map((module_key) => ({
  vendor_id: VENDOR_ID,
  module_key,
  status: "enabled" as const,
  created_at: ago(90),
  updated_at: ago(90),
  setup_started_at: ago(90),
  setup_completed_at: ago(90),
}));
