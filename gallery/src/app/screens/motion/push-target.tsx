import { PLAYLISTS } from "@/gallery/motion/data";
import { HeroArt, PlaylistHeader, TrackList } from "@/gallery/motion/parts";
import { ScrollView } from "react-native";

// The page every push style opens. The animation comes from the route's
// `anim` param (read in the root layout's options), not from this file.
export default function PushTarget() {
  const p = PLAYLISTS[1];
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <PlaylistHeader p={p} art={<HeroArt source={p.photo} />} />
      <TrackList tracks={p.tracks} />
    </ScrollView>
  );
}
