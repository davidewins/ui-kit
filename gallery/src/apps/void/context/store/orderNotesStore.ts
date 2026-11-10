import { create } from "zustand";

export type FulfillmentType = "pickup" | "platform_delivery" | "vendor_delivery";

export type DropoffOption =
  | "hand_deliver"
  | "leave_at_door"
  | "leave_with_doorman"
  | "leave_in_safe_place"
  | "leave_with_neighbour"
  | null;

export const DROPOFF_OPTIONS = [
  {
    id: "hand_deliver" as const,
    label: "Hand to me",
    description: "Wait for me to answer the door",
  },
  {
    id: "leave_at_door" as const,
    label: "Leave at door",
    description: "Leave outside my door",
  },
  {
    id: "leave_with_doorman" as const,
    label: "Leave with doorman",
    description: "Hand to concierge or doorman",
  },
  {
    id: "leave_in_safe_place" as const,
    label: "Leave in safe place",
    description: "Leave somewhere secure nearby",
  },
  {
    id: "leave_with_neighbour" as const,
    label: "Leave with neighbour",
    description: "Drop off with a nearby neighbour",
  },
];

export function dropoffOptionLabel(option: DropoffOption): string {
  if (!option) return "Select option";
  const found = DROPOFF_OPTIONS.find((o) => o.id === option);
  return found?.label ?? "Select option";
}

interface OrderConfigState {
  vendorNote: string;
  riderNote: string;
  fulfillmentType: FulfillmentType;
  dropoffOption: DropoffOption;
  deliveryAvailable: boolean;
  selectedPaymentMethod: "card" | "cash";
  vendorAcceptsCash: boolean;
  vendorAcceptsCard: boolean;
  useCredit: boolean;
  setVendorNote: (note: string) => void;
  setRiderNote: (note: string) => void;
  setFulfillmentType: (type: FulfillmentType) => void;
  setDropoffOption: (option: DropoffOption) => void;
  setDeliveryAvailable: (available: boolean) => void;
  setSelectedPaymentMethod: (method: "card" | "cash") => void;
  setVendorAcceptsCash: (accepts: boolean) => void;
  setVendorAcceptsCard: (accepts: boolean) => void;
  setUseCredit: (value: boolean) => void;
}

export const useOrderNotesStore = create<OrderConfigState>((set) => ({
  vendorNote: "",
  riderNote: "",
  fulfillmentType: "pickup",
  // Prefilled, not blank: the config screen opened asking a question every
  // customer answers the same way. They can still change it, and an
  // age-restricted order overrides it at handover because the rider has to
  // check ID in person.
  dropoffOption: "leave_at_door",
  deliveryAvailable: false,
  selectedPaymentMethod: "card",
  vendorAcceptsCash: false,
  vendorAcceptsCard: false,
  // It is the customer's money; making them opt in on every order is
  // friction, not safety (TAK-1218).
  useCredit: true,
  setVendorNote: (note) => set({ vendorNote: note }),
  setRiderNote: (note) => set({ riderNote: note }),
  setFulfillmentType: (type) => set({ fulfillmentType: type }),
  setDropoffOption: (option) => set({ dropoffOption: option }),
  setDeliveryAvailable: (available) => set({ deliveryAvailable: available }),
  setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),
  setVendorAcceptsCash: (accepts) => set({ vendorAcceptsCash: accepts }),
  setVendorAcceptsCard: (accepts) => set({ vendorAcceptsCard: accepts }),
  setUseCredit: (value) => set({ useCredit: value }),
}));
