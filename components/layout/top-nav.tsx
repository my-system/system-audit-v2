"use client";
import { cn } from "@/lib/utils";
import { Bell, Search, ChevronDown, LogOut, User, Settings, RefreshCw } from "lucide-react";
import { useState } from "react";

interface TopNavProps { title: string; subtitle?: string; }

const notifications = [
  { id: 1, msg: "TX011 flagged CRITICAL — Sari Indah", time: "2 mnt lalu", color: "text-red-400", dot: "bg-red-500" },
  { id: 2, msg: "Circular transfer terdeteksi U001→U099→U001", time: "23 mnt lalu", color: "text-orange-400", dot: "bg-orange-500" },
  { id: 3, msg: "Upload CSV berhasil — 4,991 baris", time: "1 jam lalu", color: "text-cyan-400", dot: "bg-cyan-500" },
];

export function TopNav({ title, subtitle }: TopNavProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  return (
    <header className="h-16 border-b border-[#1e2d45] bg-[#0d1626]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-base font-bold text-[#e2e8f0] leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-[#64748b] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569]" />
          <input type="text" placeholder="Cari transaksi, user..." className="pl-9 pr-4 py-2 rounded-xl text-xs bg-[#111827] border border-[#1e2d45] text-[#94a3b8] placeholder-[#475569] focus:outline-none focus:border-cyan-500/50 transition-all w-56" />
        </div>
        <button className="w-8 h-8 rounded-xl bg-[#111827] border border-[#1e2d45] flex items-center justify-center text-[#64748b] hover:text-cyan-400 transition-all">
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <div className="relative">
          <button onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }} className="relative w-8 h-8 rounded-xl bg-[#111827] border border-[#1e2d45] flex items-center justify-center text-[#64748b] hover:text-cyan-400 transition-all">
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white">4</span>
          </button>
          {showNotif && (
            <div className="absolute right-0 top-10 w-80 rounded-xl bg-[#111827] border border-[#1e2d45] shadow-2xl z-50 overflow-hidden animate-fadeIn">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e2d45]">
                <span className="text-xs font-semibold text-[#e2e8f0]">Notifikasi</span>
                <span className="text-[10px] text-cyan-400 cursor-pointer">Tandai semua dibaca</span>
              </div>
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-[#1a2235] border-b border-[#1e2d45]/50 cursor-pointer">
                  <span className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", n.dot)} />
                  <div>
                    <p className={cn("text-xs font-medium", n.color)}>{n.msg}</p>
                    <p className="text-[10px] text-[#475569] mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2.5 text-center"><span className="text-xs text-cyan-400 cursor-pointer">Lihat semua notifikasi</span></div>
            </div>
          )}
        </div>
        <div className="relative">
          <button onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }} className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 bg-[#111827] border border-[#1e2d45] hover:border-[#243450] transition-all">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-[10px] font-bold text-white">YT</div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-[#e2e8f0] leading-none">Admin</p>
              <p className="text-[10px] text-[#64748b]">Yusuf Tech</p>
            </div>
            <ChevronDown className="w-3 h-3 text-[#475569]" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-12 w-48 rounded-xl bg-[#111827] border border-[#1e2d45] shadow-2xl z-50 overflow-hidden animate-fadeIn">
              {[{ icon: User, label: "Profile" }, { icon: Settings, label: "Settings" }].map(({ icon: Icon, label }) => (
                <button key={label} className="flex items-center gap-3 w-full px-4 py-3 text-xs text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1a2235] transition-colors">
                  <Icon className="w-3.5 h-3.5" />{label}
                </button>
              ))}
              <div className="border-t border-[#1e2d45]" />
              <button className="flex items-center gap-3 w-full px-4 py-3 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                <LogOut className="w-3.5 h-3.5" />Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
