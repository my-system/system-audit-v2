"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Search, Bell, FileText,
  Upload, Settings, Users, Shield,
  ChevronLeft, ChevronRight, Zap
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard",      icon: LayoutDashboard, label: "Dashboard",      badge: null },
  { href: "/investigations", icon: Search,           label: "Investigations", badge: "5" },
  { href: "/alerts",         icon: Bell,             label: "Alert Center",  badge: "4", badgeColor: "bg-red-500" },
  { href: "/reports",        icon: FileText,         label: "Reports",       badge: null },
  { href: "/upload",         icon: Upload,           label: "Upload Data",   badge: null },
  { href: "/settings",       icon: Settings,         label: "Settings",      badge: null },
  { href: "/users",          icon: Users,            label: "Users",         badge: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "relative flex flex-col h-screen bg-[#0d1626] border-r border-[#1e2d45]",
      "transition-all duration-300 ease-in-out flex-shrink-0",
      collapsed ? "w-[64px]" : "w-[220px]"
    )}>
      {/* Logo */}
      <div className={cn(
        "flex items-center h-16 border-b border-[#1e2d45] px-4",
        collapsed ? "justify-center" : "gap-3"
      )}>
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center glow-cyan">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0d1626]" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#e2e8f0] leading-none">Sentinel</p>
            <p className="text-[10px] text-[#64748b] mt-0.5 truncate">Audit Platform</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {!collapsed && (
          <p className="px-4 text-[10px] font-semibold tracking-widest uppercase text-[#334155] mb-3">
            Navigation
          </p>
        )}
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                    "transition-all duration-200 relative",
                    isActive
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "text-[#64748b] hover:text-[#94a3b8] hover:bg-[#1a2235]",
                    collapsed && "justify-center px-2"
                  )}
                >
                  {isActive && !collapsed && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-r-full" />
                  )}
                  <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-cyan-400" : "")} />
                  {!collapsed && (
                    <span className="text-sm font-medium flex-1 truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className={cn(
                      "text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center",
                      item.badgeColor ?? "bg-[#1e2d45] text-[#64748b]",
                      item.badgeColor ? "text-white" : ""
                    )}>
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span className={cn(
                      "absolute top-1 right-1 w-2 h-2 rounded-full",
                      item.badgeColor ?? "bg-slate-500"
                    )} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* System Status */}
      {!collapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-[#111827] border border-[#1e2d45]">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider">AI Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-emerald-400 font-medium">Active</span>
            <span className="text-[10px] text-[#475569] ml-auto">v3.0</span>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute -right-3 top-20 w-6 h-6 rounded-full",
          "bg-[#1a2235] border border-[#1e2d45]",
          "flex items-center justify-center",
          "hover:bg-[#243450] transition-colors text-[#64748b] hover:text-[#94a3b8]",
          "z-10"
        )}
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3" />
          : <ChevronLeft className="w-3 h-3" />
        }
      </button>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[#1e2d45]">
          <p className="text-[10px] text-[#334155] text-center">
            Sentinel v3.0 © 2026 Yusuf Technologies
          </p>
        </div>
      )}
    </aside>
  );
}
