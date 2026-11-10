// Gallery-only: content for the demo apps. One small world per app so the
// screens link up (a workout opens its own detail, a basket holds real
// products, a booking belongs to a client on the schedule).

export const PHOTO = {
  barbell: require("@/assets/images/demo/barbell.jpg"),
  hiit: require("@/assets/images/demo/hiit.jpg"),
  gym: require("@/assets/images/demo/gym.jpg"),
  yoga: require("@/assets/images/demo/yoga.jpg"),
  core: require("@/assets/images/demo/core.jpg"),
  shoeGrey: require("@/assets/images/demo/shoe-grey.jpg"),
  shoeRed: require("@/assets/images/demo/shoe-red.jpg"),
  shoeTan: require("@/assets/images/demo/shoe-tan.jpg"),
  shoeHi: require("@/assets/images/demo/shoe-hi.jpg"),
  shoeMix: require("@/assets/images/demo/shoe-mix.jpg"),
  shoeWhite: require("@/assets/images/demo/shoe-white.jpg"),
  headphones: require("@/assets/images/demo/headphones.jpg"),
  watch: require("@/assets/images/demo/watch.jpg"),
  camera: require("@/assets/images/demo/camera.jpg"),
  sunglasses: require("@/assets/images/demo/sunglasses.jpg"),
};

export const ART = {
  calendar: require("@/assets/images/empty/calendar.png"),
  stopwatch: require("@/assets/images/empty/stopwatch.png"),
  target: require("@/assets/images/empty/target.png"),
  cart: require("@/assets/images/empty/shopping-cart.png"),
  bag: require("@/assets/images/empty/shopping-bag.png"),
  box: require("@/assets/images/empty/box.png"),
  people: require("@/assets/images/empty/people.png"),
  magnifier: require("@/assets/images/empty/magnifying-glass.png"),
  envelope: require("@/assets/images/empty/envelope.png"),
  padlock: require("@/assets/images/empty/padlock.png"),
};

// Fitness

export type WorkoutKind = "Strength" | "HIIT" | "Yoga" | "Core";

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight?: number;
  /** What you did last time: "80 × 6". */
  last?: string;
  /** Best ever set. */
  best?: string;
  rest?: number;
}

export interface Workout {
  id: string;
  name: string;
  kind: WorkoutKind;
  minutes: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  photo: number;
  coach: string;
  exercises: Exercise[];
}

export const WORKOUTS: Workout[] = [
  {
    id: "lower-power",
    name: "Lower body power",
    kind: "Strength",
    minutes: 45,
    level: "Intermediate",
    photo: PHOTO.barbell,
    coach: "Ciara Walsh",
    exercises: [
      { name: "Back squat", sets: 4, reps: "6", weight: 80, last: "77.5 × 6", best: "100 × 3", rest: 150 },
      { name: "Romanian deadlift", sets: 3, reps: "8", weight: 70, last: "70 × 8", best: "90 × 5", rest: 120 },
      { name: "Walking lunge", sets: 3, reps: "10", weight: 16, last: "14 × 10", best: "20 × 10", rest: 90 },
      { name: "Hip thrust", sets: 3, reps: "10", weight: 90, last: "85 × 10", best: "110 × 8", rest: 90 },
      { name: "Calf raise", sets: 3, reps: "15", weight: 40, last: "40 × 15", best: "50 × 12", rest: 60 },
    ],
  },
  {
    id: "upper-push",
    name: "Upper body push",
    kind: "Strength",
    minutes: 40,
    level: "Intermediate",
    photo: PHOTO.gym,
    coach: "Ciara Walsh",
    exercises: [
      { name: "Bench press", sets: 4, reps: "6", weight: 60, last: "60 × 6", best: "72.5 × 3", rest: 150 },
      { name: "Overhead press", sets: 3, reps: "8", weight: 35, last: "32.5 × 8", best: "45 × 4", rest: 120 },
      { name: "Incline dumbbell press", sets: 3, reps: "10", weight: 22, last: "20 × 10", best: "26 × 8", rest: 90 },
      { name: "Dips", sets: 3, reps: "12", last: "BW × 11", best: "BW × 15", rest: 90 },
    ],
  },
  {
    id: "hiit-20",
    name: "20 minute burner",
    kind: "HIIT",
    minutes: 20,
    level: "Beginner",
    photo: PHOTO.hiit,
    coach: "Dara Quinn",
    exercises: [
      { name: "Jump squat", sets: 4, reps: "40 s" },
      { name: "Mountain climber", sets: 4, reps: "40 s" },
      { name: "Burpee", sets: 4, reps: "40 s" },
      { name: "Plank jack", sets: 4, reps: "40 s" },
    ],
  },
  {
    id: "core-15",
    name: "Core in 15",
    kind: "Core",
    minutes: 15,
    level: "Beginner",
    photo: PHOTO.core,
    coach: "Dara Quinn",
    exercises: [
      { name: "Dead bug", sets: 3, reps: "12" },
      { name: "Side plank", sets: 3, reps: "30 s each" },
      { name: "Hollow hold", sets: 3, reps: "30 s" },
    ],
  },
  {
    id: "sunset-flow",
    name: "Sunset flow",
    kind: "Yoga",
    minutes: 30,
    level: "Beginner",
    photo: PHOTO.yoga,
    coach: "Méabh Ryan",
    exercises: [
      { name: "Sun salutation A", sets: 3, reps: "1 round" },
      { name: "Low lunge", sets: 2, reps: "60 s each" },
      { name: "Pigeon", sets: 2, reps: "90 s each" },
      { name: "Savasana", sets: 1, reps: "5 min" },
    ],
  },
];

