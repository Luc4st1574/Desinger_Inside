export interface Metric {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
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