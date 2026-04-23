"use client";
import { KPICard } from "@/components/ui/kpi-card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { activityFeed } from "@/data/dummy";
import { formatCurrency, cn } from "@/lib/utils";
import { Play, Upload, FileText, SlidersHorizontal, AlertTriangle, CheckCircle2, Info } from "lucide-react";

const kpis = [
  { label: "Total Transaksi", value: "1,247", change: 12.3, changeType: "increase" as const, icon: "activity", color: "cyan" as const, subtitle: "Hari ini" },
  { label: "Alerts Hari Ini", value: "24", change: 37.1, changeType: "increase" as const, icon: "alert", color: "red" as const, subtitle: "8 belum ditinjau" },
  { label: "Amount Monitored", value: "Rp 48.7M", change: 8.5, changeType: "increase" as const, icon: "dollar", color: "green" as const, subtitle: "Total hari ini" },
  { label: "Unique Users", value: "387", change: -2.1, changeType: "decrease" as const, icon: "users", color: "purple" as const, subtitle: "Aktif hari ini" },
  { label: "System Health", value: "99.8%", icon: "shield", color: "green" as const, subtitle: "All systems operational" },
  { label: "AI Engine", value: "Active", icon: "cpu", color: "cyan" as const, subtitle: "Hybrid mode — 6 detectors" },
];

const quickActions = [
  { icon: Play, label: "Run Audit", color: "bg-cyan-500 hover:bg-cyan-400", textColor: "text-white" },
  { icon: Upload, label: "Upload CSV", color: "bg-[#1a2235] hover:bg-[#243450] border border-[#1e2d45]", textColor: "text-[#94a3b8]" },
  { icon: FileText, label: "Export Report", color: "bg-[#1a2235] hover:bg-[#243450] border border-[#1e2d45]", textColor: "text-[#94a3b8]" },
  { icon: SlidersHorizontal, label: "Adjust Threshold", color: "bg-[#1a2235] hover:bg-[#243450] border border-[#1e2d45]", textColor: "text-[#94a3b8]" },
];

const feedIcons: Record<string, { icon: typeof AlertTriangle; color: string }> = {
  alert: { icon: AlertTriangle, color: "text-red-400" },
  cluster: { icon: AlertTriangle, color: "text-orange-400" },
  upload: { icon: Upload, color: "text-cyan-400" },
  case: { icon: FileText, color: "text-purple-400" },
  export: { icon: FileText, color: "text-slate-400" },
  login: { icon: CheckCircle2, color: "text-emerald-400" },
};

export function TabOverview() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k) => (
          <KPICard key={k.label} {...k} />
        ))}
      </div>

      {/* Quick Actions + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="rounded-2xl border border-[#1e2d45] bg-[#111827] p-5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[#475569] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(({ icon: Icon, label, color, textColor }) => (
              <button key={label} className={cn("flex items-center gap-2 px-3 py-3 rounded-xl text-xs font-medium transition-all", color, textColor)}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* System Status Panel */}
          <div className="mt-4 pt-4 border-t border-[#1e2d45] space-y-2">
            {[
              { label: "PostgreSQL", status: "online" },
              { label: "FastAPI Engine", status: "online" },
              { label: "AI Hybrid Model", status: "online" },
              { label: "Redis Cache", status: "online" },
            ].map(({ label, status }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-[#64748b]">{label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium capitalize">{status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1e2d45] bg-[#111827] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e2d45]">
            <div className="flex items-center gap-2">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <h3 className="text-xs font-semibold text-[#e2e8f0]">Live Activity Feed</h3>
            </div>
            <span className="text-[10px] text-[#475569]">Auto-refresh 30s</span>
          </div>
          <div className="overflow-y-auto max-h-[320px]">
            {activityFeed.map((item, i) => {
              const conf = feedIcons[item.type] ?? feedIcons.login;
              const FIcon = conf.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 px-5 py-3 border-b border-[#1e2d45]/50 hover:bg-[#1a2235] transition-colors"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
                    item.severity === "critical" ? "bg-red-500/10" :
                    item.severity === "high" ? "bg-orange-500/10" : "bg-[#1a2235]"
                  )}>
                    <FIcon className={cn("w-3 h-3", conf.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#94a3b8] leading-relaxed">{item.message}</p>
                  </div>
                  <span className="text-[10px] text-[#475569] font-mono flex-shrink-0 mt-0.5">{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alert Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { level: "critical", count: 4, label: "Critical Alerts", desc: "Butuh tindakan segera", color: "border-red-500/30 bg-red-500/5" },
          { level: "high", count: 8, label: "High Alerts", desc: "Perlu investigasi", color: "border-orange-500/30 bg-orange-500/5" },
          { level: "medium", count: 7, label: "Medium Alerts", desc: "Dalam pemantauan", color: "border-yellow-500/30 bg-yellow-500/5" },
          { level: "low", count: 5, label: "Low Alerts", desc: "Sudah ditinjau", color: "border-emerald-500/30 bg-emerald-500/5" },
        ].map(({ level, count, label, desc, color }) => (
          <div key={level} className={cn("rounded-2xl border p-4 flex items-center gap-4", color)}>
            <div className="text-2xl font-bold text-[#e2e8f0]">{count}</div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <RiskBadge value={level} />
              </div>
              <p className="text-[10px] text-[#64748b]">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
