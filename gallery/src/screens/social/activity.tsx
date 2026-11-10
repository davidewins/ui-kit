// What happened on the account, the way Instagram's activity tab reads:
// grouped by day, one row per thing, the people who did it as faces, the
// post it was about on the right. Each row's first face carries a coloured
// mark for what kind of thing it is, and the week's four counts at the top
// use the same marks and filter the list when tapped.
import { Text, View } from "@/components/ui";
import { Button } from "@/components/ui/actions/Button";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { Avatar, AvatarStack } from "@/components/ui/primitives/Avatar";
import { IconTile } from "@/components/ui/primitives/IconTile";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Tile } from "@/components/ui/surfaces/Tile";
import { DemoScreen, GUTTER } from "@/gallery/demo/parts";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { type Href, Stack, router } from "expo-router";
import { AtSign, Heart, MessageCircle, UserPlus } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { ACTIVITY, type ActivityItem, type ActivityKind, FACES, WEEK_ACTIVITY, full, postById } from "./data";
import { HREF } from "./parts";

const KINDS = [
  { kind: "like", Icon: Heart, hue: "pink", label: "likes" },
  { kind: "comment", Icon: MessageCircle, hue: "blue", label: "comments" },
  { kind: "follow", Icon: UserPlus, hue: "green", label: "new followers" },
  { kind: "mention", Icon: AtSign, hue: "orange", label: "mentions" },
] as const;
const KIND = Object.fromEntries(KINDS.map((k) => [k.kind, k])) as Record<ActivityKind, (typeof KINDS)[number]>;
const LEAD = 44;

export default function Activity() {
  const colors = useThemeColors();
  const hues = useHues();
  const [only, setOnly] = useState<ActivityKind | null>(null);
  const [followed, setFollowed] = useState<string[]>([]);
  const days = ACTIVITY.map((d) => ({ ...d, items: d.items.filter((i) => !only || i.kind === only) })).filter((d) => d.items.length);

  return (
    <>
      <Stack.Screen options={{ title: "Activity" }} />
      <DemoScreen>
        <View style={{ flexDirection: "row", columnGap: 6, paddingHorizontal: GUTTER - 6 }}>
          {KINDS.map(({ kind, Icon, hue, label }) => {
            const on = only === kind;
            const inner = (
              <>
                <IconTile Icon={Icon} color={hues[hue]} size={28} round />
                <Text weight="semibold" style={[TYPE.headline, TABULAR]}>{full(WEEK_ACTIVITY[kind])}</Text>
              </>
            );
            const shape = { height: 44, borderRadius: 22, padding: 0, flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, columnGap: 7 };
            return (
              <Pressable
                key={kind}
                onPress={() => {
                  Haptics.selectionAsync().catch(() => {});
                  setOnly(on ? null : kind);
                }}
                accessibilityRole="button"
                accessibilityLabel={`${WEEK_ACTIVITY[kind]} ${label} this week`}
                accessibilityState={{ selected: on }}
                style={{ flex: 1 }}
              >
                {on ? <Tile style={shape}>{inner}</Tile> : <View style={shape}>{inner}</View>}
              </Pressable>
            );
          })}
        </View>
        <Text weight="medium" style={[TYPE.sub, { color: colors.muted, paddingHorizontal: GUTTER, marginTop: 8 }]}>
          {only ? `Showing ${KIND[only].label} only. Tap it again for everything.` : "The last seven days on Instagram. Tap one to see only those."}
        </Text>

        {days.map((d) => (
          <View key={d.day}>
            <SectionHeader title={d.day} />
            <SettingsGroup separatorInset={GUTTER + LEAD + 12}>
              {d.items.map((item) => (
                <ActivityRow key={item.id} item={item} followed={followed.includes(item.id)} onFollow={() => setFollowed((f) => [...f, item.id])} />
              ))}
            </SettingsGroup>
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
      accessibilityLabel={`${first}${total > 1 ? ` and ${total - 1} others` : ""} ${item.action}${item.quote ? `: ${item.quote}` : ""}, ${item.time}`}
      style={{ flexDirection: "row", alignItems: "flex-start", columnGap: 12, paddingHorizontal: GUTTER, paddingVertical: 12, backgroundColor: pressed ? colors.border : "transparent" }}
    >
      <Avatar
        name={first}
        source={FACES[first]}
        size={LEAD}
        badge={
          <View style={{ borderRadius: 12, borderWidth: 2, borderColor: colors.background }}>
            <IconTile Icon={Icon} color={hues[hue]} size={20} round />
          </View>
        }
      />
      <View style={{ flex: 1, rowGap: 4 }}>
        <Text style={TYPE.body}>
          <Text weight="semibold">{first}</Text>
          {total > 1 ? (
            <>
              <Text weight="medium"> and </Text>
              <Text weight="semibold" style={TABULAR}>{`${full(total - 1)} others`}</Text>
            </>
          ) : null}
          <Text weight="medium">{` ${item.action}`}</Text>
          <Text weight="medium" style={[TABULAR, { color: colors.muted }]}>{`  ${item.time}`}</Text>
        </Text>
        {item.quote ? (
          <Text weight="medium" numberOfLines={2} style={[TYPE.sub, { color: colors.muted }]}>{item.quote}</Text>
        ) : null}
        {others.length ? <AvatarStack people={others.map((name) => ({ name, source: FACES[name] }))} size={22} max={3} total={total - 1} /> : null}
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
