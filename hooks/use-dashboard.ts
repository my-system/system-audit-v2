"use client";
import { useMemo } from "react";
import { useDashboardStore } from "@/lib/store";
import {
  filterTransactions,
  computeKPIs,
  computeDailyTrend,
  computeHourlyTrend,
  computeLocationData,
  computeRiskDistribution,
  computeGraphData,
  computeCircularFlows,
  computeAIInsights,
  computeRecommendations,
  computeExplainability,
  computeActivityFeed,
  computeAvailableLocations,
} from "@/lib/calculations";
import type {
  Transaction, KPIStats, ChartDataPoint, HourlyDataPoint,
  LocationDataPoint, RiskDistributionPoint, GraphNode, GraphEdge,
  CircularFlow, AIInsight, AIRecommendation, ExplainabilityFactor,
  ActivityFeedItem, Alert, Case,
} from "@/types";

export function useDashboardData() {
  const { allTransactions, allAlerts, allCases, filters } = useDashboardStore();

  const filteredTransactions = useMemo(
    () => filterTransactions(allTransactions, filters),
    [allTransactions, filters]
  );

  const filteredAlerts = useMemo(
    () => {
      const txIds = new Set(filteredTransactions.map((t) => t.id));
      return allAlerts.filter((a) => txIds.has(a.txId));
    },
    [filteredTransactions, allAlerts]
  );

  const filteredCases = useMemo(
    () => {
      const userIds = new Set(filteredTransactions.map((t) => t.senderId));
      return allCases.filter((c) => userIds.has(c.userId));
    },
    [filteredTransactions, allCases]
  );

  const kpis = useMemo(
    () => computeKPIs(filteredTransactions, allTransactions, filters),
    [filteredTransactions, allTransactions, filters]
  );

  const dailyTrend = useMemo(
    () => computeDailyTrend(filteredTransactions),
    [filteredTransactions]
  );

  const hourlyTrend = useMemo(
    () => computeHourlyTrend(filteredTransactions),
    [filteredTransactions]
  );

  const locationData = useMemo(
    () => computeLocationData(filteredTransactions),
    [filteredTransactions]
  );

  const riskDistribution = useMemo(
    () => computeRiskDistribution(filteredTransactions),
    [filteredTransactions]
  );

  const graphData = useMemo(
    () => computeGraphData(filteredTransactions),
    [filteredTransactions]
  );

  const circularFlows = useMemo(
    () => computeCircularFlows(filteredTransactions),
    [filteredTransactions]
  );

  const aiInsights = useMemo(
    () => computeAIInsights(filteredTransactions, kpis),
    [filteredTransactions, kpis]
  );

  const recommendations = useMemo(
    () => computeRecommendations(kpis, aiInsights),
    [kpis, aiInsights]
  );

  const activityFeed = useMemo(
    () => computeActivityFeed(filteredTransactions, filteredAlerts, filteredCases),
    [filteredTransactions, filteredAlerts, filteredCases]
  );

  const availableLocations = useMemo(
    () => computeAvailableLocations(allTransactions),
    [allTransactions]
  );

  const topRiskTransaction = useMemo(
    () => {
      const flagged = filteredTransactions.filter((t) => t.isFlagged);
      return flagged.length > 0
        ? flagged.reduce((a, b) => (a.riskScore > b.riskScore ? a : b))
        : null;
    },
    [filteredTransactions]
  );

  const topRiskExplainability = useMemo(
    () => topRiskTransaction ? computeExplainability(topRiskTransaction) : [],
    [topRiskTransaction]
  );

  return {
    filteredTransactions,
    filteredAlerts,
    filteredCases,
    kpis,
    dailyTrend,
    hourlyTrend,
    locationData,
    riskDistribution,
    graphData,
    circularFlows,
    aiInsights,
    recommendations,
    activityFeed,
    availableLocations,
    topRiskTransaction,
    topRiskExplainability,
  };
}
