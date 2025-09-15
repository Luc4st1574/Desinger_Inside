import { GET_TEAM_LIST_ADMIN } from '@/graphql/queries/team/getTeamListAdmin';
import { useQuery } from '@apollo/client';

export interface TeamListAdmin {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roleTitle?: string;
  workspaceId: string;
  rating: number;
  kpi?: number;
  tasks?: number;
  workHours?: string;
  timeRequest?: string;
  acceptTime: string;
  response: string;
  revisions: number;
  lateRate: number;

}

export interface UseTeamListAdminResult {
  team_members: TeamListAdmin[];
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

export const useTeamListAdmin = (): UseTeamListAdminResult => {
  const { data, loading, error, refetch } = useQuery(GET_TEAM_LIST_ADMIN, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const team_members = data?.getTeamListAdmin || [];

  return {
    team_members,
    loading,
    error,
    refetch,
  };
};
