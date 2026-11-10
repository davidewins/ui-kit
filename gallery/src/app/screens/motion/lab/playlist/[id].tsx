import { playlistById } from "@/gallery/motion/data";
import { HeroArt, LabPage, PlaylistHeader, TrackList } from "@/gallery/motion/parts";
import { useLocalSearchParams } from "expo-router";
import Transition from "react-native-screen-transitions";

// Destination of the shared cover: the hero is the matching boundary, so the
// small cover lands here. Swipe down or right to send it back to the row.
export default function LabPlaylist() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = playlistById(id);
  return (
    <LabPage>
      <PlaylistHeader
        p={p}
        art={
          <Transition.Boundary id={`cover-${p.id}`}>
            <HeroArt source={p.photo} />
          </Transition.Boundary>
        }
      />
      <TrackList tracks={p.tracks} />
    </LabPage>
  );
}
