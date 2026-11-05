import { fixtureFetch } from "@/apps/sellers/lib/fixtureFetch";
import { SERVER_URL } from "@/apps/sellers/constants/keys";
import { supabase } from "@/lib/supabase";
import { useCurrentVendorId } from "@/apps/sellers/hooks/useCurrentVendor";
import { useSafeQuery } from "@/hooks/useSafeQuery";

// ---------------------------------------------------------------------------
// Permission constants - mirrors backend PERMISSIONS object
// ---------------------------------------------------------------------------
export const PERMISSIONS = {
  INVITE_STAFF: "invite_staff",
  REMOVE_STAFF: "remove_staff",
  VIEW_ORDERS: "view_orders",
  PROCESS_PAYMENTS: "process_payments",
  VIEW_REPORTS: "view_reports",
  ASSIGN_SHIFTS: "assign_shifts",
  UPDATE_INVENTORY: "update_inventory",
  VIEW_CUSTOMERS: "view_customers",
  MANAGE_DISCOUNTS: "manage_discounts",
  MANAGE_AVAILABILITY: "manage_availability",
  MANAGE_MENU: "manage_menu",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_ORDERS: "manage_orders",
  MANAGE_FINANCIAL: "manage_financial",
  MANAGE_CHAT: "manage_chat",
  MANAGE_SETTINGS: "manage_settings",
  MANAGE_STOREFRONTS: "manage_storefronts",
  MANAGE_LOCATIONS: "manage_locations",
  MANAGE_OPENING_HOURS: "manage_opening_hours",
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ---------------------------------------------------------------------------
// Response type from GET /vendors/:vendorId/me/permissions
// ---------------------------------------------------------------------------
export interface MyPermissionsResponse {
  isOwner: boolean;
  role: string;
  permissions: string[];
  scope: {
    type: string;
    storefrontId: string | null;
    locationId: string | null;
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useMyPermissions() {
  const { data: vendorId } = useCurrentVendorId();

  const query = useSafeQuery<MyPermissionsResponse>({
    name: "myPermissions",
    queryKey: ["my_permissions", vendorId],
    requiresAuth: true,
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated");

      const res = await fixtureFetch(
        `${SERVER_URL}/vendors/${vendorId}/me/permissions`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Server error" }));
        throw new Error(body.error || `HTTP ${res.status}`);
      }

      return res.json();
    },
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000, // 5 minutes - permissions don't change often
  });

  // Convenience helpers
  const permissions = query.data?.permissions || [];

  const hasPermission = (...required: PermissionName[]): boolean =>
    required.every((p) => permissions.includes(p));

  const isOwner = query.data?.isOwner ?? false;

  return {
    ...query,
    permissions,
    hasPermission,
    isOwner,
    role: query.data?.role ?? null,
    scope: query.data?.scope ?? null,
  };
}
