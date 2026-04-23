"use client";
import { useState } from "react";
import { Shell } from "@/components/layout/shell";
import { TabOverview } from "@/components/dashboard/tab-overview";
import { TabAnalytics } from "@/components/dashboard/tab-analytics";
import { TabTransactions } from "@/components/dashboard/tab-transactions";
import { TabGraph } from "@/components/dashboard/tab-graph";
import { TabAIInsights } from "@/components/dashboard/tab-ai-insights";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview",      label: "Overview",      desc: "Kondisi sistem" },
  { id: "analytics",    label: "Analytics",     desc: "Charts & trends" },
  { id: "transactions", label: "Transactions",  desc: "Tabel data" },
  { id: "graph",        label: "Graph",         desc: "Network viz" },
  { id: "ai-insights",  label: "AI Insights",   desc: "AI analysis" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Shell title="Dashboard" subtitle="Sentinel Audit Platform — Real-time Financial Crime Detection">
      {/* Global Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5 p-3 rounded-2xl bg-[#111827] border border-[#1e2d45]">
        <div className="flex items-center gap-2 text-xs text-[#64748b]">
          <span className="font-semibold text-[#e2e8f0]">Filter:</span>
        </div>
        {[
          { label: "Date", options: ["Hari Ini", "7 Hari", "30 Hari", "90 Hari"] },
          { label: "Risk", options: ["Semua", "Critical", "High", "Medium", "Low"] },
          { label: "Lokasi", options: ["Semua Kota", "Jakarta", "Surabaya", "Bandung", "Medan"] },
          { label: "Metode", options: ["Semua", "Z-Score", "IQR", "Isolation Forest", "Circular", "Hybrid"] },
        ].map(({ label, options }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#475569] font-semibold uppercase">{label}:</span>
            <select className="text-xs bg-[#0d1626] border border-[#1e2d45] text-[#94a3b8] rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500/50">
              {options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="relative flex w-2 h-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] text-emerald-400 font-medium">Live — Auto refresh 30s</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-5 bg-[#111827] border border-[#1e2d45] rounded-2xl p-1">
        {tabs.map(tab => (
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
        {activeTab === "overview"      && <TabOverview />}
        {activeTab === "analytics"     && <TabAnalytics />}
        {activeTab === "transactions"  && <TabTransactions />}
        {activeTab === "graph"         && <TabGraph />}
        {activeTab === "ai-insights"   && <TabAIInsights />}
      </div>
    </Shell>
  );
}
