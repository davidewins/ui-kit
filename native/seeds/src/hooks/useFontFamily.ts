// App-owned. Seeded once by ui-kit for apps that only ship Geist; an app with
// a font picker (VOID, demo) keeps its own, which must export the same two names.
export type FontWeight =
  | "thin"
  | "extralight"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

const GEIST: Record<FontWeight, string> = {
  thin: "Geist-Thin",
  extralight: "Geist-ExtraLight",
  light: "Geist-Light",
  regular: "Geist-Regular",
  medium: "Geist-Medium",
  semibold: "Geist-SemiBold",
  bold: "Geist-Bold",
  extrabold: "Geist-ExtraBold",
  black: "Geist-Black",
};

const geist = (weight: FontWeight) => GEIST[weight];

/** weight -> registered fontFamily. */
export function useFontFamily() {
  return geist;
}
