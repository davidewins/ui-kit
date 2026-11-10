// Gallery-only: one creator's social world, shared by every screen in
// screens/social so the numbers agree. @davidewins posts training and kit
// from Dublin; Instagram is the account these screens are about, and posts
// also go out to TikTok, YouTube, X and Threads. "Now" is Tue 10 Nov, 14:40.
//
// What must add up (and does, because totals are computed below):
//   followers 12,480 = 12,168 on 11 Oct + the 30 daily gains (312)
//   reach this week 9,870 = the seven REACH_WEEK days
//   reach, 30 days 31,900 = the five REACH_SOURCES = followers + non-followers
//   engagement 4.2% = average interactions per post (524) over followers
import type { SocialNetwork } from "@/apps/tkvr/lib/creator/social";
import { PHOTO } from "@/gallery/demo/data";

export type Network = Extract<SocialNetwork, "instagram" | "tiktok" | "youtube" | "x" | "threads">;

export const NETWORK_LABEL: Record<Network, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  threads: "Threads",
};

export const full = (n: number) => n.toLocaleString("en-IE");
/** 4,180 -> "4.2k", 18,300 -> "18.3k", 640 -> "640". */
export const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n));

export const CREATOR = {
  name: "David Ewins",
  handle: "davidewins",
  avatar: PHOTO.yoga,
  bio: "Dublin. Lifting, running and the kit that survives both.\nNew Reel every Tuesday and Thursday at 18:00.",
  posts: 214,
  following: 318,
  synced: "2 min ago",
};

// Followers

const FOLLOWERS_START = 12_168;
/** New followers per day, 12 Oct to 10 Nov. Bumps follow the Reels. */
const GAINS = [6, 5, 23, 14, 8, 9, 6, 4, 20, 12, 7, 5, 10, 7, 4, 9, 6, 6, 3, 5, 38, 27, 13, 8, 13, 9, 9, 5, 15, 6];
/** Followers at the end of each day, 12 Oct to 10 Nov. */
export const FOLLOWERS_30 = GAINS.reduce<number[]>((acc, g) => [...acc, (acc[acc.length - 1] ?? FOLLOWERS_START) + g], []);
export const FOLLOWERS = FOLLOWERS_30[FOLLOWERS_30.length - 1];
export const FOLLOWERS_GAINED_30 = FOLLOWERS - FOLLOWERS_START;
export const FOLLOWERS_GAINED_7 = GAINS.slice(-7).reduce((a, b) => a + b, 0);
/** "12 Oct" ... "10 Nov" for each point of FOLLOWERS_30. */
export const DAYS_30 = GAINS.map((_, i) => (i < 20 ? `${12 + i} Oct` : `${i - 19} Nov`));

// Reach

/** Accounts reached per day, the last seven days. */
export const REACH_WEEK = [
  { label: "Wed", date: "Wed 4 Nov", value: 890 },
  { label: "Thu", date: "Thu 5 Nov", value: 2_140 },
  { label: "Fri", date: "Fri 6 Nov", value: 1_180 },
  { label: "Sat", date: "Sat 7 Nov", value: 1_310 },
  { label: "Sun", date: "Sun 8 Nov", value: 760 },
  { label: "Mon", date: "Mon 9 Nov", value: 2_480 },
  { label: "Tue", date: "Today so far", value: 1_110 },
];
export const REACH_7 = REACH_WEEK.reduce((n, d) => n + d.value, 0);
export const REACH_PREV_7 = 8_650;
export const REACH_CHANGE = Math.round(((REACH_7 - REACH_PREV_7) / REACH_PREV_7) * 100);

/** Where the 30-day reach came from. */
export const REACH_SOURCES = [
  { label: "Reels tab", value: 14_674 },
  { label: "Home feed", value: 8_613 },
  { label: "Explore", value: 4_785 },
  { label: "Profile", value: 2_552 },
  { label: "Other", value: 1_276 },
];
export const REACH_30 = REACH_SOURCES.reduce((n, s) => n + s.value, 0);
export const REACH_FOLLOWERS = 13_398;
export const REACH_NON_FOLLOWERS = REACH_30 - REACH_FOLLOWERS;

/** How active followers are, Monday to Sunday (rows) by hour 06:00 to 23:00
 *  (columns), 0 to 1. Evenings win; Tuesday and Thursday at 18:00 peak. */
