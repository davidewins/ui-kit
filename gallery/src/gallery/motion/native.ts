// Gallery-only: the native stack's built-in animations, grouped for the Push
// styles page. `anim` is react-native-screens' StackAnimationTypes.
import type { LucideIcon } from "lucide-react-native";
import { MOTION_ICON } from "./icons";

type Anim = "default" | "fade" | "fade_from_bottom" | "slide_from_bottom" | "slide_from_left" | "simple_push" | "ios_from_left" | "none";

export const NATIVE_ANIMATIONS: { title: string; items: { anim: Anim; label: string; note: string; Icon: LucideIcon }[] }[] = [
  {
    title: "Push",
    items: [
      { anim: "default", label: "iOS push", note: "Parallax, swipe back", Icon: MOTION_ICON.fromRight },
      { anim: "simple_push", label: "Simple push", note: "No parallax", Icon: MOTION_ICON.fromRight },
      { anim: "ios_from_left", label: "iOS push from the left", note: "Mirrored", Icon: MOTION_ICON.fromLeft },
      { anim: "slide_from_left", label: "Slide from the left", note: "Flat slide", Icon: MOTION_ICON.fromLeft },
    ],
  },
  {
    title: "Fade and rise",
    items: [
      { anim: "fade", label: "Cross-fade", note: "200 ms", Icon: MOTION_ICON.fade },
      { anim: "fade_from_bottom", label: "Fade up", note: "Android style", Icon: MOTION_ICON.fromBottom },
      { anim: "slide_from_bottom", label: "Slide up", note: "Covers the page", Icon: MOTION_ICON.fromBottom },
      { anim: "none", label: "Instant", note: "No animation", Icon: MOTION_ICON.none },
    ],
  },
];

export const isAnim = (v: unknown): v is Anim => NATIVE_ANIMATIONS.some((g) => g.items.some((i) => i.anim === v));
