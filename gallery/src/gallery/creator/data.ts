// Gallery-only: a creator's social workspace for the TKVR redo pages, in
// TKVR's own shapes (SocialAccount, SocialPost from lib/creator/social), plus
// the numbers TKVR doesn't show yet: per-post results and per-account growth.
import type { SocialAccount, SocialNetwork, SocialPost, SocialPostState } from "@/apps/tkvr/lib/creator/social";
import { DEFAULT_SETTINGS } from "@/apps/tkvr/lib/creator/social";

export const ACCOUNTS: SocialAccount[] = [
  { id: "ig", network: "instagram", name: "davidewins", picture: null, needsReconnect: false },
  { id: "tt", network: "tiktok", name: "davidewins", picture: null, needsReconnect: false },
  { id: "yt", network: "youtube", name: "David Ewins", picture: null, needsReconnect: false },
  { id: "x", network: "x", name: "davidewins", picture: null, needsReconnect: false },
  { id: "li", network: "linkedin", name: "David Ewins", picture: null, needsReconnect: true },
  { id: "th", network: "threads", name: "davidewins", picture: null, needsReconnect: false },
];

export const accountById = (id?: string) => ACCOUNTS.find((a) => a.id === id) ?? ACCOUNTS[0];
export const ACCOUNTS_BY_ID = new Map(ACCOUNTS.map((a) => [a.id, a]));

/** Followers, the change over 30 days, reach and engagement per account. */
export const ACCOUNT_STATS: Record<string, { followers: number; change: number; reach: number; reachChange: number; engagement: number; best: string; trend: number[] }> = {
  ig: { followers: 12480, change: 312, reach: 48200, reachChange: 12, engagement: 4.2, best: "Tue 18:00", trend: [11.6, 11.7, 11.8, 11.9, 12.0, 12.1, 12.2, 12.3, 12.48] },
  tt: { followers: 31900, change: 2140, reach: 212000, reachChange: 38, engagement: 6.8, best: "Thu 21:00", trend: [27, 27.6, 28.4, 29.1, 29.8, 30.4, 31.1, 31.5, 31.9] },
  yt: { followers: 4210, change: 96, reach: 18900, reachChange: -6, engagement: 3.1, best: "Sun 11:00", trend: [4.0, 4.05, 4.07, 4.1, 4.12, 4.15, 4.18, 4.2, 4.21] },
  x: { followers: 2875, change: -14, reach: 9100, reachChange: -21, engagement: 1.4, best: "Mon 08:30", trend: [2.9, 2.91, 2.9, 2.89, 2.88, 2.89, 2.88, 2.88, 2.875] },
  li: { followers: 1940, change: 41, reach: 6200, reachChange: 4, engagement: 2.6, best: "Wed 08:00", trend: [1.86, 1.87, 1.89, 1.9, 1.91, 1.92, 1.93, 1.93, 1.94] },
  th: { followers: 3330, change: 188, reach: 11400, reachChange: 15, engagement: 3.7, best: "Tue 19:00", trend: [3.0, 3.05, 3.1, 3.15, 3.2, 3.24, 3.28, 3.3, 3.33] },
};

/** What each published post did, per post id. */
export type Results = { views: number; likes: number; comments: number; shares: number; saves: number };

interface Seed {
  day: number;
  time: string;
  accounts: string[];
  content: string;
  state: SocialPostState;
  results?: Results;
  error?: string;
}

