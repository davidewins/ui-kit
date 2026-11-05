import { fixtureFetch } from "@/apps/sellers/lib/fixtureFetch";
import { SERVER_URL } from "@/apps/sellers/constants/keys";
import { supabase } from "@/lib/supabase";
import type { ModuleKey } from "@/apps/sellers/lib/onboardingCatalog";

export type ModuleStatus = "enabled" | "setup_pending" | "disabled";

export type VendorModule = {
  vendor_id: string;
  module_key: ModuleKey;
  status: ModuleStatus;
  created_at: string;
  updated_at: string;
  setup_started_at: string | null;
  setup_completed_at: string | null;
};

export type VendorModulesResponse = {
  modules: VendorModule[];
};

export class VendorModulesApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "VendorModulesApiError";
    this.status = status;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({ error: "Request failed" }));
  if (!res.ok) {
    const message =
      (data as { error?: string; message?: string }).error ||
      (data as { error?: string; message?: string }).message ||
      "Request failed";
    throw new VendorModulesApiError(`${res.status}: ${message}`, res.status);
  }
  return data as T;
}

async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new VendorModulesApiError("Not authenticated", 401);
  return token;
}

export async function getVendorModules(
  vendorId: string,
): Promise<VendorModulesResponse> {
  const token = await getAccessToken();
  const res = await fixtureFetch(
    `${SERVER_URL}/vendors/${encodeURIComponent(vendorId)}/modules`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return handleResponse<VendorModulesResponse>(res);
}

export async function patchVendorModule(
  vendorId: string,
  moduleKey: ModuleKey,
  status: ModuleStatus,
): Promise<VendorModule> {
  const token = await getAccessToken();
  const res = await fixtureFetch(
    `${SERVER_URL}/vendors/${encodeURIComponent(vendorId)}/modules/${encodeURIComponent(moduleKey)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    },
  );
  return handleResponse<VendorModule>(res);
}
