import { View } from "@/components/ui";
import { PLAYLISTS } from "@/gallery/motion/data";
import { HeroArt, LabHeader, PlaylistHeader, TrackList } from "@/gallery/motion/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Transition from "react-native-screen-transitions";

const P = PLAYLISTS[4];
const CARD_TOP = 12;

// Card stack: this card rises over the lab, which sinks and rounds. The card
// already sits below the status bar (the transition moves it down by the top
// inset), so its header adds no inset; close is an X because it drops down.
export default function LabStack() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <LabHeader title={P.title} close inset={false} />
      <Transition.ScrollView contentContainerStyle={{ paddingBottom: insets.top + CARD_TOP + insets.bottom + 24 }}>
        <PlaylistHeader p={P} art={<HeroArt source={P.photo} />} />
        <TrackList tracks={P.tracks} />
      </Transition.ScrollView>
    </View>
  );
}
