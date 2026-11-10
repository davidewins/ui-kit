// What happened on the account, the way Instagram's activity tab reads:
// the week's four counts on one glass block, then a raised card per day,
// one row per thing: who did it, what and when on the line below, the people
// as faces, the post it was about on the right. Each row's first face carries
// a coloured mark for what kind of thing it is, the same marks as the counts.
//
// Native pieces: the header menu (ActionMenu), the filter (Menu, a single
// choice) and long press on a row (ContextMenu, different per kind).
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { Button } from "@/components/ui/actions/Button";
import { ContextMenu, type ContextMenuAction } from "@/components/ui/actions/ContextMenu";
import { Menu } from "@/components/ui/actions/Menu";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { Avatar, AvatarStack } from "@/components/ui/primitives/Avatar";
import { IconTile } from "@/components/ui/primitives/IconTile";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { GUTTER, DemoScreen } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { type Href, Stack, router } from "expo-router";
import { AtSign, Heart, MessageCircle, UserPlus } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { ACTIVITY, type ActivityItem, type ActivityKind, FACES, WEEK_ACTIVITY, full, postById } from "./data";
import { HREF, PanelRows, copyText } from "./parts";

const KINDS = [
  { kind: "like", Icon: Heart, hue: "pink", label: "likes", choice: "Likes" },
  { kind: "comment", Icon: MessageCircle, hue: "blue", label: "comments", choice: "Comments" },
  { kind: "follow", Icon: UserPlus, hue: "green", label: "follows", choice: "New followers" },
  { kind: "mention", Icon: AtSign, hue: "orange", label: "mentions", choice: "Mentions" },
] as const;
const KIND = Object.fromEntries(KINDS.map((k) => [k.kind, k])) as Record<ActivityKind, (typeof KINDS)[number]>;
const LEAD = 44;
/** "liked your Reel" and "12 min" as one line: "Liked your Reel 12 min ago". */
const whatAndWhen = (action: string, time: string) => `${action[0].toUpperCase()}${action.slice(1)} ${/^\d/.test(time) ? `${time} ago` : `on ${time}`}`;

export default function Activity() {
  const colors = useThemeColors();
  const hues = useHues();
  const [only, setOnly] = useState<ActivityKind | null>(null);
  const [followed, setFollowed] = useState<string[]>([]);
  const days = ACTIVITY.map((d) => ({ ...d, items: d.items.filter((i) => !only || i.kind === only) })).filter((d) => d.items.length);
  const follow = (item: ActivityItem) => {
    setFollowed((f) => [...f, item.id]);
    Toast.success(`Following ${item.people[0]}`);
  };

  const actionsFor = (item: ActivityItem): ContextMenuAction[] => {
    const first = item.people[0];
    const mute: ContextMenuAction = { label: `Mute ${KIND[item.kind].label}`, systemImage: "bell.slash", onPress: () => Toast.info(`No more alerts for ${KIND[item.kind].label}`) };
    const profile: ContextMenuAction = { label: `View ${first}`, systemImage: "person.crop.circle", onPress: () => Toast.info(`Opening ${first}`) };
    if (item.kind === "comment") {
      return [
        { label: "Reply", systemImage: "arrowshape.turn.up.left", onPress: () => Toast.info(`Replying to ${first}`) },
        { label: "Like comment", systemImage: "heart", onPress: () => Toast.success("Comment liked") },
        { label: "Copy comment", systemImage: "doc.on.doc", onPress: () => copyText(item.quote ?? "", "Comment copied") },
        { label: "Hide comment", systemImage: "eye.slash", destructive: true, onPress: () => Toast.success("Comment hidden from your post") },
      ];
    }
    if (item.kind === "follow") {
      return [
        ...(followed.includes(item.id) || item.people.length > 1 ? [] : [{ label: "Follow back", systemImage: "person.badge.plus" as const, onPress: () => follow(item) }]),
        profile,
        mute,
      ];
    }
    if (item.kind === "mention") {
      return [
        { label: "Add to your story", systemImage: "plus.circle", onPress: () => Toast.success("Added to your story") },
        profile,
        { label: "Hide mention", systemImage: "eye.slash", destructive: true, onPress: () => Toast.success("Mention hidden from your profile") },
      ];
    }
    return [{ label: "Open post", systemImage: "photo", onPress: () => router.push(HREF.feed as Href) }, profile, mute];
  };

  return (
    <>
      <Stack.Screen options={{ title: "Activity" }} />
      <ActionMenu
        accessibilityLabel="Activity actions"
        actions={[
          { label: "Mark all as seen", systemImage: "checkmark.circle", onPress: () => Toast.success("All caught up") },
          { label: "Notification settings", systemImage: "bell", onPress: () => Toast.info("Opens notification settings") },
        ]}
      />
      <DemoScreen>
        <Panel glass>
          <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8, minHeight: 32, marginBottom: 14 }}>
            <Text weight="medium" numberOfLines={1} style={[TYPE.sub, { flex: 1, color: colors.muted }]}>The last seven days on Instagram</Text>
            <Menu
              label={only ? KIND[only].choice : "Everything"}
              systemImage="line.3.horizontal.decrease"
              items={[
                { label: "Everything", selected: only === null, onPress: () => setOnly(null) },
                ...KINDS.map((k) => ({ label: k.choice, selected: only === k.kind, onPress: () => setOnly(k.kind) })),
              ]}
            />
          </View>
          <View style={{ flexDirection: "row", columnGap: 8 }}>
            {KINDS.map(({ kind, Icon, hue, label }) => (
              <View key={kind} style={{ flex: 1, rowGap: 2, opacity: only && only !== kind ? 0.35 : 1 }} accessibilityLabel={`${WEEK_ACTIVITY[kind]} ${label} this week`}>
                <View style={{ marginBottom: 6 }}>
                  <IconTile Icon={Icon} color={hues[hue]} size={32} round />
                </View>
                <Text weight="semibold" numberOfLines={1} style={[TYPE.title, TABULAR]}>{full(WEEK_ACTIVITY[kind])}</Text>
                <Text weight="medium" numberOfLines={1} style={[TYPE.sub, { color: colors.muted }]}>{label}</Text>
              </View>
            ))}
          </View>
        </Panel>

        {days.map((d) => (
          <View key={d.day}>
            <SectionHeader title={d.day} />
            <Panel flush>
              <PanelRows>
                <SettingsGroup separatorInset={GUTTER + LEAD + 12} style={{ marginBottom: 0 }}>
                  {d.items.map((item) => (
                    <ContextMenu key={item.id} actions={actionsFor(item)}>
                      <ActivityRow item={item} followed={followed.includes(item.id)} onFollow={() => follow(item)} />
                    </ContextMenu>
                  ))}
                </SettingsGroup>
              </PanelRows>
            </Panel>
          </View>
        ))}
      </DemoScreen>
    </>
  );
}

