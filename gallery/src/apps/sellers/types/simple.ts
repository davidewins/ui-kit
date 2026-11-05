import type { TableInsert, TableRow, TableUpdate } from "./table-helpers";

// ============================================
// Shared Primitives
// ============================================

/**
 * PostGIS geography(Point, 4326) as returned by Supabase over JSON.
 * Supabase serialises PostGIS geography columns as GeoJSON Feature objects,
 * but the raw point value on a row comes back as the GeoJSON geometry itself.
 */
export interface GeoPoint {
  type: "Point";
  /** [longitude, latitude] - GeoJSON standard order */
  coordinates: [longitude: number, latitude: number];
  crs?: {
    type: "name";
    properties: { name: "urn:ogc:def:crs:EPSG::4326" };
  };
}

// ============================================
// Chat Identity Types (Stream Chat)
// ============================================

/**
 * Represents a single chat identity for a user.
 * Users can have multiple identities (personal + one per storefront they own).
 * Stored in the `stream_chat_identities` table.
 */
export interface ChatIdentity {
  id: string; // Database ID from stream_chat_identities table
  stream_user_id: string; // The actual ID used in Stream Chat system
  identity_type: "personal" | "storefront"; // Type of identity
  storefront_id: string | null; // Linked storefront (null for personal identity)
  display_name: string; // Name shown in chat
  avatar_url: string | null; // Profile picture URL
  is_active: boolean; // Whether this is the currently active identity
}

// ============================================
// Database Table Types
// ============================================

// Assignment Scope Type
export type VendorStaffStatus = "active" | "on_holiday" | "suspended";

export type AssignmentScopeType =
  | "vendor_wide"
  | "storefront_specific"
  | "location_specific_all_storefronts_at_location"
  | "location_specific";

// Allergens
export type Allergen = TableRow<"allergens">;
export type AllergenInsert = TableInsert<"allergens">;
export type AllergenUpdate = TableUpdate<"allergens">;

// Badge Count
export type NotificationBadgeCount = TableRow<"notification_badge_count">;
export type NotificationBadgeCountInsert =
  TableInsert<"notification_badge_count">;
export type NotificationBadgeCountUpdate =
  TableUpdate<"notification_badge_count">;

// Brands
export type Brand = TableRow<"brands">;
export type BrandInsert = TableInsert<"brands">;
export type BrandUpdate = TableUpdate<"brands">;

// Bundle Items
export type BundleItem = TableRow<"bundle_items">;
export type BundleItemInsert = TableInsert<"bundle_items">;
export type BundleItemUpdate = TableUpdate<"bundle_items">;

// Categories
export type Category = TableRow<"categories">;
export type CategoryInsert = TableInsert<"categories">;
export type CategoryUpdate = TableUpdate<"categories">;

// Category Allergens
export type CategoryAllergen = TableRow<"category_allergens">;
export type CategoryAllergenInsert = TableInsert<"category_allergens">;
export type CategoryAllergenUpdate = TableUpdate<"category_allergens">;

// Category Attributes
export type CategoryAttribute = TableRow<"category_attributes">;
export type CategoryAttributeInsert = TableInsert<"category_attributes">;
export type CategoryAttributeUpdate = TableUpdate<"category_attributes">;

// Category Certifications
export type CategoryCertification = TableRow<"category_certifications">;
export type CategoryCertificationInsert =
  TableInsert<"category_certifications">;
export type CategoryCertificationUpdate =
  TableUpdate<"category_certifications">;

// Category Ingredients
export type CategoryIngredient = TableRow<"category_ingredients">;
export type CategoryIngredientInsert = TableInsert<"category_ingredients">;
export type CategoryIngredientUpdate = TableUpdate<"category_ingredients">;

// Category Tags
export type CategoryTag = TableRow<"category_tags">;
export type CategoryTagInsert = TableInsert<"category_tags">;
export type CategoryTagUpdate = TableUpdate<"category_tags">;

// Certifications
export type Certification = TableRow<"certifications">;
export type CertificationInsert = TableInsert<"certifications">;
export type CertificationUpdate = TableUpdate<"certifications">;

// Commission Rates
export type CommissionRate = TableRow<"commission_rates">;
export type CommissionRateInsert = TableInsert<"commission_rates">;
export type CommissionRateUpdate = TableUpdate<"commission_rates">;

