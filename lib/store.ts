import { create } from "zustand";
import type { Transaction, Alert, Case, FilterState, DateRange, RiskLevel, DetectionMethod } from "@/types";
import { generateSeedData, CURRENT_DATE } from "./seed";
import { processRiskEngine, generateAlerts, generateCases } from "./engine";

// ── Initialize Data Once ─────────────────────────────────────────────────────
const rawTransactions = generateSeedData();
const allTransactions = processRiskEngine(rawTransactions);
const allAlerts = generateAlerts(allTransactions);
const allCases = generateCases(allTransactions);

const DEFAULT_FILTERS: FilterState = {
  dateRange: "30d",
  riskLevel: "all",
  location: "Semua Kota",
  selectedMethod: "all",
  threshold: 0,
};

interface DashboardStore {
  // Raw data
  allTransactions: Transaction[];
  allAlerts: Alert[];
  allCases: Case[];
  currentDate: string;

  // Filters
  filters: FilterState;

  // Actions
  setDateRange: (range: DateRange) => void;
  setRiskLevel: (level: RiskLevel | "all") => void;
  setLocation: (location: string) => void;
  setSelectedMethod: (method: DetectionMethod | "all") => void;
  setThreshold: (threshold: number) => void;
  resetFilters: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  allTransactions,
  allAlerts,
  allCases,
  currentDate: CURRENT_DATE,
  filters: DEFAULT_FILTERS,

  setDateRange: (dateRange) =>
    set((s) => ({ filters: { ...s.filters, dateRange } })),

  setRiskLevel: (riskLevel) =>
    set((s) => ({ filters: { ...s.filters, riskLevel } })),

  setLocation: (location) =>
    set((s) => ({ filters: { ...s.filters, location } })),

  setSelectedMethod: (selectedMethod) =>
    set((s) => ({ filters: { ...s.filters, selectedMethod } })),

  setThreshold: (threshold) =>
    set((s) => ({ filters: { ...s.filters, threshold } })),

  resetFilters: () =>
    set({ filters: DEFAULT_FILTERS }),
}));
