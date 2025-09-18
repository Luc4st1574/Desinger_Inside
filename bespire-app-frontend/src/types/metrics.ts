export interface RawTask {
  id: string;
  completedAt: string; // ISO 8601 timestamp
  completionTimeHours: number;
  requiredRevision: boolean;
  clientRating?: number; // Optional, from 1 to 5
}

export interface ChartData {
  name: string;
  uv: number;
  pv: number;
  amt: number;
}

export interface PerformanceRecord {
  id: string;
  metricName: string;
  value: string;
  trend: "up" | "down" | "stable";
  period: string;
  details: string;
}

export interface Rating {
  stars: number;
  count: number;
  total: number;
}

export interface Task {
  id: string;
  name: string;
  assignees: { name: string; avatar: string }[];
  status: 'Completed' | 'In Progress';
}

export interface DistributionData {
  name: string;
  tasks: number;
}

export interface TotalTasks {
  count: number;
  change: string;
  changeType: "increase" | "decrease";
}