const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);
const DAY_LIFT = [0.82, 1, 0.8, 0.96, 0.7, 0.62, 0.74];
const hourShape = (h: number) => Math.max(0.06, 0.28 * Math.exp(-((h - 8) ** 2) / 4) + 0.34 * Math.exp(-((h - 13) ** 2) / 5) + Math.exp(-((h - 18.5) ** 2) / 7));
export const BEST_TIMES = HOURS.map((h) => DAY_LIFT.map((lift, day) => Math.min(1, hourShape(h + (day > 4 ? -1.5 : 0)) * lift)));
export const BEST_TIMES_ROWS = ["M", "T", "W", "T", "F", "S", "S"];
export const BEST_TIMES_COLUMNS = ["06:00", "12:00", "18:00", "23:00"];

// Posts

export interface NetworkResult {
  network: Network;
  views: number;
  likes: number;
  comments: number;
}

export interface Post {
  id: string;
  photo: number;
  kind: "photo" | "video" | "carousel";
  /** Video length or slide count, as written. */
  detail?: string;
  caption: string;
  when: string;
  pinned?: boolean;
  /** Instagram's own numbers. */
  views: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  /** The same post on the other networks it went to. */
  elsewhere: NetworkResult[];
}

/** On Instagram in the last 30 days, newest first. */
export const POSTS: Post[] = [
  { id: "p1", photo: PHOTO.shoeRed, kind: "video", detail: "0:42", caption: "400 km in the red Flyknits. What wore out, what didn't, and whether I'd buy them again.", when: "Mon 9 Nov, 18:00", views: 4_180, likes: 512, comments: 41, saves: 96, shares: 38, elsewhere: [{ network: "tiktok", views: 18_300, likes: 1_420, comments: 96 }, { network: "threads", views: 640, likes: 58, comments: 12 }] },
  { id: "p2", photo: PHOTO.yoga, kind: "photo", caption: "Sunrise mobility on Dollymount Strand. Ten minutes, no mat, cold hands.", when: "Sat 7 Nov, 07:40", views: 1_960, likes: 248, comments: 17, saves: 22, shares: 9, elsewhere: [{ network: "threads", views: 410, likes: 36, comments: 5 }] },
  { id: "p3", photo: PHOTO.core, kind: "video", detail: "0:58", caption: "Five-move core finisher. Three rounds, 40 seconds each, done before the kettle boils.", when: "Thu 5 Nov, 18:00", views: 3_240, likes: 361, comments: 28, saves: 174, shares: 52, elsewhere: [{ network: "tiktok", views: 9_120, likes: 702, comments: 51 }, { network: "youtube", views: 1_280, likes: 94, comments: 11 }] },
  { id: "p4", photo: PHOTO.headphones, kind: "carousel", detail: "6 photos", caption: "The headphones that survived a year in my gym bag. Six photos, zero sponsorship.", when: "Tue 3 Nov, 18:00", views: 2_310, likes: 206, comments: 33, saves: 88, shares: 14, elsewhere: [{ network: "x", views: 870, likes: 31, comments: 6 }] },
  { id: "p5", photo: PHOTO.barbell, kind: "video", detail: "1:12", pinned: true, caption: "The deadlift cue that fixed my lower back: push the floor away, don't pull the bar.", when: "Sun 1 Nov, 10:00", views: 9_860, likes: 1_104, comments: 86, saves: 318, shares: 131, elsewhere: [{ network: "tiktok", views: 41_200, likes: 3_310, comments: 204 }, { network: "youtube", views: 2_940, likes: 188, comments: 23 }] },
  { id: "p6", photo: PHOTO.shoeTan, kind: "photo", caption: "Court Lows in wheat. Not for running. Very much for everything else.", when: "Thu 29 Oct, 18:00", views: 1_720, likes: 231, comments: 12, saves: 19, shares: 6, elsewhere: [] },
  { id: "p7", photo: PHOTO.hiit, kind: "video", detail: "0:35", caption: "Saturday class in Ranelagh. Forty minutes, one water break.", when: "Tue 27 Oct, 18:00", views: 2_640, likes: 274, comments: 19, saves: 31, shares: 22, elsewhere: [{ network: "tiktok", views: 6_480, likes: 455, comments: 30 }] },
  { id: "p8", photo: PHOTO.watch, kind: "carousel", detail: "5 photos", caption: "A week with the Field Watch: sleep, steps and the battery claim, tested.", when: "Sat 24 Oct, 11:00", views: 3_090, likes: 262, comments: 37, saves: 121, shares: 18, elsewhere: [{ network: "x", views: 1_150, likes: 44, comments: 9 }] },
  { id: "p9", photo: PHOTO.shoeHi, kind: "photo", caption: "Varsity Highs on Drury Street.", when: "Thu 22 Oct, 18:00", views: 1_480, likes: 198, comments: 9, saves: 14, shares: 5, elsewhere: [] },
  { id: "p10", photo: PHOTO.gym, kind: "video", detail: "0:49", caption: "Rack etiquette, a short rant. Put the dumbbells back.", when: "Tue 20 Oct, 18:00", views: 5_420, likes: 498, comments: 64, saves: 73, shares: 61, elsewhere: [{ network: "tiktok", views: 22_700, likes: 1_890, comments: 312 }] },
  { id: "p11", photo: PHOTO.camera, kind: "carousel", detail: "4 photos", caption: "Shooting gym content on an instant camera. Four keepers out of twenty.", when: "Sat 17 Oct, 11:00", views: 2_050, likes: 171, comments: 22, saves: 46, shares: 8, elsewhere: [] },
  { id: "p12", photo: PHOTO.shoeMix, kind: "video", detail: "0:31", pinned: true, caption: "Trail Mix, unboxed. The laces alone are worth a look.", when: "Wed 14 Oct, 18:00", views: 6_730, likes: 362, comments: 31, saves: 68, shares: 28, elsewhere: [{ network: "tiktok", views: 12_900, likes: 870, comments: 44 }] },
];

