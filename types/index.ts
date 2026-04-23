export type RiskLevel = "critical" | "high" | "medium" | "low";
export type TxStatus = "flagged" | "clear" | "investigating" | "resolved";
export type CaseStatus = "open" | "investigating" | "escalated" | "closed";
export type UserRole = "admin" | "auditor" | "analyst" | "viewer";
export type DetectionMethod = "z-score" | "iqr" | "isolation-forest" | "circular" | "cluster" | "hybrid";
export type DateRange = "today" | "7d" | "30d" | "90d";

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
  zScore: number;
  isFlagged: boolean;
  isCircular: boolean;
  isDormantReactivation: boolean;
  isVelocityAlert: boolean;
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

export interface KPIStats {
  totalTransactions: number;
  totalAlerts: number;
  totalAmount: number;
  uniqueUsers: number;
  avgAmount: number;
  fraudRate: number;
  systemHealth: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  prevTotalTransactions: number;
  prevTotalAlerts: number;
  prevTotalAmount: number;
  prevUniqueUsers: number;
}

export interface ChartDataPoint {
  date: string;
  transactions: number;
  alerts: number;
  amount: number;
  fraud: number;
}

export interface HourlyDataPoint {
  hour: string;
  transactions: number;
  alerts: number;
}

export interface LocationDataPoint {
  location: string;
  transactions: number;
  alerts: number;
  amount: number;
}

export interface RiskDistributionPoint {
  name: string;
  value: number;
  color: string;
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

export interface CircularFlow {
  path: string[];
  pathLabel: string;
  amount: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  risk: RiskLevel;
}

export interface AIInsight {
  id: number;
  type: RiskLevel;
  icon: string;
  title: string;
  summary: string;
  confidence: number;
  action: string;
  tags: string[];
}

export interface AIRecommendation {
  icon: string;
  label: string;
  desc: string;
  severity: RiskLevel;
  count: number | null;
}

export interface ExplainabilityFactor {
  factor: string;
  weight: number;
  color: string;
}

export interface ActivityFeedItem {
  id: string;
  time: string;
  message: string;
  type: "alert" | "upload" | "cluster" | "login" | "export" | "case";
  severity?: RiskLevel;
}

export interface FilterState {
  dateRange: DateRange;
  riskLevel: RiskLevel | "all";
  location: string;
  selectedMethod: DetectionMethod | "all";
  threshold: number;
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
