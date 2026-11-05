import { supabase } from "@/lib/supabase";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

function handleGlobalError(error: unknown) {
  const msg =
    error && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : "";

  if (msg.includes("SESSION_REVOKED") || msg.includes("Session revoked")) {
    supabase.auth.signOut();
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleGlobalError }),
  mutationCache: new MutationCache({ onError: handleGlobalError }),
});
