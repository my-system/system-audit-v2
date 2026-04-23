"use client";
import { ChartCard } from "@/components/ui/chart-card";
import { last30DaysData, hourlyData, riskDistribution, locationData } from "@/data/dummy";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = { cyan: "#06b6d4", red: "#ef4444", orange: "#f59e0b", green: "#10b981", purple: "#a855f7" };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111827] border border-[#1e2d45] rounded-xl p-3 shadow-2xl">
      <p className="text-xs text-[#64748b] mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#94a3b8]">{p.name}:</span>
          <span className="text-[#e2e8f0] font-medium">{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const last14 = last30DaysData.slice(-14).map(d => ({ ...d, date: d.date.slice(5) }));
const last7hourly = hourlyData.filter((_, i) => i % 2 === 0);

export function TabAnalytics() {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Transaction Trend */}
        <ChartCard title="Tren Transaksi Harian" subtitle="14 hari terakhir" height="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last14}>
              <defs>
                <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
              <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
              <Area type="monotone" dataKey="transactions" stroke="#06b6d4" fill="url(#txGrad)" strokeWidth={2} name="Transaksi" dot={false} />
              <Area type="monotone" dataKey="alerts" stroke="#ef4444" fill="url(#alertGrad)" strokeWidth={2} name="Alerts" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Risk Distribution Pie */}
        <ChartCard title="Distribusi Risiko" subtitle="Hari ini" height="h-[260px]">
          <div className="flex h-full items-center gap-4">
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {riskDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {riskDistribution.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs text-[#64748b]">{d.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#e2e8f0]">{d.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#1e2d45]">
                <div className="flex justify-between">
                  <span className="text-xs text-[#64748b]">Total</span>
                  <span className="text-xs font-bold text-[#e2e8f0]">{riskDistribution.reduce((a, b) => a + b.value, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly Activity */}
        <ChartCard title="Aktivitas per Jam" subtitle="Hari ini" height="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7hourly} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
              <XAxis dataKey="hour" tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "#475569", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="transactions" name="Transaksi" fill="#06b6d4" radius={[3, 3, 0, 0]} opacity={0.8} />
              <Bar dataKey="alerts" name="Alerts" fill="#ef4444" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Location Heatmap */}
        <ChartCard title="Top Lokasi Transaksi" subtitle="Volume tertinggi" height="h-[240px]">
          <div className="space-y-2.5 h-full overflow-y-auto pr-1">
            {locationData.map((loc, i) => {
              const maxTx = locationData[0].transactions;
              const pct = Math.round((loc.transactions / maxTx) * 100);
              return (
                <div key={loc.location}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#475569] w-4">{i + 1}</span>
                      <span className="text-xs text-[#94a3b8]">{loc.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-red-400">{loc.alerts} alerts</span>
                      <span className="text-xs font-semibold text-[#e2e8f0] w-8 text-right">{loc.transactions}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#1a2235] rounded-full">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: i < 2 ? "#06b6d4" : i < 4 ? "#0891b2" : "#1e3a5f" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Amount Trend */}
      <ChartCard title="Nominal Transaksi Harian" subtitle="30 hari terakhir (Rp)" height="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={last30DaysData.map(d => ({ ...d, date: d.date.slice(5), amountM: Math.round(d.amount / 1_000_000) }))}>
            <defs>
              <linearGradient id="amountGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
            <XAxis dataKey="date" tick={{ fill: "#475569", fontSize: 9 }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fill: "#475569", fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}jt`} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="amountM" stroke="#10b981" strokeWidth={2} dot={false} name="Amount (jt)" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
