import type {
  Transaction, Alert, Case, ChartDataPoint,
  ActivityFeedItem, GraphNode, GraphEdge
} from "@/types";

// ── Transactions ──────────────────────────────────────────────────────────────
export const transactions: Transaction[] = [
  { id: "TX001", senderId: "U001", senderName: "Andi Prasetyo", receiverId: "U099", receiverName: "Budi Santoso", amount: 450_000_000, timestamp: "2026-04-23 09:00:00", location: "Jakarta Selatan", riskScore: 9.2, riskLevel: "critical", status: "flagged", method: "z-score", zScore: 8.4 },
  { id: "TX002", senderId: "U001", senderName: "Andi Prasetyo", receiverId: "U045", receiverName: "Citra Dewi", amount: 249_000_000, timestamp: "2026-04-23 09:10:00", location: "Bandung", riskScore: 8.7, riskLevel: "critical", status: "investigating", method: "circular", zScore: 7.1 },
  { id: "TX003", senderId: "U099", senderName: "Budi Santoso", receiverId: "U001", receiverName: "Andi Prasetyo", amount: 448_000_000, timestamp: "2026-04-23 09:30:00", location: "Jakarta Selatan", riskScore: 9.5, riskLevel: "critical", status: "flagged", method: "circular", zScore: 9.1 },
  { id: "TX004", senderId: "U010", senderName: "Dewi Rahayu", receiverId: "U111", receiverName: "Eko Wijaya", amount: 125_000_000, timestamp: "2026-04-23 10:00:00", location: "Surabaya", riskScore: 7.3, riskLevel: "high", status: "flagged", method: "z-score", zScore: 5.8 },
  { id: "TX005", senderId: "U033", senderName: "Fajar Nugroho", receiverId: "U077", receiverName: "Gita Permata", amount: 78_500_000, timestamp: "2026-04-23 10:15:00", location: "Medan", riskScore: 6.1, riskLevel: "high", status: "flagged", method: "iqr", zScore: 4.2 },
  { id: "TX006", senderId: "U055", senderName: "Hendra Kurnia", receiverId: "U022", receiverName: "Indah Wulandari", amount: 35_000_000, timestamp: "2026-04-23 10:30:00", location: "Yogyakarta", riskScore: 4.8, riskLevel: "medium", status: "clear", method: "z-score", zScore: 2.9 },
  { id: "TX007", senderId: "U088", senderName: "Joko Susilo", receiverId: "U044", receiverName: "Kartika Sari", amount: 12_750_000, timestamp: "2026-04-23 11:00:00", location: "Semarang", riskScore: 3.2, riskLevel: "medium", status: "clear", method: "cluster", zScore: 2.1 },
  { id: "TX008", senderId: "U012", senderName: "Lina Marlina", receiverId: "U067", receiverName: "Maman Suparman", amount: 8_500_000, timestamp: "2026-04-23 11:15:00", location: "Bandung", riskScore: 1.8, riskLevel: "low", status: "clear", method: "z-score", zScore: 0.9 },
  { id: "TX009", senderId: "U034", senderName: "Nani Suryani", receiverId: "U089", receiverName: "Otto Firmansyah", amount: 225_000_000, timestamp: "2026-04-23 11:30:00", location: "Jakarta Utara", riskScore: 7.9, riskLevel: "high", status: "flagged", method: "isolation-forest", zScore: 6.3 },
  { id: "TX010", senderId: "U056", senderName: "Putri Anggraeni", receiverId: "U013", receiverName: "Rahmat Hidayat", amount: 5_200_000, timestamp: "2026-04-23 12:00:00", location: "Makassar", riskScore: 1.2, riskLevel: "low", status: "clear", method: "z-score", zScore: 0.4 },
  { id: "TX011", senderId: "U070", senderName: "Sari Indah", receiverId: "U091", receiverName: "Tono Hartono", amount: 565_000_000, timestamp: "2026-04-23 02:14:00", location: "Jakarta Barat", riskScore: 9.8, riskLevel: "critical", status: "flagged", method: "hybrid", zScore: 9.7 },
  { id: "TX012", senderId: "U021", senderName: "Umi Kalsum", receiverId: "U038", receiverName: "Vino Rangkuti", amount: 42_000_000, timestamp: "2026-04-23 12:30:00", location: "Palembang", riskScore: 3.5, riskLevel: "medium", status: "clear", method: "iqr", zScore: 2.4 },
  { id: "TX013", senderId: "U043", senderName: "Wahyu Setiawan", receiverId: "U059", receiverName: "Xena Puspita", amount: 189_000_000, timestamp: "2026-04-23 13:00:00", location: "Surabaya", riskScore: 7.1, riskLevel: "high", status: "investigating", method: "z-score", zScore: 5.3 },
  { id: "TX014", senderId: "U065", senderName: "Yani Kusuma", receiverId: "U002", receiverName: "Zahra Amelia", amount: 3_800_000, timestamp: "2026-04-23 13:15:00", location: "Bali", riskScore: 0.8, riskLevel: "low", status: "clear", method: "z-score", zScore: 0.2 },
  { id: "TX015", senderId: "U009", senderName: "Ahmad Fauzi", receiverId: "U078", receiverName: "Bagas Prakosa", amount: 88_000_000, timestamp: "2026-04-23 01:47:00", location: "Jakarta Timur", riskScore: 8.3, riskLevel: "critical", status: "flagged", method: "cluster", zScore: 7.6 },
];

