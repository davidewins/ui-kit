// Gallery-only: the TKVR redo pages' post row and month summary, shared by the
// calendar and the account page so a post reads the same on both.
import { SocialMark } from "@/apps/tkvr/components/SocialMark";
import { STATE_BADGE, STATE_LABEL, type SocialPost, type SocialPostState, postNetworks } from "@/apps/tkvr/lib/creator/social";
import { Badge, Text, View } from "@/components/ui";
import { SETTINGS_ROW } from "@/components/ui/lists/SettingsRow";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { type Href, router } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ACCOUNTS_BY_ID, type Results, compact, engagement } from "./data";

const TIME_COL = 48;
const EDGE = SETTINGS_ROW.paddingHorizontal;
/** Hairlines start at the post text. */
export const POST_INSET = EDGE + TIME_COL + SETTINGS_ROW.gap;

function until(iso: string) {
  const mins = Math.round((new Date(iso).getTime() - Date.now()) / 60000);
  if (mins <= 0) return "Going out now";
  if (mins < 60) return `In ${mins} min`;
  if (mins < 24 * 60) return `In ${Math.round(mins / 60)} h`;
  return `In ${Math.round(mins / (24 * 60))} days`;
}

const hhmm = (iso: string) => new Date(iso).toLocaleTimeString("en-IE", { hour: "2-digit", minute: "2-digit" });

/**
 * One post: time, text (two lines), then a strip with every network's mark
 * and what matters for its state: results once published, the countdown when
 * scheduled, the network's reason when it failed.
 */
export function PostRow({ post, href, showDate = false }: { post: SocialPost & { results?: Results }; href?: Href; showDate?: boolean }) {
  const colors = useThemeColors();
  const [pressed, setPressed] = useState(false);
  const networks = postNetworks(post, ACCOUNTS_BY_ID);
  const failed = post.deliveries.find((d) => d.state === "failed");
  const r = post.results;
  const date = new Date(post.at).toLocaleDateString("en-IE", { day: "numeric", month: "short" });

  return (
    <Pressable
      disabled={!href}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        if (href) router.push(href);
      }}
      accessibilityRole={href ? "link" : undefined}
      accessibilityLabel={`${STATE_LABEL[post.state]}, ${hhmm(post.at)}, ${post.content}`}
      style={{ flexDirection: "row", columnGap: SETTINGS_ROW.gap, paddingHorizontal: EDGE, paddingVertical: 10, backgroundColor: pressed ? colors.border : "transparent" }}
    >
      <View style={{ width: TIME_COL, paddingTop: 1 }}>
        <Text weight="semibold" style={{ fontSize: 15, fontVariant: ["tabular-nums"] }}>{hhmm(post.at)}</Text>
        {showDate ? <Text weight="medium" style={{ fontSize: 12, color: colors.muted }}>{date}</Text> : null}
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", columnGap: 8 }}>
          <Text weight="medium" numberOfLines={2} style={{ flex: 1, fontSize: 15, lineHeight: 20 }}>{post.content}</Text>
          <Badge variant={STATE_BADGE[post.state]}>{STATE_LABEL[post.state]}</Badge>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
          {networks.map((n) => (
            <SocialMark key={n} network={n} size={13} color={failed?.network === n ? colors.error : colors.muted} />
          ))}
          <Text weight="medium" numberOfLines={1} style={{ flex: 1, marginLeft: 4, fontSize: 13, color: failed ? colors.error : colors.muted, fontVariant: ["tabular-nums"] }}>
            {failed
              ? failed.error
              : r
                ? `${compact(r.views)} views, ${compact(r.likes)} likes, ${r.comments} comments, ${engagement(r).toFixed(1)}%`
                : post.state === "scheduled"
                  ? until(post.at)
                  : "Draft, not scheduled"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/** A free slot worth filling: dashed time, why it's good, and a plus. */
export function SlotRow({ time, why, onPress }: { time: string; why: string; onPress: () => void }) {
  const colors = useThemeColors();
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`Free at ${time}, ${why}. New post`}
      style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", columnGap: SETTINGS_ROW.gap, paddingHorizontal: EDGE, height: 44, backgroundColor: pressed ? colors.border : "transparent" })}
    >
      <Text weight="medium" style={{ width: TIME_COL, fontSize: 15, color: colors.muted, fontVariant: ["tabular-nums"] }}>{time}</Text>
      <Text weight="medium" numberOfLines={1} style={{ flex: 1, fontSize: 13, color: colors.muted }}>{`Free, ${why.charAt(0).toLowerCase()}${why.slice(1)}`}</Text>
      <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderStyle: "dashed", borderColor: colors.muted, alignItems: "center", justifyContent: "center" }}>
        <Plus size={14} color={colors.text} strokeWidth={2.2} />
      </View>
    </Pressable>
  );
}

/** The month at a glance in one line: a status dot and a count per state. */
export function StateCounts({ posts }: { posts: readonly SocialPost[] }) {
  const colors = useThemeColors();
  const dot: Record<SocialPostState, string> = { published: colors.success, scheduled: colors.warning, failed: colors.error, draft: colors.muted };
  const order: SocialPostState[] = ["published", "scheduled", "failed", "draft"];
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 14, rowGap: 4, marginHorizontal: EDGE, marginBottom: 12 }}>
      {order.map((st) => {
        const n = posts.filter((p) => p.state === st).length;
        return (
          <View key={st} style={{ flexDirection: "row", alignItems: "center", columnGap: 6 }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: dot[st] }} />
            <Text weight="semibold" style={{ fontSize: 13, fontVariant: ["tabular-nums"] }}>{n}</Text>
            <Text weight="medium" style={{ fontSize: 13, color: colors.muted }}>{STATE_LABEL[st].toLowerCase()}</Text>
          </View>
        );
      })}
    </View>
  );
}

export const hairline = (colors: { border: string }, inset: number) => ({ height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginLeft: inset });