// Delivery Zones
export type DeliveryZone = TableRow<"delivery_zones">;
export type DeliveryZoneInsert = TableInsert<"delivery_zones">;
export type DeliveryZoneUpdate = TableUpdate<"delivery_zones">;

// Feedback
export type Feedback = TableRow<"feedback">;
export type FeedbackInsert = TableInsert<"feedback">;
export type FeedbackUpdate = TableUpdate<"feedback">;

// GDPR Requests
export type GdprRequest = TableRow<"gdpr_requests">;
export type GdprRequestInsert = TableInsert<"gdpr_requests">;
export type GdprRequestUpdate = TableUpdate<"gdpr_requests">;

// Health Checks
export type HealthCheck = TableRow<"health_checks">;
export type HealthCheckInsert = TableInsert<"health_checks">;
export type HealthCheckUpdate = TableUpdate<"health_checks">;

// Ingredients
export type Ingredient = TableRow<"ingredients">;
export type IngredientInsert = TableInsert<"ingredients">;
export type IngredientUpdate = TableUpdate<"ingredients">;

// MCC Codes
export type MccCode = TableRow<"mcc_codes">;
export type MccCodeInsert = TableInsert<"mcc_codes">;
export type MccCodeUpdate = TableUpdate<"mcc_codes">;

// Orders
export type Order = TableRow<"orders">;
export type OrderInsert = TableInsert<"orders">;
export type OrderUpdate = TableUpdate<"orders">;

// Vendor Orders (Sub-orders, one per storefront)
export type VendorOrder = TableRow<"vendor_orders">;
export type VendorOrderInsert = TableInsert<"vendor_orders">;
export type VendorOrderUpdate = TableUpdate<"vendor_orders">;

// Order Items (Individual products in vendor orders)
export type OrderItem = TableRow<"order_items">;
export type OrderItemInsert = TableInsert<"order_items">;
export type OrderItemUpdate = TableUpdate<"order_items">;

// Enhanced Order Types with Relations
export type OrderWithDetails = Order & {
  vendor_orders?: VendorOrderWithDetails[];
  rider?: {
    id: string;
    first_name: string;
    phone_number: string;
  } | null;
  user?: {
    id: string;
    first_name: string;
    phone_number: string;
  } | null;
};

export type VendorOrderWithDetails = VendorOrder & {
  vendor_storefronts?: {
    id: string;
    name: string;
    logo_path: string | null;
  } | null;
  vendor_locations?: {
    id: string;
    address: string;
    city: string;
    postcode: string;
  } | null;
  order_items?: OrderItemWithProduct[];
  parent_order?: {
    id: string;
    customer_id: string | null;
    dropoff_location: GeoPoint | null;
    delivery_instructions: string | null;
    eta: string | null;
  } | null;
};

export type OrderItemWithProduct = OrderItem & {
  product?: {
    id: string;
    name: string;
    thumbnail: string | null;
  } | null;
  variant?: {
    id: string;
    name: string;
  } | null;
};

// Payment Sessions
export type PaymentSession = TableRow<"payment_sessions">;
export type PaymentSessionInsert = TableInsert<"payment_sessions">;
export type PaymentSessionUpdate = TableUpdate<"payment_sessions">;

// Payment Transactions
export type PaymentTransaction = TableRow<"payment_transactions">;
export type PaymentTransactionInsert = TableInsert<"payment_transactions">;
export type PaymentTransactionUpdate = TableUpdate<"payment_transactions">;

// Pending Rider Payments
export type PendingRiderPayment = TableRow<"pending_rider_payments">;
export type PendingRiderPaymentInsert = TableInsert<"pending_rider_payments">;
export type PendingRiderPaymentUpdate = TableUpdate<"pending_rider_payments">;

// Product Allergens
export type ProductAllergen = TableRow<"product_allergens">;
export type ProductAllergenInsert = TableInsert<"product_allergens">;
export type ProductAllergenUpdate = TableUpdate<"product_allergens">;

// Product Attribute Values
export type ProductAttributeValue = TableRow<"product_attribute_values">;
export type ProductAttributeValueInsert =
  TableInsert<"product_attribute_values">;
export type ProductAttributeValueUpdate =
  TableUpdate<"product_attribute_values">;

// Product Audit Logs
export type ProductAuditLog = TableRow<"product_audit_logs">;
export type ProductAuditLogInsert = TableInsert<"product_audit_logs">;
export type ProductAuditLogUpdate = TableUpdate<"product_audit_logs">;

