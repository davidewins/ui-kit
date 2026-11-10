import { useSafeMutation } from "@/hooks/useSafeMutation";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import { supabase } from "@/lib/supabase";
import Logger from "@/lib/Logger";
import { useQueryClient } from "@tanstack/react-query";

export type PaymentMethodType = "apple_pay" | "google_pay" | "card" | "cash";

interface PaymentPreferences {
  defaultMethod: PaymentMethodType;
  defaultStripePaymentMethodId: string | null;
}

/**
 * Hook to fetch user's payment preferences from Supabase
 */
export function useUserPaymentPreferences() {
  return useSafeQuery({
    name: "userPaymentPreferences",
    queryKey: ["user-payment-preferences"],
    queryFn: async (): Promise<PaymentPreferences> => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Not authenticated");
      }

      // Query with type assertion - columns added via migration
      // See sql/users_default_payment_method.sql
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        Logger.error("Error fetching payment preferences:", error);
        // Return defaults if query fails
        return {
          defaultMethod: "apple_pay",
          defaultStripePaymentMethodId: null,
        };
      }

      // Type-safe extraction with fallbacks
      const userData = data as Record<string, unknown>;
      return {
        defaultMethod: (userData?.default_payment_method as PaymentMethodType) || "apple_pay",
        defaultStripePaymentMethodId: (userData?.default_stripe_payment_method_id as string) || null,
      };
    },
    requiresAuth: true,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to update user's default payment method
 */
export function useUpdatePaymentPreferences() {
  const queryClient = useQueryClient();

  return useSafeMutation({
    name: "updatePaymentPreferences",
    mutationFn: async ({
      defaultMethod,
      defaultStripePaymentMethodId,
    }: {
      defaultMethod?: PaymentMethodType;
      defaultStripePaymentMethodId?: string | null;
    }) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Not authenticated");
      }

      const updates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (defaultMethod !== undefined) {
        updates.default_payment_method = defaultMethod;
      }

      if (defaultStripePaymentMethodId !== undefined) {
        updates.default_stripe_payment_method_id = defaultStripePaymentMethodId;
      }

      // Update with type assertion - columns added via migration
      // See sql/users_default_payment_method.sql
      const { data, error } = await supabase
        .from("users")
        .update(updates as never)
        .eq("id", user.id)
        .select("*")
        .single();

      if (error) {
        Logger.error("Error updating payment preferences:", error);
        throw error;
      }

      // Type-safe extraction
      const userData = data as Record<string, unknown>;
      return {
        defaultMethod: (userData?.default_payment_method as PaymentMethodType) || defaultMethod!,
        defaultStripePaymentMethodId: (userData?.default_stripe_payment_method_id as string) || null,
      };
    },
    requiresAuth: true,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-payment-preferences"] });
      queryClient.invalidateQueries({ queryKey: ["current_user"] });
    },
  });
}
