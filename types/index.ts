export type RiskLevel = "critical" | "high" | "medium" | "low";
export type TxStatus = "flagged" | "clear" | "investigating" | "resolved";
export type CaseStatus = "open" | "investigating" | "escalated" | "closed";
export type UserRole = "admin" | "auditor" | "analyst" | "viewer";
export type DetectionMethod = "z-score" | "iqr" | "isolation-forest" | "circular" | "cluster" | "hybrid";

export interface Transaction {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  amount: number;
  timestamp: string;
  location: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: TxStatus;
  method: DetectionMethod;
  zScore?: number;
}

export interface Alert {
  id: string;
  txId: string;
  userId: string;
  userName: string;
  reason: string;
  riskLevel: RiskLevel;
  score: number;
  timestamp: string;
  status: "new" | "reviewed" | "resolved";
  location: string;
}

export interface Case {
  id: string;
  userId: string;
  userName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: CaseStatus;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  totalTx: number;
  totalAmount: number;
  location: string;
}

export interface KPICard {
  label: string;
  value: string | number;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
  icon: string;
  color: "cyan" | "green" | "orange" | "red" | "purple";
  suffix?: string;
}

export interface ChartDataPoint {
  date: string;
  transactions: number;
  alerts: number;
  amount: number;
  fraud: number;
}

export interface GraphNode {
  id: string;
  label: string;
  risk: RiskLevel;
  amount: number;
  connections: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  amount: number;
  timestamp: string;
}

export interface ActivityFeedItem {
  id: string;
  time: string;
  message: string;
  type: "alert" | "upload" | "cluster" | "login" | "export" | "case";
  severity?: RiskLevel;
}

export interface GlobalFilters {
  dateRange: "today" | "7d" | "30d" | "90d" | "custom";
  riskLevel: RiskLevel | "all";
  location: string;
  amountMin: number;
  amountMax: number;
  detectionMethod: DetectionMethod | "all";
}
