// Gallery-only: the transition lab's screen options, one per route. Kept out
// of the layout so each recipe reads on its own.
import { interpolate } from "react-native-reanimated";
import Transition, { type ScreenTransitionConfig } from "react-native-screen-transitions";
import { MOTION_ICON } from "./icons";
import { HERO_RADIUS } from "./parts";

type Params = { id?: string } | undefined;

/** Photo zoom: the tile grows into the viewer's photo (its matching
 *  boundary); drag any way or pinch in to put it back. */
export const photoZoom: ScreenTransitionConfig = {
  gestureEnabled: true,
  gestureDirection: ["bidirectional", "pinch-in"],
  transitionSpec: Transition.Specs.Zoom,
  screenStyleInterpolator: ({ bounds, active }) => {
    "worklet";
    const id = (active.route.params as Params)?.id;
    if (!id) return null;
    return bounds(`photo-${id}`).navigation.zoom({ target: "bound", borderRadius: 0, backdropColor: "#000", backdropOpacity: 1 });
  },
};

/** Shared cover: the small cover becomes the playlist's hero cover. */
export const coverMorph: ScreenTransitionConfig = {
  gestureEnabled: true,
  gestureDirection: ["vertical", "horizontal"],
  transitionSpec: Transition.Specs.Zoom,
  screenStyleInterpolator: ({ bounds, active }) => {
    "worklet";
    const id = (active.route.params as Params)?.id;
    if (!id) return null;
    return bounds(`cover-${id}`).navigation.zoom({ target: "bound", borderRadius: HERO_RADIUS, backgroundScale: 0.94, backdropOpacity: 0.3 });
  },
};

/** A sheet with three detents; drag between them, tap outside to step down. */
export const snapSheet: ScreenTransitionConfig = {
  ...Transition.Presets.SlideFromBottom(),
  gestureEnabled: true,
  gestureDirection: "vertical",
  snapPoints: [0.4, 0.72, 0.92],
  initialSnapIndex: 0,
  backdropBehavior: "collapse",
  sheetScrollGestureBehavior: "collapse-only",
  screenStyleInterpolator: ({ progress, layouts: { screen }, next, current }) => {
    "worklet";
    if (next) {
      // The page under the sheet.
      return { content: { style: { transform: [{ scale: interpolate(progress, [1, 2], [1, 0.96], "clamp") }] } } };
    }
    const radius = interpolate(current.animatedSnapIndex, [1, 2], [28, 0], "clamp");
    return {
      content: {
        style: {
          transform: [{ translateY: interpolate(progress, [0, 1], [screen.height, 0], "clamp") }],
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderCurve: "continuous",
          overflow: "hidden",
        },
      },
      backdrop: { style: { backgroundColor: "#000", opacity: interpolate(progress, [0, 1], [0, 0.4], "clamp") } },
    };
  },
};

/** iOS-style card stack: the new card rises, the old one sinks and rounds. */
export const cardStack: ScreenTransitionConfig = {
  gestureEnabled: true,
  gestureDirection: "vertical",
  screenStyleInterpolator: ({ progress, layouts: { screen }, insets, next }) => {
    "worklet";
    if (next) {
      return {
        content: {
          style: {
            transform: [{ scale: interpolate(progress, [1, 2], [1, 0.92], "clamp") }],
            borderRadius: interpolate(progress, [1, 2], [0, 28], "clamp"),
            borderCurve: "continuous",
            overflow: "hidden",
          },
        },
      };
    }
    const top = insets.top + 12; // CARD_TOP in stack.tsx
    return {
      content: {
        style: {
          transform: [{ translateY: interpolate(progress, [0, 1], [screen.height, top], "clamp") }],
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderCurve: "continuous",
          overflow: "hidden",
        },
      },
      backdrop: { style: { backgroundColor: "#000", opacity: interpolate(progress, [0, 1], [0, 0.35], "clamp") } },
    };
  },
};

export const PRESETS = {
  "slide-top": { label: "Slide from the top", hint: "Swipe up", Icon: MOTION_ICON.fromTop, options: Transition.Presets.SlideFromTop() },
  "zoom-in": { label: "Zoom in", hint: "Back button only", Icon: MOTION_ICON.zoom, options: Transition.Presets.ZoomIn() },
  "slide-bottom": { label: "Slide from the bottom", hint: "Swipe down", Icon: MOTION_ICON.fromBottom, options: Transition.Presets.SlideFromBottom() },
  draggable: { label: "Draggable card", hint: "Drag anywhere", Icon: MOTION_ICON.drag, options: Transition.Presets.DraggableCard() },
  elastic: { label: "Elastic card", hint: "Stretches, snaps back", Icon: MOTION_ICON.elastic, options: Transition.Presets.ElasticCard() },
} as const;

export type PresetName = keyof typeof PRESETS;
