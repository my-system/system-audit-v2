"use client";
import { useState, useMemo } from "react";
import { useDashboardData } from "@/hooks/use-dashboard";
import { formatCurrency, cn } from "@/lib/utils";
import { Brain, Sparkles, AlertTriangle, TrendingUp, Users, MapPin, RefreshCw, ChevronRight, Shield, Zap, Activity } from "lucide-react";
import { RiskBadge } from "@/components/ui/risk-badge";

const iconMap: Record<string, any> = {
  AlertTriangle, TrendingUp, Users, MapPin, Activity, Shield, Zap, Brain,
};

const colorMap: Record<string, { border: string; icon: string; badge: string; bg: string }> = {
  critical: { border: "border-red-500/30", icon: "text-red-400", badge: "bg-red-500/10 text-red-400", bg: "bg-red-500/5" },
  high: { border: "border-orange-500/30", icon: "text-orange-400", badge: "bg-orange-500/10 text-orange-400", bg: "bg-orange-500/5" },
  medium: { border: "border-yellow-500/30", icon: "text-yellow-400", badge: "bg-yellow-500/10 text-yellow-400", bg: "bg-yellow-500/5" },
  low: { border: "border-emerald-500/30", icon: "text-emerald-400", badge: "bg-emerald-500/10 text-emerald-400", bg: "bg-emerald-500/5" },
};

export function TabAIInsights() {
  const { aiInsights, recommendations, topRiskTransaction, topRiskExplainability, kpis } = useDashboardData();
  const [loading, setLoading] = useState(false);

  const summaryStats = useMemo(() => ({
    patternsDetected: aiInsights.length,
    avgConfidence: aiInsights.length > 0 
      ? Math.round(aiInsights.reduce((sum, i) => sum + i.confidence, 0) / aiInsights.length) 
      : 0,
    riskyAccounts: kpis.criticalCount + kpis.highCount,
    monitoredValue: kpis.totalAmount,
  }), [aiInsights, kpis]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-bold text-[#e2e8f0]">AI Analysis Summary</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">HYBRID MODE</span>
              </div>
              <p className="text-xs text-[#64748b]">Generated: Real-time • Model: Sentinel AI v3.0 + Z-Score + Isolation Forest</p>
            </div>
          </div>
          <button onClick={handleRefresh} className={cn("flex items-center gap-2 px-3 py-2 rounded-xl text-xs bg-[#111827] border border-[#1e2d45] text-[#64748b] hover:text-cyan-400 transition-all", loading && "opacity-50")}>
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Regenerate
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { label: "Pattern Terdeteksi", value: summaryStats.patternsDetected.toString(), color: "text-red-400" },
            { label: "Confidence Rata-rata", value: `${summaryStats.avgConfidence}%`, color: "text-cyan-400" },
            { label: "Akun Berisiko", value: summaryStats.riskyAccounts.toString(), color: "text-orange-400" },
            { label: "Nilai Termonitor", value: formatCurrency(summaryStats.monitoredValue), color: "text-emerald-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#0d1626]/60 rounded-xl p-3">
              <p className="text-xs text-[#64748b] mb-1">{label}</p>
              <p className={cn("text-lg font-bold", color)}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#475569]">Insight Terdeteksi</h3>
        {aiInsights.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#64748b] bg-[#111827] rounded-2xl border border-[#1e2d45]">
            Tidak ada insight terdeteksi
          </div>
        ) : (
          aiInsights.map((insight) => {
            const c = colorMap[insight.type] ?? colorMap.medium;
            const Icon = iconMap[insight.icon] ?? AlertTriangle;
            return (
              <div key={insight.id} className={cn("rounded-2xl border bg-[#111827] p-5 hover:scale-[1.005] transition-all cursor-default", c.border, c.bg)}>
                <div className="flex items-start gap-4">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", c.badge)}>
                    <Icon className={cn("w-4 h-4", c.icon)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-[#e2e8f0]">{insight.title}</h4>
                      <RiskBadge value={insight.type} />
                      <span className="text-[10px] text-[#64748b] ml-auto">Confidence: <span className="text-[#e2e8f0] font-semibold">{insight.confidence}%</span></span>
                    </div>
                    <p className="text-xs text-[#64748b] leading-relaxed mb-3">{insight.summary}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {insight.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-lg bg-[#0d1626] border border-[#1e2d45] text-[10px] text-[#64748b] font-mono">
                          #{tag}
                        </span>
                      ))}
                      <button className={cn("ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all", c.badge, "hover:opacity-80")}>
                        {insight.action} <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#475569] mb-3">Rekomendasi Tindakan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((rec) => {
            const c = colorMap[rec.severity] ?? colorMap.medium;
            const Icon = iconMap[rec.icon] ?? Shield;
            return (
              <div key={rec.label} className="rounded-2xl border border-[#1e2d45] bg-[#111827] p-4 hover:border-[#243450] transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", c.badge)}>
                    <Icon className={cn("w-4 h-4", c.icon)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-[#e2e8f0]">{rec.label}</p>
                      {rec.count !== null && (
                        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", c.badge)}>
                          {rec.count}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[#64748b] mt-0.5">{rec.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#475569] group-hover:text-[#94a3b8] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explainability */}
      <div className="rounded-2xl border border-[#1e2d45] bg-[#111827] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-[#e2e8f0]">Explainable AI — Top Risk Case</h3>
        </div>
        {topRiskTransaction ? (
          <div className="bg-[#0d1626] rounded-xl p-4 border border-[#1e2d45]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-cyan-400">{topRiskTransaction.senderId} — {topRiskTransaction.senderName}</span>
              <span className="text-2xl font-bold text-red-400">{topRiskTransaction.riskScore}/10</span>
            </div>
            <p className="text-xs text-[#64748b] mb-3">Risk score {topRiskTransaction.riskScore} karena kombinasi faktor berikut:</p>
            <div className="space-y-2">
              {topRiskExplainability.map((factor) => (
                <div key={factor.factor}>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[#64748b]">{factor.factor}</span>
                    <span className="text-[#94a3b8] font-semibold">{factor.weight}%</span>
                  </div>
                  <div className="h-1.5 bg-[#1a2235] rounded-full">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${factor.weight}%`, background: factor.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-[#64748b] bg-[#0d1626] rounded-xl border border-[#1e2d45]">
            Tidak ada transaksi berisiko tinggi terdeteksi
          </div>
        )}
      </div>
    </div>
  );
}
