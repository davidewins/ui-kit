import { create } from "zustand";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  thumbnail: string;
  current_stock: number;
}

interface VendorState {
  // Legacy id field (may be vendor, storefront, or location ID depending on context)
  id: string | null;
  // New explicit IDs for the order system
  vendorId: string | null;
  storefrontId: string | null;
  locationId: string | null;
  // Other fields
  logo_url: string | null;
  trading_name: string | null;
  rating: number | null;
  category: string | null;
  address: string | null;
  description: string | null;
  subtitle: string | null;
  long: number | null;
  lat: number | null;
  products: Product[];
  stripe_connect_id: string | null;
  orderType: "delivery" | "pickup";
  setVendor: (vendor: Partial<VendorState>) => void;
  setOrderType: (orderType: "delivery" | "pickup") => void;
  setProducts: (products: Product[]) => void;
}

export const useStore = create<VendorState>((set) => ({
  id: null,
  vendorId: null,
  storefrontId: null,
  locationId: null,
  logo_url: null,
  trading_name: null,
  rating: null,
  category: null,
  address: null,
  description: null,
  subtitle: null,
  long: null,
  lat: null,
  products: [],
  stripe_connect_id: null,
  orderType: "delivery",
  setVendor: (vendor) => set((state) => ({ ...state, ...vendor })),
  setProducts: (products) => set({ products }),
  setOrderType: (orderType) => set({ orderType }),
}));
