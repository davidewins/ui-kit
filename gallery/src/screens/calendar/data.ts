// One dataset for all five calendar screens, so they agree with each other.
// Two worlds: a Dublin running creator's November of posts (month, week,
// agenda) and a Stoneybatter salon's bookings (day, team). "Now" is fixed so
// the now line, countdowns and statuses are the same every time.
import { PHOTO } from "@/gallery/demo/data";
import { addDays, addMinutes, isSameDay, startOfWeek } from "date-fns";

export const NOW = new Date(2026, 10, 10, 11, 25);
export const TODAY = new Date(2026, 10, 10);
const at = (day: number, time: string) => {
  const [h, m] = time.split(":").map(Number);
  return new Date(2026, 10, day, h, m);
};

// Posts

export type Network = "instagram" | "tiktok" | "x" | "youtube";
export const NETWORK_LABEL: Record<Network, string> = { instagram: "Instagram", tiktok: "TikTok", x: "X", youtube: "YouTube" };
export type PostStatus = "published" | "scheduled" | "failed" | "draft";
export const STATUS_LABEL: Record<PostStatus, string> = { published: "Published", scheduled: "Scheduled", failed: "Failed", draft: "Draft" };

export interface Post {
  id: string;
  at: Date;
  title: string;
  format: "Reel" | "Carousel" | "Short" | "Video" | "Thread" | "Photo" | "Post";
  networks: Network[];
  status: PostStatus;
  photo?: (typeof PHOTO)[keyof typeof PHOTO];
  results?: { views: number; likes: number; comments: number };
  /** Why it failed, in the network's words. */
  error?: string;
}

type Extra = { r?: [number, number, number]; error?: string; draft?: boolean };
const seed = (day: number, time: string, networks: Network[], format: Post["format"], title: string, photo?: keyof typeof PHOTO, extra: Extra = {}): Omit<Post, "id"> => {
  const when = at(day, time);
  return {
    at: when,
    title,
    format,
    networks,
    photo: photo ? PHOTO[photo] : undefined,
    status: extra.error ? "failed" : extra.draft ? "draft" : when < NOW ? "published" : "scheduled",
    results: extra.r ? { views: extra.r[0], likes: extra.r[1], comments: extra.r[2] } : undefined,
    error: extra.error,
  };
};

