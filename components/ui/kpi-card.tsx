"use client";
import { cn } from "@/lib/utils";
import {
  TrendingUp, TrendingDown, Minus,
  Activity, AlertTriangle, DollarSign,
  Users, Shield, Cpu, BarChart2,
  Eye, Clock, Zap
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  activity: Activity,
  alert: AlertTriangle,
  dollar: DollarSign,
  users: Users,
  shield: Shield,
  cpu: Cpu,
  bar: BarChart2,
  eye: Eye,
  clock: Clock,
  zap: Zap,
};

const colorMap = {
  cyan:   { border: "border-cyan-500/20",   glow: "shadow-[0_0_20px_rgba(6,182,212,0.1)]",   icon: "text-cyan-400",   bg: "bg-cyan-500/10",   badge: "text-cyan-400 bg-cyan-500/10" },
  green:  { border: "border-emerald-500/20", glow: "shadow-[0_0_20px_rgba(16,185,129,0.1)]",  icon: "text-emerald-400",bg: "bg-emerald-500/10",badge: "text-emerald-400 bg-emerald-500/10" },
  orange: { border: "border-orange-500/20",  glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)]",  icon: "text-orange-400", bg: "bg-orange-500/10", badge: "text-orange-400 bg-orange-500/10" },
  red:    { border: "border-red-500/20",     glow: "shadow-[0_0_20px_rgba(239,68,68,0.1)]",   icon: "text-red-400",    bg: "bg-red-500/10",    badge: "text-red-400 bg-red-500/10" },
  purple: { border: "border-purple-500/20",  glow: "shadow-[0_0_20px_rgba(168,85,247,0.1)]",  icon: "text-purple-400", bg: "bg-purple-500/10", badge: "text-purple-400 bg-purple-500/10" },
};

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon: string;
  color: "cyan" | "green" | "orange" | "red" | "purple";
  suffix?: string;
  subtitle?: string;
  loading?: boolean;
}

export function KPICard({
  label, value, change, changeType = "neutral",
  icon, color, suffix, subtitle, loading = false
}: KPICardProps) {
  const colors = colorMap[color];
  const Icon = iconMap[icon] || Activity;

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#1e2d45] bg-[#111827] p-5">
        <div className="skeleton h-4 w-24 mb-4" />
        <div className="skeleton h-8 w-32 mb-2" />
        <div className="skeleton h-3 w-20" />
      </div>
    );
  }

  return (
    <div className={cn(
      "relative rounded-2xl border bg-[#111827] p-5 overflow-hidden",
      "transition-all duration-300 hover:scale-[1.01] cursor-default",
      "animate-fadeIn",
      colors.border, colors.glow
    )}>
      {/* Background accent */}
      <div className={cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20", colors.bg)} />

      <div className="relative flex items-start justify-between mb-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#475569]">{label}</span>
        <div className={cn("p-2 rounded-xl", colors.bg)}>
          <Icon className={cn("w-4 h-4", colors.icon)} />
        </div>
      </div>

      <div className="relative">
        <div className="flex items-end gap-1 mb-1">
          <span className="text-2xl font-bold text-[#e2e8f0] tracking-tight">{value}</span>
          {suffix && <span className="text-sm text-[#64748b] mb-0.5">{suffix}</span>}
        </div>

        {subtitle && <p className="text-xs text-[#64748b] mb-2">{subtitle}</p>}

        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-2">
            {changeType === "increase" && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
            {changeType === "decrease" && <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
            {changeType === "neutral" && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            <span className={cn("text-xs font-medium",
              changeType === "increase" ? "text-emerald-400" :
              changeType === "decrease" ? "text-red-400" : "text-slate-400"
            )}>
              {change > 0 ? "+" : ""}{change}% vs kemarin
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