function ActivityRow({ item, followed, onFollow }: { item: ActivityItem; followed: boolean; onFollow: () => void }) {
  const colors = useThemeColors();
  const hues = useHues();
  const [pressed, setPressed] = useState(false);
  const { Icon, hue } = KIND[item.kind];
  const [first, ...others] = item.people;
  const total = item.total ?? item.people.length;
  const who = total > 1 ? `${first} and ${full(total - 1)} others` : first;
  const what = whatAndWhen(item.action, item.time);
  const post = item.post ? postById(item.post) : null;
  const canFollowBack = item.kind === "follow" && total === 1;
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        if (post) router.push(HREF.feed as Href);
      }}
      accessibilityRole="button"
      accessibilityLabel={`${who}. ${what}${item.quote ? `: ${item.quote}` : ""}`}
      style={{ flexDirection: "row", alignItems: "flex-start", columnGap: 12, paddingHorizontal: GUTTER, paddingVertical: 12, backgroundColor: pressed ? colors.border : "transparent" }}
    >
      <Avatar
        name={first}
        source={FACES[first]}
        size={LEAD}
        badge={
          <View style={{ borderRadius: 12, borderWidth: 2, borderColor: colors.card }}>
            <IconTile Icon={Icon} color={hues[hue]} size={20} round />
          </View>
        }
      />
      <View style={{ flex: 1, rowGap: 3 }}>
        <Text weight="semibold" numberOfLines={1} style={[TYPE.body, TABULAR]}>{who}</Text>
        <Text weight="medium" numberOfLines={2} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{what}</Text>
        {item.quote ? (
          <Text weight="medium" numberOfLines={2} style={[TYPE.body, { marginTop: 3 }]}>{item.quote}</Text>
        ) : null}
        {/* Faces only: the count is already in the line above. */}
        {others.length ? (
          <View style={{ marginTop: 3 }}>
            <AvatarStack people={others.map((name) => ({ name, source: FACES[name] }))} size={22} max={3} />
          </View>
        ) : null}
      </View>
      {post ? (
        <Image source={post.photo} style={{ width: 44, height: 44, borderRadius: 8 }} contentFit="cover" accessibilityLabel={post.caption} />
      ) : canFollowBack ? (
        <Button size="xs" variant={followed ? "outline" : "primary"} onPress={onFollow} disabled={followed}>
          {followed ? "Following" : "Follow back"}
        </Button>
      ) : null}
    </Pressable>
  );
}
