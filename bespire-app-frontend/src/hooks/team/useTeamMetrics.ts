"use client";

import { TeamOverview, TeamMembersMetricsResponse, ReportRange } from "@/graphql/types/team";
import { GET_TEAM_OVERVIEW } from "@/graphql/queries/team/getTeamOverview";
import { GET_TEAM_MEMBERS_METRICS } from "@/graphql/queries/team/getTeamMembersMetrics";
import { useQuery } from "@apollo/client";
import { mockTeamOverview, mockTeamMembers } from "@/mocks/team";

type UseOverviewArgs = { workspaceId: string; range: ReportRange };

type UseMembersArgs = { workspaceId: string; range: ReportRange; search?: string; filters?: Record<string, unknown> | null; sort?: { field: string; direction: string } | null; page?: number; limit?: number };

export function useTeamOverview({ workspaceId, range }: UseOverviewArgs) {
  const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

  const { data, loading, error, refetch } = useQuery(GET_TEAM_OVERVIEW, {
    variables: { workspaceId, range },
    skip: useMocks,
  });

  return {
    data: useMocks ? { teamOverview: mockTeamOverview } : data,
    loading: useMocks ? false : loading,
    error,
    refetch,
  };
}

export function useTeamMembers({ workspaceId, range, search, filters, sort, page = 1, limit = 25 }: UseMembersArgs) {
  const useMocks = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

  const { data, loading, error, refetch } = useQuery(GET_TEAM_MEMBERS_METRICS, {
    variables: { workspaceId, range, search, filters, sort, page, limit },
    skip: useMocks,
  });

  return {
    data: useMocks ? mockTeamMembers : data?.teamMembersMetrics,
    loading: useMocks ? false : loading,
    error,
    refetch,
  };
}
