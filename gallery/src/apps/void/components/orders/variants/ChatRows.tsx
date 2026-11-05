// The order's conversations, with the unread count that the tab badge and the
// profile row already use. Renders bare rows: the variant decides what surface
// they sit on.
import { Text } from "@/components/ui";
import { CountBadge } from "@/components/ui/feedback/CountBadge";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { ChevronRight, MessageCircle } from "lucide-react-native";
import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { VariantChat } from "./useVariantOrder";

export const ChatRows: FC<{
  chats: VariantChat[];
  onOpen: (cid: string) => void;
  /** Left inset for the separators, matched to the row's icon gutter. */
  separatorInset?: number;
}> = ({ chats, onOpen, separatorInset = 52 }) => {
  const colors = useThemeColors();

  return (
    <>
      {chats.map((chat, i) => (
        <View key={chat.cid}>
          {i > 0 ? (
            <View
              style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: colors.border,
                marginLeft: separatorInset,
              }}
            />
          ) : null}
          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              onOpen(chat.cid);
            }}
            accessibilityRole="button"
            accessibilityLabel={chat.label}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingHorizontal: 16,
              height: 52,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <View style={{ width: 24, alignItems: "center" }}>
              <MessageCircle size={19} color={colors.muted} strokeWidth={1.9} />
            </View>
            <Text
              weight="medium"
              className="flex-1"
              style={{ fontSize: 15, letterSpacing: -0.2 }}
              numberOfLines={1}
            >
              {chat.label}
            </Text>
            <CountBadge count={chat.unread} style={{ marginRight: 8 }} />
            <ChevronRight size={16} color={colors.muted} strokeWidth={2} />
          </Pressable>
        </View>
      ))}
    </>
  );
};
