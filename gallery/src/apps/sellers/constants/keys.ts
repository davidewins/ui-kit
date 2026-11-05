// APP ENV
// Set by eas.json per build profile. Falls back to "development" for local Metro.
export const APP_ENV = (process.env.EXPO_PUBLIC_APP_ENV ??
  process.env.APP_ENV ??
  "development") as "development" | "preview" | "production";
export const IS_PRODUCTION = APP_ENV === "production";

// SUPABASE
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
export const SUPABASE_PK = process.env.EXPO_PUBLIC_SUPABASE_PK!;

export const RAPID_API_KEY = process.env.RAPID_API_KEY!;

// SERVER
export const SERVER_URL = __DEV__
  ? process.env.EXPO_PUBLIC_DEVELOPMENT_SERVER_URL
  : process.env.EXPO_PUBLIC_PRODUCTION_SERVER_URL;

// MAPBOX
export const MAPBOX_ACCESS_TOKEN =
  process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";
// export const MAPBOX_DOWNLOAD_TOKEN =
//   process.env.EXPO_PUBLIC_MAPBOX_DOWNLOAD_TOKEN ?? "";

// STREAM CHAT
export const STREAM_CHAT_API_KEY = process.env.EXPO_PUBLIC_STREAM_CHAT_API_KEY;

// STRIPE
// Set per build profile in eas.json - test key for development/preview, live key for production.
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PK!;
// Merchant identifier - set per build profile in eas.json.
// Must match the identifier registered in your Apple Pay merchant account.
export const STRIPE_MERCHANT_IDENTIFIER =
  process.env.EXPO_PUBLIC_STRIPE_MERCHANT_IDENTIFIER!;

// NOTIFICATIONS
export const ONESIGNAL_APPID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!;
export const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ??
  process.env.EXPO_PUBLIC_GOOGLE_WEB_OAUTH_CLIENT_ID;
export const GOOGLE_ANDROID_OAUTH_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_OAUTH_CLIENT_ID;

// POSTHOG & SENTRY
export const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY!;
export const POSTHOG_HOST =
  process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
export const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

// VARIABLES
export const CONTACT_EMAIL = process.env.EXPO_PUBLIC_CONTACT_EMAIL!;
export const WEBSITE_URL = process.env.EXPO_PUBLIC_WEBSITE_URL!;
export const WHATSAPP_NUMBER = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER!;

// DEMO SELLER (App Review). Only read behind the hidden reviewer unlock - see (auth)/index.tsx.
export const DEMO_SELLER_EMAIL =
  process.env.EXPO_PUBLIC_DEMO_SELLER_EMAIL ?? "";
export const DEMO_SELLER_PASSWORD =
  process.env.EXPO_PUBLIC_DEMO_SELLER_PASSWORD ?? "";
