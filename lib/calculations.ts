import type {
  Transaction, Alert, Case, KPIStats, ChartDataPoint,
  HourlyDataPoint, LocationDataPoint, RiskDistributionPoint,
  GraphNode, GraphEdge, CircularFlow, AIInsight, AIRecommendation,
  ExplainabilityFactor, ActivityFeedItem, FilterState, RiskLevel,
} from "@/types";
import { CURRENT_DATE } from "./seed";

// ── Date Helpers ─────────────────────────────────────────────────────────────
function getDateRange(filter: FilterState["dateRange"]): { start: Date; end: Date } {
  const end = new Date(CURRENT_DATE);
  end.setHours(23, 59, 59, 999);
  const start = new Date(CURRENT_DATE);
  switch (filter) {
    case "today": start.setHours(0, 0, 0, 0); break;
    case "7d": start.setDate(start.getDate() - 6); start.setHours(0, 0, 0, 0); break;
    case "30d": start.setDate(start.getDate() - 29); start.setHours(0, 0, 0, 0); break;
    case "90d": start.setDate(start.getDate() - 89); start.setHours(0, 0, 0, 0); break;
  }
  return { start, end };
}

function parseTxDate(tx: Transaction): Date {
  return new Date(tx.timestamp);
}

// ── Filter Transactions ──────────────────────────────────────────────────────
export function filterTransactions(transactions: Transaction[], filters: FilterState): Transaction[] {
  const { start, end } = getDateRange(filters.dateRange);

  return transactions.filter((tx) => {
    const txDate = parseTxDate(tx);
    if (txDate < start || txDate > end) return false;
    if (filters.riskLevel !== "all" && tx.riskLevel !== filters.riskLevel) return false;
    if (filters.location !== "Semua Kota" && tx.location !== filters.location) return false;
    if (filters.selectedMethod !== "all" && tx.method !== filters.selectedMethod) return false;
    if (tx.riskScore < filters.threshold) return false;
    return true;
  });
}

// ── Previous Period for Comparison ────────────────────────────────────────────
function getPreviousPeriodRange(filter: FilterState["dateRange"]): { start: Date; end: Date } {
  const end = new Date(CURRENT_DATE);
  const start = new Date(CURRENT_DATE);
  switch (filter) {
    case "today":
      end.setDate(end.getDate() - 1); end.setHours(23, 59, 59, 999);
      start.setDate(start.getDate() - 1); start.setHours(0, 0, 0, 0);
      break;
    case "7d":
      end.setDate(end.getDate() - 7); end.setHours(23, 59, 59, 999);
      start.setDate(start.getDate() - 13); start.setHours(0, 0, 0, 0);
      break;
    case "30d":
      end.setDate(end.getDate() - 30); end.setHours(23, 59, 59, 999);
      start.setDate(start.getDate() - 59); start.setHours(0, 0, 0, 0);
      break;
    case "90d":
      end.setDate(end.getDate() - 90); end.setHours(23, 59, 59, 999);
      start.setDate(start.getDate() - 179); start.setHours(0, 0, 0, 0);
      break;
  }
  return { start, end };
}

export function computeKPIs(filtered: Transaction[], allTransactions: Transaction[], filters: FilterState): KPIStats {
  const flagged = filtered.filter((t) => t.isFlagged);
  const users = new Set([...filtered.map((t) => t.senderId), ...filtered.map((t) => t.receiverId)]);
  const totalAmount = filtered.reduce((a, b) => a + b.amount, 0);

  // Previous period
  const { start, end } = getPreviousPeriodRange(filters.dateRange);
  const prev = allTransactions.filter((tx) => {
    const d = parseTxDate(tx);
    return d >= start && d <= end;
  });
  const prevUsers = new Set([...prev.map((t) => t.senderId), ...prev.map((t) => t.receiverId)]);
  const prevFlagged = prev.filter((t) => t.isFlagged);

  const riskCounts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const tx of flagged) riskCounts[tx.riskLevel]++;

  return {
    totalTransactions: filtered.length,
    totalAlerts: flagged.length,
    totalAmount,
    uniqueUsers: users.size,
    avgAmount: filtered.length > 0 ? Math.round(totalAmount / filtered.length) : 0,
    fraudRate: filtered.length > 0 ? Math.round((flagged.length / filtered.length) * 10000) / 100 : 0,
    systemHealth: 99.8,
    criticalCount: riskCounts.critical,
    highCount: riskCounts.high,
    mediumCount: riskCounts.medium,
    lowCount: riskCounts.low,
    prevTotalTransactions: prev.length,
    prevTotalAlerts: prevFlagged.length,
    prevTotalAmount: prev.reduce((a, b) => a + b.amount, 0),
    prevUniqueUsers: prevUsers.size,
  };
}

