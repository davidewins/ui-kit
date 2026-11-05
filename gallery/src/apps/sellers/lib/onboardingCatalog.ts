// Workspace-local onboarding taxonomy + UI copy (mobile).
// Mirrors takeover-software/src/lib/onboardingCatalog.ts and hq-node's source of
// truth. TAK-294 Task 2 will hoist this to packages/shared/onboarding.

export const VERTICALS = [
  "restaurant",
  "takeaway",
  "cafe",
  "grocery",
  "retailer",
  "market_stall",
  "other",
] as const;

export type Vertical = (typeof VERTICALS)[number];

export const VERTICAL_SUBTYPE_VALUES = ["table_service", "quick_serve"] as const;
export type VerticalSubtype = (typeof VERTICAL_SUBTYPE_VALUES)[number];

export const MODULE_KEYS = [
  "pos",
  "online_ordering",
  "qr_ordering",
  "marketplace",
  "stock",
  "rostering",
  "haccp",
  "recipe_costing",
  "supplier_management",
  "customer_crm",
  "reservations",
  "reports",
  "allergens",
  "document_expiry",
  "loyalty",
  "gift_cards",
  "table_management",
] as const;

export type ModuleKey = (typeof MODULE_KEYS)[number];

export const STRIPE_MODULES: readonly ModuleKey[] = [
  "pos",
  "online_ordering",
  "qr_ordering",
  "marketplace",
];
export const MODULES_TRIGGERING_STRIPE = STRIPE_MODULES;

export const DEFAULT_MODULES_BY_VERTICAL: Record<Vertical, readonly ModuleKey[]> = {
  restaurant: [
    "pos",
    "online_ordering",
    "marketplace",
    "stock",
    "rostering",
    "haccp",
    "allergens",
    "reports",
  ],
  takeaway: [
    "pos",
    "online_ordering",
    "qr_ordering",
    "marketplace",
    "stock",
    "rostering",
    "haccp",
    "allergens",
    "reports",
  ],
  cafe: [
    "pos",
    "qr_ordering",
    "marketplace",
    "stock",
    "rostering",
    "haccp",
    "allergens",
    "reports",
  ],
  grocery: ["pos", "stock", "rostering", "reports"],
  retailer: ["pos", "stock", "rostering", "reports"],
  market_stall: ["pos", "stock", "reports"],
  other: ["pos", "stock", "reports"],
};

// Modules that are disabled / not yet implemented. Hidden from defaults and
// rendered as non-selectable in the picker.
export const COMING_SOON_MODULES: ReadonlySet<ModuleKey> = new Set([
  "recipe_costing",
  "customer_crm",
  "reservations",
  "loyalty",
  "gift_cards",
  "table_management",
]);

export const VERTICAL_SUBTYPES: Partial<Record<Vertical, readonly VerticalSubtype[]>> = {
  cafe: ["table_service", "quick_serve"],
};

export const VERTICAL_COPY: Record<Vertical, { label: string; subtitle: string }> = {
  restaurant: {
    label: "Restaurant",
    subtitle: "Sit-down dining, table service.",
  },
  takeaway: {
    label: "Takeaway",
    subtitle: "Order-ahead, counter collection or delivery.",
  },
  cafe: {
    label: "Café",
    subtitle: "Coffee, lunch, bakes.",
  },
  grocery: {
    label: "Grocery",
    subtitle: "Convenience, speciality, or full supermarket.",
  },
  retailer: {
    label: "Retailer",
    subtitle: "Clothing, homeware, gifts, anything non-food.",
  },
  market_stall: {
    label: "Market stall",
    subtitle: "Pop-ups, farmers' markets, trade fairs.",
  },
  other: {
    label: "Something else",
    subtitle: "We'll start you with the basics.",
  },
};

export const VERTICAL_SUBTYPE_COPY: Record<
  VerticalSubtype,
  { label: string; subtitle: string }
> = {
  table_service: {
    label: "Sit-down café",
    subtitle: "Customers order at the table, you bring it to them.",
  },
  quick_serve: {
    label: "Quick-serve counter",
    subtitle: "Customers order at the counter and take it away.",
  },
};

