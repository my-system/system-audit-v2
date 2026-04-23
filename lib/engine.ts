import type { Transaction, RiskLevel, Alert, Case } from "@/types";

// ── Z-Score Calculation ─────────────────────────────────────────────────────
function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stddev(values: number[], avg: number): number {
  const squaredDiffs = values.map((v) => (v - avg) ** 2);
  return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / values.length);
}

export function computeZScore(amount: number, avg: number, sd: number): number {
  if (sd === 0) return 0;
  return (amount - avg) / sd;
}

// ── Risk Level Classification ────────────────────────────────────────────────
export function classifyRisk(zScore: number, isCircular: boolean, isVelocity: boolean, isDormant: boolean): RiskLevel {
  // Circular, dormant, and velocity patterns are automatically critical/high
  if (isCircular && zScore > 3) return "critical";
  if (isDormant && zScore > 3) return "critical";
  if (isVelocity && zScore > 3) return "critical";
  if (isCircular || isDormant) return "high";
  if (isVelocity) return "high";

  if (zScore > 5) return "critical";
  if (zScore > 3) return "high";
  if (zScore > 2) return "medium";
  return "low";
}

// ── Risk Score (0-10) ────────────────────────────────────────────────────────
export function computeRiskScore(
  zScore: number,
  isCircular: boolean,
  isDormant: boolean,
  isVelocity: boolean,
  hour: number
): number {
  let score = 0;

  // Z-Score contribution (0-5)
  score += Math.min(zScore / 2, 5);

  // Pattern bonuses (0-3)
  if (isCircular) score += 3;
  if (isDormant) score += 2.5;
  if (isVelocity) score += 2;

  // Midnight activity bonus (0-1)
  if (hour >= 0 && hour <= 5) score += 1;

  return Math.min(Math.round(score * 10) / 10, 10);
}

// ── Status Determination ─────────────────────────────────────────────────────
function determineStatus(riskLevel: RiskLevel, isFlagged: boolean): Transaction["status"] {
  if (isFlagged) return "flagged";
  if (riskLevel === "critical") return "flagged";
  if (riskLevel === "high") return "investigating";
  return "clear";
}

// ── Main Engine: Process All Transactions ────────────────────────────────────
export function processRiskEngine(transactions: Transaction[]): Transaction[] {
  const amounts = transactions.map((t) => t.amount);
  const avg = mean(amounts);
  const sd = stddev(amounts, avg);

  return transactions.map((tx) => {
    const zScore = computeZScore(tx.amount, avg, sd);
    const hour = parseInt(tx.timestamp.split(" ")[1].split(":")[0], 10);
    const isCircular = tx.isCircular;
    const isDormant = tx.isDormantReactivation;
    const isVelocity = tx.isVelocityAlert;

    const riskLevel = classifyRisk(zScore, isCircular, isVelocity, isDormant);
    const riskScore = computeRiskScore(zScore, isCircular, isDormant, isVelocity, hour);
    const isFlagged = riskLevel === "critical" || riskLevel === "high" || isCircular || isDormant || isVelocity;
    const status = determineStatus(riskLevel, isFlagged);

    return {
      ...tx,
      zScore: Math.round(zScore * 100) / 100,
      riskLevel,
      riskScore,
      isFlagged,
      status,
    };
  });
}

// ── Generate Alerts from Flagged Transactions ────────────────────────────────
export function generateAlerts(transactions: Transaction[]): Alert[] {
  const flagged = transactions.filter((t) => t.isFlagged);
  return flagged.map((tx, i) => {
    let reason = "";
    if (tx.isCircular) reason = `Circular transfer terdeteksi — Z-score ${tx.zScore.toFixed(1)}`;
    else if (tx.isDormantReactivation) reason = `Dormant reactivation — Akun tidak aktif 90+ hari, transfer ${formatAmountShort(tx.amount)}`;
    else if (tx.isVelocityAlert) reason = `Velocity fraud — Multiple transfers dalam waktu singkat`;
    else reason = `Z-score ${tx.zScore.toFixed(1)} — Anomali terdeteksi pada transaksi ${formatAmountShort(tx.amount)}`;

    return {
      id: `ALT${String(i + 1).padStart(3, "0")}`,
      txId: tx.id,
      userId: tx.senderId,
      userName: tx.senderName,
      reason,
      riskLevel: tx.riskLevel,
      score: tx.riskScore,
      timestamp: tx.timestamp,
      status: tx.riskLevel === "critical" ? "new" : "reviewed",
      location: tx.location,
    };
  });
}

// ── Generate Cases from Critical Alerts ──────────────────────────────────────
export function generateCases(transactions: Transaction[]): Case[] {
  const userMap = new Map<string, { name: string; txs: Transaction[]; location: string }>();

  const flagged = transactions.filter((t) => t.riskLevel === "critical" || t.riskLevel === "high");
  for (const tx of flagged) {
    if (!userMap.has(tx.senderId)) {
      userMap.set(tx.senderId, { name: tx.senderName, txs: [], location: tx.location });
    }
    userMap.get(tx.senderId)!.txs.push(tx);
  }

  const assignees = ["Rudi Hartanto", "Maya Dewi", "Bima Santosa", "Unassigned"];
  let caseIdx = 0;

  return Array.from(userMap.entries())
    .filter(([, v]) => v.txs.length >= 1)
    .sort((a, b) => Math.max(...b[1].txs.map((t) => t.riskScore)) - Math.max(...a[1].txs.map((t) => t.riskScore)))
    .slice(0, 10)
    .map(([userId, data]) => {
      caseIdx++;
      const maxRisk = Math.max(...data.txs.map((t) => t.riskScore));
      const totalAmount = data.txs.reduce((a, b) => a + b.amount, 0);
      const riskLevel: RiskLevel = maxRisk >= 9 ? "critical" : maxRisk >= 7 ? "high" : "medium";
      const status = riskLevel === "critical" ? (caseIdx <= 2 ? "investigating" : "open") : "investigating";

      return {
        id: `CASE-${String(caseIdx).padStart(3, "0")}`,
        userId,
        userName: data.name,
        riskScore: maxRisk,
        riskLevel,
        status: status as Case["status"],
        assignedTo: assignees[caseIdx % assignees.length],
        createdAt: data.txs[0].timestamp,
        updatedAt: data.txs[data.txs.length - 1].timestamp,
        totalTx: data.txs.length,
        totalAmount,
        location: data.location,
      };
    });
}

function formatAmountShort(amount: number): string {
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
  if (amount >= 1_000_000) return `Rp ${Math.round(amount / 1_000_000)}jt`;
  return `Rp ${amount.toLocaleString("id-ID")}`;
}
