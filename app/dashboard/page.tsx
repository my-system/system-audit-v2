"use client";
import { useState } from "react";
import { Shell } from "@/components/layout/shell";
import { TabOverview } from "@/components/dashboard/tab-overview";
import { TabAnalytics } from "@/components/dashboard/tab-analytics";
import { TabTransactions } from "@/components/dashboard/tab-transactions";
import { TabGraph } from "@/components/dashboard/tab-graph";
import { TabAIInsights } from "@/components/dashboard/tab-ai-insights";
import { useDashboardStore } from "@/lib/store";
import { useDashboardData } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";
import type { DateRange, RiskLevel, DetectionMethod } from "@/types";

const tabs = [
  { id: "overview", label: "Overview", desc: "Kondisi sistem" },
  { id: "analytics", label: "Analytics", desc: "Charts & trends" },
  { id: "transactions", label: "Transactions", desc: "Tabel data" },
  { id: "graph", label: "Graph", desc: "Network viz" },
  { id: "ai-insights", label: "AI Insights", desc: "AI analysis" },
];

const dateOptions: { label: string; value: DateRange }[] = [
  { label: "Hari Ini", value: "today" },
  { label: "7 Hari", value: "7d" },
  { label: "30 Hari", value: "30d" },
  { label: "90 Hari", value: "90d" },
];

const riskOptions: { label: string; value: RiskLevel | "all" }[] = [
  { label: "Semua", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const methodOptions: { label: string; value: DetectionMethod | "all" }[] = [
  { label: "Semua", value: "all" },
  { label: "Z-Score", value: "z-score" },
  { label: "IQR", value: "iqr" },
  { label: "Isolation Forest", value: "isolation-forest" },
  { label: "Circular", value: "circular" },
  { label: "Hybrid", value: "hybrid" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { filters, setDateRange, setRiskLevel, setLocation, setSelectedMethod, resetFilters } = useDashboardStore();
  const { availableLocations, kpis } = useDashboardData();

  return (
    <Shell title="Dashboard" subtitle="Sentinel Audit Platform — Real-time Financial Crime Detection">
      {/* Global Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5 p-3 rounded-2xl bg-[#111827] border border-[#1e2d45]">
        <div className="flex items-center gap-2 text-xs text-[#64748b]">
          <span className="font-semibold text-[#e2e8f0]">Filter:</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#475569] font-semibold uppercase">Date:</span>
          <select
            value={filters.dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="text-xs bg-[#0d1626] border border-[#1e2d45] text-[#94a3b8] rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500/50"
          >
            {dateOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#475569] font-semibold uppercase">Risk:</span>
          <select
            value={filters.riskLevel}
            onChange={(e) => setRiskLevel(e.target.value as RiskLevel | "all")}
            className="text-xs bg-[#0d1626] border border-[#1e2d45] text-[#94a3b8] rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500/50"
          >
            {riskOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#475569] font-semibold uppercase">Lokasi:</span>
          <select
            value={filters.location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-xs bg-[#0d1626] border border-[#1e2d45] text-[#94a3b8] rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500/50"
          >
            {availableLocations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#475569] font-semibold uppercase">Metode:</span>
          <select
            value={filters.selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value as DetectionMethod | "all")}
            className="text-xs bg-[#0d1626] border border-[#1e2d45] text-[#94a3b8] rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500/50"
          >
            {methodOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <button onClick={resetFilters} className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
          Reset
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">
            {kpis.totalTransactions.toLocaleString()} tx • {kpis.totalAlerts} alerts
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-5 bg-[#111827] border border-[#1e2d45] rounded-2xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-0.5 py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 shadow-[0_0_12px_rgba(6,182,212,0.1)]"
                : "text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1a2235]"
            )}
          >
            <span className="font-semibold">{tab.label}</span>
            <span className={cn("text-[9px] hidden md:block", activeTab === tab.id ? "text-cyan-500/70" : "text-[#334155]")}>
              {tab.desc}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div key={activeTab}>
        {activeTab === "overview" && <TabOverview />}
        {activeTab === "analytics" && <TabAnalytics />}
        {activeTab === "transactions" && <TabTransactions />}
        {activeTab === "graph" && <TabGraph />}
        {activeTab === "ai-insights" && <TabAIInsights />}
      </div>
    </Shell>
  );
}
