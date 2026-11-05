// Gallery stand-in for the kit's useSafeMutation: same signature, plain
// TanStack mutation underneath.
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

type SafeMutationOptions<TData, TVariables> = {
  name: string;
  mutationFn: (variables: TVariables) => Promise<TData>;
  requiresAuth?: boolean;
  requiresNetwork?: boolean;
  showAlerts?: boolean;
  errorMessage?: string;
  trackSuccess?: boolean;
  context?: Record<string, unknown>;
  schema?: unknown;
  timeout?: number;
  severity?: string;
  retry?: unknown;
  variablesSchema?: unknown;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: string, variables: TVariables, context?: unknown) => void | Promise<void>;
} & Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn" | "retry" | "onSuccess" | "onError">;

export function useSafeMutation<TData = unknown, TVariables = void>({
  name: _name,
  mutationFn,
  requiresAuth: _a,
  requiresNetwork: _n,
  showAlerts: _s,
  errorMessage: _e,
  trackSuccess: _t,
  context: _c,
  schema: _schema,
  timeout: _to,
  severity: _sev,
  retry: _r,
  variablesSchema: _v,
  onSuccess,
  onError,
  ...options
}: SafeMutationOptions<TData, TVariables>) {
  return useMutation<TData, Error, TVariables>({
    mutationFn,
    ...options,
    onSuccess: (data, variables) => onSuccess?.(data, variables),
    onError: (error, variables, context) => onError?.(error.message, variables, context),
  });
}
