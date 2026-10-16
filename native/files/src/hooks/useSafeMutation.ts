/**
 * TanStack Query Integration for Safe Execute
 *
 * Provides mutations that automatically include all safety checks:
 * - Optional Zod validation of variables (variablesSchema)
 * - Network connectivity
 * - Authentication
 * - Sentry error tracking with typed error codes
 * - PostHog analytics
 * - Optional retry with backoff
 * - Operation timing
 *
 * Usage:
 * ```typescript
 * const mutation = useSafeMutation({
 *   name: "createOrder",
 *   mutationFn: (data) => supabase.from("orders").insert(data),
 *   requiresAuth: true,
 *   variablesSchema: orderSchema, // optional Zod schema
 * });
 *
 * await mutation.mutateAsync(orderData);
 * ```
 */

import {
  safeExecute,
  ErrorCode,
  type SafeExecuteOptions,
} from "@/lib/utils/safeExecute";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { usePostHog } from "posthog-react-native";
import type { z } from "zod";

type SafeMutationOptions<TData, TVariables> = Omit<
  SafeExecuteOptions<TData>,
  "fn" | "name" | "posthog"
> & {
  name: string;
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Optional Zod schema to validate variables before calling mutationFn */
  variablesSchema?: z.ZodType<TVariables>;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (
    error: string,
    variables: TVariables,
    context?: unknown,
  ) => void | Promise<void>;
} & Omit<
    UseMutationOptions<TData, Error, TVariables>,
    "mutationFn" | "onSuccess" | "onError"
  >;

/**
 * Hook that combines TanStack Query mutations with safeExecute.
 * If variablesSchema is provided, variables are parsed and validated with Zod before mutationFn runs.
 */
export function useSafeMutation<TData = unknown, TVariables = void>({
  name,
  mutationFn,
  variablesSchema,
  requiresAuth = false,
  requiresNetwork = true,
  showAlerts = true,
  errorMessage,
  trackSuccess = true,
  context = {},
  retry: safeRetry,
  timeout,
  severity,
  onSuccess,
  onError,
  ...queryOptions
}: SafeMutationOptions<TData, TVariables>) {
  const posthog = usePostHog();

  return useMutation({
    ...queryOptions,
    mutationFn: async (variables: TVariables) => {
      let parsedVariables = variables;

      if (variablesSchema) {
        const parsed = variablesSchema.safeParse(variables);
        if (!parsed.success) {
          const msg = parsed.error.issues.map((e) => e.message).join("; ");
          throw Object.assign(new Error(msg), {
            code: ErrorCode.VALIDATION_ERROR,
            status: 422,
          });
        }
        parsedVariables = parsed.data;
      }

      const result = await safeExecute({
        name,
        fn: () => mutationFn(parsedVariables),
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
          variables: (JSON.stringify(parsedVariables) ?? "").slice(0, 200), // Truncate for logging
        },
      });

      if (!result.success) {
        throw new Error(result.error || "Unknown error");
      }

      return result.data!;
    },
    onSuccess: async (data, variables, context) => {
      await onSuccess?.(data, variables);
    },
    onError: async (error: Error, variables, context) => {
      await onError?.(error.message, variables, context);
    },
  });
}

/**
 * Example usage:
 *
 * ```typescript
 * // Simple mutation
 * const createProduct = useSafeMutation({
 *   name: "createProduct",
 *   mutationFn: (data: ProductData) => supabase.from("products").insert(data),
 *   requiresAuth: true,
 *   onSuccess: () => {
 *     Toast.success("Product created!");
 *     router.back();
 *   },
 * });
 *
 * // Critical mutation with retry + timeout
 * const processPayment = useSafeMutation({
 *   name: "processPayment",
 *   mutationFn: (data) => api.payments.process(data),
 *   requiresAuth: true,
 *   retry: 2,             // retry server errors / timeouts
 *   timeout: 30000,       // 30s timeout
 *   severity: "fatal",    // page on-call if this fails
 *   showAlerts: true,
 * });
 *
 * // With optimistic updates
 * const updateProduct = useSafeMutation({
 *   name: "updateProduct",
 *   mutationFn: (data: UpdateData) =>
 *     supabase.from("products").update(data).eq("id", data.id),
 *   requiresAuth: true,
 *   onMutate: async (newData) => {
 *     await queryClient.cancelQueries({ queryKey: ["products"] });
 *     const previous = queryClient.getQueryData(["products"]);
 *     queryClient.setQueryData(["products"], (old) => updateOptimistically(old, newData));
 *     return { previous };
 *   },
 *   onError: (err, variables, context) => {
 *     queryClient.setQueryData(["products"], context?.previous);
 *   },
 *   onSettled: () => {
 *     queryClient.invalidateQueries({ queryKey: ["products"] });
 *   },
 * });
 *
 * // Using the mutation
 * <Button
 *   onPress={() => createProduct.mutate(formData)}
 *   loading={createProduct.isPending}
 * >
 *   Create
 * </Button>
 * ```
 */
