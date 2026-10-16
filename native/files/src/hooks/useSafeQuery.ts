/**
 * TanStack Query Integration for Safe Execute
 *
 * Provides queries that automatically include all safety checks:
 * - Network connectivity
 * - Authentication
 * - Sentry error tracking with typed error codes
 * - PostHog analytics
 * - Optional retry with backoff
 * - Operation timing
 *
 * Usage:
 * ```typescript
 * const { data, isLoading } = useSafeQuery({
 *   name: "fetchOrders",
 *   queryKey: ["orders"],
 *   queryFn: () => supabase.from("orders").select("*"),
 *   requiresAuth: true,
 * });
 * ```
 */

import { safeExecute, SafeExecuteOptions } from "@/lib/utils/safeExecute";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { usePostHog } from "posthog-react-native";

type SafeQueryOptions<TData> = Omit<
  SafeExecuteOptions<TData>,
  "fn" | "name" | "posthog" | "showAlerts"
> & {
  name: string;
  queryKey: unknown[];
  queryFn: () => Promise<TData>;
  showAlerts?: boolean; // Default false for queries (silent failures)
} & Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn">;

/**
 * Hook that combines TanStack Query with safeExecute
 */
export function useSafeQuery<TData = unknown>({
  name,
  queryKey,
  queryFn,
  requiresAuth = false,
  requiresNetwork = true,
  showAlerts = false, // Queries fail silently by default
  errorMessage,
  trackSuccess = false, // Don't track every query success
  context = {},
  retry: safeRetry,
  timeout,
  severity,
  ...queryOptions
}: SafeQueryOptions<TData>) {
  const posthog = usePostHog();

  return useQuery<TData, Error>({
    queryKey,
    ...queryOptions,
    queryFn: async () => {
      const result = await safeExecute({
        name,
        fn: queryFn,
        requiresAuth,
        requiresNetwork,
        posthog,
        showAlerts,
        errorMessage,
        trackSuccess,
        retry: safeRetry,
        timeout,
        severity,
        context: {
          ...context,
          queryKey: JSON.stringify(queryKey),
        },
        silent: !showAlerts, // Silent if not showing alerts
      });

      if (!result.success) {
        throw new Error(result.error || "Query failed");
      }

      return result.data!;
    },
  });
}

/**
 * Example usage:
 *
 * ```typescript
 * function OrdersScreen() {
 *   const { data: orders, isLoading, refetch } = useSafeQuery({
 *     name: "fetchOrders",
 *     queryKey: ["orders"],
 *     queryFn: () => supabase.from("orders").select("*"),
 *     requiresAuth: true,
 *     staleTime: 5 * 60 * 1000, // 5 minutes
 *   });
 *
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <FlatList
 *       data={orders}
 *       renderItem={({ item }) => <OrderCard order={item} />}
 *       refreshing={isLoading}
 *       onRefresh={refetch}
 *     />
 *   );
 * }
 *
 * // With retry for flaky endpoints
 * const { data } = useSafeQuery({
 *   name: "fetchAnalytics",
 *   queryKey: ["analytics"],
 *   queryFn: () => fetchAnalytics(),
 *   requiresAuth: true,
 *   retry: 2,            // retry transient failures twice
 *   timeout: 10000,      // 10s timeout per attempt
 *   severity: "warning", // don't page on-call for analytics
 * });
 *
 * // With parameters
 * function ProductDetail({ productId }) {
 *   const { data: product } = useSafeQuery({
 *     name: "fetchProduct",
 *     queryKey: ["products", productId],
 *     queryFn: () =>
 *       supabase.from("products").select("*").eq("id", productId).single(),
 *     requiresAuth: true,
 *     enabled: !!productId, // Only fetch when productId exists
 *   });
 *
 *   return <ProductView product={product} />;
 * }
 *
 * // With dependent queries
 * function OrderDetail({ orderId }) {
 *   const { data: order } = useSafeQuery({
 *     name: "fetchOrder",
 *     queryKey: ["orders", orderId],
 *     queryFn: () => supabase.from("orders").select("*").eq("id", orderId).single(),
 *     requiresAuth: true,
 *   });
 *
 *   const { data: items } = useSafeQuery({
 *     name: "fetchOrderItems",
 *     queryKey: ["orders", orderId, "items"],
 *     queryFn: () => supabase.from("order_items").select("*").eq("order_id", orderId),
 *     requiresAuth: true,
 *     enabled: !!order, // Wait for order to load first
 *   });
 *
 *   return <OrderView order={order} items={items} />;
 * }
 * ```
 */
