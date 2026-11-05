import { useSafeMutation } from "@/hooks/useSafeMutation";
import { useSafeQuery } from "@/hooks/useSafeQuery";
import type { ModuleKey } from "@/apps/sellers/lib/onboardingCatalog";
import {
  getVendorModules,
  patchVendorModule,
  type ModuleStatus,
  type VendorModule,
} from "@/apps/sellers/lib/vendorModulesApi";
import { useQueryClient } from "@tanstack/react-query";

const STALE_TIME_MS = 5 * 60 * 1000;

export function useVendorModules(vendorId: string | null | undefined) {
  return useSafeQuery<VendorModule[]>({
    name: "vendorModules",
    queryKey: ["vendor-modules", vendorId],
    requiresAuth: true,
    enabled: !!vendorId,
    staleTime: STALE_TIME_MS,
    queryFn: async () => {
      if (!vendorId) throw new Error("vendorId required");
      const { modules } = await getVendorModules(vendorId);
      return modules;
    },
  });
}

/**
 * Returns a Map<ModuleKey, ModuleStatus> for quick lookup. Undefined for
 * modules the vendor doesn't have a row for.
 */
export function useVendorModuleStatusMap(vendorId: string | null | undefined) {
  const query = useVendorModules(vendorId);
  const byKey = new Map<ModuleKey, ModuleStatus>();
  if (query.data) {
    for (const m of query.data) byKey.set(m.module_key, m.status);
  }
  return { byKey, ...query };
}

export function useSetVendorModuleStatus(vendorId: string | null | undefined) {
  const queryClient = useQueryClient();
  return useSafeMutation<
    VendorModule,
    { moduleKey: ModuleKey; status: ModuleStatus }
  >({
    name: "setVendorModuleStatus",
    requiresAuth: true,
    mutationFn: async ({ moduleKey, status }) => {
      if (!vendorId) throw new Error("vendorId required");
      return patchVendorModule(vendorId, moduleKey, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vendor-modules", vendorId],
      });
    },
  });
}
