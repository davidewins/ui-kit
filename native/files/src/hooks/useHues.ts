import { useMemo } from "react";
import { useCSSVariable } from "uniwind";

/**
 * The data colours (tokens.json hue-*): for charts, rings, gauges, category
 * marks and avatars. Never for buttons, selection or other chrome, which stay
 * black and white, and never in place of the status colours (success, warning,
 * error) when a colour is saying good or bad.
 */
export function useHues() {
  const blue = useCSSVariable("--color-hue-blue") as string;
  const green = useCSSVariable("--color-hue-green") as string;
  const red = useCSSVariable("--color-hue-red") as string;
  const orange = useCSSVariable("--color-hue-orange") as string;
  const yellow = useCSSVariable("--color-hue-yellow") as string;
  const teal = useCSSVariable("--color-hue-teal") as string;
  const cyan = useCSSVariable("--color-hue-cyan") as string;
  const mint = useCSSVariable("--color-hue-mint") as string;
  const pink = useCSSVariable("--color-hue-pink") as string;
  const gray = useCSSVariable("--color-hue-gray") as string;
  return useMemo(
    () => ({ blue, green, red, orange, yellow, teal, cyan, mint, pink, gray }),
    [blue, green, red, orange, yellow, teal, cyan, mint, pink, gray],
  );
}

export type Hue = keyof ReturnType<typeof useHues>;