// Product Bundles
export type ProductBundle = TableRow<"product_bundles">;
export type ProductBundleInsert = TableInsert<"product_bundles">;
export type ProductBundleUpdate = TableUpdate<"product_bundles">;

// Product Categories
export type ProductCategory = TableRow<"product_categories">;
export type ProductCategoryInsert = TableInsert<"product_categories">;
export type ProductCategoryUpdate = TableUpdate<"product_categories">;

// Product Certifications
export type ProductCertification = TableRow<"product_certifications">;
export type ProductCertificationInsert = TableInsert<"product_certifications">;
export type ProductCertificationUpdate = TableUpdate<"product_certifications">;

// Product Discounts
export type ProductDiscount = TableRow<"product_discounts">;
export type ProductDiscountInsert = TableInsert<"product_discounts">;
export type ProductDiscountUpdate = TableUpdate<"product_discounts">;

// Product Images
export type ProductImage = TableRow<"product_images">;
export type ProductImageInsert = TableInsert<"product_images">;
export type ProductImageUpdate = TableUpdate<"product_images">;

// Product Ingredients
export type ProductIngredient = TableRow<"product_ingredients">;
export type ProductIngredientInsert = TableInsert<"product_ingredients">;
export type ProductIngredientUpdate = TableUpdate<"product_ingredients">;

// Product Inventory
export type ProductInventory = TableRow<"product_inventory">;
export type ProductInventoryInsert = TableInsert<"product_inventory">;
export type ProductInventoryUpdate = TableUpdate<"product_inventory">;

// Product Media
export type ProductMedia = TableRow<"product_media">;
export type ProductMediaInsert = TableInsert<"product_media">;
export type ProductMediaUpdate = TableUpdate<"product_media">;

// Product Questions
export type ProductQuestion = TableRow<"product_questions">;
export type ProductQuestionInsert = TableInsert<"product_questions">;
export type ProductQuestionUpdate = TableUpdate<"product_questions">;

// Product Ratings
export type ProductRating = TableRow<"product_ratings">;
export type ProductRatingInsert = TableInsert<"product_ratings">;
export type ProductRatingUpdate = TableUpdate<"product_ratings">;

// Product Return Policies
export type ProductReturnPolicy = TableRow<"product_return_policies">;
export type ProductReturnPolicyInsert = TableInsert<"product_return_policies">;
export type ProductReturnPolicyUpdate = TableUpdate<"product_return_policies">;

// Product Stock Logs
export type ProductStockLog = TableRow<"product_stock_logs">;
export type ProductStockLogInsert = TableInsert<"product_stock_logs">;
export type ProductStockLogUpdate = TableUpdate<"product_stock_logs">;

// Product Tag Values
export type ProductTagValue = TableRow<"product_tag_values">;
export type ProductTagValueInsert = TableInsert<"product_tag_values">;
export type ProductTagValueUpdate = TableUpdate<"product_tag_values">;

// Product Tags
export type ProductTag = TableRow<"product_tags">;
export type ProductTagInsert = TableInsert<"product_tags">;
export type ProductTagUpdate = TableUpdate<"product_tags">;

// Product Variants
export type ProductVariant = TableRow<"product_variants">;
export type ProductVariantInsert = TableInsert<"product_variants">;
export type ProductVariantUpdate = TableUpdate<"product_variants">;

// Product Warranties
export type ProductWarranty = TableRow<"product_warranties">;
export type ProductWarrantyInsert = TableInsert<"product_warranties">;
export type ProductWarrantyUpdate = TableUpdate<"product_warranties">;

