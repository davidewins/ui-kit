import { Platform } from "react-native";

const normalizeBaseUrl = (url?: string | null) => {
  if (!url) return undefined;
  // Avoid double slashes when composing endpoint URLs.
  return url.replace(/\/+$/, "");
};

// APP_ENV: set by eas.json per build profile. Falls back to "development" for local Metro.
export const APP_ENV = (process.env.EXPO_PUBLIC_APP_ENV ??
  process.env.APP_ENV ??
  "development") as "development" | "preview" | "production";
export const IS_PRODUCTION = APP_ENV === "production";

// SUPABASE
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
export const SUPABASE_PK = process.env.EXPO_PUBLIC_SUPABASE_PK!;

// SERVER
export const DEVELOPMENT_SERVER_URL =
  process.env.EXPO_PUBLIC_DEVELOPMENT_SERVER_URL;

export const PRODUCTION_SERVER_URL =
  process.env.EXPO_PUBLIC_PRODUCTION_SERVER_URL ??
  process.env.EXPO_PUBLIC_SERVER_URL;

// GOOGLE
export const GOOGLE_MAPS_IOS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY;
export const GOOGLE_MAPS_ANDROID_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY;
export const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ??
  process.env.EXPO_PUBLIC_GOOGLE_WEB_OAUTH_CLIENT_ID;
export const GOOGLE_ANDROID_OAUTH_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_OAUTH_CLIENT_ID;

export const STREAM_CHAT_API_KEY = process.env.EXPO_PUBLIC_STREAM_CHAT_API_KEY;

export const MAPBOX_ACCESS_TOKEN =
  process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";
export const MAPBOX_DOWNLOAD_TOKEN =
  process.env.EXPO_PUBLIC_MAPBOX_DOWNLOAD_TOKEN ?? "";

export const RIDER_URL = "https://takeover.software/riders";
export const VENDOR_URL = "https://takeover.software/sellers";

// The app's registered URL scheme - MUST match app.config.ts `scheme`
// (IS_DEV ? "void-dev" : "void"). Stripe return URLs must use this scheme or
// the SDK rejects them ("not a valid url") and payment sheet init fails.
export const APP_SCHEME = IS_PRODUCTION ? "void" : "void-dev";
export const STRIPE_RETURN_URL = `${APP_SCHEME}://stripe-redirect`;

// Stripe: set per build profile in eas.json; local Metro uses .env.local (EXPO_PUBLIC_STRIPE_PK).
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PK!;
export const STRIPE_MERCHANT_IDENTIFIER =
  process.env.EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER!;
export const ONESIGNAL_APPID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!;
export const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY!;
export const POSTHOG_HOST =
  process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
export const API_URL = normalizeBaseUrl(
  __DEV__ ? DEVELOPMENT_SERVER_URL : PRODUCTION_SERVER_URL,
);
export const SERVER_URL = API_URL;

export const GOOGLE_MAPS_API_KEY =
  Platform.OS === "android"
    ? GOOGLE_MAPS_ANDROID_API_KEY
    : GOOGLE_MAPS_IOS_API_KEY;

export const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN!;

// Hardcoded, not env-driven - these are static contact details, not secrets
// or per-environment config, and don't need to depend on EAS env refresh.
export const CONTACT_EMAIL = "david@takeover.software";
export const WEBSITE_URL = "https://takeover.software";
export const WHATSAPP_NUMBER = "353838044262";

// --- URLs (avoid hardcoding across app) ---

/** Base for opening directions to a lat,lng destination. Append `${lat},${lon}`. */
export const GOOGLE_MAPS_DIRECTIONS_BASE =
  "https://www.google.com/maps/dir/?api=1&destination=";

/** Base for opening a map at coordinates. Append `${lat},${lon}`. */
export const GOOGLE_MAPS_COORDS_QUERY_BASE = "https://www.google.com/maps?q=";

/** Base for search-by-address. Append encodeURIComponent(address). */
export const GOOGLE_MAPS_SEARCH_QUERY_BASE =
  "https://www.google.com/maps/search/?api=1&query=";

/** Placeholder image base; use getPlaceholderImageUrl(size) for full URL. */
export const PROFILER_PLACEHOLDER_IMAGE_BASE_URL =
  "https://via.placeholder.com"; // for profile pic
export const PRODUCT_PLACEHOLDER_IMAGE_BASE_URL = "https://via.placeholder.com"; // for product
export const STOREFRONT_PLACEHOLDER_IMAGE_BASE_URL =
  "https://via.placeholder.com"; // for storefront

export function getProfilerPlaceholderImageUrl(size: number): string {
  return `${PROFILER_PLACEHOLDER_IMAGE_BASE_URL}/${size}`;
}

export function getProductPlaceholderImageUrl(size: number): string {
  return `${PRODUCT_PLACEHOLDER_IMAGE_BASE_URL}/${size}`;
}

export function getStorefrontPlaceholderImageUrl(size: number): string {
  return `${STOREFRONT_PLACEHOLDER_IMAGE_BASE_URL}/${size}`;
}
