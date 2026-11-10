// One conversation, the way iMessage and WhatsApp lay a thread out: runs of
// bubbles with tightened corners, the time and read state under the last of
// a run, a photo, a quoted reply, and the composer floating on glass over the
// messages. What only this thread has is the deal it is about, as a raised
// card at the top: what was agreed, for how much, and when it is due, with
// the full terms folded under it.
//
// Native pieces: the header menu (ActionMenu), long press on a bubble
// (ContextMenu: reply, copy, unsend), the deal's terms (Disclosure) and the
// confirms before unsending or blocking (ConfirmDialog).
//
// Keyboard: VOID, RIDERS, SELLERS and TKVR all wrap their chat screen in
// `KeyboardAvoidingView behavior="padding"` (keyboardVerticalOffset 90 on
// iOS). That wrapper is deliberately NOT here: the kit rule is no keyboard
// handling until David asks for it. Add the same wrapper around the outer
// View when this becomes a real screen.
import { Text, View } from "@/components/ui";
import { ActionMenu } from "@/components/ui/actions/ActionMenu";
import { ContextMenu, type ContextMenuAction } from "@/components/ui/actions/ContextMenu";
import { Badge } from "@/components/ui/feedback/Badge";
import { Disclosure } from "@/components/ui/lists/Disclosure";
import { Composer } from "@/components/ui/messaging/Composer";
import { MessageBubble } from "@/components/ui/messaging/MessageBubble";
import { ConfirmDialog } from "@/components/ui/overlays/ConfirmDialog";
import { Avatar } from "@/components/ui/primitives/Avatar";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Panel } from "@/components/ui/surfaces/Panel";
import { euro } from "@/gallery/demo/data";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { FileText } from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEAL, THREAD, type ThreadItem } from "./data";
import { NetworkBadge, copyText } from "./parts";

type Message = Extract<ThreadItem, { type: "message" }>;
const FEE = euro(DEAL.fee).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const FIRST_NAME = DEAL.contact.split(" ")[0];
// The deal in full. Usage and the giveaway pair were settled in the thread below.
const TERMS: [string, string][] = [
  ["Fee", FEE],
  ["You deliver", DEAL.deliverables],
  ["Their ad usage", "30 days"],
  ["Giveaway", "A second pair"],
  ["Due", DEAL.due],
];