export const POSTS: Post[] = [
  seed(1, "10:00", ["youtube"], "Video", "Dublin Marathon, every kilometre (24 min)", "shoeGrey", { r: [18900, 1240, 212] }),
  seed(2, "07:30", ["instagram", "tiktok"], "Reel", "Legs the morning after 42 km", "barbell", { r: [41200, 3310, 148] }),
  seed(2, "18:00", ["instagram"], "Carousel", "Recovery week: the plan I follow", "yoga", { r: [12800, 1020, 64] }),
  seed(3, "12:30", ["x"], "Thread", "What 42 km taught me about pacing", undefined, { r: [5400, 212, 31] }),
  seed(4, "18:00", ["instagram", "tiktok"], "Reel", "Grey daily trainers after 600 km", "shoeGrey", { r: [63500, 5120, 301] }),
  seed(5, "07:00", ["tiktok"], "Short", "10 minute core finisher", "core", { r: [28700, 2260, 97] }),
  seed(6, "17:00", ["youtube"], "Video", "Garmin or Apple Watch for a first marathon?", "watch", { r: [9800, 640, 118] }),
  seed(7, "09:00", ["instagram"], "Photo", "Marlay parkrun, 21:48", "sunglasses", { r: [7300, 890, 42] }),
  seed(7, "20:00", ["tiktok", "instagram"], "Reel", "HIIT in a hotel room, no kit", "hiit", { error: "Instagram: the audio track is not licensed for Reels" }),
  seed(8, "10:00", ["youtube"], "Video", "The camera kit behind my run vlogs", "camera", { r: [6100, 410, 73] }),
  seed(9, "07:30", ["instagram", "tiktok"], "Reel", "Back under the bar: week 1", "barbell", { r: [33900, 2840, 122] }),
  seed(9, "12:30", ["x"], "Thread", "Race photos cost more than the race", undefined, { r: [8900, 402, 67] }),
  seed(10, "08:00", ["x"], "Post", "Red racers review lands Thursday", "shoeRed", { r: [1900, 64, 7] }),
  seed(10, "10:30", ["tiktok", "instagram"], "Reel", "Headphones that survive Irish rain", "headphones", { error: "TikTok: video is 3:42, your account allows 3:00" }),
  seed(10, "18:00", ["instagram"], "Carousel", "6 stretches for tight calves", "yoga"),
  seed(10, "21:00", ["tiktok"], "Short", "What I eat before a long run", "gym"),
  seed(11, "07:30", ["instagram", "tiktok"], "Reel", "Tempo session on the Clontarf seafront", "shoeMix"),
  seed(12, "17:00", ["youtube"], "Video", "Red racers: the 100 km review", "shoeRed"),
  seed(12, "19:00", ["x"], "Post", "The red racers review is live"),
  seed(13, "18:00", ["instagram"], "Carousel", "Autumn running kit under €100", "sunglasses"),
  seed(14, "09:00", ["instagram"], "Photo", "St Anne's parkrun", "shoeTan"),
  seed(14, "20:00", ["tiktok"], "Short", "Core finisher, round two", "core", { draft: true }),
  seed(16, "07:30", ["instagram", "tiktok"], "Reel", "Back under the bar: week 2", "barbell"),
  seed(17, "12:30", ["x"], "Thread", "My whole training week in one post", undefined, { draft: true }),
  seed(18, "18:00", ["instagram"], "Carousel", "High tops in the gym: yes or no?", "shoeHi"),
  seed(18, "21:00", ["tiktok"], "Short", "Gym bag tour", "gym"),
  seed(21, "09:00", ["instagram"], "Photo", "Poolbeg parkrun", "shoeWhite"),
  seed(22, "10:00", ["youtube"], "Video", "Q&A: 10,000 subscribers", "camera", { draft: true }),
  seed(24, "18:00", ["instagram"], "Carousel", "White trainers, cleaned properly", "shoeWhite", { draft: true }),
  seed(26, "17:00", ["youtube"], "Video", "Winter base training, explained", "gym", { draft: true }),
  seed(28, "09:00", ["instagram"], "Photo", "Marlay parkrun", "sunglasses"),
  seed(30, "07:30", ["instagram", "tiktok"], "Reel", "November in numbers", "watch", { draft: true }),
].map((p, i) => ({ ...p, id: `p${i + 1}` }));

export const postsOn = (date: Date) => POSTS.filter((p) => isSameDay(p.at, date));

/** 18400 -> "18.4K". */
export const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1).replace(/\.0$/, "")}K` : String(n));
/** Likes and comments as a share of views. */
export const engagement = (r: NonNullable<Post["results"]>) => `${(((r.likes + r.comments) / r.views) * 100).toFixed(1)}%`;

/** "in 6 h 35 min", "in 2 days", "3 h ago". */
export function fromNow(when: Date) {
  const mins = Math.round((+when - +NOW) / 60000);
  const abs = Math.abs(mins);
  const text = abs < 60 ? `${abs} min` : abs < 24 * 60 ? `${Math.floor(abs / 60)} h${abs % 60 ? ` ${abs % 60} min` : ""}` : `${Math.round(abs / 1440)} days`;
  return mins >= 0 ? `in ${text}` : `${text} ago`;
}

/** "45 min", "2 h", "2 h 30". */
export const duration = (mins: number) => (mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)} h${mins % 60 ? ` ${mins % 60}` : ""}`);

// Salon

export const SALON = { name: "Manor Street Hair", address: "42 Manor Street, Stoneybatter, Dublin 7" };

export type ServiceKind = "Cut" | "Colour" | "Styling" | "Barber";
export const SERVICES = {
  cut: { name: "Cut and finish", short: "Cut", minutes: 45, price: 55, kind: "Cut" },
  kids: { name: "Kids cut", short: "Kids cut", minutes: 20, price: 18, kind: "Cut" },
  colour: { name: "Full colour", short: "Colour", minutes: 120, price: 140, kind: "Colour" },
  balayage: { name: "Balayage", short: "Balayage", minutes: 150, price: 185, kind: "Colour" },
  roots: { name: "Root touch-up", short: "Roots", minutes: 75, price: 85, kind: "Colour" },
  blowdry: { name: "Blow dry", short: "Blow dry", minutes: 30, price: 35, kind: "Styling" },
  olaplex: { name: "Olaplex treatment", short: "Olaplex", minutes: 30, price: 40, kind: "Styling" },
  fade: { name: "Skin fade", short: "Fade", minutes: 30, price: 28, kind: "Barber" },
  beard: { name: "Beard trim", short: "Beard", minutes: 20, price: 15, kind: "Barber" },
  cutBeard: { name: "Cut and beard", short: "Cut, beard", minutes: 45, price: 38, kind: "Barber" },
} as const satisfies Record<string, { name: string; short: string; minutes: number; price: number; kind: ServiceKind }>;
export type ServiceId = keyof typeof SERVICES;

