import { gql } from "@apollo/client";

export const GET_TEAM_MEMBERS_METRICS = gql`
query GetTeamMembersMetrics(
  $workspaceId: ID!,
  $range: ReportRange!,
  $search: String,
  $filters: TeamFilters,
  $sort: TeamSort,
  $page: Int,
  $limit: Int
) {
  teamMembersMetrics(
    workspaceId: $workspaceId, range: $range,
    search: $search, filters: $filters, sort: $sort,
    page: $page, limit: $limit
  ) {
    total
    items {
      id name role avatar
      kpi
      avgRating
      tasks
      workHours
      timePerRequest
      acceptTime
      responseTime
      revisions
      lateRate
    }
  }
}
`;
