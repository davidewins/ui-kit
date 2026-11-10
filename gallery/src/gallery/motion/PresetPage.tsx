// Gallery-only: the page each preset in the transition lab opens.
import { PLAYLISTS } from "./data";
import { PRESETS, type PresetName } from "./lab";
import { HeroArt, LabPage, PlaylistHeader, TrackList } from "./parts";

export function PresetPage({ name }: { name: PresetName }) {
  const p = PLAYLISTS[(Object.keys(PRESETS).indexOf(name) + 1) % PLAYLISTS.length];
  return (
    <LabPage title={PRESETS[name].label}>
      <PlaylistHeader p={p} art={<HeroArt source={p.photo} />} />
      <TrackList tracks={p.tracks} />
    </LabPage>
  );
}
