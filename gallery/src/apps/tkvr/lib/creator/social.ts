// TAK-1401: social posting. Mirror of creator-platform src/lib/social.ts (the
// networks, their limits and settings, the composer's checks), without the
// zod input schema, which only the server needs. Change both together.
// Copied from TKVR (lib/creator/social.ts). MediaItem is TKVR's studio-api
// type, inlined here so the gallery doesn't pull TKVR's API client.
type MediaItem = { type: "image" | "video"; path: string; name: string; mime: string; size: number };

export const SOCIAL_NETWORKS = [
  "instagram",
  "facebook",
  "threads",
  "tiktok",
  "youtube",
  "x",
  "linkedin",
  "pinterest",
  "bluesky",
  "mastodon",
] as const;

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

type NetworkInfo = {
  label: string;
  /** Most characters a post can have (Postiz's own limit). */
  limit: number;
  /** What the network needs attached, if anything. */
  needs: "media" | "video" | "image" | null;
  /** What extra parts become: replies in a thread, or comments under the post. */
  extra: "thread" | "comments" | null;
  /** False where TKVR cannot post there yet (shown as Soon). */
  available: boolean;
};

export const NETWORK: Record<SocialNetwork, NetworkInfo> = {
  instagram: {
    label: "Instagram",
    limit: 2200,
    needs: "media",
    extra: "comments",
    available: true,
  },
  facebook: {
    label: "Facebook",
    limit: 63206,
    needs: null,
    extra: "comments",
    available: true,
  },
  threads: {
    label: "Threads",
    limit: 500,
    needs: null,
    extra: "thread",
    available: true,
  },
  tiktok: {
    label: "TikTok",
    limit: 2000,
    needs: "video",
    extra: null,
    available: true,
  },
  youtube: {
    label: "YouTube",
    limit: 5000,
    needs: "video",
    extra: null,
    available: true,
  },
  x: { label: "X", limit: 280, needs: null, extra: "thread", available: true },
  linkedin: {
    label: "LinkedIn",
    limit: 3000,
    needs: null,
    extra: "comments",
    available: true,
  },
  pinterest: {
    label: "Pinterest",
    limit: 500,
    needs: "image",
    extra: null,
    available: false,
  },
  bluesky: {
    label: "Bluesky",
    limit: 300,
    needs: null,
    extra: "thread",
    available: true,
  },
  mastodon: {
    label: "Mastodon",
    limit: 500,
    needs: null,
    extra: "thread",
    available: true,
  },
};

export type SocialAccount = {
  id: string;
  network: SocialNetwork;
  name: string;
  picture: string | null;
  needsReconnect: boolean;
};

export type SocialPostState = "scheduled" | "published" | "failed" | "draft";

export type SocialDelivery = {
  accountId: string;
  network: SocialNetwork;
  state: SocialPostState;
  url: string | null;
  error: string | null;
};

export const TIKTOK_PRIVACY = [
  "PUBLIC_TO_EVERYONE",
  "MUTUAL_FOLLOW_FRIENDS",
  "FOLLOWER_OF_CREATOR",
  "SELF_ONLY",
] as const;
export const TIKTOK_PRIVACY_LABEL: Record<
  (typeof TIKTOK_PRIVACY)[number],
  string
> = {
  PUBLIC_TO_EVERYONE: "Everyone",
  MUTUAL_FOLLOW_FRIENDS: "Friends",
  FOLLOWER_OF_CREATOR: "Followers",
  SELF_ONLY: "Only me",
};
export const YOUTUBE_VISIBILITY = ["public", "unlisted", "private"] as const;
export const X_REPLY = [
  "everyone",
  "following",
  "mentionedUsers",
  "subscribers",
  "verified",
] as const;
export const X_REPLY_LABEL: Record<(typeof X_REPLY)[number], string> = {
  everyone: "Everyone",
  following: "People you follow",
  mentionedUsers: "Only people you mention",
  subscribers: "Subscribers",
  verified: "Verified accounts",
};

export type SocialSettings = {
  instagram?: { postType: "post" | "story" };
  tiktok?: {
    privacy: (typeof TIKTOK_PRIVACY)[number] | null;
    comments: boolean;
    duet: boolean;
    stitch: boolean;
    madeWithAi: boolean;
  };
  youtube?: {
    title: string;
    visibility: (typeof YOUTUBE_VISIBILITY)[number];
    madeForKids: boolean;
  };
  x?: { whoCanReply: (typeof X_REPLY)[number] };
};

export const DEFAULT_SETTINGS: Required<SocialSettings> = {
  instagram: { postType: "post" },
  tiktok: {
    privacy: null,
    comments: true,
    duet: false,
    stitch: false,
    madeWithAi: false,
  },
  youtube: { title: "", visibility: "public", madeForKids: false },
  x: { whoCanReply: "everyone" },
};

