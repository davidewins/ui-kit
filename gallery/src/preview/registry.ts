// The screens the browser preview can open, by the path after the host.
// Each loads on demand, so a page that needs a native module never breaks
// the others. One part file per area, so they can be edited side by side.
import type { ComponentType } from "react";
import { PART as calendar } from "./parts/calendar";
import { PART as core } from "./parts/core";
import { PART as shop } from "./parts/shop";
import { PART as social } from "./parts/social";

type Loader = () => { default: ComponentType };
export type PreviewPart = Record<string, { title: string; load: Loader }>;

export const REGISTRY: PreviewPart = { ...core, ...calendar, ...social, ...shop };
