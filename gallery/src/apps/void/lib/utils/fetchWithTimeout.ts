// Gallery (TAK-1491): VOID's API answered from fixtures, never the network.
import { makeFixtureFetch } from "@/gallery/fixtureFetch";
import {
  NOTIFICATION_SETTINGS,
  ORDER_LIST,
  ORDERS,
  orderLive,
} from "@/apps/void/fixtures";

export const fetchWithTimeout = makeFixtureFetch([
  [/\/api\/orders$/, () => ({ orders: ORDER_LIST })],
  [/\/api\/orders\/([^/]+)$/, (m) => ({ order: ORDERS.find((o) => o.id === m[1]) ?? null })],
  [/\/video\/order-live\/([^/]+)$/, (m) => orderLive(m[1])],
  [/\/api\/notification-settings$/, () => ({ settings: NOTIFICATION_SETTINGS })],
]);