/** How hard each workout works each area, 0 to 1 (drawn as bar gauges). */
export const FOCUS: Record<WorkoutKind, { area: string; load: number }[]> = {
  Strength: [{ area: "Legs", load: 0.9 }, { area: "Glutes", load: 0.75 }, { area: "Back", load: 0.45 }, { area: "Core", load: 0.3 }],
  HIIT: [{ area: "Heart rate", load: 0.95 }, { area: "Legs", load: 0.6 }, { area: "Core", load: 0.5 }],
  Yoga: [{ area: "Mobility", load: 0.9 }, { area: "Balance", load: 0.6 }, { area: "Core", load: 0.4 }],
  Core: [{ area: "Abs", load: 0.9 }, { area: "Obliques", load: 0.7 }, { area: "Lower back", load: 0.4 }],
};

export const workoutById = (id?: string) => WORKOUTS.find((w) => w.id === id) ?? WORKOUTS[0];

export const SESSIONS = [
  { id: "s5", workout: "lower-power", day: "Today", time: "07:10", minutes: 47, volume: "6,240 kg", prs: 1, sets: 16, kcal: 412, avgHr: 128 },
  { id: "s4", workout: "hiit-20", day: "Sun", time: "10:02", minutes: 21, volume: "312 kcal", prs: 0, sets: 16, kcal: 312, avgHr: 156 },
  { id: "s3", workout: "upper-push", day: "Fri", time: "18:30", minutes: 42, volume: "4,880 kg", prs: 2, sets: 13, kcal: 341, avgHr: 121 },
  { id: "s2", workout: "sunset-flow", day: "Thu", time: "20:15", minutes: 30, volume: "30 min", prs: 0, sets: 9, kcal: 118, avgHr: 92 },
  { id: "s1", workout: "core-15", day: "Tue", time: "07:00", minutes: 16, volume: "16 min", prs: 0, sets: 9, kcal: 96, avgHr: 110 },
] as const;

/** Minutes trained each day this week, Monday first (null = rest). */
export const WEEK_MINUTES = [47, 16, null, 30, 42, null, 21] as const;

/** Body and recovery, today vs a week ago. */
export const BODY = [
  { label: "Weight", value: "78.4", unit: "kg", delta: "-0.6", good: true },
  { label: "Resting HR", value: "54", unit: "bpm", delta: "-2", good: true },
  { label: "Sleep", value: "7:12", unit: "h", delta: "+0:20", good: true },
  { label: "HRV", value: "61", unit: "ms", delta: "-4", good: false },
  { label: "Steps", value: "8,412", unit: "", delta: "+1,204", good: true },
  { label: "Water", value: "1.6", unit: "L", delta: "-0.4", good: false },
] as const;

/** The last six weeks, newest first. */
export const WEEKS = [
  { week: "This week", sessions: 5, minutes: 156, volume: "15.4 t", prs: 3 },
  { week: "3 Nov", sessions: 4, minutes: 170, volume: "14.1 t", prs: 1 },
  { week: "27 Oct", sessions: 4, minutes: 130, volume: "12.9 t", prs: 0 },
  { week: "20 Oct", sessions: 5, minutes: 155, volume: "13.8 t", prs: 2 },
  { week: "13 Oct", sessions: 3, minutes: 140, volume: "11.2 t", prs: 0 },
  { week: "6 Oct", sessions: 2, minutes: 80, volume: "6.4 t", prs: 1 },
] as const;