// EnhancedProduct
// EnhancedProduct: A detailed view of a product with its relationships.
// This type is specifically crafted for the product details page query.
// NOTE: Several relations from the original query were removed due to schema mismatches
// or impossiblity of joining (e.g., 'brands' cannot be joined from 'products').
// This corrected type reflects a valid and functional query.
export type EnhancedProduct = Product & {
  product_categories?: { categories: Category }[] | null;
  product_variants?: ProductVariant[] | null;
  product_inventory?:
    | (ProductInventory & {
        vendor_locations?: VendorLocation | null;
      })[]
    | null;
  product_allergens?: { allergens: Allergen }[] | null;
  product_certifications?: { certifications: Certification }[] | null;
  product_ingredients?: { ingredients: Ingredient }[] | null;
  product_attribute_values?:
    | (ProductAttributeValue & {
        category_attributes?: { name: string } | null;
      })[]
    | null;
  product_tags?: { tags: Tag }[] | null;
  product_images?: ProductImage[] | null;
  product_media?: ProductMedia[] | null;
  product_discounts?: ProductDiscount[] | null;
  product_ratings?: ProductRating[] | null;
  product_questions?: ProductQuestion[] | null;
  // The 'related_products' join is complex (self-referencing M2M).
  // This type reflects a working query structure.
  related_products?:
    | {
        related_product: Product;
      }[]
    | null;
  variant_groups?:
    | (Pick<VariantGroup, "id" | "name" | "sort_order"> & {
        variant_options?:
          | Pick<VariantOption, "id" | "value" | "sort_order">[]
          | null;
      })[]
    | null;
  // The 'vendor_storefronts' table is joined via the 'storefront_id' on the product.
  vendor_storefronts?: {
    id: string;
    name: string | null;
    slug: string | null;
    description: string | null;
    logo_path: string | null;
    banner_path: string | null;
    vendor_categories?: { name: string | null } | null;
    vendor_locations?: {
      address: string | null;
      city: string | null;
      state: string | null;
      postcode: string | null;
    } | null;
  } | null;
};

// Products
export type Product = TableRow<"products">;
export type ProductInsert = TableInsert<"products">;
export type ProductUpdate = TableUpdate<"products">;

// Product with order count and storefront details (for product list screen)
export type ProductWithOrderCount = Product & {
  order_count?: number;
  vendor_storefronts?: {
    name: string | null;
    vendor_categories?: { name: string | null } | null;
    vendor_locations?: {
      address: string | null;
      city: string | null;
      postcode: string | null;
    } | null;
  } | null;
};

// Related Products
export type RelatedProduct = TableRow<"related_products">;
export type RelatedProductInsert = TableInsert<"related_products">;
export type RelatedProductUpdate = TableUpdate<"related_products">;

// Return Policies
export type ReturnPolicy = TableRow<"return_policies">;
export type ReturnPolicyInsert = TableInsert<"return_policies">;
export type ReturnPolicyUpdate = TableUpdate<"return_policies">;

// Riders
export type Rider = TableRow<"riders">;
export type RiderInsert = TableInsert<"riders">;
export type RiderUpdate = TableUpdate<"riders">;

// Rider Sessions
export type RiderSession = TableRow<"rider_sessions">;
export type RiderSessionInsert = TableInsert<"rider_sessions">;
export type RiderSessionUpdate = TableUpdate<"rider_sessions">;

// Rider Transfers
export type RiderTransfer = TableRow<"rider_transfers">;
export type RiderTransferInsert = TableInsert<"rider_transfers">;
export type RiderTransferUpdate = TableUpdate<"rider_transfers">;

// Storefront Delivery Radius
export type StorefrontDeliveryRadius = TableRow<"storefront_delivery_radius">;
export type StorefrontDeliveryRadiusInsert =
  TableInsert<"storefront_delivery_radius">;
export type StorefrontDeliveryRadiusUpdate =
  TableUpdate<"storefront_delivery_radius">;

// Location Delivery Radius
export type LocationDeliveryRadius = TableRow<"location_delivery_radius">;
export type LocationDeliveryRadiusInsert =
  TableInsert<"location_delivery_radius">;
export type LocationDeliveryRadiusUpdate =
  TableUpdate<"location_delivery_radius">;

// Storefront Locations
export type StorefrontLocation = TableRow<"storefront_locations">;
export type StorefrontLocationInsert = TableInsert<"storefront_locations">;
export type StorefrontLocationUpdate = TableUpdate<"storefront_locations">;

// Storefront Opening Hours
export type StorefrontOpeningHour = TableRow<"storefront_opening_hours">;
export type StorefrontOpeningHourInsert =
  TableInsert<"storefront_opening_hours">;
export type StorefrontOpeningHourUpdate =
  TableUpdate<"storefront_opening_hours">;

// Stripe Events
export type StripeEvent = TableRow<"stripe_events">;
export type StripeEventInsert = TableInsert<"stripe_events">;
export type StripeEventUpdate = TableUpdate<"stripe_events">;

// Suppliers
export type Supplier = TableRow<"suppliers">;
export type SupplierInsert = TableInsert<"suppliers">;
export type SupplierUpdate = TableUpdate<"suppliers">;

