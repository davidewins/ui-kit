export const APP_ENV = (process.env.EXPO_PUBLIC_APP_ENV ??
  process.env.APP_ENV ??
  "development") as "development" | "preview" | "production";
export const IS_PRODUCTION = APP_ENV === "production";

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
export const SUPABASE_PK = process.env.EXPO_PUBLIC_SUPABASE_PK!;
export const DEVELOPMENT_SERVER_URL =
  process.env.EXPO_PUBLIC_DEVELOPMENT_SERVER_URL;
export const PRODUCTION_SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;

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

export const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN!;

export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PK!;
export const ONESIGNAL_APPID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!;
export const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY!;
export const POSTHOG_HOST =
  process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
export const API_URL =
  (__DEV__ ? DEVELOPMENT_SERVER_URL : PRODUCTION_SERVER_URL) ||
  "https://hq-node.fly.dev";
export const SERVER_URL = API_URL;
export const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN!;
export const CONTACT_EMAIL = "david@takeover.software";
export const WEBSITE_URL = process.env.EXPO_PUBLIC_WEBSITE_URL!;
export const WHATSAPP_NUMBER = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER!;

export const GOOGLE_MAPS_DIRECTIONS_BASE =
  "https://www.google.com/maps/dir/?api=1&destination=";
