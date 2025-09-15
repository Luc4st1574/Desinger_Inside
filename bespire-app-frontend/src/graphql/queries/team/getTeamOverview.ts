import { gql } from "@apollo/client";

export const GET_TEAM_OVERVIEW = gql`
query GetTeamOverview($workspaceId: ID!, $range: ReportRange!) {
  teamOverview(workspaceId: $workspaceId, range: $range) {
    avgTaskCompletionDays
    revisionRate
    overallClientRating
    taskVolume
    kpiTrend { label value }
    topPerformers { id name role avatar kpi avgRating tasks }
    topContributors { id name role avatar kpi avgRating tasks }
  }
}
`;
