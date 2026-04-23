import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

const config: Record<RiskLevel | string, { label: string; cls: string; dot: string }> = {
  critical: { label: "CRITICAL",     cls: "badge-critical", dot: "bg-red-400" },
  high:     { label: "HIGH",         cls: "badge-high",     dot: "bg-orange-400" },
  medium:   { label: "MEDIUM",       cls: "badge-medium",   dot: "bg-yellow-400" },
  low:      { label: "LOW",          cls: "badge-low",      dot: "bg-emerald-400" },
  open:         { label: "OPEN",         cls: "badge-critical", dot: "bg-red-400" },
  investigating:{ label: "INVESTIGATING",cls: "badge-high",     dot: "bg-orange-400" },
  escalated:    { label: "ESCALATED",    cls: "badge-critical", dot: "bg-purple-400" },
  closed:       { label: "CLOSED",       cls: "badge-low",      dot: "bg-emerald-400" },
  flagged:      { label: "FLAGGED",      cls: "badge-critical", dot: "bg-red-400" },
  clear:        { label: "CLEAR",        cls: "badge-low",      dot: "bg-emerald-400" },
  resolved:     { label: "RESOLVED",     cls: "badge-low",      dot: "bg-emerald-400" },
  new:          { label: "NEW",          cls: "badge-info",     dot: "bg-cyan-400" },
  reviewed:     { label: "REVIEWED",     cls: "badge-medium",   dot: "bg-yellow-400" },
};

interface BadgeProps {
  value: string;
  showDot?: boolean;
  size?: "sm" | "md";
}

export function RiskBadge({ value, showDot = true, size = "sm" }: BadgeProps) {
  const c = config[value.toLowerCase()] ?? { label: value.toUpperCase(), cls: "badge-info", dot: "bg-slate-400" };
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-semibold",
      c.cls,
      size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
    )}>
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", c.dot)} />}
      {c.label}
    </span>
  );
}
