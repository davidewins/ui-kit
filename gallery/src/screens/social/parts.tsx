// Gallery-only: the pieces every social screen shares. The network marks in
// their own colours, the hrefs between the screens (the lead rewires these
// when the routes are final), the clip for rows inside a flush Panel, and
// copy to the clipboard for the long-press menus.
import { SocialMark } from "@/apps/tkvr/components/SocialMark";
import { useHues } from "@/hooks/useHues";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Toast } from "@/lib/toast";
import type { ReactNode } from "react";
import { Share, View } from "react-native";
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
 *  overlaps (an avatar's corner); `on` is the colour behind it when that is
 *  a Panel and not the page. */
export function NetworkBadge({ network, size = 22, ring = false, on }: { network: Network; size?: number; ring?: boolean; on?: string }) {
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
        borderColor: on ?? colors.background,
        backgroundColor: fill,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SocialMark network={network} size={Math.round(size * 0.56)} color={ink} />
    </View>
  );
}

/** Rows inside `<Panel flush>`: clips their pressed fill to the panel's
 *  corners. The Panel cannot clip itself, it would cut off its own shadow. */
export function PanelRows({ children }: { children: ReactNode }) {
  return <View style={{ borderRadius: 23, borderCurve: "continuous", overflow: "hidden" }}>{children}</View>;
}

/** Copy from a long-press menu, the way the kit's CopyButton does it: the
 *  share sheet stands in on a build made before expo-clipboard was added. */
export async function copyText(value: string, done = "Copied") {
  try {
    const Clipboard = require("expo-clipboard") as typeof import("expo-clipboard");
    await Clipboard.setStringAsync(value);
    Toast.success(done);
  } catch {
    Share.share({ message: value }).catch(() => {});
  }
}
