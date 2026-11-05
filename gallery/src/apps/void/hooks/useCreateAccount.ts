import { API_URL } from "@/apps/void/constants/keys";
import { useSafeMutation } from "@/hooks/useSafeMutation";
import Logger from "@/lib/Logger";
import { supabase } from "@/lib/supabase";
import { fetchWithTimeout } from "@/apps/void/lib/utils/fetchWithTimeout";

type CreateAccountParams = {
  account_type: "vendor" | "rider" | "staff" | "gymbros_user" | "user";
  email?: string;
  first_name?: string;
  last_name?: string;
};

/**
 * Hook to create a user account on the backend after authentication.
 *
 * Important notes:
 * - Use `mutateAsync` (not `mutate`) if you need to await the result or
 *   catch errors at the call site. `mutate` is fire-and-forget and will
 *   NOT throw - errors only surface via the `onError` callback or the
 *   returned `error` / `isError` state.
 * - 409 (account already exists) is treated as success, not an error.
 * - Retries up to 2 times with exponential backoff for transient failures.
 */
export function useCreateAccount() {
  return useSafeMutation({
    name: "createAccount",
    mutationFn: async (params: CreateAccountParams) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("No active session");
      }

      const response = await fetchWithTimeout(
        `${API_URL}/accounts/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            ...params,
            email: params.email || session.user.email,
          }),
        },
        15000,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // Ignore 409 (Account already exists) - not an error
        if (response.status === 409) {
          return { message: "Account already exists", exists: true };
        }
        throw new Error(errorData.error || "Failed to create account");
      }

      return await response.json();
    },
    requiresAuth: true,
    retry: 2,
    retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 8000),
    onError: (errorMessage: string) => {
      Logger.error("Account creation failed:", errorMessage);
    },
  });
}