// Supported Currencies
export type SupportedCurrency = TableRow<"supported_currencies">;
export type SupportedCurrencyInsert = TableInsert<"supported_currencies">;
export type SupportedCurrencyUpdate = TableUpdate<"supported_currencies">;

// Tags
export type Tag = TableRow<"tags">;
export type TagInsert = TableInsert<"tags">;
export type TagUpdate = TableUpdate<"tags">;

// Transfer Attempts
export type TransferAttempt = TableRow<"transfer_attempts">;
export type TransferAttemptInsert = TableInsert<"transfer_attempts">;
export type TransferAttemptUpdate = TableUpdate<"transfer_attempts">;

// User Addresses
export type UserAddress = TableRow<"user_addresses">;
export type UserAddressInsert = TableInsert<"user_addresses">;
export type UserAddressUpdate = TableUpdate<"user_addresses">;

// User Devices
export type UserDevice = TableRow<"user_devices">;
export type UserDeviceInsert = TableInsert<"user_devices">;
export type UserDeviceUpdate = TableUpdate<"user_devices">;

// User Notifications
export type UserNotification = TableRow<"user_notifications">;
export type UserNotificationInsert = TableInsert<"user_notifications">;
export type UserNotificationUpdate = TableUpdate<"user_notifications">;

// Users
export type User = TableRow<"users">;
export type UserInsert = TableInsert<"users">;
export type UserUpdate = TableUpdate<"users">;

// Variant Allergens
export type VariantAllergen = TableRow<"variant_allergens">;
export type VariantAllergenInsert = TableInsert<"variant_allergens">;
export type VariantAllergenUpdate = TableUpdate<"variant_allergens">;

// Variant Groups
export type VariantGroup = TableRow<"variant_groups">;
export type VariantGroupInsert = TableInsert<"variant_groups">;
export type VariantGroupUpdate = TableUpdate<"variant_groups">;

// Variant Ingredients
export type VariantIngredient = TableRow<"variant_ingredients">;
export type VariantIngredientInsert = TableInsert<"variant_ingredients">;
export type VariantIngredientUpdate = TableUpdate<"variant_ingredients">;

// Variant Option Selections
export type VariantOptionSelection = TableRow<"variant_option_selections">;
export type VariantOptionSelectionInsert =
  TableInsert<"variant_option_selections">;
export type VariantOptionSelectionUpdate =
  TableUpdate<"variant_option_selections">;

// Variant Options
export type VariantOption = TableRow<"variant_options">;
export type VariantOptionInsert = TableInsert<"variant_options">;
export type VariantOptionUpdate = TableUpdate<"variant_options">;

// Vendor Addresses
export type VendorAddress = TableRow<"vendor_addresses">;
export type VendorAddressInsert = TableInsert<"vendor_addresses">;
export type VendorAddressUpdate = TableUpdate<"vendor_addresses">;

// Vendor Categories
export type VendorCategory = TableRow<"vendor_categories">;
export type VendorCategoryInsert = TableInsert<"vendor_categories">;
export type VendorCategoryUpdate = TableUpdate<"vendor_categories">;

// Vendor Category Groups
export type VendorCategoryGroup = TableRow<"vendor_category_groups">;
export type VendorCategoryGroupInsert = TableInsert<"vendor_category_groups">;
export type VendorCategoryGroupUpdate = TableUpdate<"vendor_category_groups">;

// Vendor Sub Categories
export type VendorSubCategory = TableRow<"vendor_sub_categories">;
export type VendorSubCategoryInsert = TableInsert<"vendor_sub_categories">;
export type VendorSubCategoryUpdate = TableUpdate<"vendor_sub_categories">;

// Vendor Delivery Radius
export type VendorDeliveryRadius = TableRow<"vendor_delivery_radius">;
export type VendorDeliveryRadiusInsert = TableInsert<"vendor_delivery_radius">;
export type VendorDeliveryRadiusUpdate = TableUpdate<"vendor_delivery_radius">;

// Vendor Locations
export type VendorLocation = TableRow<"vendor_locations">;
export type VendorLocationInsert = TableInsert<"vendor_locations">;
export type VendorLocationUpdate = TableUpdate<"vendor_locations">;

// Vendor Owners
export type VendorOwner = TableRow<"vendor_owners">;
export type VendorOwnerInsert = TableInsert<"vendor_owners">;
export type VendorOwnerUpdate = TableUpdate<"vendor_owners">;

