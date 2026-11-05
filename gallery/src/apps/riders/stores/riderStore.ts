import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { setOnlineStatus as setOnlineStatusApi } from "@/apps/riders/services/api";
import Logger from "@/lib/Logger";
import { GALWAY_COORDS } from "@/apps/riders/lib/reviewDemo";

const riderStorage = createMMKV({ id: "rider-store" });

const mmkvZustandStorage = {
  getItem: (name: string) => {
    const value = riderStorage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    riderStorage.set(name, value);
  },
  removeItem: (name: string) => {
    riderStorage.remove(name);
  },
};

export interface DeliveryOrder {
  id: string;
  orderId: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  customerName: string;
  customerId?: string;
  vendorName: string;
  estimatedDistance: number;
  estimatedDuration: number;
  deliveryFee: number;
  noteForRider?: string | null;
  deliveryInstructions?: string | null;
  status: "pending" | "accepted" | "picked_up" | "en_route" | "delivered" | "cancelled";
  createdAt: string;
  expiresAt?: string | null;
  // TAK-1092: order has 18+ items - rider checks photo ID before handover.
  ageRestricted?: boolean;
  // Ready time (accepted_at + prep_time) once the restaurant has confirmed.
  // Concierge offers go out before the call, so theirs arrives by push.
  readyAt?: string | null;
  // Concierge (TAK-934): the rider buys the food at the counter. `items` is the
  // shopping list to buy; on pickup the rider enters what they actually paid.
  concierge?: boolean;
  items?: {
    name: string;
    quantity: number;
    // Item configuration to buy (pizza size/toppings, drink, meal-deal parts).
    customizations?: { group: string; option: string; price_delta_cents: number }[];
  }[];
}

interface RiderState {
  isOnline: boolean;
  activeDelivery: DeliveryOrder | null;
  currentLat: number | null;
  currentLng: number | null;
  currentHeading: number | null;
  todayEarnings: number;
  todayDeliveries: number;
  // Set once from the rider's profile phone_number - see lib/reviewDemo.ts.
  isReviewDemoRider: boolean;

  setOnline: (online: boolean) => Promise<boolean>;
  setActiveDelivery: (delivery: DeliveryOrder | null) => void;
  syncTodayTotals: (earningsCents: number, deliveries: number) => void;
  setIsReviewDemoRider: (value: boolean) => void;
  updateLocation: (lat: number, lng: number, heading?: number | null) => void;
  acceptDelivery: (delivery: DeliveryOrder) => void;
  updateDeliveryStatus: (status: DeliveryOrder["status"]) => void;
  completeDelivery: (payoutCents?: number) => void;
  resetDay: () => void;
}

export const useRiderStore = create<RiderState>()(
  persist(
    (set, get) => ({
      isOnline: false,
      activeDelivery: null,
      currentLat: null,
      currentLng: null,
      currentHeading: null,
      todayEarnings: 0,
      todayDeliveries: 0,
      isReviewDemoRider: false,

      setOnline: async (online) => {
        // A rider with a delivery in progress must finish or hand it off
        // first - going offline mid-delivery would strand the order with no
        // one tracking it to pickup/dropoff.
        if (!online && get().activeDelivery) {
          return false;
        }
        const previous = get().isOnline;
        set({ isOnline: online });
        try {
          await setOnlineStatusApi(online);
          return true;
        } catch (err) {
          Logger.error("[RiderStore] Failed to sync online status:", err);
          set({ isOnline: previous });
          return false;
        }
      },

      setActiveDelivery: (delivery) => set({ activeDelivery: delivery }),

      // The server owns today's totals: riders.today_earnings_cents and
      // today_deliveries are written when a delivery completes and cleared
      // when the rider goes live on a new day. completeDelivery() below only
      // moves the number optimistically so the rider sees it straight away -
      // without this the counter was device-local, survived in MMKV forever
      // and never reset, so "Today's Earnings" drifted into a running total
      // and read 0 on a new device.
      syncTodayTotals: (earningsCents, deliveries) => {
        const { todayEarnings, todayDeliveries } = get();
        if (todayEarnings === earningsCents && todayDeliveries === deliveries) {
          return;
        }
        set({ todayEarnings: earningsCents, todayDeliveries: deliveries });
      },

      setIsReviewDemoRider: (value) => set({ isReviewDemoRider: value }),

      updateLocation: (lat, lng, heading) => {
        const { isReviewDemoRider } = get();
        const headingDeg =
          heading != null && heading >= 0 ? heading : undefined;
        if (isReviewDemoRider) {
          set({
            currentLat: GALWAY_COORDS.lat,
            currentLng: GALWAY_COORDS.lng,
            currentHeading: 0,
          });
          return;
        }
        set({
          currentLat: lat,
          currentLng: lng,
          ...(headingDeg != null ? { currentHeading: headingDeg } : {}),
        });
      },

      acceptDelivery: (delivery) =>
        set({
          activeDelivery: { ...delivery, status: "accepted" },
        }),

      updateDeliveryStatus: (status) => {
        const current = get().activeDelivery;
        if (current) {
          set({ activeDelivery: { ...current, status } });
        }
      },

      completeDelivery: (payoutCents?: number) => {
        const current = get().activeDelivery;
        if (current) {
          const earnings = payoutCents ?? current.deliveryFee;
          set({
            activeDelivery: null,
            todayEarnings: get().todayEarnings + earnings,
            todayDeliveries: get().todayDeliveries + 1,
          });
        }
      },

      resetDay: () => set({ todayEarnings: 0, todayDeliveries: 0 }),
    }),
    {
      name: "rider-state",
      storage: createJSONStorage(() => mmkvZustandStorage),
      partialize: (state) => ({
        isOnline: state.isOnline,
        activeDelivery: state.activeDelivery,
        todayEarnings: state.todayEarnings,
        todayDeliveries: state.todayDeliveries,
      }),
    },
  ),
);