// ── Chart: Daily Trend ────────────────────────────────────────────────────────
export function computeDailyTrend(filtered: Transaction[]): ChartDataPoint[] {
  const map = new Map<string, { transactions: number; alerts: number; amount: number; fraud: number }>();

  for (const tx of filtered) {
    const date = tx.timestamp.split(" ")[0];
    const existing = map.get(date) || { transactions: 0, alerts: 0, amount: 0, fraud: 0 };
    existing.transactions++;
    existing.amount += tx.amount;
    if (tx.isFlagged) { existing.alerts++; existing.fraud++; }
    map.set(date, existing);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, d]) => ({ date, ...d }));
}

// ── Chart: Hourly Trend ──────────────────────────────────────────────────────
export function computeHourlyTrend(filtered: Transaction[]): HourlyDataPoint[] {
  const hours: HourlyDataPoint[] = Array.from({ length: 24 }, (_, h) => ({
    hour: `${String(h).padStart(2, "0")}:00`,
    transactions: 0,
    alerts: 0,
  }));

  for (const tx of filtered) {
    const h = parseInt(tx.timestamp.split(" ")[1].split(":")[0], 10);
    hours[h].transactions++;
    if (tx.isFlagged) hours[h].alerts++;
  }

  return hours;
}

// ── Chart: Location Data ──────────────────────────────────────────────────────
export function computeLocationData(filtered: Transaction[]): LocationDataPoint[] {
  const map = new Map<string, { transactions: number; alerts: number; amount: number }>();

  for (const tx of filtered) {
    const existing = map.get(tx.location) || { transactions: 0, alerts: 0, amount: 0 };
    existing.transactions++;
    existing.amount += tx.amount;
    if (tx.isFlagged) existing.alerts++;
    map.set(tx.location, existing);
  }

  return Array.from(map.entries())
    .sort((a, b) => b[1].transactions - a[1].transactions)
    .map(([location, d]) => ({ location, ...d }));
}

// ── Chart: Risk Distribution ─────────────────────────────────────────────────
export function computeRiskDistribution(filtered: Transaction[]): RiskDistributionPoint[] {
  const counts: Record<RiskLevel, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const tx of filtered) counts[tx.riskLevel]++;

  return [
    { name: "Critical", value: counts.critical, color: "#ef4444" },
    { name: "High", value: counts.high, color: "#f59e0b" },
    { name: "Medium", value: counts.medium, color: "#eab308" },
    { name: "Low", value: counts.low, color: "#10b981" },
  ];
}