/** Minutes trained per week, oldest first. */
export const WEEKLY_MINUTES = [95, 120, 80, 140, 155, 130, 170, 156];
export const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"] as const;
/** This week, Monday first: trained, planned, rest. */
export const WEEK_PLAN = ["done", "done", "rest", "done", "planned", "planned", "rest"] as const;

export const PERSONAL_BESTS = [
  { lift: "Back squat", value: "100 × 3", e1rm: "106 kg", when: "Today" },
  { lift: "Bench press", value: "72.5 × 3", e1rm: "77 kg", when: "Fri" },
  { lift: "Deadlift", value: "130 × 2", e1rm: "134 kg", when: "12 Oct" },
  { lift: "Overhead press", value: "45 × 4", e1rm: "49 kg", when: "6 Oct" },
  { lift: "Hip thrust", value: "110 × 8", e1rm: "139 kg", when: "27 Oct" },
] as const;

// Shop

export interface Product {
  id: string;
  name: string;
  category: "Running" | "Lifestyle" | "Audio" | "Accessories";
  price: number;
  was?: number;
  colour: string;
  photos: number[];
  stock: "In stock" | "Low stock" | "Sold out";
  description: string;
  sizes?: string[];
}

const SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44", "45"];

export const PRODUCTS: Product[] = [
  { id: "pace", name: "Pace Runner", category: "Running", price: 129, colour: "Graphite", photos: [PHOTO.shoeGrey, PHOTO.shoeWhite], stock: "In stock", description: "A light daily trainer with a soft foam midsole and a knit upper that breathes on long runs.", sizes: SHOE_SIZES },
  { id: "aero", name: "Aero Knit", category: "Running", price: 109, was: 139, colour: "Crimson", photos: [PHOTO.shoeRed, PHOTO.shoeGrey], stock: "Low stock", description: "Flexible, sock-like fit for short fast runs and gym days.", sizes: SHOE_SIZES },
  { id: "cloud", name: "Cloud Max", category: "Running", price: 149, colour: "White and coral", photos: [PHOTO.shoeWhite, PHOTO.shoeMix], stock: "In stock", description: "Max cushioning for recovery runs and long days on your feet.", sizes: SHOE_SIZES },
  { id: "court", name: "Court Low", category: "Lifestyle", price: 119, colour: "Wheat", photos: [PHOTO.shoeTan], stock: "In stock", description: "Nubuck leather court shoe with a cupsole that lasts.", sizes: SHOE_SIZES },
  { id: "hi", name: "Varsity High", category: "Lifestyle", price: 159, colour: "Black, white, orange", photos: [PHOTO.shoeHi], stock: "Sold out", description: "A high-top in full grain leather. Restocks in December.", sizes: SHOE_SIZES },
  { id: "mix", name: "Trail Mix", category: "Lifestyle", price: 135, colour: "Multi", photos: [PHOTO.shoeMix, PHOTO.shoeWhite], stock: "In stock", description: "Chunky sole, mixed materials, made for city streets.", sizes: SHOE_SIZES },
  { id: "studio", name: "Studio Headphones", category: "Audio", price: 199, colour: "Black", photos: [PHOTO.headphones], stock: "In stock", description: "Over-ear, 40 hours of battery, noise cancelling for the commute." },
  { id: "field", name: "Field Watch", category: "Accessories", price: 89, colour: "White", photos: [PHOTO.watch], stock: "Low stock", description: "Steps, heart rate and sleep on a week of battery." },
  { id: "instant", name: "Instant Camera", category: "Accessories", price: 139, colour: "White", photos: [PHOTO.camera], stock: "In stock", description: "Point, shoot and hold the print a minute later." },
  { id: "shades", name: "Classic Shades", category: "Accessories", price: 69, colour: "Black", photos: [PHOTO.sunglasses], stock: "In stock", description: "Polarised lenses in an acetate frame." },
];

export const productById = (id?: string) => PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
export const euro = (n: number) => `€${n.toFixed(n % 1 ? 2 : 0)}`;