// ── Alerts ────────────────────────────────────────────────────────────────────
export const alerts: Alert[] = [
  { id: "ALT001", txId: "TX011", userId: "U070", userName: "Sari Indah", reason: "Z-score 9.7 — Transfer tengah malam melebihi 500jt", riskLevel: "critical", score: 9.8, timestamp: "2026-04-23 02:14:22", status: "new", location: "Jakarta Barat" },
  { id: "ALT002", txId: "TX003", userId: "U099", userName: "Budi Santoso", reason: "Circular transfer terdeteksi: U001 → U099 → U001 dalam 30 menit", riskLevel: "critical", score: 9.5, timestamp: "2026-04-23 09:30:11", status: "new", location: "Jakarta Selatan" },
  { id: "ALT003", txId: "TX001", userId: "U001", userName: "Andi Prasetyo", reason: "Anomali jumlah transaksi — Z-score 8.4 melebihi threshold 5.0", riskLevel: "critical", score: 9.2, timestamp: "2026-04-23 09:00:45", status: "reviewed", location: "Jakarta Selatan" },
  { id: "ALT004", txId: "TX015", userId: "U009", userName: "Ahmad Fauzi", reason: "Cluster risiko tinggi — 7 transaksi serupa dalam 2 jam", riskLevel: "critical", score: 8.3, timestamp: "2026-04-23 01:47:33", status: "new", location: "Jakarta Timur" },
  { id: "ALT005", txId: "TX009", userId: "U034", userName: "Nani Suryani", reason: "Isolation Forest mendeteksi pola tidak normal pada volume transfer", riskLevel: "high", score: 7.9, timestamp: "2026-04-23 11:30:00", status: "new", location: "Jakarta Utara" },
  { id: "ALT006", txId: "TX004", userId: "U010", userName: "Dewi Rahayu", reason: "Z-score 5.8 — Transaksi melebihi rata-rata historis 580%", riskLevel: "high", score: 7.3, timestamp: "2026-04-23 10:00:22", status: "reviewed", location: "Surabaya" },
  { id: "ALT007", txId: "TX013", userId: "U043", userName: "Wahyu Setiawan", reason: "Pola velocity fraud — 5 transfer dalam 15 menit", riskLevel: "high", score: 7.1, timestamp: "2026-04-23 13:00:00", status: "new", location: "Surabaya" },
  { id: "ALT008", txId: "TX005", userId: "U033", userName: "Fajar Nugroho", reason: "IQR outlier — Nilai di atas Q3 + 2.8×IQR", riskLevel: "high", score: 6.1, timestamp: "2026-04-23 10:15:00", status: "resolved", location: "Medan" },
];

