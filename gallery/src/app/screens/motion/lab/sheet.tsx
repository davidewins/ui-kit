import { Text, View } from "@/components/ui";
import { PLAYLISTS } from "@/gallery/motion/data";
import { EDGE, TrackList, styles } from "@/gallery/motion/parts";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Transition from "react-native-screen-transitions";

const P = PLAYLISTS[2];

// Snap sheet: opens at 40%, drag to 72% or 92%. Dragging the list only
// collapses it; expanding starts from the grabber. Tap outside to step down.
export default function LabSheet() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ alignItems: "center", paddingTop: 8, paddingBottom: 12, paddingHorizontal: EDGE }}>
        <View style={{ width: 36, height: 5, borderRadius: 3, backgroundColor: colors.border }} />
        <Text weight="semibold" style={[styles.headline, { marginTop: 12 }]}>Up next</Text>
        <Text weight="medium" style={[styles.secondary, { color: colors.muted, marginTop: 2 }]}>{`From ${P.title}`}</Text>
      </View>
      <Transition.ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <TrackList tracks={P.tracks} />
      </Transition.ScrollView>
    </View>
  );
}