export const BASKET = [
  { product: "pace", size: "42", qty: 1 },
  { product: "studio", qty: 1 },
  { product: "shades", qty: 2 },
];

export const SHOP_ORDERS = [
  { id: "4821", placed: "Today, 09:41", items: ["pace", "studio", "shades"], total: 466, status: "Processing" },
  { id: "4790", placed: "3 Nov", items: ["court"], total: 119, status: "On the way" },
  { id: "4712", placed: "21 Oct", items: ["field", "instant"], total: 228, status: "Delivered" },
  { id: "4655", placed: "2 Oct", items: ["aero"], total: 139, status: "Refunded" },
] as const;

// Bookings

export interface Service {
  id: string;
  name: string;
  minutes: number;
  price: number;
}

export const SERVICES: Service[] = [
  { id: "cut", name: "Cut and finish", minutes: 45, price: 55 },
  { id: "colour", name: "Full colour", minutes: 120, price: 140 },
  { id: "blow", name: "Blow dry", minutes: 30, price: 35 },
  { id: "beard", name: "Beard trim", minutes: 20, price: 20 },
  { id: "consult", name: "Colour consultation", minutes: 15, price: 0 },
];

export const STAFF = ["Aisling", "Rory", "Saoirse"] as const;

export interface Client {
  id: string;
  name: string;
  phone: string;
  visits: number;
  lastVisit: string;
  note?: string;
}

export const CLIENTS: Client[] = [
  { id: "c1", name: "Aoife Byrne", phone: "+353 87 123 4567", visits: 14, lastVisit: "12 Oct", note: "Prefers Aisling. Sensitive scalp, use the gentle shampoo." },
  { id: "c2", name: "Cian Murphy", phone: "+353 86 222 1934", visits: 6, lastVisit: "2 Nov" },
  { id: "c3", name: "Niamh Kelly", phone: "+353 85 774 0021", visits: 22, lastVisit: "29 Oct", note: "Always books colour with a cut." },
  { id: "c4", name: "Seán O'Brien", phone: "+353 83 410 7788", visits: 3, lastVisit: "18 Sep" },
  { id: "c5", name: "Róisín Doyle", phone: "+353 87 900 1200", visits: 9, lastVisit: "5 Nov" },
  { id: "c6", name: "Tadhg Nolan", phone: "+353 89 455 6612", visits: 1, lastVisit: "New" },
];

export const clientById = (id?: string) => CLIENTS.find((c) => c.id === id) ?? CLIENTS[0];

export interface Booking {
  id: string;
  client: string;
  service: string;
  staff: (typeof STAFF)[number];
  start: string;
  end: string;
  status: "Confirmed" | "Checked in" | "Unconfirmed" | "Cancelled";
}

export const BOOKINGS: Booking[] = [
  { id: "b1", client: "c1", service: "cut", staff: "Aisling", start: "09:00", end: "09:45", status: "Checked in" },
  { id: "b2", client: "c3", service: "colour", staff: "Saoirse", start: "09:30", end: "11:30", status: "Confirmed" },
  { id: "b3", client: "c2", service: "beard", staff: "Rory", start: "10:15", end: "10:35", status: "Confirmed" },
  { id: "b4", client: "c5", service: "blow", staff: "Aisling", start: "12:00", end: "12:30", status: "Unconfirmed" },
  { id: "b5", client: "c4", service: "cut", staff: "Rory", start: "14:00", end: "14:45", status: "Confirmed" },
  { id: "b6", client: "c6", service: "consult", staff: "Saoirse", start: "15:30", end: "15:45", status: "Cancelled" },
  { id: "b7", client: "c1", service: "blow", staff: "Aisling", start: "17:00", end: "17:30", status: "Confirmed" },
];

export const bookingById = (id?: string) => BOOKINGS.find((b) => b.id === id) ?? BOOKINGS[1];
export const serviceById = (id: string) => SERVICES.find((s) => s.id === id)!;

export const DAYS = ["Mon 10", "Tue 11", "Wed 12", "Thu 13", "Fri 14", "Sat 15"] as const;

export const STATUS_BADGE = {
  Confirmed: "default",
  "Checked in": "success",
  Unconfirmed: "warning",
  Cancelled: "error",
  Processing: "warning",
  "On the way": "default",
  Delivered: "success",
  Refunded: "error",
  "In stock": "success",
  "Low stock": "warning",
  "Sold out": "error",
} as const;
