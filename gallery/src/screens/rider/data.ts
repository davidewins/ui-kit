// A delivery rider's week. Each day's trips add up to that day's total.
export interface Trip {
  time: string;
  from: string;
  to: string;
  km: number;
  minutes: number;
  fare: number;
  tip: number;
}

export interface Day {
  label: string;
  name: string;
  /** null: has not happened yet. */
  total: number | null;
  online: string;
  fares: number;
  tips: number;
  bonus: number;
  trips: Trip[];
}

const thursday: Trip[] = [
  { time: "12:04", from: "Bao House, Capel St", to: "Smithfield Sq", km: 1.4, minutes: 9, fare: 5.2, tip: 2.0 },
  { time: "12:31", from: "Sprout, Dawson St", to: "Fitzwilliam Sq", km: 1.1, minutes: 8, fare: 4.8, tip: 0 },
  { time: "13:02", from: "Bunsen, Wexford St", to: "Portobello Rd", km: 1.9, minutes: 11, fare: 5.9, tip: 3.0 },
  { time: "13:40", from: "Musashi, Capel St", to: "Stoneybatter", km: 2.6, minutes: 14, fare: 7.1, tip: 1.5 },
  { time: "18:12", from: "Pi Pizza, George's St", to: "Ranelagh Rd", km: 3.2, minutes: 16, fare: 8.4, tip: 4.0 },
  { time: "18:48", from: "Bunsen, Wexford St", to: "Harold's Cross", km: 2.8, minutes: 15, fare: 7.6, tip: 0 },
  { time: "19:20", from: "Bao House, Capel St", to: "Phibsborough Rd", km: 2.4, minutes: 13, fare: 6.9, tip: 2.5 },
  { time: "19:55", from: "Sprout, Dawson St", to: "Grand Canal Dock", km: 2.1, minutes: 12, fare: 6.4, tip: 5.0 },
];
const sum = (ts: Trip[], k: "fare" | "tip") => Math.round(ts.reduce((n, t) => n + t[k], 0) * 100) / 100;

export const DAYS: Day[] = [
  { label: "M", name: "Monday", total: 96.4, online: "4 h 20", fares: 71.9, tips: 14.5, bonus: 10, trips: [] },
  { label: "T", name: "Tuesday", total: 132.1, online: "5 h 45", fares: 98.6, tips: 23.5, bonus: 10, trips: [] },
  { label: "W", name: "Wednesday", total: 84.0, online: "3 h 50", fares: 66.5, tips: 17.5, bonus: 0, trips: [] },
  { label: "T", name: "Thursday", total: sum(thursday, "fare") + sum(thursday, "tip") + 10, online: "5 h 10", fares: sum(thursday, "fare"), tips: sum(thursday, "tip"), bonus: 10, trips: thursday },
  { label: "F", name: "Friday", total: null, online: "", fares: 0, tips: 0, bonus: 0, trips: [] },
  { label: "S", name: "Saturday", total: null, online: "", fares: 0, tips: 0, bonus: 0, trips: [] },
  { label: "S", name: "Sunday", total: null, online: "", fares: 0, tips: 0, bonus: 0, trips: [] },
];
export const TODAY = 3;
export const GOAL = 600;
export const LAST_WEEK_BY_NOW = 344.2;
export const WEEK_TOTAL = Math.round(DAYS.reduce((n, d) => n + (d.total ?? 0), 0) * 100) / 100;
export const eur = (n: number) => `€${n.toFixed(2)}`;
