import { View } from "@/components/ui";
import { PLAYLISTS } from "@/gallery/motion/data";
import { CoverArt, CoverCaption, EDGE, GAP, useCoverWidth } from "@/gallery/motion/parts";
import { haptic } from "@/lib/haptics";
import { Toast } from "@/lib/toast";
import { Link } from "expo-router";
import { Pressable, ScrollView, Share } from "react-native";

// Apple's own zoom (Music, Photos): the cover grows into the playlist's hero
// and shrinks back into its tile; swipe down or from the edge and the page
// follows your finger. Press and hold a cover to peek, with Play, Shuffle
// and Share in the menu. iOS 18+, all native.
export default function NativeZoom() {
  const size = useCoverWidth();
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ paddingHorizontal: EDGE, paddingTop: 8, paddingBottom: 32 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: GAP, rowGap: GAP + 4 }}>
        {PLAYLISTS.map((p) => (
          <Link key={p.id} href={`/screens/motion/playlist/${p.id}`} asChild>
            <Link.Trigger>
              <Pressable onPress={() => haptic("selection")} accessibilityRole="link" accessibilityLabel={`${p.title}, ${p.curator}`} style={{ width: size }}>
                <Link.AppleZoom>
                  <CoverArt source={p.photo} size={size} />
                </Link.AppleZoom>
                <CoverCaption p={p} />
              </Pressable>
            </Link.Trigger>
            <Link.Preview />
            <Link.Menu>
              <Link.MenuAction title="Play" icon="play.fill" onPress={() => Toast.info(`Playing ${p.title}`)} />
              <Link.MenuAction title="Shuffle" icon="shuffle" onPress={() => Toast.info(`Shuffling ${p.title}`)} />
              <Link.MenuAction title="Share" icon="square.and.arrow.up" onPress={() => Share.share({ message: `${p.title}: ${p.curator}` })} />
            </Link.Menu>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}
