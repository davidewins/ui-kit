// One small shop (runners and audio, South William Street) seen three ways:
// its balance, its day of sales and where the money went. Figures agree.
import { PHOTO } from "@/gallery/demo/data";

export const euro2 = (n: number) => `€${Math.abs(n).toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const euro0 = (n: number) => `€${Math.round(n).toLocaleString("en-IE")}`;

export const BALANCE = { now: 18426.3, monthChange: 2312.4 };

export const RANGES = {
  "1W": { labels: ["Fri", "Sun", "Tue", "Thu"], values: [17020, 17610, 18240, 17890, 17460, 18000, 18426.3] },
  "1M": { labels: ["13 Oct", "23 Oct", "2 Nov", "12 Nov"], values: [16114, 15380, 15900, 15120, 16440, 17300, 16210, 16980, 17850, 17240, 18190, 18426.3] },
  "3M": { labels: ["Aug", "Sep", "Oct", "Nov"], values: [12480, 13120, 12740, 13910, 14680, 14190, 15220, 16114, 15900, 17240, 17850, 18426.3] },
  "1Y": { labels: ["Nov", "Mar", "Jul", "Nov"], values: [6420, 7680, 7190, 8910, 10240, 9880, 11560, 12480, 13910, 15220, 16114, 18426.3] },
} as const;
export type Range = keyof typeof RANGES;

export const PAYOUT = { amount: 3300, day: "Friday 13 Nov", bank: "AIB", last4: "4471" };

export type Category = "sales" | "stock" | "wages" | "rent" | "fees" | "refund" | "post";

export interface Txn {
  id: string;
  who: string;
  what: string;
  time: string;
  amount: number;
  category: Category;
  pending?: boolean;
}

export const TRANSACTIONS: { day: string; net: number; items: Txn[] }[] = [
  {
    day: "Today",
    net: 425.9,
    items: [
      { id: "t1", who: "Card sales", what: "23 payments", time: "17:02", amount: 3486.0, category: "sales" },
      { id: "t2", who: "Nike Ireland", what: "24 pairs, invoice 8841", time: "11:40", amount: -2880.0, category: "stock" },
      { id: "t3", who: "Refund to Visa 4242", what: "Order #4790, Pace Runner", time: "09:15", amount: -129.0, category: "refund", pending: true },
      { id: "t4", who: "Card fees", what: "1.4% plus 10c a payment", time: "17:02", amount: -51.1, category: "fees" },
    ],
  },
  {
    day: "Yesterday",
    net: -776.0,
    items: [
      { id: "t5", who: "Card sales", what: "19 payments", time: "17:01", amount: 2912.0, category: "sales" },
      { id: "t6", who: "Wages", what: "4 staff, week 45", time: "16:00", amount: -2140.0, category: "wages" },
      { id: "t7", who: "Dublin City Council", what: "Rates, quarter 4", time: "08:00", amount: -1450.0, category: "rent" },
      { id: "t8", who: "An Post", what: "14 parcels", time: "07:45", amount: -98.0, category: "post" },
    ],
  },
];

// A Thursday of sales by hour. It is just after 17:00; later hours are forecast.
export const HOURS: { label: string; value: number; forecast?: boolean }[] = [
  { label: "10", value: 129 }, { label: "11", value: 328 }, { label: "12", value: 447 }, { label: "13", value: 696 },
  { label: "14", value: 398 }, { label: "15", value: 517 }, { label: "16", value: 574 }, { label: "17", value: 397 },
  { label: "18", value: 420, forecast: true }, { label: "19", value: 310, forecast: true }, { label: "20", value: 180, forecast: true },
];
export const NOW_HOUR = 7;
export const SALES = { today: 3486, lastThursday: 3112, orders: 23, average: 151.57, forecast: 4396 };

export const CHANNELS = [
  { label: "In store", value: 1862 },
  { label: "VOID app", value: 978 },
  { label: "Website", value: 646 },
] as const;

export const LIVE_ORDERS = [
  { id: "4832", who: "Niamh Kelly", items: "Pace Runner, size 42", total: 129, status: "Packing", minutes: 3, late: false, photo: PHOTO.shoeGrey },
  { id: "4831", who: "Website order", items: "Studio Headphones, 2", total: 398, status: "Packing", minutes: 26, late: true, photo: PHOTO.headphones },
  { id: "4829", who: "Conor Byrne", items: "Classic Shades, collect in store", total: 69, status: "Ready", minutes: 1, late: false, photo: PHOTO.sunglasses },
] as const;

export const TOP_PRODUCTS = [
  { label: "Studio Headphones", value: 995, sold: 5, photo: PHOTO.headphones },
  { label: "Pace Runner", value: 903, sold: 7, photo: PHOTO.shoeGrey },
  { label: "Compact Camera", value: 549, sold: 1, photo: PHOTO.camera },
  { label: "Field Watch", value: 498, sold: 2, photo: PHOTO.watch },
  { label: "Classic Shades", value: 414, sold: 6, photo: PHOTO.sunglasses },
] as const;

// October: where the money went.
export const SPEND = [
  { label: "Stock", value: 31200, hue: "orange" },
  { label: "Wages", value: 8560, hue: "blue" },
  { label: "Rent and rates", value: 4650, hue: "pink" },
  { label: "Card fees", value: 1112, hue: "teal" },
  { label: "Everything else", value: 1884, hue: "gray" },
] as const;
export const INCOME = 58940;

/** Running takings in thousands: this month so far against all of October. */
export const CUMULATIVE = {
  now: [2.1, 4.6, 6.4, 9.2, 11.8, 14.8, 16.2, 18.6, 21.6, 24.0, 25.9, 27.4],
  before: [1.8, 3.8, 5.6, 7.8, 10.0, 12.8, 14.0, 15.8, 18.4, 20.2, 22.6, 24.8, 26.4, 28.6, 31.0, 32.8, 34.0, 35.8, 37.6, 39.4, 40.8, 42.4, 44.0, 45.8, 47.0, 48.8, 50.6, 52.8, 54.6, 56.9, 58.9],
};

/** Mon..Sun columns, 10:00 to 20:00 rows, share of the busiest hour. */
export const BUSY: number[][] = [
  [0.2, 0.4, 0.5, 0.7, 0.4, 0.4, 0.5, 0.4, 0.3, 0.2, 0.1],
  [0.2, 0.4, 0.5, 0.7, 0.5, 0.4, 0.5, 0.5, 0.3, 0.2, 0.1],
  [0.2, 0.5, 0.6, 0.8, 0.5, 0.5, 0.6, 0.5, 0.4, 0.3, 0.1],
  [0.2, 0.5, 0.6, 0.9, 0.5, 0.7, 0.7, 0.6, 0.6, 0.5, 0.3],
  [0.3, 0.5, 0.7, 0.9, 0.6, 0.7, 0.8, 0.8, 0.7, 0.5, 0.3],
  [0.4, 0.7, 0.9, 1, 0.9, 0.9, 0.8, 0.7, 0.5, 0.3, 0.1],
  [0, 0.3, 0.6, 0.8, 0.8, 0.7, 0.6, 0.4, 0.2, 0, 0],
];
