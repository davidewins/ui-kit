// The bar at the bottom of a thread: an attach button, a text field that
// grows with the message up to five lines, and a send button that lights up
// once there is something to send. Both pieces are glass, because messages
// scroll underneath. The screen places it (a sibling after the ScrollView,
// pinned to the bottom) and pads its list by the height `onHeight` reports.
// It carries no keyboard handling of its own: the screen it sits in decides
// that, as the apps' chat screens do. Not a search field or a form input.
import { GlassSurface } from "@/components/GlassSurface";
import { useFontFamily } from "@/hooks/useFontFamily";
import { useThemeColors } from "@/hooks/useThemeColors";
import * as Haptics from "expo-haptics";
import { ArrowUp, Plus } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { TextInput } from "../primitives/TextInput";
import { TYPE } from "../primitives/type";

const H = 44;
const LINE = TYPE.body.lineHeight;
const MAX_LINES = 5;
const PAD_Y = (H - LINE) / 2;

export interface ComposerProps {
  value: string;
  onChangeText: (text: string) => void;
  /** Called with the trimmed text. Clear `value` yourself. */
  onSend: (text: string) => void;
  /** Leave out to hide the attach button. */
  onAttach?: () => void;
  placeholder?: string;
  /** The bar's full height whenever it changes, for the list's bottom padding. */
  onHeight?: (height: number) => void;
  /** Space under the bar: the home indicator inset. */
  bottomInset?: number;
}

export function Composer({ value, onChangeText, onSend, onAttach, placeholder = "Message", onHeight, bottomInset = 8 }: ComposerProps) {
  const colors = useThemeColors();
  const fontFamily = useFontFamily();
  const [inputHeight, setInputHeight] = useState<number>(LINE);
  const text = value.trim();
  const canSend = text.length > 0;
  const glass = { borderRadius: H / 2, borderCurve: "continuous" as const, overflow: "hidden" as const, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border };
  return (
    <View
      onLayout={(e) => onHeight?.(e.nativeEvent.layout.height)}
      style={{ flexDirection: "row", alignItems: "flex-end", columnGap: 8, paddingHorizontal: 12, paddingTop: 8, paddingBottom: bottomInset }}
    >
      {onAttach ? (
        <Pressable
          onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            onAttach();
          }}
          accessibilityRole="button"
          accessibilityLabel="Attach"
          hitSlop={6}
        >
          <GlassSurface fill isInteractive style={[glass, { width: H, height: H, alignItems: "center", justifyContent: "center" }]}>
            <Plus size={22} color={colors.text} strokeWidth={2} />
          </GlassSurface>
        </Pressable>
      ) : null}
      <GlassSurface fill style={[glass, { flex: 1, minHeight: H, flexDirection: "row", alignItems: "flex-end" }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          multiline
          maxLength={2000}
          textAlignVertical="top"
          accessibilityLabel={placeholder}
          onContentSizeChange={(e) => setInputHeight(Math.min(LINE * MAX_LINES, Math.max(LINE, e.nativeEvent.contentSize.height)))}
          style={[
            TYPE.body,
            {
              flex: 1,
              height: inputHeight,
              marginVertical: PAD_Y,
              marginLeft: 16,
              marginRight: 8,
              padding: 0,
              color: colors.text,
              fontFamily: fontFamily("medium"),
            },
          ]}
        />
        <Pressable
          disabled={!canSend}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            onSend(text);
          }}
          accessibilityRole="button"
          accessibilityLabel="Send"
          accessibilityState={{ disabled: !canSend }}
          hitSlop={8}
          style={{ width: 32, height: 32, borderRadius: 16, margin: 6, alignItems: "center", justifyContent: "center", backgroundColor: canSend ? colors.text : colors.border }}
        >
          <ArrowUp size={18} color={canSend ? colors.background : colors.muted} strokeWidth={2.6} />
        </Pressable>
      </GlassSurface>
    </View>
  );
}