// Days are offsets from today, so the calendar always has a busy month.
const SEEDS: Seed[] = [
  { day: -9, time: "18:00", accounts: ["ig", "th"], content: "Three things I'd tell myself before shipping my first app.", state: "published", results: { views: 18400, likes: 1210, comments: 84, shares: 66, saves: 302 } },
  { day: -8, time: "21:00", accounts: ["tt"], content: "Building a delivery app in a weekend, part 1", state: "published", results: { views: 96100, likes: 7420, comments: 391, shares: 840, saves: 1210 } },
  { day: -7, time: "08:30", accounts: ["x", "li"], content: "Why every button in my apps is a pill now.", state: "published", results: { views: 4300, likes: 118, comments: 22, shares: 9, saves: 31 } },
  { day: -6, time: "11:00", accounts: ["yt"], content: "Full build: VOID checkout from scratch (42 min)", state: "published", results: { views: 6900, likes: 512, comments: 140, shares: 38, saves: 220 } },
  { day: -5, time: "18:00", accounts: ["ig"], content: "Carousel: the 7 screens that sell an app", state: "published", results: { views: 22900, likes: 1880, comments: 96, shares: 210, saves: 940 } },
  { day: -4, time: "21:00", accounts: ["tt", "ig"], content: "Part 2: the rider app goes live", state: "published", results: { views: 71300, likes: 5010, comments: 233, shares: 402, saves: 690 } },
  { day: -3, time: "08:00", accounts: ["li"], content: "Hiring isn't the answer to shipping faster.", state: "failed", error: "LinkedIn login expired. Connect it again." },
  { day: -2, time: "19:00", accounts: ["th", "x"], content: "Dark mode bugs I keep making, a thread", state: "published", results: { views: 5200, likes: 240, comments: 41, shares: 18, saves: 52 } },
  { day: -1, time: "18:00", accounts: ["ig"], content: "Before and after: the basket screen", state: "published", results: { views: 15100, likes: 1320, comments: 58, shares: 77, saves: 410 } },
  { day: 0, time: "08:30", accounts: ["x"], content: "Shipped: Apple Music style zoom in every list.", state: "published", results: { views: 1900, likes: 64, comments: 7, shares: 5, saves: 12 } },
  { day: 0, time: "12:15", accounts: ["tt", "ig", "th"], content: "Part 3: payouts, the bit nobody shows you", state: "failed", error: "TikTok: video longer than your account allows (3 min)." },
  { day: 0, time: "18:00", accounts: ["ig", "th"], content: "Q&A: ask me anything about building solo", state: "scheduled" },
  { day: 0, time: "21:00", accounts: ["tt"], content: "Part 4: launch day", state: "scheduled" },
  { day: 1, time: "11:00", accounts: ["yt"], content: "Full build: the rider app (55 min)", state: "scheduled" },
  { day: 2, time: "18:00", accounts: ["ig"], content: "Carousel: pricing a marketplace", state: "scheduled" },
  { day: 3, time: "21:00", accounts: ["tt"], content: "What a 20 euro server can handle", state: "scheduled" },
  { day: 4, time: "08:30", accounts: ["x", "th"], content: "My whole stack, one picture", state: "draft" },
  { day: 6, time: "18:00", accounts: ["ig", "tt"], content: "Month in numbers", state: "draft" },
];

function iso(dayOffset: number, time: string) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  const [h, m] = time.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export const POSTS: (SocialPost & { results?: Results })[] = SEEDS.map((s, i) => ({
  id: `p${i + 1}`,
  accountIds: s.accounts,
  content: s.content,
  variants: {},
  extra: [],
  media: [],
  settings: DEFAULT_SETTINGS,
  mode: s.state === "draft" ? "draft" : "schedule",
  at: iso(s.day, s.time),
  state: s.state,
  deliveries: s.accounts.map((a, j) => ({
    accountId: a,
    network: ACCOUNTS_BY_ID.get(a)!.network as SocialNetwork,
    state: s.state === "failed" && j === 0 ? "failed" : s.state === "failed" ? "published" : s.state,
    url: null,
    error: s.state === "failed" && j === 0 ? (s.error ?? null) : null,
  })),
  results: s.results,
}));

export const postById = (id?: string) => POSTS.find((p) => p.id === id) ?? POSTS[0];

/** Best open slots this week (from each network's best time). */
export const BEST_SLOTS: Record<number, { time: string; account: string; why: string }[]> = {
  0: [{ time: "19:30", account: "th", why: "Threads peaks at 19:00" }],
  1: [{ time: "18:00", account: "ig", why: "Your best time on Instagram" }, { time: "21:00", account: "tt", why: "TikTok peaks Thu 21:00" }],
  2: [{ time: "08:00", account: "li", why: "LinkedIn peaks Wed 08:00" }],
};

export const compact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}m` : n >= 10_000 ? `${Math.round(n / 1000)}k` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

/** Likes, comments, shares and saves over views, as a percentage. */
export const engagement = (r: Results) => ((r.likes + r.comments + r.shares + r.saves) / Math.max(1, r.views)) * 100;
