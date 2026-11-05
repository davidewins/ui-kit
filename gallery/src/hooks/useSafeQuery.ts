// Gallery stand-in for the kit's useSafeQuery: same signature, plain TanStack
// Query underneath (no network, auth, Sentry or PostHog checks).
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

type SafeQueryOptions<TData> = {
  name: string;
  queryKey: unknown[];
  queryFn: () => Promise<TData>;
  requiresAuth?: boolean;
  requiresNetwork?: boolean;
  showAlerts?: boolean;
  errorMessage?: string;
  trackSuccess?: boolean;
  context?: Record<string, unknown>;
  timeout?: number;
  severity?: string;
} & Omit<UseQueryOptions<TData, Error>, "queryKey" | "queryFn" | "retry"> & {
  retry?: unknown;
};

export function useSafeQuery<TData = unknown>({
  name: _name,
  queryKey,
  queryFn,
  requiresAuth: _a,
  requiresNetwork: _n,
  showAlerts: _s,
  errorMessage: _e,
  trackSuccess: _t,
  context: _c,
  timeout: _to,
  severity: _sev,
  retry: _r,
  ...options
}: SafeQueryOptions<TData>) {
  return useQuery<TData, Error>({ queryKey, queryFn, retry: false, ...options });
}
