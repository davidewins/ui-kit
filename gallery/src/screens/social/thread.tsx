// One conversation, the way iMessage and WhatsApp lay a thread out: runs of
// bubbles with tightened corners, the time and read state under the last of
// a run, a photo, a quoted reply, and the composer floating on glass over the
// messages. What only this thread has is the deal it is about, pinned as a
// card at the top: what was agreed, for how much, and when it is due.
//
// Keyboard: VOID, RIDERS, SELLERS and TKVR all wrap their chat screen in
// `KeyboardAvoidingView behavior="padding"` (keyboardVerticalOffset 90 on
// iOS). That wrapper is deliberately NOT here: the kit rule is no keyboard
// handling until David asks for it. Add the same wrapper around the outer
// View when this becomes a real screen.
import { Text, View } from "@/components/ui";
import { HeaderIconButton } from "@/components/ui/actions/HeaderIconButton";
import { Badge } from "@/components/ui/feedback/Badge";
import { Composer } from "@/components/ui/messaging/Composer";
import { MessageBubble } from "@/components/ui/messaging/MessageBubble";
import { Avatar } from "@/components/ui/primitives/Avatar";
import { TABULAR, TYPE } from "@/components/ui/primitives/type";
import { Card } from "@/components/ui/surfaces/Card";
import { euro } from "@/gallery/demo/data";
import { GUTTER } from "@/gallery/demo/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { FileText } from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEAL, THREAD, type ThreadItem } from "./data";
import { NetworkBadge } from "./parts";

export default function Thread() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const scroll = useRef<React.ElementRef<typeof ScrollView>>(null);
  const [items, setItems] = useState<ThreadItem[]>(THREAD);
  const [draft, setDraft] = useState("");
  const [bar, setBar] = useState(64);

  const send = (text: string) => {
    setItems((all) => [...all, { type: "message", id: `sent${all.length}`, from: "me", text, time: "14:40", status: "delivered" }]);
    setDraft("");
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
          headerRight: () => <HeaderIconButton icon={FileText} accessibilityLabel="Brief and contract" onPress={() => Toast.info("Brief and contract")} />,
        }}
      />
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scroll}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingTop: 8, paddingBottom: bar + 8 }}
          onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}
        >
          <View style={{ paddingHorizontal: GUTTER }}>
            <Card raised className="p-3" accessibilityLabel={`${DEAL.product}, ${euro(DEAL.fee)}, ${DEAL.status}`}>
              <View style={{ flexDirection: "row", alignItems: "center", columnGap: 12 }}>
                <Image source={DEAL.photo} style={{ width: 52, height: 52, borderRadius: 12 }} contentFit="cover" />
                <View style={{ flex: 1, rowGap: 2 }}>
                  <Text weight="semibold" numberOfLines={1} style={TYPE.headline}>{DEAL.product}</Text>
                  <Text weight="medium" numberOfLines={1} style={[TYPE.sub, TABULAR, { color: colors.muted }]}>{`${DEAL.deliverables}, due ${DEAL.due}`}</Text>
                </View>
                <View style={{ alignItems: "flex-end", rowGap: 4 }}>
                  <Text weight="semibold" style={[TYPE.headline, TABULAR]}>{euro(DEAL.fee).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                  <Badge variant="success">{DEAL.status}</Badge>
                </View>
              </View>
            </Card>
          </View>

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
                <MessageBubble
                  key={item.id}
                  side={item.from === "me" ? "sent" : "received"}
                  position={above && below ? "middle" : above ? "last" : below ? "first" : "single"}
                  text={item.text}
                  image={item.photo ? { source: item.photo, aspect: item.aspect, label: "Photo of the shoe" } : undefined}
                  reply={item.reply}
                  time={below ? undefined : item.time}
                  status={below || item.from !== "me" ? undefined : item.status}
                />
              );
            })}
          </View>
        </ScrollView>
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
          <Composer value={draft} onChangeText={setDraft} onSend={send} onAttach={() => Toast.info("Photo, file or rate card")} placeholder={`Message ${DEAL.contact.split(" ")[0]}`} onHeight={setBar} bottomInset={insets.bottom || 10} />
        </View>
      </View>
    </>
  );
}
