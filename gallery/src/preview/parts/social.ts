import type { PreviewPart } from "../registry";

// path (after http://localhost:8090/) -> page. Keep requires inline so each
// page loads on demand.
export const PART: PreviewPart = {
  "screens/social/account-profile": { title: "davidewins", load: () => require("@/screens/social/account-profile") },
  "screens/social/account-insights": { title: "Insights", load: () => require("@/screens/social/account-insights") },
  "screens/social/account-feed": { title: "Timeline", load: () => require("@/screens/social/account-feed") },
  "screens/social/inbox": { title: "Inbox", load: () => require("@/screens/social/inbox") },
  "screens/social/thread": { title: "Tolka Run Co", load: () => require("@/screens/social/thread") },
  "screens/social/activity": { title: "Activity", load: () => require("@/screens/social/activity") },
};