export const MODULE_CATALOG: Record<ModuleKey, { label: string; description: string; comingSoon?: boolean }> = {
  pos: {
    label: "Point of sale",
    description: "Take payments at the counter, table, or on mobile.",
  },
  online_ordering: {
    label: "Online ordering",
    description: "Take orders from your own website, zero commission.",
  },
  qr_ordering: {
    label: "QR ordering",
    description: "Customers scan at the table, order, and pay.",
  },
  marketplace: {
    label: "VOID marketplace",
    description: "Get discovered by new customers on the VOID app.",
  },
  stock: {
    label: "Stock control",
    description: "Track inventory, set par levels, see what's running low.",
  },
  rostering: {
    label: "Rostering",
    description: "Build shift schedules and share them with your team.",
  },
  haccp: {
    label: "HACCP",
    description: "Food-safety checks, temperatures, cleaning logs.",
  },
  recipe_costing: {
    label: "Recipe costing",
    description: "Break dishes down to ingredient cost and margin.",
    comingSoon: true,
  },
  supplier_management: {
    label: "Supplier management",
    description: "Keep your supplier list, POs, and delivery notes in one place.",
  },
  customer_crm: {
    label: "Customer CRM",
    description: "Profiles, visit history, notes - know your regulars.",
    comingSoon: true,
  },
  reservations: {
    label: "Reservations",
    description: "Take bookings, manage covers, avoid double-seating.",
    comingSoon: true,
  },
  reports: {
    label: "Reports",
    description: "Sales by day, category, staff - the numbers you care about.",
  },
  allergens: {
    label: "Allergens",
    description: "Menu labelling compliant with EU 1169 / FSAI requirements.",
  },
  document_expiry: {
    label: "Compliance",
    description: "Licences, certs, HACCP plan - every document with expiry tracked.",
  },
  loyalty: {
    label: "Loyalty",
    description: "Points, stamp cards, repeat-visit rewards.",
    comingSoon: true,
  },
  gift_cards: {
    label: "Gift cards",
    description: "Sell and redeem physical or digital gift cards.",
    comingSoon: true,
  },
  table_management: {
    label: "Table management",
    description: "Floor plan, table turn times, server sections.",
    comingSoon: true,
  },
};

export function moduleIsComingSoon(key: ModuleKey): boolean {
  return COMING_SOON_MODULES.has(key);
}

export type ModuleCategory = {
  key: string;
  label: string;
  modules: readonly ModuleKey[];
};

export const MODULE_CATEGORIES: readonly ModuleCategory[] = [
  {
    key: "sell",
    label: "Selling",
    modules: ["pos", "online_ordering", "qr_ordering", "marketplace", "reservations"],
  },
  {
    key: "operations",
    label: "Operations",
    modules: [
      "stock",
      "rostering",
      "table_management",
      "supplier_management",
      "recipe_costing",
    ],
  },
  {
    key: "compliance",
    label: "Compliance",
    modules: ["haccp", "allergens", "document_expiry"],
  },
  {
    key: "customers",
    label: "Customers",
    modules: ["customer_crm", "loyalty", "gift_cards"],
  },
  {
    key: "insights",
    label: "Insights",
    modules: ["reports"],
  },
];

export function defaultModulesForVertical(vertical: Vertical): readonly ModuleKey[] {
  return DEFAULT_MODULES_BY_VERTICAL[vertical] ?? [];
}

export function moduleTriggersStripe(moduleKey: ModuleKey): boolean {
  return (STRIPE_MODULES as readonly string[]).includes(moduleKey);
}

export function subtypesForVertical(vertical: Vertical): readonly VerticalSubtype[] {
  return VERTICAL_SUBTYPES[vertical] ?? [];
}

export function verticalRequiresSubtype(vertical: Vertical): boolean {
  return subtypesForVertical(vertical).length > 0;
}

export function isValidModuleKey(value: unknown): value is ModuleKey {
  return typeof value === "string" && (MODULE_KEYS as readonly string[]).includes(value);
}

export function isValidVertical(value: unknown): value is Vertical {
  return typeof value === "string" && (VERTICALS as readonly string[]).includes(value);
}

export function isValidSubtype(value: unknown): value is VerticalSubtype {
  return value === "table_service" || value === "quick_serve";
}
