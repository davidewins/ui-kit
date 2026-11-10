import { useSafeQuery } from "@/hooks/useSafeQuery";
import { supabase } from "@/lib/supabase";
import { API_URL } from "@/apps/void/constants/keys";
import { fetchWithTimeout } from "@/apps/void/lib/utils/fetchWithTimeout";

export interface AvailableCredit {
  platform_cents: number;
  vendor_cents: number;
  applicable_cents: number;
}

const NONE: AvailableCredit = {
  platform_cents: 0,
  vendor_cents: 0,
  applicable_cents: 0,
};

/**
 * Store credit this customer can spend at this vendor. Falls back to zero on
 * any failure: paying full price is recoverable, a checkout that will not
 * render is not.
 */
export function useAvailableCredit(vendorId: string | null, enabled: boolean) {
  return useSafeQuery({
    name: "availableCredit",
    queryKey: ["available_credit", vendorId],
    queryFn: async (): Promise<AvailableCredit> => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) return NONE;

      const qs = vendorId ? `?vendorId=${encodeURIComponent(vendorId)}` : "";
      const response = await fetchWithTimeout(
        `${API_URL}/api/credit/available${qs}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } },
        10000,
      );
      if (!response.ok) return NONE;
      return (await response.json()) as AvailableCredit;
    },
    requiresAuth: true,
    enabled,
    staleTime: 1000 * 60,
  });
}
