"use client";
import { useState } from "react";
import { transactions } from "@/data/dummy";
import { RiskBadge } from "@/components/ui/risk-badge";
import { formatCurrency, cn } from "@/lib/utils";
import { Search, Download, Eye, FolderOpen, ChevronUp, ChevronDown, Filter } from "lucide-react";
import type { Transaction } from "@/types";

export function TabTransactions() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof Transaction>("timestamp");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = transactions
    .filter(t =>
      (riskFilter === "all" || t.riskLevel === riskFilter) &&
      (search === "" || t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.senderName.toLowerCase().includes(search.toLowerCase()) ||
        t.receiverName.toLowerCase().includes(search.toLowerCase()) ||
        t.location.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      const av = a[sortField] as any;
      const bv = b[sortField] as any;
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const handleSort = (f: keyof Transaction) => {
    if (f === sortField) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(f); setSortDir("desc"); }
  };

  const SortIcon = ({ field }: { field: keyof Transaction }) =>
    sortField === field
      ? sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3 opacity-30" />;

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#475569]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari ID, sender, receiver, lokasi..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-[#111827] border border-[#1e2d45] text-[#94a3b8] placeholder-[#475569] focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#475569]" />
          {["all", "critical", "high", "medium", "low"].map(r => (
            <button
              key={r}
              onClick={() => setRiskFilter(r)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                riskFilter === r
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "bg-[#111827] border border-[#1e2d45] text-[#64748b] hover:text-[#94a3b8]"
              )}
            >
              {r === "all" ? "Semua" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl text-xs bg-[#111827] border border-[#1e2d45] text-[#64748b] hover:text-cyan-400 transition-all">
          <Download className="w-3.5 h-3.5" />Export CSV
        </button>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-4 text-xs text-[#64748b]">
        <span>Menampilkan <span className="text-[#e2e8f0] font-semibold">{filtered.length}</span> transaksi</span>
        <span>•</span>
        <span className="text-red-400 font-medium">{filtered.filter(t => t.riskLevel === "critical").length} critical</span>
        <span>•</span>
        <span className="text-orange-400 font-medium">{filtered.filter(t => t.riskLevel === "high").length} high</span>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#1e2d45] bg-[#111827] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr className="bg-[#0d1626]">
                {[
                  { label: "TX ID", field: "id" as keyof Transaction },
                  { label: "Sender", field: "senderName" as keyof Transaction },
                  { label: "Receiver", field: "receiverName" as keyof Transaction },
                  { label: "Amount", field: "amount" as keyof Transaction },
                  { label: "Waktu", field: "timestamp" as keyof Transaction },
                  { label: "Lokasi", field: "location" as keyof Transaction },
                  { label: "Risk Score", field: "riskScore" as keyof Transaction },
                  { label: "Status", field: "status" as keyof Transaction },
                  { label: "Aksi", field: null },
                ].map(({ label, field }) => (
                  <th key={label} onClick={() => field && handleSort(field)} className={cn(field && "cursor-pointer hover:text-[#94a3b8] transition-colors")}>
                    <div className="flex items-center gap-1">
                      {label}
                      {field && <SortIcon field={field} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr
                  key={tx.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedTx(selectedTx?.id === tx.id ? null : tx)}
                >
                  <td>
                    <span className="font-mono text-xs text-cyan-400">{tx.id}</span>
                  </td>
                  <td>
                    <div>
                      <p className="text-[#e2e8f0] text-xs font-medium">{tx.senderName}</p>
                      <p className="text-[10px] text-[#475569]">{tx.senderId}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="text-[#e2e8f0] text-xs font-medium">{tx.receiverName}</p>
                      <p className="text-[10px] text-[#475569]">{tx.receiverId}</p>
                    </div>
                  </td>
                  <td>
                    <span className="text-[#e2e8f0] font-semibold text-xs">{formatCurrency(tx.amount)}</span>
                  </td>
                  <td>
                    <span className="font-mono text-[10px] text-[#64748b]">{tx.timestamp.split(" ")[1]}</span>
                    <p className="text-[10px] text-[#475569]">{tx.timestamp.split(" ")[0]}</p>
                  </td>
                  <td><span className="text-xs">{tx.location}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#1a2235] rounded-full h-1.5 w-16">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${tx.riskScore * 10}%`,
                            background: tx.riskScore >= 8 ? "#ef4444" : tx.riskScore >= 6 ? "#f59e0b" : tx.riskScore >= 4 ? "#eab308" : "#10b981"
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#e2e8f0] w-8">{tx.riskScore}</span>
                    </div>
                  </td>
                  <td><RiskBadge value={tx.status} /></td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 rounded-lg bg-[#1a2235] hover:bg-cyan-500/10 text-[#64748b] hover:text-cyan-400 transition-all" onClick={e => { e.stopPropagation(); setSelectedTx(tx); }}>
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-[#1a2235] hover:bg-purple-500/10 text-[#64748b] hover:text-purple-400 transition-all">
                        <FolderOpen className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedTx && (
        <div className="rounded-2xl border border-cyan-500/20 bg-[#111827] p-5 animate-fadeIn">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-[#64748b] mb-1">Detail Transaksi</p>
              <h3 className="text-base font-bold text-[#e2e8f0] font-mono">{selectedTx.id}</h3>
            </div>
            <div className="flex items-center gap-2">
              <RiskBadge value={selectedTx.riskLevel} size="md" />
              <button onClick={() => setSelectedTx(null)} className="text-[#475569] hover:text-[#94a3b8] text-lg leading-none">×</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Sender", value: `${selectedTx.senderName} (${selectedTx.senderId})` },
              { label: "Receiver", value: `${selectedTx.receiverName} (${selectedTx.receiverId})` },
              { label: "Amount", value: formatCurrency(selectedTx.amount) },
              { label: "Timestamp", value: selectedTx.timestamp },
              { label: "Lokasi", value: selectedTx.location },
              { label: "Risk Score", value: `${selectedTx.riskScore}/10` },
              { label: "Z-Score", value: selectedTx.zScore?.toFixed(2) ?? "N/A" },
              { label: "Metode Deteksi", value: selectedTx.method.toUpperCase() },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#0d1626] rounded-xl p-3">
                <p className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">{label}</p>
                <p className="text-xs font-semibold text-[#e2e8f0]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
