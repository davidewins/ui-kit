import type { PreviewPart } from "../registry";

export const PART: PreviewPart = {
  "screens/fitness/today": { title: "Today", load: () => require("@/screens/fitness/today") },
  "screens/fitness/session": { title: "Lower body power", load: () => require("@/screens/fitness/session") },
  "screens/fitness/summary": { title: "Lower body power", load: () => require("@/screens/fitness/summary") },
  "screens/fitness/progress": { title: "Progress", load: () => require("@/screens/fitness/progress") },
  "screens/money/earnings": { title: "Earnings", load: () => require("@/screens/rider/earnings") },
  "screens/profile/plan": { title: "Set up", load: () => require("@/screens/plans/choose") },
  "screens/money/balance": { title: "Balance", load: () => require("@/screens/money/balance") },
  "screens/money/sales": { title: "Today", load: () => require("@/screens/money/sales") },
  "screens/money/spending": { title: "October", load: () => require("@/screens/money/spending") },
};
