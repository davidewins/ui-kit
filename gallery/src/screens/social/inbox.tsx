// Every network's DMs in one list, the way Instagram's inbox reads but with
// the network on each face: unread first with two lines of the message, the
// rest below in one. The marks under the header filter to one network and
// show how many conversations are waiting there. Search is the native header
// search bar, the kit's pattern for screens.
import { EmptyState, Text, View } from "@/components/ui";
import { HeaderIconButton } from "@/components/ui/actions/HeaderIconButton";
import { CountBadge } from "@/components/ui/feedback/CountBadge";
import { CONVERSATION_ROW, ConversationRow } from "@/components/ui/lists/ConversationRow";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { TYPE } from "@/components/ui/primitives/type";
import { Tile } from "@/components/ui/surfaces/Tile";
import { SocialMark } from "@/apps/tkvr/components/SocialMark";
import { ART } from "@/gallery/demo/data";
import { DemoScreen, GUTTER, useStates } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import * as Haptics from "expo-haptics";
import { type Href, Stack, router } from "expo-router";
import { Inbox as InboxIcon, SquarePen } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { CONVERSATIONS, type Conversation, NETWORK_LABEL, type Network } from "./data";
import { HREF, NetworkBadge } from "./parts";

const STATES = ["Inbox", "Empty"] as const;
const FILTERS = ["all", "instagram", "tiktok", "x", "threads"] as const;
type Filter = (typeof FILTERS)[number];

export default function Inbox() {
  const { state } = useStates(STATES);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const needle = q.trim().toLowerCase();
  const shown = CONVERSATIONS.filter((c) => (filter === "all" || c.network === filter) && (!needle || c.name.toLowerCase().includes(needle) || c.preview.toLowerCase().includes(needle)));
  const unread = shown.filter((c) => c.unread > 0);
  const earlier = shown.filter((c) => c.unread === 0);
  const waiting = (f: Filter) => CONVERSATIONS.filter((c) => c.unread > 0 && (f === "all" || c.network === f)).length;

  const row = (c: Conversation) => (
    <ConversationRow
      key={c.id}
      name={c.name}
      source={c.photo}
      preview={c.preview}
      lines={c.unread ? 2 : 1}
      time={c.time}
      unread={c.unread}
      status={c.online ? "online" : undefined}
      mark={<NetworkBadge network={c.network} size={20} ring />}
      onPress={() => router.push(HREF.thread as Href)}
    />
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Inbox",
          headerSearchBarOptions: state === "Empty" ? undefined : { placeholder: "Search people and messages", onChangeText: (e) => setQ(e.nativeEvent.text) },
          headerRight: () => <HeaderIconButton icon={SquarePen} accessibilityLabel="New message" onPress={() => Toast.info("New message")} />,
        }}
      />
      <DemoScreen scroll={state !== "Empty"}>
        {state === "Empty" ? (
          <EmptyState
            art={{ image: ART.envelope }}
            title="No messages yet"
            body="DMs from Instagram, TikTok, X and Threads land here as soon as someone writes to you."
            action={{ label: "Add your inbox link to a post", onPress: () => Toast.info("New post") }}
          />
        ) : (
          <>
            <View style={{ flexDirection: "row", columnGap: 8, paddingHorizontal: GUTTER, marginBottom: 4 }} accessibilityRole="tablist">
              {FILTERS.map((f) => (
                <NetworkFilter key={f} filter={f} selected={filter === f} waiting={waiting(f)} onPress={() => setFilter(f)} />
              ))}
            </View>

            {unread.length ? (
              <>
                <SectionHeader title="Unread" count={unread.length} first />
                <SettingsGroup separatorInset={CONVERSATION_ROW.separatorInset}>{unread.map(row)}</SettingsGroup>
              </>
            ) : null}
            {earlier.length ? (
              <>
                <SectionHeader title="Earlier" first={!unread.length} />
                <SettingsGroup separatorInset={CONVERSATION_ROW.separatorInset}>{earlier.map(row)}</SettingsGroup>
              </>
            ) : null}
            {shown.length === 0 ? (
              <EmptyState
                layout="inline"
                art={{ image: ART.magnifier }}
                title={needle ? `Nothing matches "${q.trim()}"` : `No ${NETWORK_LABEL[filter as Network]} messages`}
                body={needle ? "Try a name, or a word from the message." : "Conversations from this network will show up here."}
                secondary={filter === "all" ? undefined : { label: "Show every network", onPress: () => setFilter("all") }}
              />
            ) : null}
          </>
        )}
      </DemoScreen>
    </>
  );
}

/** One network as a round mark. The chosen one stretches to carry its name,
 *  so the row never needs a label beside it. */
function NetworkFilter({ filter, selected, waiting, onPress }: { filter: Filter; selected: boolean; waiting: number; onPress: () => void }) {
  const colors = useThemeColors();
  const label = filter === "all" ? "All" : NETWORK_LABEL[filter];
  const ink = selected ? colors.background : colors.text;
  return (
    <Pressable
      onPress={() => {
        if (selected) return;
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      accessibilityRole="tab"
      accessibilityLabel={`${label}, ${waiting} unread`}
      accessibilityState={{ selected }}
    >
      <Tile
        style={[
          { height: 44, minWidth: 44, borderRadius: 22, padding: 0, paddingHorizontal: selected ? 16 : 0, flexDirection: "row", alignItems: "center", justifyContent: "center", columnGap: 8 },
          selected ? { backgroundColor: colors.text } : null,
        ]}
      >
        {filter === "all" ? <InboxIcon size={19} color={ink} strokeWidth={2} /> : <SocialMark network={filter} size={17} color={ink} />}
        {selected ? <Text weight="semibold" style={[TYPE.body, { color: ink }]}>{label}</Text> : null}
      </Tile>
      {!selected && waiting ? <CountBadge count={waiting} size="sm" style={{ position: "absolute", top: -2, right: -2 }} /> : null}
    </Pressable>
  );
}