export const postById = (id: string) => POSTS.find((p) => p.id === id) ?? POSTS[0];
export const interactions = (p: Post) => p.likes + p.comments + p.saves + p.shares;
export const VIEWS_30 = POSTS.reduce((n, p) => n + p.views, 0);
export const INTERACTIONS_PER_POST = Math.round(POSTS.reduce((n, p) => n + interactions(p), 0) / POSTS.length);
/** Average interactions per post over followers, as Instagram counts it. */
export const ENGAGEMENT = ((INTERACTIONS_PER_POST / FOLLOWERS) * 100).toFixed(1);
export const TOP_POSTS = [...POSTS].sort((a, b) => b.views - a.views).slice(0, 5);

export const SCHEDULED = [
  { id: "s1", photo: PHOTO.sunglasses, kind: "photo" as const, caption: "Classic Shades, three months on", when: "Today 18:00" },
  { id: "s2", photo: PHOTO.shoeGrey, kind: "video" as const, caption: "Pace Runner, the 100 km review", when: "Thu 18:00" },
  { id: "s3", photo: PHOTO.shoeWhite, kind: "video" as const, caption: "Cloud Max launch with Tolka Run Co", when: "21 Nov 08:00" },
];

export const DRAFTS = [
  { id: "d1", photo: PHOTO.barbell, kind: "video" as const, caption: "Squat depth, filmed from the side", when: "Edited today" },
  { id: "d2", photo: PHOTO.headphones, kind: "carousel" as const, caption: "Gym bag, November", when: "Edited Sun" },
  { id: "d3", photo: PHOTO.yoga, kind: "photo" as const, caption: "Howth cliff walk", when: "Edited 2 Nov" },
];

/** Today's post that did not make it to Instagram. It is on TikTok and
 *  Threads, so it is in the timeline but not in the Instagram grid. */
export const FAILED_POST = {
  id: "f1",
  photo: PHOTO.shoeTan,
  kind: "video" as const,
  detail: "1:04",
  caption: "Three pairs for a Dublin winter, and the one rule I use to rotate them.",
  when: "Today, 12:15",
  failed: "instagram" as Network,
  reason: "Instagram timed out while the video was uploading (184 MB). Nothing was posted there.",
  results: [
    { network: "tiktok", views: 2_140, likes: 163, comments: 9 },
    { network: "threads", views: 180, likes: 14, comments: 2 },
  ] as NetworkResult[],
};

/** A post's results on every network, Instagram first. */
export const resultsOf = (p: Post): NetworkResult[] => [{ network: "instagram", views: p.views, likes: p.likes, comments: p.comments }, ...p.elsewhere];