// Vendor Ratings
export type VendorRating = TableRow<"vendor_ratings">;
export type VendorRatingInsert = TableInsert<"vendor_ratings">;
export type VendorRatingUpdate = TableUpdate<"vendor_ratings">;

// Vendor Staff
export type VendorStaff = TableRow<"vendor_staff"> & {
  scope_type?: AssignmentScopeType | null;
  assigned_storefront_id?: string | null;
  assigned_location_id?: string | null;

  // Status (added via migration 20250214_vendor_staff_status)
  status?: VendorStaffStatus;
  status_note?: string | null;

  // For display if joined
  vendor_staff_roles?: { name: string | null } | null;
  vendor_storefronts?: { name: string | null } | null;
  vendor_locations?: { address: string | null } | null;
  users?: {
    email: string | null;
    first_name: string | null;
    last_name: string | null;
  } | null;
};
export type VendorStaffInsert = TableInsert<"vendor_staff">;
export type VendorStaffUpdate = TableUpdate<"vendor_staff">;

// Vendor Staff Invites
export type VendorStaffInvite = TableRow<"vendor_staff_invites"> & {
  scope_type?: AssignmentScopeType | null; // Use the specific AssignmentScopeType
  assigned_storefront_id?: string | null;
  assigned_location_id?: string | null;

  // For display, if you join them in the loader:
  vendor_storefronts?: { name: string | null } | null;
  vendor_locations?: { address: string | null } | null; // Correctly typed
};
export type VendorStaffInviteInsert = TableInsert<"vendor_staff_invites">;
export type VendorStaffInviteUpdate = TableUpdate<"vendor_staff_invites">;

// Vendor Staff Permissions
export type VendorStaffPermission = TableRow<"vendor_staff_permissions">;
export type VendorStaffPermissionInsert =
  TableInsert<"vendor_staff_permissions">;
export type VendorStaffPermissionUpdate =
  TableUpdate<"vendor_staff_permissions">;

// Vendor Staff Role Permissions
export type VendorStaffRolePermission =
  TableRow<"vendor_staff_role_permissions">;
export type VendorStaffRolePermissionInsert =
  TableInsert<"vendor_staff_role_permissions">;
export type VendorStaffRolePermissionUpdate =
  TableUpdate<"vendor_staff_role_permissions">;

// Vendor Staff Roles
export type VendorStaffRole = TableRow<"vendor_staff_roles">;
export type VendorStaffRoleInsert = TableInsert<"vendor_staff_roles">;
export type VendorStaffRoleUpdate = TableUpdate<"vendor_staff_roles">;

// Vendor Storefronts
// Corrected VendorStorefront type to include joined fields
export type VendorStorefront = TableRow<"vendor_storefronts"> & {
  // These keys `vendor_category_groups`, `vendor_categories`, `vendor_sub_categories`
  // MUST exactly match the names of the tables/views you are joining in your .select()
  // And their types must match the data you are selecting (e.g., `{ name: string } | null`)
  vendor_category_groups?: { name: string | null } | null; // Note `name: string | null` based on your DB type
  vendor_categories?: { name: string | null } | null;
  vendor_sub_categories?: { name: string | null } | null;
  linked_locations?: VendorLocation[] | null; // This will be an array of VendorLocation
};
export type VendorStorefrontInsert = TableInsert<"vendor_storefronts">;
export type VendorStorefrontUpdate = TableUpdate<"vendor_storefronts">;

// Vendors
export type Vendor = TableRow<"vendors">;
export type VendorInsert = TableInsert<"vendors">;
export type VendorUpdate = TableUpdate<"vendors">;

// ============================================
// NEW TYPES FOR DELIVERY, TRUST & REFUNDS
// ============================================

// Delivery Fee Tiers (per location)
export interface DeliveryFeeTier {
  id: string;
  location_id: string | null;
  min_distance_km: number;
  max_distance_km: number;
  fee_cents: number;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}
export type DeliveryFeeTierInsert = Omit<
  DeliveryFeeTier,
  "id" | "created_at" | "updated_at"
>;
export type DeliveryFeeTierUpdate = Partial<DeliveryFeeTierInsert>;

