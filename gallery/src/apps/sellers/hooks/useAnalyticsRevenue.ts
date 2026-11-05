// Analytics → Sales: revenue / orders / AOV / customers / refunds sparks over
// the selected period, plus top products, peak hours, and fulfillment mix.
//
// Server-side aggregation via vendor_analytics_revenue RPC - the prior
// embedded vendor_orders → orders + order_items select hit statement_timeout
// on the demo seller at ~700 rows (TAK-818).

import { useCurrentVendorId } from "@/apps/sellers/hooks/useCurrentVendor";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { clientTz } from "@/apps/sellers/lib/clientTz";
import { supabase } from "@/lib/supabase";
import { useAnalyticsPeriodStore } from "@/apps/sellers/stores/analyticsPeriodStore";

export interface RevenueAnalytics {
  todayCents: number;
  changePct: number | null;
  periodDays: number;
  weekRevenue: number[];
  ordersCount: number;
  ordersChangePct: number | null;
  ordersSpark: number[];
  aovCents: number;
  aovChangePct: number | null;
  aovSpark: number[];
  customersCount: number;
  customersChangePct: number | null;
  customersSpark: number[];
  refundsCount: number;
  refundsChangePct: number | null;
  refundsSpark: number[];
  topProducts: { id: string; name: string; sold: number; revenue: number }[];
  peakHours: { hour: string; count: number }[];
  peakHourLabel: string;
  fulfillmentMix: { type: string; percentage: number; amount: number }[];
}

function emptyResult(periodDays: number): RevenueAnalytics {
  const zeros = Array.from({ length: periodDays }, () => 0);
  return {
    todayCents: 0,
    changePct: null,
    periodDays,
    weekRevenue: zeros,
    ordersCount: 0,
    ordersChangePct: null,
    ordersSpark: zeros,
    aovCents: 0,
    aovChangePct: null,
    aovSpark: zeros,
    customersCount: 0,
    customersChangePct: null,
    customersSpark: zeros,
    refundsCount: 0,
    refundsChangePct: null,
    refundsSpark: zeros,
    topProducts: [],
    peakHours: [],
    peakHourLabel: "-",
    fulfillmentMix: [],
  };
}

export function useAnalyticsRevenue() {
  const { data: vendorId } = useCurrentVendorId();
  const periodDays = useAnalyticsPeriodStore((s) => s.periodDays);

  return useSafeQuery<RevenueAnalytics>({
    name: "analyticsRevenue",
    queryKey: ["analytics-revenue", vendorId, periodDays],
    requiresAuth: true,
    enabled: !!vendorId,
    staleTime: 60 * 1000,
    queryFn: async () => {
      if (!vendorId) return emptyResult(periodDays);
      const { data, error } = await supabase.rpc("vendor_analytics_revenue", {
        p_vendor_id: vendorId,
        p_days: periodDays,
        p_tz: clientTz(),
      });
      if (error) throw error;
      return (
        (data as unknown as RevenueAnalytics | null) ?? emptyResult(periodDays)
      );
    },
  });
}
