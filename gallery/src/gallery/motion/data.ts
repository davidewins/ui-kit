// Gallery-only: the playlists every Transitions page opens, so the native zoom,
// the push styles and the transition lab all move between the same content.
import { PHOTO } from "@/gallery/demo/data";

export interface Track {
  title: string;
  artist: string;
  time: string;
}

export interface Playlist {
  id: string;
  title: string;
  curator: string;
  photo: number;
  tracks: Track[];
}

const T = (title: string, artist: string, time: string): Track => ({ title, artist, time });

export const PLAYLISTS: Playlist[] = [
  {
    id: "heavy",
    title: "Heavy",
    curator: "Lifting, 140 bpm",
    photo: PHOTO.barbell,
    tracks: [
      T("Concrete", "Halden", "3:42"),
      T("Plate Weight", "Sister Volt", "4:05"),
      T("No Spotter", "Kilnfield", "3:18"),
      T("Grip", "Halden", "2:56"),
      T("Lockout", "Ora Mire", "4:31"),
      T("Chalk", "Sister Volt", "3:27"),
      T("Last Rep", "Kilnfield", "5:02"),
    ],
  },
  {
    id: "tempo",
    title: "Tempo",
    curator: "Running, 170 bpm",
    photo: PHOTO.shoeRed,
    tracks: [
      T("Split Time", "Neon Harbour", "3:12"),
      T("Negative", "Lumen Drift", "3:48"),
      T("Threshold", "Neon Harbour", "4:20"),
      T("Kick", "Paloma Ray", "2:59"),
      T("Bell Lap", "Lumen Drift", "3:35"),
    ],
  },
  {
    id: "long",
    title: "Long Run",
    curator: "Running, easy pace",
    photo: PHOTO.shoeWhite,
    tracks: [
      T("Coastline", "Fen Hollow", "5:44"),
      T("Mile Nine", "Paloma Ray", "4:51"),
      T("Second Wind", "Fen Hollow", "6:02"),
      T("Headwind", "Marlo Kade", "4:17"),
      T("Home Straight", "Paloma Ray", "5:20"),
    ],
  },
  {
    id: "flow",
    title: "Flow",
    curator: "Yoga and stretching",
    photo: PHOTO.yoga,
    tracks: [
      T("Low Tide", "Ilse Morrow", "6:10"),
      T("Breath Count", "Saltwater Hymn", "5:33"),
      T("Open Hands", "Ilse Morrow", "7:02"),
      T("Dusk", "Saltwater Hymn", "6:45"),
    ],
  },
  {
    id: "burn",
    title: "Burn",
    curator: "Intervals, 40 on 20 off",
    photo: PHOTO.hiit,
    tracks: [
      T("Forty On", "Static Garden", "2:48"),
      T("Twenty Off", "Vex Lowry", "3:01"),
      T("Redline", "Static Garden", "3:14"),
      T("Final Round", "Vex Lowry", "2:39"),
      T("Burnout", "Kilnfield", "3:22"),
      T("Collapse", "Static Garden", "4:10"),
    ],
  },
  {
    id: "iron",
    title: "Iron",
    curator: "Gym floor, all day",
    photo: PHOTO.gym,
    tracks: [
      T("Rack Pull", "Ora Mire", "3:55"),
      T("Mirror Wall", "Halden", "4:12"),
      T("Superset", "Sister Volt", "3:08"),
      T("Cooldown", "Ora Mire", "5:30"),
    ],
  },
  {
    id: "core",
    title: "Core",
    curator: "Floor work, 15 minutes",
    photo: PHOTO.core,
    tracks: [
      T("Hollow Hold", "Vex Lowry", "2:30"),
      T("Plank Line", "Lumen Drift", "3:04"),
      T("Dead Bug", "Vex Lowry", "2:47"),
      T("Brace", "Lumen Drift", "3:19"),
    ],
  },
  {
    id: "studio",
    title: "Studio",
    curator: "Focus, no lyrics",
    photo: PHOTO.headphones,
    tracks: [
      T("Quiet Room", "Marlo Kade", "4:44"),
      T("Desk Lamp", "Fen Hollow", "3:58"),
      T("Long Draft", "Marlo Kade", "5:16"),
      T("Late Edit", "Ilse Morrow", "4:29"),
      T("Save As", "Fen Hollow", "3:41"),
    ],
  },
];

export const playlistById = (id?: string) => PLAYLISTS.find((p) => p.id === id) ?? PLAYLISTS[0];

/** "7 songs, 27 min" from the track times. */
export function playlistMeta(p: Playlist) {
  const secs = p.tracks.reduce((n, t) => {
    const [m, s] = t.time.split(":").map(Number);
    return n + m * 60 + s;
  }, 0);
  return `${p.tracks.length} songs, ${Math.round(secs / 60)} min`;
}

/** The transition lab's photo grid and viewer: one list, read by both. */
export const LAB_PHOTOS = [PHOTO.barbell, PHOTO.shoeRed, PHOTO.yoga, PHOTO.hiit, PHOTO.headphones, PHOTO.shoeWhite, PHOTO.gym, PHOTO.camera, PHOTO.core];