// User Trust Metrics
export interface UserTrustMetrics {
  id: string;
  user_id: string;
  trust_score: number;
  order_count: number;
  total_spent_cents: number;
  dispute_count: number;
  dispute_rate: number;
  refund_count: number;
  refund_rate: number;
  cancellation_count: number;
  cancellation_rate: number;
  loyalty_tier: string | null;
  fraud_score: number;
  is_banned: boolean;
  ban_reason: string | null;
  banned_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Vendor Trust Metrics
export interface VendorTrustMetrics {
  id: string;
  vendor_id: string;
  trust_score: number;
  order_count: number;
  total_revenue_cents: number;
  rejection_count: number;
  acceptance_rate: number;
  complaint_count: number;
  complaint_rate: number;
  average_prep_time_minutes: number | null;
  is_suspended: boolean;
  suspension_reason: string | null;
  suspended_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Rider Trust Metrics
export interface RiderTrustMetrics {
  id: string;
  rider_id: string;
  trust_score: number;
  delivery_count: number;
  total_earnings_cents: number;
  complaint_count: number;
  complaint_rate: number;
  average_delivery_time_minutes: number | null;
  on_time_rate: number;
  is_suspended: boolean;
  suspension_reason: string | null;
  suspended_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Trust Events (audit trail)
export interface TrustEvent {
  id: string;
  entity_type: "user" | "vendor" | "rider";
  entity_id: string;
  event_type: string;
  score_change: number;
  new_score: number;
  reason: string | null;
  metadata: Record<string, any> | null;
  created_at: string | null;
}

// Admin Alerts
export interface AdminAlert {
  id: string;
  alert_type: string;
  entity_type: "user" | "vendor" | "rider";
  entity_id: string;
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  data: Record<string, any> | null;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string | null;
}

// Refund Requests
export interface RefundRequest {
  id: string;
  order_id: string;
  user_id: string;
  vendor_order_id: string | null;
  request_type: "full_order" | "partial" | "single_item";
  status:
    | "pending"
    | "approved"
    | "denied"
    | "processing"
    | "completed"
    | "cancelled";
  requested_amount_cents: number;
  approved_amount_cents: number | null;
  reason: string;
  reason_details: string | null;
  image_proof_urls: string[] | null;
  admin_notes: string | null;
  auto_approved: boolean;
  reviewed_by: string | null;
  reviewed_at: string | null;
  stripe_refund_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Refund Request Items
export interface RefundRequestItem {
  id: string;
  refund_request_id: string;
  order_item_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price_cents: number;
  refund_amount_cents: number;
  reason: string | null;
  created_at: string | null;
}

// Commission Rate Usage (analytics)
export interface CommissionRateUsage {
  id: string;
  commission_rate_id: string;
  order_id: string;
  vendor_order_id: string;
  order_subtotal_cents: number;
  commission_amount_cents: number;
  rate_percent_applied: number;
  flat_fee_applied: number;
  created_at: string | null;
}

// Commission Rate Daily Stats
export interface CommissionRateDailyStats {
  id: string;
  commission_rate_id: string;
  date: string;
  order_count: number;
  total_order_value_cents: number;
  total_commission_cents: number;
  average_order_value_cents: number;
  error_count: number;
  created_at: string | null;
  updated_at: string | null;
}

// Extended VendorLocation with delivery settings
export type VendorLocationWithDelivery = VendorLocation & {
  /** @deprecated use platform_delivery_eligible / vendor_delivery_enabled */
  delivery_enabled?: boolean;
  platform_delivery_eligible?: boolean;
  vendor_delivery_enabled?: boolean;
  delivery_radius_km?: number | null;
  free_delivery_threshold_cents?: number | null;
  min_order_amount_cents?: number | null;
};

// Organizations (legal entity layer above vendors - Migration 1)
export type OrganizationType =
  | "independent"
  | "franchise_group"
  | "wholesale"
  | "retail_group"
  | "dark_kitchen_operator";

export interface Organization {
  id: string;
  name: string;
  slug: string | null;
  type: OrganizationType;
  owner_id: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  logo_path: string | null;
  website: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Buildings (physical container for vendor locations - Migration 1)
export type BuildingType =
  | "standard"
  | "food_hall"
  | "dark_kitchen"
  | "market"
  | "shopping_centre"
  | "office_complex"
  | "hotel"
  | "stadium";

export interface Building {
  id: string;
  name: string;
  slug: string | null;
  type: BuildingType;
  address: string | null;
  city: string | null;
  county: string | null;
  postcode: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  logo_path: string | null;
  banner_path: string | null;
  is_active: boolean;
  is_publicly_listed: boolean;
  created_at: string;
  updated_at: string;
}
