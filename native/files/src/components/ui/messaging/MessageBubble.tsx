// One message in a thread. Sent bubbles sit on the right in the text colour
// (black in light, white in dark) with inverted text; received bubbles sit on
// the left in the surface grey. Messages in a row from the same person form a
// run: pass `position` and the corners between them tighten, as in iMessage.
// A bubble can carry a photo, a quote of the message it replies to, or both
// with text. Give `time` (and `status` for sent ones) only to the last bubble
// of a run. Not for system lines ("Today", "Sinéad joined"): write those as
// centred caption text between bubbles.
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image, type ImageProps } from "expo-image";
import { Check, CheckCheck } from "lucide-react-native";
import { View } from "react-native";
import { Text } from "../primitives/Text";
import { TABULAR, TYPE } from "../primitives/type";

const R = 20;
const TIGHT = 6;
const PHOTO_W = 236;

export interface MessageBubbleProps {
  side: "sent" | "received";
  text?: string;
  /** Where it sits in a run of messages from the same person. */
  position?: "single" | "first" | "middle" | "last";
  /** A photo, drawn edge to edge at the top of the bubble. */
  image?: { source: ImageProps["source"]; /** width / height */ aspect?: number; label?: string };
  /** The message this one answers, quoted above the text. */
  reply?: { author: string; text: string };
  /** Written under the bubble: "14:32". */
  time?: string;
  /** Sent messages only, beside the time. */
  status?: "sent" | "delivered" | "read";
}

export function MessageBubble({ side, text, position = "single", image, reply, time, status }: MessageBubbleProps) {
  const colors = useThemeColors();
  const sent = side === "sent";
  const fill = sent ? colors.text : colors.surface;
  const ink = sent ? colors.background : colors.text;
  const joinsAbove = position === "middle" || position === "last";
  const joinsBelow = position === "middle" || position === "first";
  const corners = sent
    ? { borderTopRightRadius: joinsAbove ? TIGHT : R, borderBottomRightRadius: joinsBelow ? TIGHT : R }
    : { borderTopLeftRadius: joinsAbove ? TIGHT : R, borderBottomLeftRadius: joinsBelow ? TIGHT : R };
  const statusLabel = status === "read" ? "Read" : status === "delivered" ? "Delivered" : status === "sent" ? "Sent" : null;
  const StatusIcon = status === "sent" ? Check : CheckCheck;
  return (
    <View
      style={{ alignItems: sent ? "flex-end" : "flex-start", marginTop: joinsAbove ? 2 : 10 }}
      accessibilityLabel={`${sent ? "You" : "Them"}: ${[reply ? `replying to ${reply.author}` : null, image ? (image.label ?? "photo") : null, text, time, statusLabel].filter(Boolean).join(", ")}`}
    >
      <View style={[{ maxWidth: "78%", borderRadius: R, borderCurve: "continuous", overflow: "hidden", backgroundColor: fill }, corners]}>
        {image ? (
          <Image source={image.source} style={{ width: PHOTO_W, aspectRatio: image.aspect ?? 1 }} contentFit="cover" transition={120} />
        ) : null}
        {reply || text ? (
          <View style={{ paddingHorizontal: 14, paddingVertical: 9, rowGap: 6, maxWidth: image ? PHOTO_W : undefined }}>
            {reply ? (
              <View style={{ flexDirection: "row", columnGap: 8 }}>
                <View style={{ width: 3, borderRadius: 1.5, backgroundColor: ink, opacity: 0.45 }} />
                <View style={{ flexShrink: 1, rowGap: 1 }}>
                  <Text weight="semibold" numberOfLines={1} style={[TYPE.sub, { color: ink }]}>
                    {reply.author}
                  </Text>
                  <Text weight="medium" numberOfLines={2} style={[TYPE.sub, { color: ink, opacity: 0.7 }]}>
                    {reply.text}
                  </Text>
                </View>
              </View>
            ) : null}
            {text ? (
              <Text weight="medium" style={[TYPE.body, { color: ink }]}>
                {text}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
      {time || statusLabel ? (
        <View style={{ flexDirection: "row", alignItems: "center", columnGap: 4, marginTop: 4, marginHorizontal: 4 }}>
          {statusLabel ? <StatusIcon size={13} color={status === "read" ? colors.text : colors.muted} strokeWidth={2.4} /> : null}
          <Text weight="medium" style={[TYPE.caption, TABULAR, { color: colors.muted }]}>
            {[statusLabel, time].filter(Boolean).join(" ")}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
