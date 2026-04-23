"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Brain, Sparkles, TrendingUp, AlertTriangle, Users, MapPin, RefreshCw, ChevronRight, Shield, Zap } from "lucide-react";
import { RiskBadge } from "@/components/ui/risk-badge";

const insights = [
  {
    id: 1,
    type: "critical",
    icon: AlertTriangle,
    title: "Circular Transfer Pattern Terdeteksi",
    summary: "Hari ini terdeteksi 3 siklus transfer melingkar dengan total nilai Rp 2.48 miliar. Pola dominan: A→B→A dalam rentang 30–68 menit, melibatkan 6 akun unik yang saling terhubung.",
    confidence: 97,
    action: "Freeze Account Review",
    tags: ["circular", "high-value", "multi-account"],
  },
  {
    id: 2,
    type: "high",
    icon: TrendingUp,
    title: "Peningkatan Anomali 37% vs Kemarin",
    summary: "Volume transaksi anomali meningkat signifikan 37.1% dibanding hari sebelumnya. Jam puncak: 02:00–03:00 pagi (aktivitas tengah malam tidak normal). Lokasi konsentrasi: Jakarta Selatan dan Jakarta Barat.",
    confidence: 91,
    action: "Escalate to Compliance",
    tags: ["velocity", "midnight-activity", "jakarta"],
  },
  {
    id: 3,
    type: "high",
    icon: Users,
    title: "3 Akun dengan Pola Dormant Reactivation",
    summary: "Tiga akun yang tidak aktif selama 90+ hari tiba-tiba melakukan transaksi besar. U001 tidak aktif 127 hari lalu transfer Rp 450jt. U070 tidak aktif 203 hari lalu transfer Rp 565jt.",
    confidence: 88,
    action: "Manual Auditor Check",
    tags: ["dormant", "reactivation", "unusual"],
  },
  {
    id: 4,
    type: "medium",
    icon: MapPin,
    title: "Location Jump Terdeteksi",
    summary: "U010 melakukan login dari Jakarta pukul 09:55 dan transaksi dari Surabaya pukul 10:00 (jarak 700km dalam 5 menit). Kemungkinan penggunaan VPN atau akun dikompromikan.",
    confidence: 79,
    action: "Flag for Review",
    tags: ["location-jump", "vpn-suspect", "account-takeover"],
  },
];

const recommendations = [
  { icon: Shield, label: "Freeze Account Review", desc: "4 akun direkomendasikan untuk pembekuan sementara", severity: "critical", count: 4 },
  { icon: AlertTriangle, label: "Escalate to Compliance", desc: "Laporkan ke tim compliance untuk SAR generation", severity: "high", count: 2 },
  { icon: Zap, label: "Manual Auditor Check", desc: "Assign investigator untuk 3 kasus dormant reactivation", severity: "high", count: 3 },
  { icon: Brain, label: "Retrain AI Model", desc: "Dataset baru tersedia untuk meningkatkan akurasi deteksi", severity: "medium", count: null },
];

const colorMap: Record<string, { border: string; icon: string; badge: string; bg: string }> = {
  critical: { border: "border-red-500/30", icon: "text-red-400", badge: "bg-red-500/10 text-red-400", bg: "bg-red-500/5" },
  high: { border: "border-orange-500/30", icon: "text-orange-400", badge: "bg-orange-500/10 text-orange-400", bg: "bg-orange-500/5" },
  medium: { border: "border-yellow-500/30", icon: "text-yellow-400", badge: "bg-yellow-500/10 text-yellow-400", bg: "bg-yellow-500/5" },
};

export function TabAIInsights() {
  const [loading, setLoading] = useState(false);

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
              <p className="text-xs text-[#64748b]">Generated: Hari ini, 13:30 WIB • Model: Sentinel AI v3.0 + Z-Score + Isolation Forest</p>
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
            { label: "Pattern Terdeteksi", value: "7", color: "text-red-400" },
            { label: "Confidence Rata-rata", value: "89%", color: "text-cyan-400" },
            { label: "Akun Berisiko", value: "12", color: "text-orange-400" },
            { label: "Nilai Termonitor", value: "Rp 4.8M", color: "text-emerald-400" },
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
        {insights.map((insight) => {
          const c = colorMap[insight.type];
          const Icon = insight.icon;
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
        })}
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[#475569] mb-3">Rekomendasi Tindakan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((rec) => {
            const c = colorMap[rec.severity] ?? colorMap.medium;
            const Icon = rec.icon;
            return (
              <div key={rec.label} className="rounded-2xl border border-[#1e2d45] bg-[#111827] p-4 hover:border-[#243450] transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", c.badge)}>
                    <Icon className={cn("w-4 h-4", c.icon)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-[#e2e8f0]">{rec.label}</p>
                      {rec.count && (
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
        <div className="bg-[#0d1626] rounded-xl p-4 border border-[#1e2d45]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-cyan-400">U001 — Andi Prasetyo</span>
            <span className="text-2xl font-bold text-red-400">9.5/10</span>
          </div>
          <p className="text-xs text-[#64748b] mb-3">Risk score 9.5 karena kombinasi faktor berikut:</p>
          <div className="space-y-2">
            {[
              { factor: "Z-Score 8.4 (ambang: 5.0)", weight: 85, color: "#ef4444" },
              { factor: "Circular Transfer (U001→U099→U001)", weight: 95, color: "#ef4444" },
              { factor: "Akun dormant 127 hari lalu aktif", weight: 70, color: "#f59e0b" },
              { factor: "Transfer tengah malam (02:14)", weight: 60, color: "#f59e0b" },
              { factor: "Nominal di atas Q3 + 3×IQR", weight: 78, color: "#ef4444" },
            ].map(({ factor, weight, color }) => (
              <div key={factor}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-[#64748b]">{factor}</span>
                  <span className="text-[#94a3b8] font-semibold">{weight}%</span>
                </div>
                <div className="h-1.5 bg-[#1a2235] rounded-full">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${weight}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
