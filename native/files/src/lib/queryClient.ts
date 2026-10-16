// lib/queryClient.ts
import { DefaultOptions, QueryClient } from "@tanstack/react-query";
// import * as Sentry from "@sentry/react-native";

const defaultOptions: DefaultOptions = {
  queries: {
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    networkMode: "online",
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    networkMode: "online",
  },
};

export const queryClient = new QueryClient({
  defaultOptions,
});

// Helper functions
export const clearQueryCache = () => {
  queryClient.clear();
};

export const invalidateQueries = (queryKey: string[]) => {
  queryClient.invalidateQueries({ queryKey });
};
