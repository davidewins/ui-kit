/**
 * Store status utility for determining if a storefront is currently open
 * and when it will next accept orders.
 */

export type OpeningHoursMap = Record<
  string,
  {
    isOpen: boolean;
    timeSlots: Array<{ open: string; close: string }>;
  }
>;

export interface StoreStatus {
  isOpen: boolean;
  statusText: string;
  nextOpenDay?: string;
  nextOpenTime?: string;
}

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  if (!hours || minutes == null) return time;
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

const DAY_ALIASES: Record<string, (typeof DAY_ORDER)[number]> = {
  mon: "Monday",
  monday: "Monday",
  tue: "Tuesday",
  tues: "Tuesday",
  tuesday: "Tuesday",
  wed: "Wednesday",
  weds: "Wednesday",
  wednesday: "Wednesday",
  thu: "Thursday",
  thur: "Thursday",
  thurs: "Thursday",
  thursday: "Thursday",
  fri: "Friday",
  friday: "Friday",
  sat: "Saturday",
  saturday: "Saturday",
  sun: "Sunday",
  sunday: "Sunday",
  "0": "Sunday",
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday",
  "7": "Sunday",
};

export const normalizeDayKey = (day: string | number): string => {
  const raw = String(day).trim();
  if (!raw) return raw;
  const alias = DAY_ALIASES[raw.toLowerCase()];
  if (alias) return alias;
  const lower = raw.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const resolveDayHours = (
  openingHours: OpeningHoursMap,
  day: (typeof DAY_ORDER)[number],
) => {
  const candidates = [
    day,
    day.toLowerCase(),
    day.toUpperCase(),
    normalizeDayKey(day),
  ];
  for (const key of candidates) {
    if (openingHours[key]) return openingHours[key];
  }
  return undefined;
};

const parseMinutes = (time: string) => {
  const parts = time.split(":");
  const hours = Number(parts[0]);
  const minutes = Number(parts[1] ?? 0);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
};

/**
 * Compute whether a store is open right now and when it will next be open.
 */
export const getStoreStatus = (
  openingHours: OpeningHoursMap | null
): StoreStatus => {
  if (!openingHours) {
    return { isOpen: false, statusText: "Hours unavailable" };
  }

  const now = new Date();
  const todayName = normalizeDayKey(
    now.toLocaleDateString("en-US", { weekday: "long" }),
  );
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const todayIndex = DAY_ORDER.indexOf(todayName as (typeof DAY_ORDER)[number]);

  // Check if a window that opened YESTERDAY is still running (overnight hours,
  // e.g. opens 18:00, closes 03:30). If so, we're open right now.
  if (todayIndex !== -1) {
    const yesterdayIndex = (todayIndex + 6) % 7;
    const yesterdayHours = resolveDayHours(
      openingHours,
      DAY_ORDER[yesterdayIndex],
    );
    if (yesterdayHours?.isOpen && yesterdayHours.timeSlots?.[0]) {
      const { open, close } = yesterdayHours.timeSlots[0];
      const openMinutes = parseMinutes(open);
      const closeMinutes = parseMinutes(close);
      if (openMinutes == null || closeMinutes == null) {
        // fall through
      } else {
      // Only an overnight window (close <= open) can spill into today.
        if (closeMinutes <= openMinutes && currentMinutes < closeMinutes) {
          return {
            isOpen: true,
            statusText: `Open till ${formatTime(close)}`,
          };
        }
      }
    }
  }

  const todayHours = resolveDayHours(openingHours, todayName as (typeof DAY_ORDER)[number]);

  // Check if currently open
  if (todayHours?.isOpen && todayHours.timeSlots?.[0]) {
    const { open, close } = todayHours.timeSlots[0];
    const openMinutes = parseMinutes(open);
    const closeMinutes = parseMinutes(close);
    if (openMinutes != null && closeMinutes != null) {
    // Overnight windows (close <= open) run past midnight, so any time at or
    // after open counts as open today.
    const isOvernight = closeMinutes <= openMinutes;

    const openNow = isOvernight
      ? currentMinutes >= openMinutes
      : currentMinutes >= openMinutes && currentMinutes < closeMinutes;

      if (openNow) {
        return {
          isOpen: true,
          statusText: `Open till ${formatTime(close)}`,
        };
      }

      // Haven't opened yet today
      if (currentMinutes < openMinutes) {
        return {
          isOpen: false,
          statusText: `Opens today at ${formatTime(open)}`,
          nextOpenDay: todayName,
          nextOpenTime: formatTime(open),
        };
      }
    }
  }

  // Find next open day
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (todayIndex + i) % 7;
    const nextDay = DAY_ORDER[nextDayIndex];
    const nextDayHours = resolveDayHours(openingHours, nextDay);

    if (nextDayHours?.isOpen && nextDayHours.timeSlots?.[0]) {
      const nextOpenTime = formatTime(nextDayHours.timeSlots[0].open);
      const dayLabel = i === 1 ? "tomorrow" : nextDay;
      return {
        isOpen: false,
        statusText: `Opens ${dayLabel} at ${nextOpenTime}`,
        nextOpenDay: nextDay,
        nextOpenTime,
      };
    }
  }

  return { isOpen: false, statusText: "Currently closed" };
};

/**
 * Do we actually know this store's hours? An empty map means "unknown", not
 * "closed" - concierge listings often publish no hours at all (TAK-1110), and
 * getStoreStatus reports isOpen:false for unknown just as it does for shut.
 */
export const hasKnownHours = (openingHours: OpeningHoursMap | null): boolean =>
  !!openingHours && Object.keys(openingHours).length > 0;

/**
 * Block ordering only when hours we know say the store is shut. Mirrors the
 * product page ("missing hours must not lock a store out") so the basket can't
 * disable checkout for a store the rest of the app shows as orderable.
 */
export const isOrderingBlocked = (
  openingHours: OpeningHoursMap | null,
  status: StoreStatus,
): boolean => hasKnownHours(openingHours) && !status.isOpen;

/**
 * Compact closed-state phrasing for cards/badges, derived from the statusText
 * produced by getStoreStatus so callers that only hold the string (home feed
 * cards via useStorefrontOpenMap) get identical wording:
 *   "Opens today at 09:00"    → "Closed till 9:00"
 *   "Opens tomorrow at 09:00" → "Closed till tomorrow 9:00"
 *   "Opens Tuesday at 09:00"  → "Closed till Tue 9:00"
 * Anything else ("Currently closed", "Hours unavailable", "Open till ...") is
 * returned unchanged.
 */
export const formatClosedStatusText = (statusText: string): string => {
  const match = /^Opens (today|tomorrow|[A-Za-z]+) at (\d{1,2}:\d{2})$/.exec(
    statusText,
  );
  if (!match) return statusText;
  const [, day, time] = match;
  const shortTime = time.replace(/^0(?=\d)/, "");
  if (day === "today") return `Closed till ${shortTime}`;
  const dayLabel = day === "tomorrow" ? "tomorrow" : day.slice(0, 3);
  return `Closed till ${dayLabel} ${shortTime}`;
};
