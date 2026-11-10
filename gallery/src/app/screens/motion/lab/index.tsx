import { View } from "@/components/ui";
import { SectionTitle } from "@/components/ui/lists/SectionTitle";
import { SETTINGS_GROUP, SettingsGroup } from "@/components/ui/lists/SettingsGroup";
import { SettingsRow } from "@/components/ui/lists/SettingsRow";
import { LAB_PHOTOS, PLAYLISTS } from "@/gallery/motion/data";
import { MOTION_ICON } from "@/gallery/motion/icons";
import { PRESETS, type PresetName } from "@/gallery/motion/lab";
import { COVER_RADIUS, CoverArt, CoverCaption, EDGE, GAP, LabPage } from "@/gallery/motion/parts";
import { haptic } from "@/lib/haptics";
import { Image } from "expo-image";
import { type Href, router } from "expo-router";
import { useWindowDimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Transition from "react-native-screen-transitions";

const PHOTO_GAP = 2;

// SettingsRow fires its own haptic, so rows only navigate.
const go = (href: string) => () => router.push(href as Href);
// Boundaries are plain pressables: they add the tap haptic themselves.
const open = (href: string) => () => {
  haptic("selection");
  router.push(href as Href);
};

// Every transition react-native-screen-transitions does, on one page: bounds
// zoom from a photo grid, a shared cover into a playlist, the five presets,
// a snap sheet and a custom card stack.
export default function Lab() {
  const { width } = useWindowDimensions();
  const cell = Math.floor((width - EDGE * 2 - PHOTO_GAP * 2) / 3);
  // Two and a half covers, so the row shows it scrolls.
  const cover = Math.floor((width - EDGE * 2 - GAP * 2) / 2.5);

  return (
    <LabPage title="Transition lab" back="Transitions">
      <SectionTitle>Zoom a photo</SectionTitle>
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: PHOTO_GAP, marginHorizontal: EDGE, marginBottom: SETTINGS_GROUP.marginBottom }}>
        {LAB_PHOTOS.map((src, i) => (
          <Transition.Boundary key={i} id={`photo-${i}`} onPress={open(`/screens/motion/lab/photo/${i}`)} accessibilityRole="button" accessibilityLabel={`Open photo ${i + 1} of ${LAB_PHOTOS.length}`}>
            <Image source={src} style={{ width: cell, height: cell, borderRadius: COVER_RADIUS }} contentFit="cover" transition={120} />
          </Transition.Boundary>
        ))}
      </View>

      <SectionTitle>Shared cover</SectionTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: EDGE, gap: GAP }} style={{ marginBottom: SETTINGS_GROUP.marginBottom }}>
        {PLAYLISTS.map((p) => (
          <Transition.Boundary key={p.id} id={`cover-${p.id}`} onPress={open(`/screens/motion/lab/playlist/${p.id}`)} style={{ width: cover }} accessibilityRole="button" accessibilityLabel={`${p.title}, ${p.curator}`}>
            <Transition.Boundary.Target>
              <CoverArt source={p.photo} size={cover} />
            </Transition.Boundary.Target>
            <CoverCaption p={p} />
          </Transition.Boundary>
        ))}
      </ScrollView>

      <SectionTitle>Presets</SectionTitle>
      <SettingsGroup>
        {(Object.keys(PRESETS) as PresetName[]).map((k) => (
          <SettingsRow key={k} label={PRESETS[k].label} Icon={PRESETS[k].Icon} trailing={PRESETS[k].hint} navigates onPress={go(`/screens/motion/lab/preset-${k}`)} />
        ))}
      </SettingsGroup>

      <SectionTitle>Sheets and stacks</SectionTitle>
      <SettingsGroup>
        <SettingsRow label="Snap sheet" Icon={MOTION_ICON.sheet} trailing="40%, 72%, 92%" navigates onPress={go("/screens/motion/lab/sheet")} />
        <SettingsRow label="Card stack" Icon={MOTION_ICON.stack} trailing="Swipe down" navigates onPress={go("/screens/motion/lab/stack")} />
      </SettingsGroup>
    </LabPage>
  );
}
