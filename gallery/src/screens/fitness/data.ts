// One athlete's week, shared by every fitness screen so the numbers agree.
import { PHOTO, WORKOUTS } from "@/gallery/demo/data";

export const GOALS = { move: 600, train: 45, stand: 12 } as const;

/** Mon..Sun. Today is Thursday (index 3); later days have not happened. */
export const WEEK = [
  { day: "M", date: 9, move: 640, train: 47, stand: 12 },
  { day: "T", date: 10, move: 380, train: 16, stand: 10 },
  { day: "W", date: 11, move: 290, train: 0, stand: 11 },
  { day: "T", date: 12, move: 420, train: 32, stand: 9 },
  { day: "F", date: 13, move: 0, train: 0, stand: 0 },
  { day: "S", date: 14, move: 0, train: 0, stand: 0 },
  { day: "S", date: 15, move: 0, train: 0, stand: 0 },
] as const;
export const TODAY = 3;

export const NEXT = { ...WORKOUTS[0], photo: PHOTO.barbell, kcal: 420, at: "18:30" };

export const TRENDS = [
  { label: "Move", figure: "432", unit: "kcal a day", change: "9%", direction: "up", good: true, values: [360, 372, 390, 381, 402, 418, 409, 432], hue: "pink" },
  { label: "Train", figure: "31", unit: "min a day", change: "24%", direction: "up", good: true, values: [22, 24, 21, 26, 25, 29, 28, 31], hue: "green" },
  { label: "Resting heart rate", figure: "54", unit: "bpm", change: "3 bpm", direction: "down", good: true, values: [59, 58, 58, 57, 57, 56, 55, 54], hue: "red" },
  { label: "Sleep", figure: "6 h 48", unit: "a night", change: "24 min", direction: "down", good: false, values: [7.4, 7.3, 7.2, 7.3, 7.0, 6.9, 7.0, 6.8], hue: "cyan" },
] as const;

/** The live session: back squat, 4 sets of 6. */
export const SESSION = {
  workout: "Lower body power",
  exercise: "Back squat",
  position: "1 of 5",
  elapsed: "12:40",
  rest: { left: 84, of: 150 },
  heart: { now: 142, zone: "Zone 3" },
  sets: [
    { n: 1, weight: 80, reps: 6, rpe: 7, done: true, last: "77.5 × 6" },
    { n: 2, weight: 80, reps: 6, rpe: 8, done: true, last: "77.5 × 6" },
    { n: 3, weight: 80, reps: 6, rpe: null, done: false, last: "77.5 × 5" },
    { n: 4, weight: 80, reps: 6, rpe: null, done: false, last: "75 × 6" },
  ],
  queue: [
    { name: "Romanian deadlift", plan: "3 × 8", load: "70 kg" },
    { name: "Walking lunge", plan: "3 × 10", load: "16 kg" },
    { name: "Hip thrust", plan: "3 × 10", load: "90 kg" },
    { name: "Calf raise", plan: "3 × 15", load: "40 kg" },
  ],
} as const;

/** Minutes in each heart-rate zone for the finished session. */
export const ZONES = [
  { label: "Zone 1", minutes: 4 },
  { label: "Zone 2", minutes: 9 },
  { label: "Zone 3", minutes: 21 },
  { label: "Zone 4", minutes: 10 },
  { label: "Zone 5", minutes: 3 },
] as const;

export const HEART_RATE = [92, 104, 118, 131, 126, 139, 148, 141, 133, 152, 158, 147, 139, 150, 163, 155, 142, 136, 149, 157, 151, 138, 127, 118, 109];

export const SUMMARY = {
  minutes: 47,
  kcal: 438,
  volume: 6840,
  avgHeart: 138,
  maxHeart: 163,
  byExercise: [
    { label: "Back squat", value: 1920, display: "1,920 kg", detail: "4 × 6 at 80" },
    { label: "Hip thrust", value: 2700, display: "2,700 kg", detail: "3 × 10 at 90" },
    { label: "Romanian deadlift", value: 1680, display: "1,680 kg", detail: "3 × 8 at 70" },
    { label: "Walking lunge", value: 480, display: "480 kg", detail: "3 × 10 at 16" },
    { label: "Calf raise", value: 60, display: "60 kg", detail: "1 × 15 at 40, cut short" },
  ],
  records: [
    { lift: "Back squat", what: "Heaviest set of 6", figure: "80 kg", was: "77.5 kg" },
    { lift: "Hip thrust", what: "Most volume", figure: "2,700 kg", was: "2,550 kg" },
  ],
} as const;

/** 16 weeks of training days, oldest first, Mon..Sun. 0 = rest, 1 = long session. */
export const CONSISTENCY: number[][] = [
  [0.6, 0, 0.4, 0, 0.7, 0, 0], [0.5, 0.3, 0, 0.6, 0, 0, 0.2], [0.7, 0, 0.5, 0, 0.8, 0.3, 0], [0, 0.6, 0, 0.5, 0, 0, 0],
  [0.8, 0, 0.6, 0.2, 0.7, 0, 0.3], [0.7, 0.4, 0, 0.6, 0.9, 0, 0], [0.6, 0, 0.7, 0, 0.8, 0.5, 0], [0.9, 0.3, 0, 0.7, 0, 0, 0.4],
  [0.7, 0, 0.8, 0, 0.9, 0, 0], [0, 0, 0, 0.3, 0, 0, 0], [0.8, 0.5, 0, 0.7, 0.9, 0.2, 0], [0.9, 0, 0.7, 0.4, 0.8, 0, 0.5],
  [0.8, 0.6, 0, 0.9, 0.7, 0, 0], [1, 0, 0.8, 0, 0.9, 0.6, 0], [0.9, 0.5, 0.7, 0, 1, 0, 0.4], [1, 0.4, 0, 0.7, 0, 0, 0],
];

export const VOLUME_WEEKS = [
  { label: "22 Sep", value: 9.8 }, { label: "29", value: 11.2 }, { label: "6 Oct", value: 6.4 }, { label: "13", value: 11.2 },
  { label: "20", value: 13.8 }, { label: "27", value: 12.9 }, { label: "3 Nov", value: 14.1 }, { label: "10", value: 15.4 },
];

export const LIFTS = [
  { name: "Back squat", unit: "kg", values: [88, 90, 90, 92.5, 94, 93, 96, 98, 97, 100, 103, 106], best: "100 × 3", when: "2 days ago" },
  { name: "Bench press", unit: "kg", values: [66, 67, 68, 68, 70, 71, 70, 72, 74, 75, 76, 77], best: "72.5 × 3", when: "6 days ago" },
  { name: "Deadlift", unit: "kg", values: [118, 120, 124, 122, 126, 130, 129, 133, 136, 135, 140, 143], best: "130 × 3", when: "9 days ago" },
  { name: "Overhead press", unit: "kg", values: [41, 42, 42, 43, 44, 44, 45, 46, 46, 47, 48, 48], best: "45 × 4", when: "3 weeks ago" },
];

export const MUSCLES = [
  { label: "Legs", value: 46, display: "46 sets" },
  { label: "Back", value: 31, display: "31 sets" },
  { label: "Chest", value: 24, display: "24 sets" },
  { label: "Shoulders", value: 18, display: "18 sets" },
  { label: "Arms", value: 12, display: "12 sets", detail: "under your 16 target" },
  { label: "Core", value: 9, display: "9 sets" },
];