/** Everything that went out in the last seven days, newest first. */
export const TIMELINE = POSTS.slice(0, 4);
const WEEK_RESULTS = [...FAILED_POST.results, ...POSTS.slice(0, 3).flatMap(resultsOf)];
export const WEEK_POSTS = 4;
export const WEEK_VIEWS = WEEK_RESULTS.reduce((n, r) => n + r.views, 0);
export const WEEK_VIEWS_BY_NETWORK = (["tiktok", "instagram", "youtube", "threads"] as Network[]).map((network) => ({
  network,
  views: WEEK_RESULTS.filter((r) => r.network === network).reduce((n, r) => n + r.views, 0),
}));

// Inbox

export interface Conversation {
  id: string;
  name: string;
  network: Network;
  photo?: number;
  preview: string;
  time: string;
  unread: number;
  online?: boolean;
}

export const CONVERSATIONS: Conversation[] = [
  { id: "tolka", name: "Tolka Run Co", network: "instagram", photo: PHOTO.shoeWhite, preview: "Shoes ship tomorrow by DPD. What size are you?", time: "14:36", unread: 2, online: true },
  { id: "aoife", name: "Aoife Byrne", network: "tiktok", preview: "Is the core finisher ok for a beginner? Did it twice and I'm wrecked", time: "13:58", unread: 1 },
  { id: "cian", name: "Cian Murphy", network: "instagram", preview: "Replied to your story: where is that gym??", time: "12:20", unread: 1, online: true },
  { id: "niamh", name: "Niamh Kelly", network: "x", preview: "Would you come on the podcast in December? We record in Smithfield on Thursdays.", time: "09:12", unread: 3 },
  { id: "field", name: "Field Audio", network: "threads", photo: PHOTO.headphones, preview: "You: Happy to, send over the spec sheet", time: "Yesterday", unread: 0 },
  { id: "sean", name: "Seán O'Brien", network: "instagram", preview: "You: 43. The grey ones run half a size small", time: "Yesterday", unread: 0 },
  { id: "roisin", name: "Róisín Doyle", network: "tiktok", preview: "Thanks a million, ordering the tan ones tonight", time: "Sun", unread: 0 },
  { id: "tadhg", name: "Tadhg Nolan", network: "threads", preview: "Fair point on rack etiquette. Guilty as charged", time: "Sun", unread: 0 },
  { id: "dara", name: "Dara Quinn", network: "instagram", preview: "You: See you Saturday at 10, I'll bring the camera", time: "Sat", unread: 0 },
  { id: "meabh", name: "Méabh Ryan", network: "x", preview: "Sent you the Dollymount route, 8 km out and back", time: "Fri", unread: 0 },
  { id: "ciara", name: "Ciara Walsh", network: "instagram", preview: "Liked your message", time: "2 Nov", unread: 0 },
];

// Thread: Tolka Run Co on Instagram, about a paid Reel for the Cloud Max.

export const DEAL = {
  brand: "Tolka Run Co",
  contact: "Sinéad Farrell",
  product: "Cloud Max launch",
  photo: PHOTO.shoeWhite,
  fee: 1_600,
  deliverables: "1 Reel, 3 Stories",
  due: "Sat 21 Nov",
  status: "Agreed",
};

export type ThreadItem =
  | { type: "day"; label: string }
  | {
      type: "message";
      id: string;
      from: "me" | "them";
      text?: string;
      photo?: number;
      aspect?: number;
      reply?: { author: string; text: string };
      time: string;
      /** Shown under my last message of a run. */
      status?: "delivered" | "read";
    };

