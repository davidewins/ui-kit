// Gallery-only: the two pieces every social screen shares. The network marks
// in their own colours, and the hrefs between the screens (the lead rewires
// these when the routes are final).
import { SocialMark } from "@/apps/tkvr/components/SocialMark";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { View } from "react-native";
import type { Network } from "./data";

export const HREF = {
  profile: "/screens/social/account-profile",
  insights: "/screens/social/account-insights",
  feed: "/screens/social/account-feed",
  inbox: "/screens/social/inbox",
  thread: "/screens/social/thread",
  activity: "/screens/social/activity",
} as const;

// Brand marks keep their brand colour. X, Threads and TikTok are black on
// white (white on black in dark mode), so they follow the text colour.
const BRAND: Partial<Record<Network, string>> = { instagram: "#E1306C", youtube: "#FF0000" };

/** A network's colour for its marks and for the data drawn about it. */
export function useNetworkColor() {
  const colors = useThemeColors();
  const hues = useHues();
  return (network: Network) => BRAND[network] ?? (network === "threads" ? hues.gray : colors.text);
}

/** The network's mark in a filled circle. `ring` carves it out of whatever it
 *  overlaps (an avatar's corner). */
export function NetworkBadge({ network, size = 22, ring = false }: { network: Network; size?: number; ring?: boolean }) {
  const colors = useThemeColors();
  const fill = BRAND[network] ?? colors.text;
  const ink = BRAND[network] ? "#fff" : colors.background;
  const edge = ring ? 2 : 0;
  return (
    <View
      style={{
        width: size + edge * 2,
        height: size + edge * 2,
        borderRadius: size / 2 + edge,
        borderWidth: edge,
        borderColor: colors.background,
        backgroundColor: fill,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SocialMark network={network} size={Math.round(size * 0.56)} color={ink} />
    </View>
  );
}