export const STYLISTS = [
  { id: "aoife", name: "Aoife", role: "Colourist", from: 9, to: 18 },
  { id: "rory", name: "Rory", role: "Barber", from: 10, to: 18 },
  { id: "saoirse", name: "Saoirse", role: "Stylist", from: 9, to: 17 },
] as const;
export type StylistId = (typeof STYLISTS)[number]["id"];

export interface Booking {
  id: string;
  stylist: StylistId;
  service: ServiceId;
  client: string;
  /** Which visit this is for the client; 1 is a first visit. */
  visit: number;
  start: Date;
  end: Date;
  cancelled: boolean;
}

type Slot = [time: string, service: ServiceId, client: string, visit: number, cancelled?: boolean];
// Tuesday 10 November, the day both salon screens open on.
const TUESDAY: Record<StylistId, Slot[]> = {
  aoife: [
    ["09:00", "cut", "Niamh Kelly", 12],
    ["10:00", "colour", "Róisín Doyle", 23],
    // Booked into Róisín's processing time: the overlap.
    ["10:45", "cut", "Cian Murphy", 4],
    ["12:00", "blowdry", "Emma Walsh", 2],
    ["14:00", "balayage", "Sinéad O'Connor", 7],
    ["16:30", "cut", "Tadhg Nolan", 3, true],
    ["17:15", "olaplex", "Orla Brennan", 1],
  ],
  rory: [
    ["10:00", "fade", "Seán O'Brien", 14],
    ["10:30", "beard", "Darragh Byrne", 6],
    ["11:00", "cutBeard", "Conor Walsh", 9],
    ["11:45", "fade", "Eoin Daly", 2],
    ["12:30", "fade", "Liam Kavanagh", 21],
    ["14:00", "kids", "Fionn Murphy", 1],
    ["14:30", "cutBeard", "Paddy Nolan", 5],
    ["15:30", "fade", "Oisín Reilly", 11],
    ["16:00", "beard", "Shane Doyle", 3],
    ["16:30", "cutBeard", "Mark Brennan", 8],
    ["17:30", "fade", "Dylan Kelly", 4],
  ],
  saoirse: [
    ["09:30", "roots", "Mary Fitzgerald", 31],
    ["11:00", "cut", "Ciara Lynch", 5],
    ["12:00", "blowdry", "Aisling Burke", 9],
    ["14:30", "colour", "Deirdre Flynn", 16],
  ],
};

function bookingsFor(date: Date): Booking[] {
  const weekday = (date.getDay() + 6) % 7; // Monday 0
  if (weekday === 6) return []; // closed Sundays
  const tuesday = weekday === 1;
  const out: Booking[] = [];
  for (const s of STYLISTS) {
    TUESDAY[s.id].forEach(([time, service, client, visit, cancelled], i) => {
      // Other days are Tuesday's book with a different third of it missing.
      if (!tuesday && (i + weekday) % 3 === 0) return;
      const [h, m] = time.split(":").map(Number);
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
      out.push({ id: `${s.id}-${date.getDate()}-${i}`, stylist: s.id, service, client, visit, start, end: addMinutes(start, SERVICES[service].minutes), cancelled: !!cancelled && tuesday });
    });
  }
  return out;
}

const monday = startOfWeek(TODAY, { weekStartsOn: 1 });
/** The salon's week, Monday 9 to Sunday 15 November. */
export const BOOKINGS: Booking[] = Array.from({ length: 7 }, (_, i) => bookingsFor(addDays(monday, i))).flat();

export const bookingsOn = (date: Date, stylist?: StylistId) => BOOKINGS.filter((b) => isSameDay(b.start, date) && (!stylist || b.stylist === stylist));
export const bookingStatus = (b: Booking) => (b.cancelled ? "Cancelled" : b.end <= NOW ? "Done" : b.start <= NOW ? "In the chair" : "Confirmed");
