// Every network's DMs in one list, the way Instagram's inbox reads but with
// the network on each face: unread first with two lines of the message, the
// rest below in one. The glass marks under the header filter to one network
// and show how many conversations are waiting there. The list itself stays
// flat, like Messages. Search is the native header search bar, the kit's
// pattern for screens.
//
// Native pieces: the header menu (ActionMenu), long press on a conversation
// (ContextMenu: read or unread, pin, mute, delete) and the confirm before
// deleting (ConfirmDialog).
import { EmptyState, Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ContextMenu } from "@/components/ui/actions/ContextMenu";
import { RoundButton } from "@/components/ui/actions/RoundButton";
import { CountBadge } from "@/components/ui/feedback/CountBadge";
import { CONVERSATION_ROW } from "@/components/ui/lists/ConversationRow";
import { SectionHeader } from "@/components/ui/lists/SectionHeader";
import { SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { Avatar } from "@/components/ui/primitives/Avatar";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
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
  // What long press changed: true is read, false is unread again.
  const [read, setRead] = useState<Record<string, boolean>>({});
  const [gone, setGone] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<Conversation | null>(null);

  const all = CONVERSATIONS.filter((c) => !gone.includes(c.id)).map((c) => ({ ...c, unread: read[c.id] === true ? 0 : read[c.id] === false ? Math.max(1, c.unread) : c.unread }));
  const needle = q.trim().toLowerCase();
  const shown = all.filter((c) => (filter === "all" || c.network === filter) && (!needle || c.name.toLowerCase().includes(needle) || c.preview.toLowerCase().includes(needle)));
  const unread = shown.filter((c) => c.unread > 0);
  const earlier = shown.filter((c) => c.unread === 0);
  const waiting = (f: Filter) => all.filter((c) => c.unread > 0 && (f === "all" || c.network === f)).length;

  const row = (c: Conversation) => (
    <ContextMenu
      key={c.id}
      actions={[
        c.unread
          ? { label: "Mark as read", systemImage: "envelope.open", onPress: () => setRead((r) => ({ ...r, [c.id]: true })) }
          : { label: "Mark as unread", systemImage: "envelope.badge", onPress: () => setRead((r) => ({ ...r, [c.id]: false })) },
        { label: "Pin to top", systemImage: "pin", onPress: () => Toast.success(`${c.name} pinned`) },
        { label: "Mute", systemImage: "bell.slash", onPress: () => Toast.info(`${c.name} muted`) },
        { label: "Delete", systemImage: "trash", destructive: true, onPress: () => setDeleting(c) },
      ]}
    >
      <InboxRow conversation={c} onPress={() => router.push(HREF.thread as Href)} />
    </ContextMenu>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Inbox",
          headerSearchBarOptions: state === "Empty" ? undefined : { placeholder: "Search people and messages", onChangeText: (e) => setQ(e.nativeEvent.text) },
        }}
      />
      <ActionMenu
        accessibilityLabel="Inbox actions"
        buttons={[{ label: "New message", systemImage: "square.and.pencil", icon: SquarePen, onPress: () => Toast.info("New message") }]}
        actions={
          state === "Empty"
            ? []
            : [
                { label: "Mark all as read", systemImage: "envelope.open", onPress: () => setRead(Object.fromEntries(CONVERSATIONS.map((c) => [c.id, true]))) },
                { label: "Message requests", systemImage: "tray", onPress: () => Toast.info("No new requests") },
                { label: "Muted conversations", systemImage: "bell.slash", onPress: () => Toast.info("Nothing muted") },
              ]
        }
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
            <View style={{ flexDirection: "row", columnGap: 8, paddingHorizontal: GUTTER, marginBottom: 12 }} accessibilityRole="tablist">
              {FILTERS.map((f) => (
                <NetworkFilter key={f} filter={f} selected={filter === f} waiting={waiting(f)} onPress={() => setFilter(f)} />
              ))}
            </View>

            {unread.length ? (
              <>
                <SectionHeader title={`${unread.length} unread`} first />
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
      <ConfirmDialog
        visible={!!deleting}
        onClose={() => setDeleting(null)}
        variant="sheet"
        title={deleting ? `Delete the conversation with ${deleting.name}?` : ""}
        message={deleting ? `It leaves your inbox here. ${deleting.name} still has it on ${NETWORK_LABEL[deleting.network]}.` : undefined}
        confirmLabel="Delete conversation"
        destructive
        onConfirm={() => {
          if (!deleting) return;
          setGone((g) => [...g, deleting.id]);
          Toast.success("Conversation deleted");
        }}
      />
    </>
  );
}

/** The kit's ConversationRow at the same metrics, with one text style per
 *  line: the name alone (the unread count is a mark at its end), then the
 *  message and its time in the same size and colour at the two ends. */
function InboxRow({ conversation: c, onPress }: { conversation: Conversation; onPress: () => void }) {
  const colors = useThemeColors();
  const [pressed, setPressed] = useState(false);
  const isUnread = c.unread > 0;
  const ink = isUnread ? colors.text : colors.muted;
  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={`${c.name}, ${isUnread ? "unread, " : ""}${c.preview}, ${c.time}`}
      style={{ flexDirection: "row", alignItems: "center", minHeight: 72, paddingVertical: 10, paddingHorizontal: GUTTER, columnGap: 12, backgroundColor: pressed ? colors.border : "transparent" }}
    >
      <Avatar name={c.name} source={c.photo} size={CONVERSATION_ROW.avatar} status={c.online ? "online" : undefined} badge={<NetworkBadge network={c.network} size={20} ring />} />
      <View style={{ flex: 1, rowGap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 8 }}>
          <Text weight="semibold" numberOfLines={1} style={[TYPE.body, { flex: 1 }]}>{c.name}</Text>
          <CountBadge count={c.unread} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-start", columnGap: 12 }}>
          <Text weight="medium" numberOfLines={isUnread ? 2 : 1} style={[TYPE.sub, { flex: 1, color: ink }]}>{c.preview}</Text>
          <Text weight="medium" style={[TYPE.sub, TABULAR, { color: ink }]}>{c.time}</Text>
        </View>
      </View>
    </Pressable>
  );
}

/** One network as a round glass mark (the kit's RoundButton). The chosen one
 *  is a solid pill that stretches to carry its name, so the row never needs
 *  a label beside it and the selection is never in doubt. */
function NetworkFilter({ filter, selected, waiting, onPress }: { filter: Filter; selected: boolean; waiting: number; onPress: () => void }) {
  const colors = useThemeColors();
  const label = filter === "all" ? "All" : NETWORK_LABEL[filter];
  const mark = (ink: string) => (filter === "all" ? <InboxIcon size={19} color={ink} strokeWidth={2} /> : <SocialMark network={filter} size={17} color={ink} />);
  if (selected) {
    return (
      <View
        accessibilityRole="tab"
        accessibilityLabel={`${label}, ${waiting} unread`}
        accessibilityState={{ selected: true }}
        style={{ height: 44, borderRadius: 22, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", columnGap: 8, backgroundColor: colors.text }}
      >
        {mark(colors.background)}
        <Text weight="semibold" style={[TYPE.body, { color: colors.background }]}>{label}</Text>
      </View>
    );
  }
  return (
    <View>
      <RoundButton accessibilityLabel={`${label}, ${waiting} unread`} onPress={onPress}>{mark(colors.text)}</RoundButton>
      {waiting ? <CountBadge count={waiting} size="sm" style={{ position: "absolute", top: -2, right: -2 }} /> : null}
    </View>
  );
}
