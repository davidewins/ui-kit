// Analytics → Channels: revenue split across channels (own site / POS / QR /
// marketplace) over the selected period, plus per-channel spark and
// storefront leaderboard.
//
// Server-side aggregation via vendor_analytics_channels RPC - supersedes
// the embedded vendor_orders → orders + vendor_storefronts join that hit
// statement_timeout on busy vendors (TAK-818).

import { useCurrentVendorId } from "@/apps/sellers/hooks/useCurrentVendor";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { clientTz } from "@/apps/sellers/lib/clientTz";
import { supabase } from "@/lib/supabase";
import { useAnalyticsPeriodStore } from "@/apps/sellers/stores/analyticsPeriodStore";

const CHANNELS = ["storefront", "pos", "qr", "marketplace"] as const;
type Channel = (typeof CHANNELS)[number];

export interface ChannelAnalytics {
  totalCents: number;
  channels: Record<
    Channel,
    { cents: number; spark: number[]; changePct: number | null }
  >;
  storefronts: {
    id: string;
    name: string;
    totalOrders: number;
    totalRevenue: number;
    averageRating: number;
    isActive: boolean;
  }[];
}

function emptyResult(periodDays: number): ChannelAnalytics {
  const zeros = Array.from({ length: periodDays }, () => 0);
  return {
    totalCents: 0,
    channels: {
      storefront: { cents: 0, spark: zeros, changePct: null },
      pos: { cents: 0, spark: zeros, changePct: null },
      qr: { cents: 0, spark: zeros, changePct: null },
      marketplace: { cents: 0, spark: zeros, changePct: null },
    },
    storefronts: [],
  };
}

export function useAnalyticsChannels() {
  const { data: vendorId } = useCurrentVendorId();
  const periodDays = useAnalyticsPeriodStore((s) => s.periodDays);

  return useSafeQuery<ChannelAnalytics>({
    name: "analyticsChannels",
    queryKey: ["analytics-channels", vendorId, periodDays],
    requiresAuth: true,
    enabled: !!vendorId,
    staleTime: 60 * 1000,
    queryFn: async () => {
      if (!vendorId) return emptyResult(periodDays);
      const { data, error } = await supabase.rpc("vendor_analytics_channels", {
        p_vendor_id: vendorId,
        p_days: periodDays,
        p_tz: clientTz(),
      });
      if (error) throw error;
      return (
        (data as unknown as ChannelAnalytics | null) ?? emptyResult(periodDays)
      );
    },
  });
}
