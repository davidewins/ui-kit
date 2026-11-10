import type { PreviewPart } from "../registry";

// path (after http://localhost:8090/) -> page. Keep requires inline so each
// page loads on demand.
export const PART: PreviewPart = {
  "screens/orders/track-timeline": { title: "Order", load: () => require("@/screens/orders/track-timeline") },
  "screens/orders/track-live": { title: "On its way", load: () => require("@/screens/orders/track-live") },
  "screens/orders/receipt": { title: "Receipt", load: () => require("@/screens/orders/receipt") },
  "screens/orders/compact": { title: "Order", load: () => require("@/screens/orders/compact") },
  "screens/orders/list": { title: "Orders", load: () => require("@/screens/orders/list") },
  "screens/orders/product-gallery": { title: "", load: () => require("@/screens/orders/product-gallery") },
  "screens/orders/product-editorial": { title: "", load: () => require("@/screens/orders/product-editorial") },
};
