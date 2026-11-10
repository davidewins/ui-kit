// One small world for the order, receipt and product screens: one shop
// (Runlab, Drury Street), one customer (Aoife Byrne, Dublin 8) and her
// orders. Every total is worked out from its lines, and VAT is the part of
// the total that is tax (prices include it), never added on top.
import { PHOTO } from "@/gallery/demo/data";
import type { TimelineEvent } from "@/components/ui/feedback/Timeline";
import type { Brand } from "@/components/ui/primitives/BrandMark";

export const SHOP = { name: "Runlab", street: "12 Drury Street", area: "Dublin 2", vatNo: "IE 3482910FH" } as const;

export const CUSTOMER = {
  name: "Aoife Byrne",
  street: "14 Clanbrassil Street Lower",
  area: "Dublin 8, D08 X2C4",
  note: "Buzzer 3. Leave with no. 16 if out",
} as const;

export const ITEMS = {
  trail: { name: "Trail Mix", colour: "Multi", price: 135, photo: PHOTO.shoeMix },
  pace: { name: "Pace Runner", colour: "Graphite", price: 129, photo: PHOTO.shoeGrey },
  aero: { name: "Aero Knit", colour: "Crimson", price: 109, photo: PHOTO.shoeRed },
  cloud: { name: "Cloud Max", colour: "White and coral", price: 149, photo: PHOTO.shoeWhite },
  court: { name: "Court Low", colour: "Wheat", price: 119, photo: PHOTO.shoeTan },
  hi: { name: "Varsity High", colour: "Black and orange", price: 159, photo: PHOTO.shoeHi },
  studio: { name: "Studio Headphones", colour: "Black", price: 199, photo: PHOTO.headphones },
  field: { name: "Field Watch", colour: "White", price: 89, photo: PHOTO.watch },
  instant: { name: "Instant Camera", colour: "White", price: 139, photo: PHOTO.camera },
  shades: { name: "Classic Shades", colour: "Black", price: 69, photo: PHOTO.sunglasses },
} as const;

export type ItemId = keyof typeof ITEMS;
export interface Line {
  item: ItemId;
  qty: number;
  size?: string;
}

export type OrderStatus = "On the way" | "Delivered" | "Refunded" | "Returned";

export interface Order {
  number: string;
  /** "Mon 9 Nov, 09:41" */
  placed: string;
  /** Short date for lists: "9 Nov". */
  day: string;
  month: string;
  status: OrderStatus;
  /** What happened last, for the list: "Delivered Sat 7 Nov". */
  outcome: string;
  lines: Line[];
  delivery: { method: string; fee: number };
  paidWith: { brand: Brand; label: string };
}

export const ORDERS: Order[] = [
  {
    number: "RL-48213",
    placed: "Mon 9 Nov, 09:41",
    day: "9 Nov",
    month: "November",
    status: "On the way",
    outcome: "Arriving today, 13:00 to 14:00",
    lines: [{ item: "pace", qty: 1, size: "42" }, { item: "studio", qty: 1 }, { item: "shades", qty: 2 }],
    delivery: { method: "Standard delivery", fee: 0 },
    paidWith: { brand: "visa", label: "Visa ending 4242" },
  },
  {
    number: "RL-48236",
    placed: "Sat 7 Nov, 12:42",
    day: "7 Nov",
    month: "November",
    status: "Delivered",
    outcome: "Delivered Sat 7 Nov",
    lines: [{ item: "aero", qty: 1, size: "39" }, { item: "field", qty: 1 }],
    delivery: { method: "Same-day by bike", fee: 4.95 },
    paidWith: { brand: "applepay", label: "Apple Pay" },
  },
  {
    number: "RL-47120",
    placed: "Wed 21 Oct, 13:02",
    day: "21 Oct",
    month: "October",
    status: "Delivered",
    outcome: "Delivered Thu 22 Oct",
    lines: [{ item: "court", qty: 1, size: "42" }, { item: "instant", qty: 1 }, { item: "shades", qty: 2 }],
    delivery: { method: "Express delivery", fee: 5.95 },
    paidWith: { brand: "visa", label: "Visa ending 4242" },
  },
  {
    number: "RL-46655",
    placed: "Fri 2 Oct, 19:15",
    day: "2 Oct",
    month: "October",
    status: "Refunded",
    outcome: "Refunded to Visa 9 Oct",
    lines: [{ item: "cloud", qty: 1, size: "42" }],
    delivery: { method: "Standard delivery", fee: 0 },
    paidWith: { brand: "visa", label: "Visa ending 4242" },
  },
  {
    number: "RL-45980",
    placed: "Fri 18 Sep, 08:27",
    day: "18 Sep",
    month: "September",
    status: "Delivered",
    outcome: "Delivered Mon 21 Sep",
    lines: [{ item: "trail", qty: 1, size: "42" }, { item: "shades", qty: 1 }],
    delivery: { method: "Standard delivery", fee: 0 },
    paidWith: { brand: "mastercard", label: "Mastercard ending 5510" },
  },
  {
    number: "RL-45544",
    placed: "Fri 4 Sep, 21:50",
    day: "4 Sep",
    month: "September",
    status: "Returned",
    outcome: "Returned 12 Sep, wrong size",
    lines: [{ item: "hi", qty: 1, size: "41" }],
    delivery: { method: "Standard delivery", fee: 0 },
    paidWith: { brand: "visa", label: "Visa ending 4242" },
  },
];

/** The courier order in transit, the bike order arriving now, the delivered one. */
export const IN_TRANSIT = ORDERS[0];
export const LIVE = ORDERS[1];
export const DELIVERED = ORDERS[2];

