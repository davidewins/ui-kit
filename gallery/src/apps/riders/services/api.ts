import { fetchWithTimeout } from "@/apps/riders/lib/utils/fetchWithTimeout";
/**
 * Rider API service
 *
 * Authenticated HTTP client for the hq-node backend.
 * All rider-specific endpoints: location, status, assignments.
 *
 * When demo mode is active, all mutation endpoints are no-ops and
 * read endpoints return static demo data.
 */

import { API_URL } from "@/apps/riders/constants/keys";
import { supabase } from "@/lib/supabase";
import Logger from "@/lib/Logger";
import { useDemoStore } from "@/apps/riders/stores/demoStore";
import { DEMO_EARNINGS, DEMO_HISTORY, DEMO_REFERRALS } from "@/apps/riders/data/demoData";

function isDemoMode() {
  return useDemoStore.getState().isDemoMode;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return {
    "Content-Type": "application/json",
    ...(session?.access_token && {
      Authorization: `Bearer ${session.access_token}`,
    }),
  };
}

async function apiRequest<T = any>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const headers = await getAuthHeaders();
  const url = `${API_URL}${path}`;

  const response = await fetchWithTimeout(url, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  if (!response.ok) {
    const body = await response.text();
    Logger.error(`API ${options?.method || "GET"} ${path} failed: ${response.status}`, body);
    throw new Error(`API error ${response.status}: ${body}`);
  }

  return response.json();
}

// ============================================
// LOCATION
// ============================================

export async function updateLocation(
  lat: number,
  lng: number,
  extras?: {
    heading?: number | null;
    speed?: number | null;
    accuracy?: number | null;
  },
) {
  if (isDemoMode()) return;
  return apiRequest("/api/riders/location", {
    method: "POST",
    body: JSON.stringify({ lat, lng, ...extras }),
  });
}

// ============================================
// ONLINE/OFFLINE
// ============================================

export async function setOnlineStatus(isLive: boolean) {
  if (isDemoMode()) return;
  return apiRequest("/api/riders/status", {
    method: "POST",
    body: JSON.stringify({ is_live: isLive }),
  });
}

// ============================================
// PROFILE
// ============================================

export async function getRiderProfile() {
  return apiRequest("/api/riders/me");
}

// ============================================
// ASSIGNMENTS
// ============================================

export async function getActiveAssignment() {
  if (isDemoMode()) return null;
  return apiRequest("/api/riders/active-assignment");
}

export async function acceptAssignment(assignmentId: string) {
  if (isDemoMode()) return null;
  return apiRequest(`/api/riders/assignments/${assignmentId}/accept`, {
    method: "POST",
  });
}

export async function declineAssignment(assignmentId: string) {
  if (isDemoMode()) return null;
  return apiRequest(`/api/riders/assignments/${assignmentId}/decline`, {
    method: "POST",
  });
}

export async function markPickedUp(assignmentId: string) {
  if (isDemoMode()) return null;
  return apiRequest(`/api/riders/assignments/${assignmentId}/picked-up`, {
    method: "POST",
  });
}

export async function markDelivered(
  assignmentId: string,
  ageVerified?: boolean,
) {
  if (isDemoMode()) return null;
  return apiRequest(`/api/riders/assignments/${assignmentId}/delivered`, {
    method: "POST",
    ...(ageVerified && { body: JSON.stringify({ age_verified: true }) }),
  });
}

// TAK-1092: rider couldn't verify the customer is 18+ - no handover.
export async function markAgeCheckFailed(assignmentId: string) {
  if (isDemoMode()) return null;
  return apiRequest(
    `/api/riders/assignments/${assignmentId}/age-check-failed`,
    { method: "POST" },
  );
}

// ============================================
// EARNINGS & HISTORY
// ============================================

export async function getEarnings(period: "week" | "month" | "all" = "week") {
  if (isDemoMode()) return DEMO_EARNINGS[period];
  return apiRequest(`/api/riders/earnings?period=${period}`);
}

// ============================================
// REFERRALS
// ============================================

export async function getReferralSummary() {
  if (isDemoMode()) return DEMO_REFERRALS;
  return apiRequest("/api/riders/referrals");
}

export async function redeemReferralCode(code: string) {
  if (isDemoMode()) return { ok: true };
  return apiRequest("/api/riders/redeem-referral", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function getDeliveryHistory(page = 1, limit = 20) {
  if (isDemoMode()) {
    const start = (page - 1) * limit;
    const items = DEMO_HISTORY.slice(start, start + limit);
    return { items, hasMore: start + limit < DEMO_HISTORY.length };
  }
  return apiRequest(`/api/riders/delivery-history?page=${page}&limit=${limit}`);
}

// ============================================
// STRIPE ONBOARDING (for payouts)
// ============================================

export interface RiderOnboardingData {
  userId: string;
  firstName: string;
  lastName: string;
  dob: { day: number; month: number; year: number };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  phone: string;
  ppsn: string;
  bankAccountHolderName: string;
  bankIban: string;
  ipAddress: string;
  userAgent: string;
  insuranceCertified?: boolean;
  insuranceCertifiedAt?: string | null;
}

export async function completeRiderOnboarding(data: RiderOnboardingData) {
  return apiRequest("/api/riders/onboard", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getRiderStripeStatus(userId: string) {
  return apiRequest(`/api/riders/${userId}/stripe-status`);
}

export async function getRiderStripeAccountLink(): Promise<{ url: string }> {
  return apiRequest("/api/riders/stripe-account-link", { method: "POST" });
}