// ── Cases ─────────────────────────────────────────────────────────────────────
export const cases: Case[] = [
  { id: "CASE-001", userId: "U001", userName: "Andi Prasetyo", riskScore: 9.5, riskLevel: "critical", status: "investigating", assignedTo: "Rudi Hartanto", createdAt: "2026-04-23 09:35:00", updatedAt: "2026-04-23 11:20:00", totalTx: 8, totalAmount: 1_234_000_000, location: "Jakarta Selatan" },
  { id: "CASE-002", userId: "U070", userName: "Sari Indah", riskScore: 9.8, riskLevel: "critical", status: "open", assignedTo: "Maya Dewi", createdAt: "2026-04-23 02:18:00", updatedAt: "2026-04-23 02:18:00", totalTx: 3, totalAmount: 892_000_000, location: "Jakarta Barat" },
  { id: "CASE-003", userId: "U009", userName: "Ahmad Fauzi", riskScore: 8.3, riskLevel: "critical", status: "escalated", assignedTo: "Bima Santosa", createdAt: "2026-04-23 01:52:00", updatedAt: "2026-04-23 08:00:00", totalTx: 12, totalAmount: 2_145_000_000, location: "Jakarta Timur" },
  { id: "CASE-004", userId: "U034", userName: "Nani Suryani", riskScore: 7.9, riskLevel: "high", status: "investigating", assignedTo: "Rudi Hartanto", createdAt: "2026-04-23 11:45:00", updatedAt: "2026-04-23 12:30:00", totalTx: 5, totalAmount: 567_000_000, location: "Jakarta Utara" },
  { id: "CASE-005", userId: "U043", userName: "Wahyu Setiawan", riskScore: 7.1, riskLevel: "high", status: "open", assignedTo: "Unassigned", createdAt: "2026-04-23 13:05:00", updatedAt: "2026-04-23 13:05:00", totalTx: 7, totalAmount: 445_000_000, location: "Surabaya" },
];

// ── Chart Data ────────────────────────────────────────────────────────────────
export const last30DaysData: ChartDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date("2026-04-23");
  d.setDate(d.getDate() - (29 - i));
  const dateStr = d.toISOString().split("T")[0];
  const base = 180 + Math.sin(i * 0.4) * 40 + Math.random() * 30;
  const fraudBase = 12 + Math.sin(i * 0.6) * 5 + Math.random() * 8;
  return {
    date: dateStr,
    transactions: Math.round(base),
    alerts: Math.round(fraudBase),
    amount: Math.round((base * 45_000_000) + Math.random() * 500_000_000),
    fraud: Math.round(fraudBase),
  };
});

