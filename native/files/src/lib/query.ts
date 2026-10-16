import { QueryClient } from "@tanstack/react-query";

// Retry transient network/timeout errors a couple of times with exponential
// backoff before surfacing the error UI. Don't retry 4xx (client) responses -
// they won't recover from a retry. 429 is the exception: it's a 4xx but
// recovers on its own after the rate-limit window, so we retry with a
// longer backoff matched to hq-node's sliding-window admin limiter (60/min).
//
// REVERTED (2026-05-19, TAK-674): the earlier aggressive-cache config
// (refetchOnMount: false, global placeholderData: prev) broke filter
// changes - old data stayed on screen and the new query never fired on
// mount. Default react-query behaviour is correct; do not override
// refetchOnMount globally, do not set placeholderData globally.

function isTransientError(err: unknown) {
  const msg = errorMessage(err);
  return (
    msg.includes("network request failed") ||
    msg.includes("failed to fetch") ||
    msg.includes("timeout") ||
    msg.includes("timed out") ||
    msg.includes("aborted") ||
    msg.includes("502") ||
    msg.includes("503") ||
    msg.includes("504")
  );
}

function isRateLimited(err: unknown) {
  const msg = errorMessage(err);
  return msg.includes("too many requests") || msg.includes("429");
}

function errorMessage(err: unknown): string {
  return (err instanceof Error ? err.message : String(err ?? "")).toLowerCase();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        if (isRateLimited(error)) return failureCount < 3;
        return isTransientError(error) && failureCount < 2;
      },
      retryDelay: (attempt, error) => {
        if (isRateLimited(error)) {
          return Math.min(5000 * 2 ** attempt, 30_000);
        }
        return Math.min(1000 * 2 ** attempt, 4000);
      },
    },
  },
});
