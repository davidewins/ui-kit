// Period selector for the Analytics tab. Set from the calendar headerLeft;
// read by every analytics hook so they re-query when the user picks a new
// range. Default = last 7 days because that's the cadence operators look at.

import { create } from "zustand";

export type AnalyticsPeriod = 7 | 30 | 90;

export const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
  7: "Last 7 days",
  30: "Last 30 days",
  90: "Last 90 days",
};

interface AnalyticsPeriodState {
  periodDays: AnalyticsPeriod;
  setPeriod: (p: AnalyticsPeriod) => void;
}

export const useAnalyticsPeriodStore = create<AnalyticsPeriodState>((set) => ({
  periodDays: 7,
  setPeriod: (p) => set({ periodDays: p }),
}));