// ── Graph Data ────────────────────────────────────────────────────────────────
export function computeGraphData(filtered: Transaction[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodeMap = new Map<string, { label: string; risk: RiskLevel; amount: number; connections: number }>();
  const edgeMap = new Map<string, GraphEdge>();

  for (const tx of filtered) {
    // Sender node
    const sender = nodeMap.get(tx.senderId) || { label: tx.senderName, risk: tx.riskLevel as RiskLevel, amount: 0, connections: 0 };
    sender.amount += tx.amount;
    sender.connections++;
    if (riskPriority(tx.riskLevel) > riskPriority(sender.risk)) sender.risk = tx.riskLevel;
    nodeMap.set(tx.senderId, sender);

    // Receiver node
    const receiver = nodeMap.get(tx.receiverId) || { label: tx.receiverName, risk: "low" as RiskLevel, amount: 0, connections: 0 };
    receiver.amount += tx.amount;
    receiver.connections++;
    nodeMap.set(tx.receiverId, receiver);

    // Edge
    const edgeKey = `${tx.senderId}->${tx.receiverId}`;
    const existing = edgeMap.get(edgeKey);
    if (existing) {
      existing.amount += tx.amount;
    } else {
      edgeMap.set(edgeKey, { source: tx.senderId, target: tx.receiverId, amount: tx.amount, timestamp: tx.timestamp });
    }
  }

  const nodes = Array.from(nodeMap.entries())
    .map(([id, d]) => ({ id, ...d }))
    .sort((a, b) => b.connections - a.connections);

  const edges = Array.from(edgeMap.values());

  return { nodes, edges };
}

function riskPriority(r: RiskLevel): number {
  return { critical: 4, high: 3, medium: 2, low: 1 }[r] || 0;
}

// ── Circular Flow Detection ──────────────────────────────────────────────────
export function computeCircularFlows(filtered: Transaction[]): CircularFlow[] {
  const flows: CircularFlow[] = [];
  const flagged = filtered.filter((t) => t.isCircular);

  // Group by sender to find A→B→A patterns
  const senderTx = new Map<string, Transaction[]>();
  for (const tx of flagged) {
    const list = senderTx.get(tx.senderId) || [];
    list.push(tx);
    senderTx.set(tx.senderId, list);
  }

  // Look for reverse edges
  for (const tx of flagged) {
    const reverse = flagged.find((r) => r.senderId === tx.receiverId && r.receiverId === tx.senderId);
    if (reverse && tx.timestamp < reverse.timestamp) {
      const duration = (new Date(reverse.timestamp).getTime() - new Date(tx.timestamp).getTime()) / 60000;
      flows.push({
        path: [tx.senderId, tx.receiverId, tx.senderId],
        pathLabel: `${tx.senderId} → ${tx.receiverId} → ${tx.senderId}`,
        amount: tx.amount + reverse.amount,
        startTime: tx.timestamp.split(" ")[1],
        endTime: reverse.timestamp.split(" ")[1],
        durationMinutes: Math.round(duration),
        risk: "critical",
      });
    }
  }

  // Multi-hop circular flows
  const byUser = new Map<string, Transaction[]>();
  for (const tx of flagged) {
    const list = byUser.get(tx.senderId) || [];
    list.push(tx);
    byUser.set(tx.senderId, list);
  }

  for (const [userId, txs] of byUser) {
    for (const tx of txs) {
      const nextTxs = byUser.get(tx.receiverId);
      if (nextTxs) {
        for (const next of nextTxs) {
          if (next.receiverId === userId) {
            const exists = flows.some((f) => f.path.length === 3 && f.path.includes(userId) && f.path.includes(tx.receiverId));
            if (!exists) {
              const duration = (new Date(next.timestamp).getTime() - new Date(tx.timestamp).getTime()) / 60000;
              flows.push({
                path: [userId, tx.receiverId, next.receiverId === userId ? tx.receiverId : next.receiverId, userId],
                pathLabel: `${userId} → ${tx.receiverId} → ${next.receiverId} → ${userId}`,
                amount: tx.amount + next.amount,
                startTime: tx.timestamp.split(" ")[1],
                endTime: next.timestamp.split(" ")[1],
                durationMinutes: Math.round(duration),
                risk: "critical",
              });
            }
          }
        }
      }
    }
  }

  return flows;
}

// ── AI Insights Generation ────────────────────────────────────────────────────
export function computeAIInsights(filtered: Transaction[], kpis: KPIStats): AIInsight[] {
  const insights: AIInsight[] = [];
  let id = 1;

  // 1. Circular flow insight
  const circulars = filtered.filter((t) => t.isCircular);
  if (circulars.length > 0) {
    const totalCircularAmount = circulars.reduce((a, b) => a + b.amount, 0);
    const uniqueCircularUsers = new Set(circulars.flatMap((t) => [t.senderId, t.receiverId]));
    insights.push({
      id: id++,
      type: "critical",
      icon: "AlertTriangle",
      title: "Circular Transfer Pattern Terdeteksi",
      summary: `Terdeteksi ${circulars.length} transaksi circular flow dengan total Rp ${(totalCircularAmount / 1_000_000_000).toFixed(2)} miliar. Melibatkan ${uniqueCircularUsers.size} akun unik yang saling mengirim dana dalam rentang waktu singkat.`,
      confidence: 97,
      action: "Freeze Account Review",
      tags: ["circular", "high-value", "multi-account"],
    });
  }

  // 2. Anomaly spike insight
  const prevAlerts = kpis.prevTotalAlerts;
  const currentAlerts = kpis.totalAlerts;
  if (prevAlerts > 0 && currentAlerts > prevAlerts) {
    const pctIncrease = Math.round(((currentAlerts - prevAlerts) / prevAlerts) * 1000) / 10;
    const midnightTx = filtered.filter((t) => {
      const h = parseInt(t.timestamp.split(" ")[1].split(":")[0], 10);
      return h >= 0 && h <= 5 && t.isFlagged;
    });
    insights.push({
      id: id++,
      type: "high",
      icon: "TrendingUp",
      title: `Peningkatan Anomali ${pctIncrease}% vs Periode Sebelumnya`,
      summary: `Volume anomali meningkat ${pctIncrease}% dari ${prevAlerts} menjadi ${currentAlerts} alert. ${midnightTx.length > 0 ? `Terdeteksi ${midnightTx.length} transaksi mencurigakan pada jam 00:00-05:00 (aktivitas tengah malam tidak normal).` : ""}`,
      confidence: 91,
      action: "Escalate to Compliance",
      tags: ["velocity", "anomaly-spike"],
    });
  }

  // 3. Dormant reactivation insight
  const dormant = filtered.filter((t) => t.isDormantReactivation);
  if (dormant.length > 0) {
    const dormantUsers = [...new Set(dormant.map((t) => t.senderId))];
    insights.push({
      id: id++,
      type: "high",
      icon: "Users",
      title: `${dormantUsers.length} Akun dengan Pola Dormant Reactivation`,
      summary: `${dormantUsers.length} akun yang tidak aktif selama 90+ hari tiba-tiba melakukan transaksi besar. ${dormant.slice(0, 3).map((t) => `${t.senderId} transfer Rp ${(t.amount / 1_000_000).toFixed(0)}jt`).join(". ")}.`,
      confidence: 88,
      action: "Manual Auditor Check",
      tags: ["dormant", "reactivation", "unusual"],
    });
  }

  // 4. Location jump / velocity insight
  const velocityAlerts = filtered.filter((t) => t.isVelocityAlert);
  if (velocityAlerts.length > 0) {
    const vUsers = [...new Set(velocityAlerts.map((t) => t.senderId))];
    insights.push({
      id: id++,
      type: velocityAlerts.some((t) => t.riskLevel === "critical") ? "critical" : "medium",
      icon: "MapPin",
      title: "Velocity Fraud Pattern Terdeteksi",
      summary: `Terdeteksi ${velocityAlerts.length} transaksi velocity fraud dari ${vUsers.length} akun. ${vUsers.map((u) => { const txs = velocityAlerts.filter((t) => t.senderId === u); return `${u} melakukan ${txs.length} transfer dalam waktu singkat`; }).join(". ")}.`,
      confidence: 79,
      action: "Flag for Review",
      tags: ["velocity", "rapid-transfer", "suspicious"],
    });
  }

  return insights;
}

// ── AI Recommendations ────────────────────────────────────────────────────────
export function computeRecommendations(kpis: KPIStats, insights: AIInsight[]): AIRecommendation[] {
  return [
    { icon: "Shield", label: "Freeze Account Review", desc: `${kpis.criticalCount} akun direkomendasikan untuk pembekuan sementara`, severity: "critical" as RiskLevel, count: kpis.criticalCount },
    { icon: "AlertTriangle", label: "Escalate to Compliance", desc: "Laporkan ke tim compliance untuk SAR generation", severity: "high" as RiskLevel, count: kpis.highCount },
    { icon: "Zap", label: "Manual Auditor Check", desc: `Assign investigator untuk ${kpis.highCount} kasus high risk`, severity: "high" as RiskLevel, count: kpis.highCount },
    { icon: "Brain", label: "Retrain AI Model", desc: "Dataset baru tersedia untuk meningkatkan akurasi deteksi", severity: "medium" as RiskLevel, count: null },
  ];
}

// ── Explainability ───────────────────────────────────────────────────────────
export function computeExplainability(tx: Transaction): ExplainabilityFactor[] {
  const factors: ExplainabilityFactor[] = [];

  if (tx.zScore > 5) factors.push({ factor: `Z-Score ${tx.zScore.toFixed(1)} (ambang: 5.0)`, weight: 85, color: "#ef4444" });
  else if (tx.zScore > 3) factors.push({ factor: `Z-Score ${tx.zScore.toFixed(1)} (ambang: 3.0)`, weight: 65, color: "#f59e0b" });
  else factors.push({ factor: `Z-Score ${tx.zScore.toFixed(1)} (normal)`, weight: 20, color: "#10b981" });

  if (tx.isCircular) factors.push({ factor: "Circular Transfer terdeteksi", weight: 95, color: "#ef4444" });
  if (tx.isDormantReactivation) factors.push({ factor: "Akun dormant reaktivasi tiba-tiba", weight: 70, color: "#f59e0b" });
  if (tx.isVelocityAlert) factors.push({ factor: "Velocity fraud pattern", weight: 75, color: "#ef4444" });

  const hour = parseInt(tx.timestamp.split(" ")[1].split(":")[0], 10);
  if (hour >= 0 && hour <= 5) factors.push({ factor: `Transfer tengah malam (${hour}:00)`, weight: 60, color: "#f59e0b" });

  if (tx.amount > 200_000_000) factors.push({ factor: "Nominal di atas Q3 + 3×IQR", weight: 78, color: "#ef4444" });

  return factors;
}

// ── Activity Feed ─────────────────────────────────────────────────────────────
export function computeActivityFeed(filtered: Transaction[], alerts: Alert[], cases: Case[]): ActivityFeedItem[] {
  const items: ActivityFeedItem[] = [];
  let id = 1;

  // Recent alerts
  const recentAlerts = alerts.slice(0, 5);
  for (const alt of recentAlerts) {
    items.push({
      id: String(id++),
      time: alt.timestamp.split(" ")[1].substring(0, 5),
      message: `Alert: ${alt.txId} — ${alt.reason.substring(0, 60)}...`,
      type: "alert",
      severity: alt.riskLevel,
    });
  }

  // Recent cases
  for (const c of cases.slice(0, 3)) {
    items.push({
      id: String(id++),
      time: c.createdAt.split(" ")[1].substring(0, 5),
      message: `Case ${c.id} — ${c.userName} (${c.riskLevel})`,
      type: "case",
      severity: c.riskLevel,
    });
  }

  // System events
  items.push({ id: String(id++), time: "08:00", message: "Sistem Sentinel online — AI Engine aktif", type: "login" });
  items.push({ id: String(id++), time: "07:45", message: "Laporan eksekutif diekspor oleh Admin (PDF, 2.3MB)", type: "export" });

  return items.sort((a, b) => b.time.localeCompare(a.time));
}

// ── Available Filter Options ──────────────────────────────────────────────────
export function computeAvailableLocations(transactions: Transaction[]): string[] {
  return ["Semua Kota", ...new Set(transactions.map((t) => t.location))].sort();
}
