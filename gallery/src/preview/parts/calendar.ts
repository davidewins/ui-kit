import type { PreviewPart } from "../registry";

// path (after http://localhost:8090/) -> page. Keep requires inline so each
// page loads on demand.
export const PART: PreviewPart = {
  "screens/calendar/month": { title: "Calendar", load: () => require("@/screens/calendar/month") },
  "screens/calendar/week": { title: "Calendar", load: () => require("@/screens/calendar/week") },
  "screens/calendar/day": { title: "Calendar", load: () => require("@/screens/calendar/day") },
  "screens/calendar/agenda": { title: "Calendar", load: () => require("@/screens/calendar/agenda") },
  "screens/calendar/team": { title: "Calendar", load: () => require("@/screens/calendar/team") },
};
