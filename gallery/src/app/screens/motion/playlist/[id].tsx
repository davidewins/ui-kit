import { playlistById } from "@/gallery/motion/data";
import { HeroArt, PlaylistHeader, TrackList } from "@/gallery/motion/parts";
import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

// Destination of the native zoom: the hero is the zoom target, so the cover
// in the grid lands exactly here and returns there on the way back.
export default function NativePlaylist() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = playlistById(id);
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <PlaylistHeader
        p={p}
        art={
          <Link.AppleZoomTarget>
            <HeroArt source={p.photo} />
          </Link.AppleZoomTarget>
        }
      />
      <TrackList tracks={p.tracks} />
    </ScrollView>
  );
}