export const hourlyData = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, "0")}:00`,
  transactions: h >= 8 && h <= 20 ? randomBetween(12, 45) : randomBetween(1, 8),
  alerts: h >= 8 && h <= 20 ? randomBetween(0, 4) : randomBetween(0, 6),
}));

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const riskDistribution = [
  { name: "Critical", value: 8, color: "#ef4444" },
  { name: "High", value: 15, color: "#f59e0b" },
  { name: "Medium", value: 34, color: "#eab308" },
  { name: "Low", value: 143, color: "#10b981" },
];

export const locationData = [
  { location: "Jakarta Selatan", transactions: 487, alerts: 23, amount: 12_450_000_000 },
  { location: "Surabaya", transactions: 312, alerts: 15, amount: 8_230_000_000 },
  { location: "Bandung", transactions: 245, alerts: 9, amount: 5_670_000_000 },
  { location: "Medan", transactions: 198, alerts: 12, amount: 4_120_000_000 },
  { location: "Jakarta Barat", transactions: 176, alerts: 18, amount: 9_870_000_000 },
  { location: "Makassar", transactions: 143, alerts: 4, amount: 2_340_000_000 },
  { location: "Semarang", transactions: 134, alerts: 6, amount: 3_450_000_000 },
  { location: "Yogyakarta", transactions: 112, alerts: 3, amount: 2_100_000_000 },
];

// ── Activity Feed ─────────────────────────────────────────────────────────────
export const activityFeed: ActivityFeedItem[] = [
  { id: "1", time: "13:05", message: "Alert: TX013 – Velocity fraud terdeteksi (Wahyu Setiawan)", type: "alert", severity: "high" },
  { id: "2", time: "12:47", message: "Case CASE-004 diperbarui oleh Rudi Hartanto", type: "case", severity: "high" },
  { id: "3", time: "12:30", message: "CSV baru diupload — 4.991 baris berhasil diimpor", type: "upload" },
  { id: "4", time: "11:58", message: "Cluster risiko terdeteksi di node Jakarta Utara (5 akun)", type: "cluster", severity: "high" },
  { id: "5", time: "11:30", message: "Alert KRITIS: TX009 – Isolation Forest score 7.9", type: "alert", severity: "critical" },
  { id: "6", time: "10:15", message: "Alert: TX005 – IQR outlier di Medan (Fajar Nugroho)", type: "alert", severity: "high" },
  { id: "7", time: "09:35", message: "Case CASE-001 dibuka – Investigasi Andi Prasetyo dimulai", type: "case", severity: "critical" },
  { id: "8", time: "09:30", message: "KRITIS: Circular transfer U001 → U099 → U001 terdeteksi", type: "alert", severity: "critical" },
  { id: "9", time: "09:05", message: "Laporan eksekutif diekspor oleh Admin (PDF, 2.3MB)", type: "export" },
  { id: "10", time: "08:00", message: "Sistem Sentinel online — AI Engine aktif", type: "login" },
];

// ── Graph Nodes & Edges ───────────────────────────────────────────────────────
export const graphNodes: GraphNode[] = [
  { id: "U001", label: "Andi Prasetyo", risk: "critical", amount: 1_234_000_000, connections: 8 },
  { id: "U099", label: "Budi Santoso", risk: "critical", amount: 892_000_000, connections: 6 },
  { id: "U045", label: "Citra Dewi", risk: "high", amount: 345_000_000, connections: 4 },
  { id: "U070", label: "Sari Indah", risk: "critical", amount: 765_000_000, connections: 5 },
  { id: "U009", label: "Ahmad Fauzi", risk: "critical", amount: 2_145_000_000, connections: 12 },
  { id: "U034", label: "Nani Suryani", risk: "high", amount: 567_000_000, connections: 5 },
  { id: "U010", label: "Dewi Rahayu", risk: "high", amount: 234_000_000, connections: 3 },
  { id: "U111", label: "Eko Wijaya", risk: "medium", amount: 125_000_000, connections: 2 },
  { id: "U033", label: "Fajar Nugroho", risk: "medium", amount: 78_500_000, connections: 2 },
  { id: "U077", label: "Gita Permata", risk: "low", amount: 45_000_000, connections: 1 },
  { id: "U043", label: "Wahyu Setiawan", risk: "high", amount: 445_000_000, connections: 7 },
  { id: "U059", label: "Xena Puspita", risk: "medium", amount: 189_000_000, connections: 3 },
];

export const graphEdges: GraphEdge[] = [
  { source: "U001", target: "U099", amount: 450_000_000, timestamp: "2026-04-23 09:00:00" },
  { source: "U001", target: "U045", amount: 249_000_000, timestamp: "2026-04-23 09:10:00" },
  { source: "U099", target: "U001", amount: 448_000_000, timestamp: "2026-04-23 09:30:00" },
  { source: "U009", target: "U034", amount: 225_000_000, timestamp: "2026-04-23 11:30:00" },
  { source: "U070", target: "U043", amount: 565_000_000, timestamp: "2026-04-23 02:14:00" },
  { source: "U010", target: "U111", amount: 125_000_000, timestamp: "2026-04-23 10:00:00" },
  { source: "U033", target: "U077", amount: 78_500_000, timestamp: "2026-04-23 10:15:00" },
  { source: "U043", target: "U059", amount: 189_000_000, timestamp: "2026-04-23 13:00:00" },
  { source: "U045", target: "U009", amount: 198_000_000, timestamp: "2026-04-23 10:45:00" },
];
