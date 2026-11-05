// Analytics → Customers: 90-day cohort summary - total / new this week /
// repeat rate / avg lifetime + retention curve + top spenders.
//
// Server-side aggregation via vendor_analytics_customers RPC. The prior
// 90-day vendor_orders → orders embedded select was the heaviest of the
// analytics queries and the first to time out (TAK-818).

import { useCurrentVendorId } from "@/apps/sellers/hooks/useCurrentVendor";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { clientTz } from "@/apps/sellers/lib/clientTz";
import { supabase } from "@/lib/supabase";

export interface CustomerAnalytics {
  totalCustomers: number;
  newThisWeek: number;
  newChangePct: number | null;
  repeatRatePct: number;
  avgLifetimeCents: number;
  retentionCurve: number[];
  topSpenders: {
    id: string;
    initials: string;
    name: string;
    visits: number;
    total: number;
  }[];
  newSpark: number[];
}

const EMPTY: CustomerAnalytics = {
  totalCustomers: 0,
  newThisWeek: 0,
  newChangePct: null,
  repeatRatePct: 0,
  avgLifetimeCents: 0,
  retentionCurve: [],
  topSpenders: [],
  newSpark: [],
};

export function useAnalyticsCustomers() {
  const { data: vendorId } = useCurrentVendorId();

  return useSafeQuery<CustomerAnalytics>({
    name: "analyticsCustomers",
    queryKey: ["analytics-customers", vendorId],
    requiresAuth: true,
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!vendorId) return EMPTY;
      const { data, error } = await supabase.rpc(
        "vendor_analytics_customers",
        { p_vendor_id: vendorId, p_tz: clientTz() },
      );
      if (error) throw error;
      return (data as unknown as CustomerAnalytics | null) ?? EMPTY;
    },
  });
}