export const subtotal = (o: Order) => o.lines.reduce((sum, l) => sum + ITEMS[l.item].price * l.qty, 0);
export const total = (o: Order) => subtotal(o) + o.delivery.fee;
/** The tax already inside a total, at Ireland's 23%. */
export const vatIn = (amount: number) => (amount * 23) / 123;
export const itemCount = (o: Order) => o.lines.reduce((n, l) => n + l.qty, 0);
export const itemNames = (o: Order) => o.lines.map((l) => ITEMS[l.item].name).join(", ");
/** One photo per unit, so two pairs of shades show twice. */
export const photosOf = (o: Order) => o.lines.flatMap((l) => Array.from({ length: l.qty }, () => ITEMS[l.item].photo));
export const lineDetail = (l: Line) => [ITEMS[l.item].colour, l.size ? `EU ${l.size}` : null].filter(Boolean).join(", ");

/** €466 or €202.95: pence only when there are some. */
export const eur = (n: number) => `€${n.toFixed(n % 1 ? 2 : 0)}`;
/** €466.00: always to the cent, for a receipt. */
export const eur2 = (n: number) => `€${n.toFixed(2)}`;

// The courier order.
export const TRACKING = { courier: "dpd" as Brand, service: "DPD Predict", number: "15502 8841 2207", parcel: "1 parcel, 2.4 kg" };
export const STEPS = ["Placed", "Shipped", "On the van", "Delivered"] as const;
/** DPD's scans, newest first. */
export const SCANS: TimelineEvent[] = [
  { title: "Delivery", time: "13:00 to 14:00", detail: "One hour window from DPD Predict", state: "upcoming" },
  { title: "Out for delivery", time: "Today 08:02", detail: "On the van with Marek, 6 stops before yours", state: "current" },
  { title: "Arrived at Dublin depot", time: "Today 05:36", detail: "Ballymount, Dublin 12", state: "done" },
  { title: "Sorted at the hub", time: "Mon 23:48", detail: "DPD central hub, Athlone", state: "done" },
  { title: "Collected by DPD", time: "Mon 17:32", detail: "From Runlab, Drury Street", state: "done" },
  { title: "Packed", time: "Mon 14:10", detail: "1 parcel, 2.4 kg", state: "done" },
  { title: "Order placed", time: "Mon 09:41", state: "done" },
];

// The bike order.
export const RIDER = { name: "Tomás Keane", vehicle: "Cargo bike", rating: "4.9", trips: "1,284 deliveries" } as const;
export const LIVE_TRIP = { minutes: 4, eta: "13:18", done: 1.8, of: 2.4, where: "on Clanbrassil Street", code: "7294" } as const;
/** The bike order so far, newest first. */
export const LIVE_EVENTS: TimelineEvent[] = [
  { title: "Nearly there", time: "13:14", detail: "600 m away, coming up Clanbrassil Street", state: "current" },
  { title: "Picked up", time: "13:06", detail: "Tomás left Runlab, 12 Drury Street", state: "done" },
  { title: "Packed", time: "12:51", detail: "2 items in one bag", state: "done" },
  { title: "Order confirmed", time: "12:43", detail: "Paid €202.95 with Apple Pay", state: "done" },
];

// The product pages: one shoe, two ways to sell it.
export const PRODUCT = {
  ...ITEMS.trail,
  line: "Lifestyle, unisex",
  /** The photo is 800 x 1000. Each shot is a crop of it: zoom, and the point kept in the middle. */
  photoRatio: 0.8,
  shots: [
    { zoom: 1, x: 0.5, y: 0.5, label: "The pair" },
    { zoom: 1.9, x: 0.3, y: 0.35, label: "Upper, mixed panels" },
    { zoom: 1.9, x: 0.62, y: 0.68, label: "Sole and heel" },
  ],
  sizes: [
    { eu: "38", left: 4 },
    { eu: "39", left: 6 },
    { eu: "40", left: 2 },
    { eu: "41", left: 8 },
    { eu: "42", left: 5 },
    { eu: "43", left: 1 },
    { eu: "44", left: 3 },
    { eu: "45", left: 0 },
  ],
  headline: "Cut from last season's offcuts, built for wet pavements.",
  story: [
    "Every pair starts as leftovers. The suede, mesh and webbing come off the cutting room floor of last year's runners, so the panels on yours will not quite match the pair beside it on the shelf.",
    "Underneath is the part we did not improvise: a 42 mm foam stack on a rubber cupsole with a deep tread, tested through a Dublin winter. It is heavier than a runner and it is meant to be.",
  ],
  specs: [
    { value: "412 g", label: "Each shoe, EU 42" },
    { value: "42 mm", label: "Foam stack at the heel" },
    { value: "68%", label: "Recycled upper" },
    { value: "Porto", label: "Made in Portugal" },
  ],
  pairs: ["shades", "field", "studio", "instant"] as ItemId[],
} as const;

export const RATING = {
  avg: "4.6",
  count: 212,
  split: [0.71, 0.18, 0.06, 0.03, 0.02],
} as const;

export const REVIEWS = [
  { name: "Ciara W.", date: "2 Nov", title: "Chunky but not heavy on the foot", size: "39", fit: "true to size", stars: 5, body: "Wore them for a full day around town in the rain and my socks stayed dry. The sole grips on wet cobbles. Went my normal size." },
  { name: "Liam K.", date: "28 Oct", title: "Great shoe, a bit narrow", size: "44", fit: "runs narrow", stars: 4, body: "Love that no two pairs look the same. Toe box is narrow, so if you have wide feet go half a size up or try them in the shop first." },
] as const;
