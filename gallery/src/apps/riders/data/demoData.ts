/**
 * Demo mode mock data - Galway-based fake orders, earnings, and delivery history.
 * All coordinates are real Galway city locations.
 */

import type { DeliveryOrder } from "@/apps/riders/stores/riderStore";

// ─── Vendors ────────────────────────────────────────────────────────────────

const VENDORS = [
  { name: "Esquires Coffee", lat: 53.2744, lng: -9.0493, address: "11 Eyre Square, Galway" },
  { name: "McDonald's", lat: 53.2732, lng: -9.0498, address: "Eyre Square Centre, Galway" },
  { name: "Supermac's", lat: 53.2725, lng: -9.0505, address: "8 Eyre Square, Galway" },
  { name: "The Dáil Bar", lat: 53.2720, lng: -9.0528, address: "36 Shop Street, Galway" },
  { name: "Tigh Neachtain", lat: 53.2715, lng: -9.0540, address: "17 Cross Street, Galway" },
  { name: "Ard Bia at Nimmos", lat: 53.2708, lng: -9.0545, address: "Spanish Arch, Galway" },
  { name: "Ground & Co", lat: 53.2617, lng: -9.0733, address: "Salthill Promenade, Galway" },
  { name: "The College Bar", lat: 53.2796, lng: -9.0578, address: "University Road, Galway" },
  { name: "Murphy's Ice Cream", lat: 53.2718, lng: -9.0535, address: "2 Quay Street, Galway" },
  { name: "Caprice Café", lat: 53.2738, lng: -9.0515, address: "19 William Street, Galway" },
];

const DROPOFF_ADDRESSES = [
  { address: "14 Salthill Promenade, Galway", lat: 53.2605, lng: -9.0745 },
  { address: "22 Knocknacarra Rd, Galway", lat: 53.2655, lng: -9.0850 },
  { address: "7 Rahoon Ave, Galway", lat: 53.2705, lng: -9.0780 },
  { address: "31 Bohermore, Galway", lat: 53.2775, lng: -9.0445 },
  { address: "18 Mervue Rd, Galway", lat: 53.2875, lng: -9.0345 },
  { address: "9 Ballybane Rd, Galway", lat: 53.2895, lng: -9.0255 },
  { address: "5 Doughiska Rd, Galway", lat: 53.2905, lng: -9.0110 },
  { address: "12 Renmore Ave, Galway", lat: 53.2805, lng: -9.0210 },
  { address: "27 Terryland Rd, Galway", lat: 53.2835, lng: -9.0555 },
  { address: "16 Father Griffin Rd, Galway", lat: 53.2695, lng: -9.0530 },
  { address: "33 Westside, Galway", lat: 53.2735, lng: -9.0760 },
  { address: "8 Shantalla Rd, Galway", lat: 53.2755, lng: -9.0660 },
  { address: "3 Claddagh Quay, Galway", lat: 53.2675, lng: -9.0560 },
  { address: "20 Woodquay, Galway", lat: 53.2758, lng: -9.0565 },
  { address: "11 Headford Rd, Galway", lat: 53.2820, lng: -9.0620 },
];

const CUSTOMER_NAMES = [
  "Aoife Murphy", "Ciarán O'Brien", "Sinéad Kelly", "Darragh Walsh",
  "Niamh Brennan", "Fionn McCarthy", "Caoimhe Ryan", "Eoin Dunne",
  "Roisín Clarke", "Conor Doyle", "Áine Fitzpatrick", "Seán Lynch",
];