export const MAX_SOCIAL_EXTRA = 10;

export type SocialPostInput = {
  accountIds: string[];
  content: string;
  variants: Partial<Record<SocialNetwork, string>>;
  extra: string[];
  media: MediaItem[];
  settings: SocialSettings;
  mode: "now" | "schedule" | "draft";
  /** ISO time, for mode "schedule". */
  at: string | null;
};

export type SocialPost = {
  id: string;
  accountIds: string[];
  content: string;
  variants: Partial<Record<SocialNetwork, string>>;
  extra: string[];
  media: MediaItem[];
  settings: SocialSettings;
  mode: "now" | "schedule" | "draft";
  at: string;
  state: SocialPostState;
  deliveries: SocialDelivery[];
};

export type StudioSocial = {
  enabled: boolean;
  accounts: SocialAccount[];
  posts: SocialPost[];
};

export function contentFor(
  post: Pick<SocialPostInput, "content" | "variants">,
  network: SocialNetwork,
): string {
  return post.variants[network] ?? post.content;
}

export type ComposerProblem = {
  network: SocialNetwork | null;
  message: string;
};

const chars = (s: string) => [...s].length;

/** What stops this post going to these networks, in the words the composer shows. */
export function composerProblems(
  post: Pick<
    SocialPostInput,
    "content" | "variants" | "extra" | "settings" | "mode"
  > & {
    media: readonly { type: "image" | "video" | "audio" }[];
  },
  networks: readonly SocialNetwork[],
): ComposerProblem[] {
  if (networks.length === 0) return [];
  const unique = [...new Set(networks)];
  if (
    unique.every((n) => chars(contentFor(post, n)) === 0) &&
    post.media.length === 0
  ) {
    return [{ network: null, message: "Write something or add a photo." }];
  }
  if (post.mode === "draft") return [];
  const has = (t: "image" | "video") => post.media.some((m) => m.type === t);
  const out: ComposerProblem[] = [];
  for (const network of unique) {
    const { label, limit, needs, available } = NETWORK[network];
    if (!available) {
      out.push({ network, message: `Posting to ${label} is coming soon.` });
      continue;
    }
    const length = chars(contentFor(post, network));
    if (length > limit) {
      out.push({
        network,
        message: `${label} allows ${limit.toLocaleString("en-US")} characters. Cut ${(length - limit).toLocaleString("en-US")}.`,
      });
    }
    if (NETWORK[network].extra === "thread") {
      const long = post.extra.findIndex((e) => chars(e) > limit);
      if (long >= 0)
        out.push({
          network,
          message: `Reply ${long + 2} is too long for ${label} (${limit.toLocaleString("en-US")} characters).`,
        });
    }
    if (needs === "media" && !has("image") && !has("video"))
      out.push({ network, message: `${label} needs a photo or video.` });
    else if (needs === "video" && !has("video"))
      out.push({ network, message: `${label} needs a video.` });
    else if (needs === "image" && !has("image"))
      out.push({ network, message: `${label} needs a photo.` });
    if (network === "tiktok" && !post.settings.tiktok?.privacy)
      out.push({ network, message: "Pick who can watch it on TikTok." });
    if (network === "youtube" && !post.settings.youtube?.title.trim())
      out.push({ network, message: "Give the YouTube video a title." });
    if (
      network === "instagram" &&
      post.settings.instagram?.postType === "story" &&
      post.media.length !== 1
    ) {
      out.push({
        network,
        message: "An Instagram story is one photo or video.",
      });
    }
  }
  return out;
}

export const STATE_LABEL: Record<SocialPostState, string> = {
  scheduled: "Scheduled",
  published: "Published",
  failed: "Failed",
  draft: "Draft",
};

export const STATE_BADGE = {
  scheduled: "warning",
  published: "success",
  failed: "error",
  draft: "default",
} as const;

/** "Tue 14 Oct, 18:30" in the viewer's locale. */
export function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** The line under a post: when it goes or went out, or why it failed. */
export function postSubtitle(p: SocialPost): string {
  if (p.state === "failed")
    return (
      p.deliveries.find((d) => d.state === "failed")?.error ??
      "A network refused it"
    );
  if (p.state === "scheduled") return `Goes out ${formatWhen(p.at)}`;
  if (p.state === "draft") return "Draft";
  return `Published ${formatWhen(p.at)}`;
}

/** The networks a post goes to, in the order picked. */
export function postNetworks(
  p: Pick<SocialPost, "accountIds">,
  accounts: ReadonlyMap<string, SocialAccount>,
): SocialNetwork[] {
  return [
    ...new Set(
      p.accountIds
        .map((id) => accounts.get(id)?.network)
        .filter((n): n is SocialNetwork => !!n),
    ),
  ];
}
