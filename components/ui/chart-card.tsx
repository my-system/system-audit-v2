"use client";
import { cn } from "@/lib/utils";
import { ChartSkeleton } from "./skeleton";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  loading?: boolean;
  className?: string;
  height?: string;
}

export function ChartCard({
  title, subtitle, children, action, loading, className, height = "h-[280px]"
}: ChartCardProps) {
  return (
    <div className={cn(
      "rounded-2xl border border-[#1e2d45] bg-[#111827] overflow-hidden",
      "transition-all duration-300 hover:border-[#243450]",
      "animate-fadeIn",
      className
    )}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2d45]">
        <div>
          <h3 className="text-sm font-semibold text-[#e2e8f0]">{title}</h3>
          {subtitle && <p className="text-xs text-[#64748b] mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className={cn("p-4", height)}>
        {loading ? <ChartSkeleton /> : children}
      </div>
    </div>
  );
}