const NOTES = [
  "Leave at the door please",
  "Ring the bell - flat 2B",
  "Call on arrival, gate code: 4712",
  null,
  null,
  null,
  "Leave with neighbour if not home",
  "No cutlery needed thanks",
  null,
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Generate a single random incoming order ────────────────────────────────

export function generateDemoOrder(): DeliveryOrder {
  const vendor = pick(VENDORS);
  const dropoff = pick(DROPOFF_ADDRESSES);
  const customer = pick(CUSTOMER_NAMES);
  const note = pick(NOTES);

  const dLat = dropoff.lat - vendor.lat;
  const dLng = dropoff.lng - vendor.lng;
  const distanceKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111;
  const durationSecs = Math.round(distanceKm * 3 * 60); // ~3 min/km average
  const fee = Math.round((300 + distanceKm * 80) / 5) * 5; // €3.00 + €0.80/km, rounded to 5c

  const now = new Date();
  const expires = new Date(now.getTime() + 25_000);

  return {
    id: `demo-${Date.now()}`,
    orderId: `demo-order-${Date.now()}`,
    pickupAddress: vendor.address,
    pickupLat: vendor.lat + (Math.random() - 0.5) * 0.001,
    pickupLng: vendor.lng + (Math.random() - 0.5) * 0.001,
    dropoffAddress: dropoff.address,
    dropoffLat: dropoff.lat + (Math.random() - 0.5) * 0.001,
    dropoffLng: dropoff.lng + (Math.random() - 0.5) * 0.001,
    customerName: customer,
    vendorName: vendor.name,
    estimatedDistance: Math.round(distanceKm * 10) / 10,
    estimatedDuration: durationSecs,
    deliveryFee: fee,
    noteForRider: note,
    deliveryInstructions: null,
    status: "pending",
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };
}

// ─── Demo referral data ──────────────────────────────────────────────────────

export interface DemoReferralSummary {
  referral_code: string;
  referred_count: number;
  qualifying_deliveries: number;
  paid_cents: number;
  unpaid_cents: number;
  total_cents: number;
}

export const DEMO_REFERRALS: DemoReferralSummary = {
  referral_code: "DEMO1234",
  referred_count: 2,
  qualifying_deliveries: 34,
  paid_cents: 1200,
  unpaid_cents: 500,
  total_cents: 1700,
};

// ─── Demo earnings data ──────────────────────────────────────────────────────

export interface DemoEarnings {
  period: string;
  deliveryCount: number;
  baseFeeCents: number;
  tipsCents: number;
  bonusesCents: number;
  totalCents: number;
}

export const DEMO_EARNINGS: Record<"week" | "month" | "all", DemoEarnings> = {
  week: {
    period: "week",
    deliveryCount: 34,
    baseFeeCents: 11220,
    tipsCents: 1480,
    bonusesCents: 500,
    totalCents: 13200,
  },
  month: {
    period: "month",
    deliveryCount: 142,
    baseFeeCents: 46800,
    tipsCents: 6120,
    bonusesCents: 2000,
    totalCents: 54920,
  },
  all: {
    period: "all",
    deliveryCount: 487,
    baseFeeCents: 162480,
    tipsCents: 21340,
    bonusesCents: 7500,
    totalCents: 191320,
  },
};

// ─── Demo delivery history ──────────────────────────────────────────────────

export interface DemoHistoryItem {
  id: string;
  status: string;
  payCents: number;
  tipCents: number;
  vendorName: string;
  pickupAddress: string;
  deliveryAddress: string;
  completedAt: string;
  createdAt: string;
}

function daysAgo(n: number, hoursOffset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(d.getHours() - hoursOffset);
  return d.toISOString();
}

export const DEMO_HISTORY: DemoHistoryItem[] = [
  {
    id: "demo-h-1",
    status: "completed",
    payCents: 480,
    tipCents: 100,
    vendorName: "Esquires Coffee",
    pickupAddress: "11 Eyre Square, Galway",
    deliveryAddress: "14 Salthill Promenade, Galway",
    completedAt: daysAgo(0, 1),
    createdAt: daysAgo(0, 1),
  },
  {
    id: "demo-h-2",
    status: "completed",
    payCents: 390,
    tipCents: 0,
    vendorName: "The Dáil Bar",
    pickupAddress: "36 Shop Street, Galway",
    deliveryAddress: "22 Knocknacarra Rd, Galway",
    completedAt: daysAgo(0, 3),
    createdAt: daysAgo(0, 3),
  },
  {
    id: "demo-h-3",
    status: "completed",
    payCents: 440,
    tipCents: 200,
    vendorName: "Caprice Café",
    pickupAddress: "19 William Street, Galway",
    deliveryAddress: "7 Rahoon Ave, Galway",
    completedAt: daysAgo(1, 2),
    createdAt: daysAgo(1, 2),
  },
  {
    id: "demo-h-4",
    status: "cancelled",
    payCents: 0,
    tipCents: 0,
    vendorName: "McDonald's",
    pickupAddress: "Eyre Square Centre, Galway",
    deliveryAddress: "31 Bohermore, Galway",
    completedAt: daysAgo(1, 5),
    createdAt: daysAgo(1, 5),
  },
  {
    id: "demo-h-5",
    status: "completed",
    payCents: 510,
    tipCents: 150,
    vendorName: "Supermac's",
    pickupAddress: "8 Eyre Square, Galway",
    deliveryAddress: "18 Mervue Rd, Galway",
    completedAt: daysAgo(2, 1),
    createdAt: daysAgo(2, 1),
  },
  {
    id: "demo-h-6",
    status: "completed",
    payCents: 360,
    tipCents: 0,
    vendorName: "Murphy's Ice Cream",
    pickupAddress: "2 Quay Street, Galway",
    deliveryAddress: "9 Ballybane Rd, Galway",
    completedAt: daysAgo(2, 4),
    createdAt: daysAgo(2, 4),
  },
  {
    id: "demo-h-7",
    status: "completed",
    payCents: 430,
    tipCents: 100,
    vendorName: "Tigh Neachtain",
    pickupAddress: "17 Cross Street, Galway",
    deliveryAddress: "5 Doughiska Rd, Galway",
    completedAt: daysAgo(3, 0),
    createdAt: daysAgo(3, 0),
  },
  {
    id: "demo-h-8",
    status: "completed",
    payCents: 400,
    tipCents: 50,
    vendorName: "Ard Bia at Nimmos",
    pickupAddress: "Spanish Arch, Galway",
    deliveryAddress: "12 Renmore Ave, Galway",
    completedAt: daysAgo(3, 3),
    createdAt: daysAgo(3, 3),
  },
  {
    id: "demo-h-9",
    status: "completed",
    payCents: 470,
    tipCents: 200,
    vendorName: "Ground & Co",
    pickupAddress: "Salthill Promenade, Galway",
    deliveryAddress: "27 Terryland Rd, Galway",
    completedAt: daysAgo(4, 1),
    createdAt: daysAgo(4, 1),
  },
  {
    id: "demo-h-10",
    status: "completed",
    payCents: 380,
    tipCents: 0,
    vendorName: "The College Bar",
    pickupAddress: "University Road, Galway",
    deliveryAddress: "16 Father Griffin Rd, Galway",
    completedAt: daysAgo(4, 4),
    createdAt: daysAgo(4, 4),
  },
  {
    id: "demo-h-11",
    status: "completed",
    payCents: 520,
    tipCents: 300,
    vendorName: "Esquires Coffee",
    pickupAddress: "11 Eyre Square, Galway",
    deliveryAddress: "33 Westside, Galway",
    completedAt: daysAgo(5, 2),
    createdAt: daysAgo(5, 2),
  },
  {
    id: "demo-h-12",
    status: "completed",
    payCents: 345,
    tipCents: 0,
    vendorName: "McDonald's",
    pickupAddress: "Eyre Square Centre, Galway",
    deliveryAddress: "3 Claddagh Quay, Galway",
    completedAt: daysAgo(6, 0),
    createdAt: daysAgo(6, 0),
  },
];
