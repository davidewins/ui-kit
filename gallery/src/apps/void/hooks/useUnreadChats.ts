import {
  isSupportCid,
  orderIdOfCid,
  useOrderBadgeStore,
} from "@/apps/void/context/store/orderBadgeStore";
import { useMemo } from "react";

/**
 * Unread chats, from the one source the app already keeps in sync. Exposes a
 * global total for the Profile row and a per-order count for the order screen,
 * so the two can never disagree.
 */
export function useUnreadChats() {
  const cids = useOrderBadgeStore((s) => s.cids);
  return useMemo(
    () => ({
      total: cids.length,
      support: cids.filter(isSupportCid).length,
      forOrder: (orderId: string) =>
        cids.filter((cid) => orderIdOfCid(cid) === orderId).length,
      cidsForOrder: (orderId: string) =>
        cids.filter((cid) => orderIdOfCid(cid) === orderId),
    }),
    [cids],
  );
}
