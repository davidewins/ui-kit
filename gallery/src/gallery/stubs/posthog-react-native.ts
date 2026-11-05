// Gallery: no analytics. usePostHog returns undefined, which every caller
// already guards with posthog?.
type PostHog = {
  capture: (event: string, props?: Record<string, unknown>) => void;
  identify: (id: string, props?: Record<string, unknown>) => void;
  reset: () => void;
  screen: (name: string, props?: Record<string, unknown>) => void;
};
export function usePostHog(): PostHog | undefined {
  return undefined;
}
export type { PostHog };