export const THREAD: ThreadItem[] = [
  { type: "day", label: "Mon 9 Nov" },
  { type: "message", id: "m1", from: "them", text: "Hi David, Sinéad from Tolka Run Co. Your 400 km Flyknit Reel did the rounds in our office this morning.", time: "19:04" },
  { type: "message", id: "m2", from: "them", text: "We launch the Cloud Max on 21 Nov and want you on it. Paid, not gifted.", time: "19:05" },
  { type: "message", id: "m3", from: "me", text: "Thanks Sinéad. What have you in mind?", time: "19:31", status: "read" },
  { type: "message", id: "m4", from: "them", photo: PHOTO.shoeWhite, aspect: 800 / 640, text: "This is the launch colourway, white and coral.", time: "19:40" },
  { type: "message", id: "m5", from: "them", text: "One Reel and three Stories the week of the 21st. Budget is €1,400.", time: "19:41" },
  { type: "day", label: "Today" },
  { type: "message", id: "m6", from: "me", reply: { author: "Tolka Run Co", text: "One Reel and three Stories the week of the 21st. Budget is €1,400." }, text: "For a Reel and three Stories my rate is €1,800. That includes 30 days of usage in your own ads.", time: "10:12" },
  { type: "message", id: "m7", from: "me", text: "My last two shoe Reels did 4.2k and 6.7k views here, and 18.3k and 12.9k on TikTok.", time: "10:13", status: "read" },
  { type: "message", id: "m8", from: "them", text: "Could you do €1,600 if we add a second pair for a giveaway?", time: "13:50" },
  { type: "message", id: "m9", from: "me", text: "Deal at €1,600. Send the brief and I'll have a script back to you by Friday.", time: "14:32", status: "read" },
  { type: "message", id: "m10", from: "them", text: "Brilliant. Brief is on its way.", time: "14:35" },
  { type: "message", id: "m11", from: "them", text: "Shoes ship tomorrow by DPD. What size are you?", time: "14:36" },
];

// Activity

export type ActivityKind = "like" | "comment" | "follow" | "mention";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  /** The first few people, newest first. */
  people: string[];
  /** Everyone, when more than the people listed. */
  total?: number;
  /** After the names: "liked your Reel". */
  action: string;
  /** A comment or a mention, quoted. */
  quote?: string;
  post?: string;
  time: string;
}

export const ACTIVITY: { day: string; items: ActivityItem[] }[] = [
  {
    day: "Today",
    items: [
      { id: "a1", kind: "like", people: ["Aoife Byrne", "Cian Murphy", "Róisín Doyle"], total: 13, action: "liked your Reel", post: "p1", time: "12 min" },
      { id: "a2", kind: "comment", people: ["Seán O'Brien"], action: "commented", quote: "What size did you go for? I'm between a 43 and a 44", post: "p1", time: "38 min" },
      { id: "a3", kind: "follow", people: ["Tolka Run Co"], action: "started following you", time: "1 h" },
      { id: "a4", kind: "mention", people: ["Dara Quinn"], action: "mentioned you in a story", quote: "Class is back Saturday at 10 with @davidewins on camera", time: "2 h" },
      { id: "a5", kind: "follow", people: ["Méabh Ryan", "Tadhg Nolan", "Ciara Walsh"], total: 6, action: "started following you", time: "3 h" },
    ],
  },
  {
    day: "Yesterday",
    items: [
      { id: "a6", kind: "like", people: ["Niamh Kelly", "Dara Quinn", "Aoife Byrne"], total: 512, action: "liked your Reel", post: "p1", time: "Mon" },
      { id: "a7", kind: "comment", people: ["Cian Murphy", "Róisín Doyle"], total: 41, action: "commented on your Reel", quote: "Buying them on the strength of this", post: "p1", time: "Mon" },
      { id: "a8", kind: "mention", people: ["Field Audio"], action: "mentioned you in a comment", quote: "@davidewins put a pair through a year of this", post: "p4", time: "Mon" },
    ],
  },
  {
    day: "Earlier this week",
    items: [
      { id: "a9", kind: "like", people: ["Ciara Walsh", "Seán O'Brien", "Méabh Ryan"], total: 248, action: "liked your photo", post: "p2", time: "Sat" },
      { id: "a10", kind: "comment", people: ["Aoife Byrne", "Tadhg Nolan"], total: 28, action: "commented on your Reel", quote: "Round three nearly ended me", post: "p3", time: "Thu" },
      { id: "a11", kind: "follow", people: ["Field Audio", "Cian Murphy", "Niamh Kelly"], total: 58, action: "started following you", time: "Thu" },
      { id: "a12", kind: "like", people: ["Tadhg Nolan", "Róisín Doyle", "Dara Quinn"], total: 361, action: "liked your Reel", post: "p3", time: "Thu" },
    ],
  },
];

/** The last seven days, for the line at the top of Activity. */
export const WEEK_ACTIVITY: Record<ActivityKind, number> = {
  like: 1_284,
  comment: 96,
  follow: FOLLOWERS_GAINED_7,
  mention: 7,
};

/** Photos for the people and brands who have one. Everyone else is initials. */
export const FACES: Record<string, number> = {
  "Tolka Run Co": PHOTO.shoeWhite,
  "Field Audio": PHOTO.headphones,
};
