import { useSafeQuery } from "@/hooks/useSafeQuery";
import { usePlatformAdmin } from "@/apps/sellers/context/PlatformAdminContext";
import { supabase } from "@/lib/supabase";

/**
 * Hook to get the current vendor for the authenticated user
 *
 * Checks three sources (in order):
 * 1. Platform admin's selected vendor (from PlatformAdminContext)
 * 2. Vendor ownership (vendor_owners table)
 * 3. Staff membership (vendor_staff table)
 */
export function useCurrentVendor() {
  const { isPlatformAdmin, selectedVendorId } = usePlatformAdmin();

  return useSafeQuery({
    name: "currentVendor",
    queryKey: ["current_vendor", selectedVendorId],
    requiresAuth: true,
    queryFn: async () => {
      // If platform admin has selected a vendor, use that
      if (isPlatformAdmin && selectedVendorId) {
        const { data: vendor, error: vendorError } = await supabase
          .from("vendors")
          .select("*")
          .eq("id", selectedVendorId)
          .single();

        if (vendorError) throw vendorError;
        return vendor;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("No authenticated user found");
      }

      // Check if user is an owner via vendor_owners table
      const { data: ownership, error: ownershipError } = await supabase
        .from("vendor_owners")
        .select("vendor_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (ownershipError) throw ownershipError;

      if (!ownership) {
        // Check if user is staff
        const { data: staffRecord } = await supabase
          .from("vendor_staff")
          .select("vendor_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (staffRecord?.vendor_id) {
          const { data: vendor, error: vendorError } = await supabase
            .from("vendors")
            .select("*")
            .eq("id", staffRecord.vendor_id)
            .single();
          if (vendorError) throw vendorError;
          return vendor;
        }

        return null;
      }

      // Fetch the full vendor object
      const { data: vendor, error: vendorError } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", ownership.vendor_id!)
        .single();

      if (vendorError) throw vendorError;
      return vendor;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1, // Only retry once on failure (TanStack Query retry)
    timeout: 8000, // Fail-fast: never let a hung query block the UI
  });
}

/**
 * Convenience hook that just returns the vendor ID
 */
export function useCurrentVendorId() {
  const { data: vendor, ...rest } = useCurrentVendor();
  return {
    data: vendor?.id ?? null,
    ...rest,
  };
}
