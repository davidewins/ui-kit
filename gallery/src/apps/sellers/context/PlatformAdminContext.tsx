import React, { createContext, useContext, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface PlatformAdminState {
  /** Whether the current user is a platform admin */
  isPlatformAdmin: boolean;
  setPlatformAdmin: (value: boolean) => void;
  /** The vendor ID that the platform admin has selected to manage */
  selectedVendorId: string | null;
  selectVendor: (vendorId: string) => void;
  clearVendor: () => void;
}

const PlatformAdminContext = createContext<PlatformAdminState>({
  isPlatformAdmin: false,
  setPlatformAdmin: () => {},
  selectedVendorId: null,
  selectVendor: () => {},
  clearVendor: () => {},
});

export function PlatformAdminProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPlatformAdmin, setPlatformAdmin] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Vendor-scoped queries (earnings, balance, storefronts, orders, modules,
  // permissions, opening hours, ...) all key off a derived vendorId, not on
  // selectedVendorId itself. Without invalidation here, switching vendors
  // shows the previous vendor's data until each query's staleTime expires
  // (TAK-332).
  const selectVendor = useCallback(
    (vendorId: string) => {
      setSelectedVendorId(vendorId);
      queryClient.invalidateQueries();
    },
    [queryClient],
  );

  const clearVendor = useCallback(() => {
    setSelectedVendorId(null);
    queryClient.invalidateQueries();
  }, [queryClient]);

  return (
    <PlatformAdminContext.Provider
      value={{
        isPlatformAdmin,
        setPlatformAdmin,
        selectedVendorId,
        selectVendor,
        clearVendor,
      }}
    >
      {children}
    </PlatformAdminContext.Provider>
  );
}

export const usePlatformAdmin = () => useContext(PlatformAdminContext);