export default function Thread() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const scroll = useRef<React.ElementRef<typeof ScrollView>>(null);
  const [items, setItems] = useState<ThreadItem[]>(THREAD);
  const [draft, setDraft] = useState("");
  const [bar, setBar] = useState(64);
  const [replyTo, setReplyTo] = useState<{ author: string; text: string } | null>(null);
  const [unsending, setUnsending] = useState<Message | null>(null);
  const [blocking, setBlocking] = useState(false);

  const send = (text: string) => {
    setItems((all) => [...all, { type: "message", id: `sent${all.length}`, from: "me", text, reply: replyTo ?? undefined, time: "14:40", status: "delivered" }]);
    setDraft("");
    setReplyTo(null);
  };

  const actionsFor = (m: Message): ContextMenuAction[] => {
    const said = m.text ?? "Photo";
    return [
      { label: "Reply", systemImage: "arrowshape.turn.up.left", onPress: () => setReplyTo({ author: m.from === "me" ? "You" : DEAL.brand, text: said }) },
      ...(m.text ? [{ label: "Copy", systemImage: "doc.on.doc" as const, onPress: () => copyText(said, "Message copied") }] : []),
      ...(m.photo ? [{ label: "Save photo", systemImage: "square.and.arrow.down" as const, onPress: () => Toast.success("Saved to Photos") }] : []),
      ...(m.from === "me" ? [{ label: "Unsend", systemImage: "arrow.uturn.backward.circle" as const, destructive: true, onPress: () => setUnsending(m) }] : []),
    ];
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: DEAL.brand,
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 10 }}>
              <Avatar name={DEAL.brand} source={DEAL.photo} size={34} badge={<NetworkBadge network="instagram" size={14} ring />} />
              <View>
                <Text weight="semibold" numberOfLines={1} style={TYPE.body}>{DEAL.brand}</Text>
                <Text weight="medium" numberOfLines={1} style={[TYPE.caption, { color: colors.muted }]}>{`${DEAL.contact}, active now`}</Text>
              </View>
            </View>
          ),
        }}
      />
      <ActionMenu
        accessibilityLabel="Conversation actions"
        title={DEAL.brand}
        buttons={[{ label: "Brief and contract", systemImage: "doc.text", icon: FileText, onPress: () => Toast.info("Brief and contract") }]}
        actions={[
          { label: "Open on Instagram", systemImage: "arrow.up.right.square", onPress: () => Toast.info("Opening Instagram") },
          { label: "Mark as unread", systemImage: "envelope.badge", onPress: () => Toast.success("Marked as unread") },
          { label: "Mute", systemImage: "bell.slash", onPress: () => Toast.info(`${DEAL.brand} muted`) },
          { label: `Block ${DEAL.brand}`, systemImage: "hand.raised", destructive: true, onPress: () => setBlocking(true) },
        ]}
      />
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scroll}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingTop: 8, paddingBottom: bar + 8 }}
          onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}
        >
          <Panel>
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }} accessibilityLabel={`${DEAL.product}, ${FEE}, ${DEAL.status}`}>
              <Image source={DEAL.photo} style={{ width: 52, height: 52, borderRadius: 12 }} contentFit="cover" />
              <View style={{ flex: 1, rowGap: 2 }}>
                <Text weight="semibold" numberOfLines={1} style={TYPE.headline}>{DEAL.product}</Text>
                <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${DEAL.deliverables}, due ${DEAL.due}`}</Text>
              </View>
              <View style={{ alignItems: "flex-end", rowGap: 4 }}>
                <Text weight="semibold" style={[TYPE.headline, TABULAR]}>{FEE}</Text>
                <Badge variant="success">{DEAL.status}</Badge>
              </View>
            </View>
            <View style={{ marginTop: 12 }}>
              <Disclosure title="What was agreed">
                <View style={{ paddingTop: 8, rowGap: 8 }}>
                  {TERMS.map(([label, value]) => (
                    <View key={label} style={{ flexDirection: "row", justifyContent: "space-between", columnGap: 12 }}>
                      <Text weight="medium" style={TYPE.body}>{label}</Text>
                      <Text weight="semibold" style={[TYPE.body, TABULAR]}>{value}</Text>
                    </View>
                  ))}
                </View>
              </Disclosure>
            </View>
          </Panel>

          <View style={{ paddingHorizontal: 12 }}>
            {items.map((item, i) => {
              if (item.type === "day") {
                return (
                  <Text key={item.label} weight="medium" style={[TYPE.caption, TABULAR, { color: colors.muted, textAlign: "center", marginTop: 18, marginBottom: 2 }]}>
                    {item.label}
                  </Text>
                );
              }
              const prev = items[i - 1];
              const next = items[i + 1];
              const above = prev?.type === "message" && prev.from === item.from;
              const below = next?.type === "message" && next.from === item.from;
              return (
                <ContextMenu key={item.id} actions={actionsFor(item)}>
                  <MessageBubble
                    side={item.from === "me" ? "sent" : "received"}
                    position={above && below ? "middle" : above ? "last" : below ? "first" : "single"}
                    text={item.text}
                    image={item.photo ? { source: item.photo, aspect: item.aspect, label: "Photo of the shoe" } : undefined}
                    reply={item.reply}
                    time={below ? undefined : item.time}
                    status={below || item.from !== "me" ? undefined : item.status}
                  />
                </ContextMenu>
              );
            })}
          </View>
        </ScrollView>
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
          <Composer value={draft} onChangeText={setDraft} onSend={send} onAttach={() => Toast.info("Photo, file or rate card")} placeholder={replyTo ? `Reply to ${replyTo.author === "You" ? "yourself" : replyTo.author}` : `Message ${FIRST_NAME}`} onHeight={setBar} bottomInset={insets.bottom || 10} />
        </View>
      </View>
      <ConfirmDialog
        visible={!!unsending}
        onClose={() => setUnsending(null)}
        variant="sheet"
        title="Unsend this message?"
        message={`It disappears for you and for ${FIRST_NAME}. It may already have been read.`}
        confirmLabel="Unsend"
        destructive
        onConfirm={() => {
          if (!unsending) return;
          setItems((all) => all.filter((it) => it.type !== "message" || it.id !== unsending.id));
          Toast.success("Message unsent");
        }}
      />
      <ConfirmDialog
        visible={blocking}
        onClose={() => setBlocking(false)}
        title={`Block ${DEAL.brand}?`}
        message={`They can no longer message you on Instagram. The ${DEAL.product} deal stays ${DEAL.status.toLowerCase()} until you cancel it.`}
        confirmLabel="Block"
        destructive
        onConfirm={() => Toast.success(`${DEAL.brand} blocked`)}
      />
    </>
  );
}
