// ui-kit: copy of davidewins/ui-kit native/files/src/components/ui/lists/ConversationRow.tsx. Edit it there and sync; local edits fail ui-kit:check.
// One conversation in an inbox: who, the start of the last message, when,
// and whether there is something unread. Unread rows set the preview in the
// text colour and show the count (or a dot); read rows go quiet. The whole
// row fills when pressed, like SettingsRow. Put rows in a SettingsGroup with
// `separatorInset={CONVERSATION_ROW.separatorInset}` for the hairlines. Not
// for notifications ("X liked your post"): those have no thread to open.
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import type { ImageProps } from "expo-image";
import { type ReactNode, useState } from "react";
import { Pressable, View } from "react-native";
import { CountBadge } from "../feedback/CountBadge";
import { Avatar, type AvatarStatus } from "../primitives/Avatar";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";

const AVATAR = 52;
const PADDING = 16;
const GAP = 12;

export const CONVERSATION_ROW = {
  avatar: AVATAR,
  /** Where the hairline under a row starts: the name's x. */
  separatorInset: PADDING + AVATAR + GAP,
} as const;

export interface ConversationRowProps {
  name: string;
  /** Their photo; initials on a colour when missing. */
  source?: ImageProps["source"];
  /** The last message, as written. */
  preview: string;
  /** How many lines of the preview to show. */
  lines?: 1 | 2;
  /** "14:36", "Yesterday", "Sun". */
  time: string;
  /** A number draws the count; true draws a dot. */
  unread?: number | boolean;
  /** Sits on the avatar's corner: which network or channel it came from. */
  mark?: ReactNode;
  status?: AvatarStatus;
  onPress?: () => void;
}

export function ConversationRow({ name, source, preview, lines = 1, time, unread = false, mark, status, onPress }: ConversationRowProps) {
  const colors = useThemeColors();
  const [pressed, setPressed] = useState(false);
  const isUnread = unread === true || (typeof unread === "number" && unread > 0);
  return (
    <Pressable
      disabled={!onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${isUnread ? "unread, " : ""}${preview}, ${time}`}
      style={{
        flexDirection: "row",
        alignItems: "center",
        minHeight: 72,
        paddingVertical: 10,
        paddingHorizontal: PADDING,
        columnGap: GAP,
        backgroundColor: pressed ? colors.border : "transparent",
      }}
    >
      <Avatar name={name} source={source} size={AVATAR} status={status} badge={mark} />
      <View style={{ flex: 1, rowGap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", columnGap: 8 }}>
          <Text weight="semibold" numberOfLines={1} style={[TYPE.body, { flex: 1 }]}>
            {name}
          </Text>
          <Text weight={isUnread ? "semibold" : "medium"} style={[TYPE.sub, TABULAR, { color: isUnread ? colors.text : colors.muted }]}>
            {time}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-start", columnGap: 12 }}>
          <Text weight="medium" numberOfLines={lines} style={[TYPE.sub, { flex: 1, color: isUnread ? colors.text : colors.muted }]}>
            {preview}
          </Text>
          {typeof unread === "number" ? (
            <CountBadge count={unread} />
          ) : unread ? (
            <View accessibilityLabel="Unread" style={{ width: 10, height: 10, borderRadius: 5, marginTop: 4, backgroundColor: colors.error }} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
