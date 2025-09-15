import { TeamOverview, TeamMembersMetricsResponse } from "@/graphql/types/team";

export const mockTeamOverview: TeamOverview = {
  avgTaskCompletionDays: 2.4,
  revisionRate: 1.2,
  overallClientRating: 4.6,
  taskVolume: 124,
  kpiTrend: [
    { label: "Mar 1–7", value: 60 },
    { label: "Mar 8–14", value: 70 },
    { label: "Mar 15–21", value: 55 },
    { label: "Mar 22–28", value: 75 },
  ],
  topPerformers: [
    { id: "1", name: "Ana", role: "Designer", avatar: '', kpi: 92, avgRating: 4.8, tasks: 34 },
    { id: "2", name: "Carlos", role: "Developer", avatar: '', kpi: 88, avgRating: 4.6, tasks: 29 },
    { id: "4", name: "Marta", role: "Designer", avatar: '', kpi: 86, avgRating: 4.4, tasks: 21 },
  ],
  topContributors: [
    { id: "3", name: "Luis", role: "PM", avatar: '', kpi: 85, avgRating: 4.5, tasks: 40 },
  ],
};

export const mockTeamMembers: TeamMembersMetricsResponse = {
  total: 6,
  items: [
    { id: '1', name: 'Ana', role: 'Designer', avatar: '', kpi: 92, avgRating: 4.8, tasks: 34, workHours: 120, timePerRequest: 1.2, acceptTime: 30, responseTime: 2.5, revisions: 1.1, lateRate: 2 },
    { id: '2', name: 'Carlos', role: 'Developer', avatar: '', kpi: 88, avgRating: 4.6, tasks: 29, workHours: 100, timePerRequest: 1.6, acceptTime: 45, responseTime: 3.1, revisions: 1.3, lateRate: 4 },
    { id: '3', name: 'Luis', role: 'PM', avatar: '', kpi: 85, avgRating: 4.5, tasks: 40, workHours: 140, timePerRequest: 0.9, acceptTime: 20, responseTime: 1.8, revisions: 1.0, lateRate: 1 },
    { id: '4', name: 'Marta', role: 'Designer', avatar: '', kpi: 86, avgRating: 4.4, tasks: 21, workHours: 90, timePerRequest: 1.1, acceptTime: 35, responseTime: 2.0, revisions: 1.2, lateRate: 3 },
    { id: '5', name: 'Diego', role: 'Developer', avatar: '', kpi: 78, avgRating: 4.1, tasks: 18, workHours: 80, timePerRequest: 2.0, acceptTime: 50, responseTime: 4.0, revisions: 1.6, lateRate: 7 },
    { id: '6', name: 'Sofia', role: 'QA', avatar: '', kpi: 82, avgRating: 4.3, tasks: 24, workHours: 95, timePerRequest: 1.4, acceptTime: 40, responseTime: 2.8, revisions: 1.0, lateRate: 5 },
  ],
};
