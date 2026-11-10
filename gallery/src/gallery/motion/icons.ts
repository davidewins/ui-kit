// Gallery-only: one icon per direction of motion, shared by the Push styles
// page and the transition lab so the same motion always has the same arrow.
import { ArrowDownFromLine, ArrowLeftFromLine, ArrowRightFromLine, ArrowUpFromLine, Blend, CircleOff, Layers, Move, PanelBottom, Waves, ZoomIn } from "lucide-react-native";

export const MOTION_ICON = {
  fromRight: ArrowLeftFromLine,
  fromLeft: ArrowRightFromLine,
  fromBottom: ArrowUpFromLine,
  fromTop: ArrowDownFromLine,
  fade: Blend,
  none: CircleOff,
  zoom: ZoomIn,
  drag: Move,
  elastic: Waves,
  sheet: PanelBottom,
  stack: Layers,
} as const;
