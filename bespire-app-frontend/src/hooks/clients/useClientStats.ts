import { useQuery } from '@apollo/client';
import { GET_CLIENT_STATS_BY_PERIOD } from '@/graphql/queries/clients/getClientStatsByPeriod';

export const useClientStats = (clientId?: string | number, period: string = 'weekly', options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true;

  const { data, loading, error, refetch } = useQuery(GET_CLIENT_STATS_BY_PERIOD, {
    variables: { id: clientId, period },
    skip: !enabled || !clientId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const stats = data?.getClientStats ?? null;

  return { stats, loading, error, refetch };
};

export default useClientStats;
