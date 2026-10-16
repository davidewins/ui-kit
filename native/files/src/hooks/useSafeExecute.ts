/**
 * React Hook for Safe Execution
 *
 * Automatically provides PostHog instance and wraps safeExecute
 * for easier use in React components.
 *
 * Usage:
 * ```typescript
 * const { execute } = useSafeExecute();
 *
 * const result = await execute({
 *   name: "fetchOrders",
 *   fn: () => supabase.from("orders").select("*"),
 *   requiresAuth: true,
 * });
 * ```
 */

import {
  safeExecute,
  SafeExecuteOptions,
  SafeExecuteResult,
} from "@/lib/utils/safeExecute";
import { usePostHog } from "posthog-react-native";
import { useCallback } from "react";

export function useSafeExecute() {
  const posthog = usePostHog();

  /**
   * Execute a function with all safety checks
   * PostHog is automatically provided from the hook
   */
  const execute = useCallback(
    async <T>(
      options: Omit<SafeExecuteOptions<T>, "posthog">
    ): Promise<SafeExecuteResult<T>> => {
      return safeExecute({
        ...options,
        posthog,
      });
    },
    [posthog]
  );

  return { execute };
}

/**
 * Example usage in a component:
 *
 * ```typescript
 * function OrdersScreen() {
 *   const { execute } = useSafeExecute();
 *   const [orders, setOrders] = useState([]);
 *   const [loading, setLoading] = useState(false);
 *
 *   const fetchOrders = async () => {
 *     setLoading(true);
 *
 *     const result = await execute({
 *       name: "fetchOrders",
 *       fn: () => supabase.from("orders").select("*"),
 *       requiresAuth: true,
 *       requiresNetwork: true,
 *       showAlerts: true,
 *       errorMessage: "Failed to load orders",
 *       retry: true,        // auto-retry transient failures
 *       timeout: 15000,     // 15s timeout
 *     });
 *
 *     setLoading(false);
 *
 *     if (result.success) {
 *       setOrders(result.data);
 *     } else {
 *       // result.errorCode gives you the typed code
 *       // result.duration gives you how long it took
 *       console.warn(result.errorCode, result.error);
 *     }
 *   };
 *
 *   return (
 *     <View>
 *       <Button onPress={fetchOrders} disabled={loading}>
 *         {loading ? "Loading..." : "Load Orders"}
 *       </Button>
 *     </View>
 *   );
 * }
 * ```
 */
