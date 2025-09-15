export type ReportRange = "day" | "week" | "month" | "year";

export type KpiPoint = {
  label: string;
  value: number;
};

export type TeamMemberMetrics = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  kpi: number; // percentage
  avgRating: number;
  tasks: number;
  workHours: number;
  timePerRequest: number;
  acceptTime: number;
  responseTime: number;
  revisions: number;
  lateRate: number;
};

export type TopPerformer = {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  kpi?: number;
  avgRating?: number;
  tasks?: number;
};

export type TeamOverview = {
  avgTaskCompletionDays: number;
  revisionRate: number;
  overallClientRating: number;
  taskVolume: number;
  kpiTrend: KpiPoint[];
  topPerformers: TopPerformer[];
  topContributors: TopPerformer[];
};

export type TeamMembersMetricsResponse = {
  total: number;
  items: TeamMemberMetrics[];
};
