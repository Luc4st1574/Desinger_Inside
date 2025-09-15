import { useQuery } from '@apollo/client';
import { GET_CLIENT_FAVORITE_MEMBERS } from '@/graphql/queries/clients/getClientFavoriteMembers';

export const useClientFavoriteMembers = (clientId?: string | number, options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true;

  const { data, loading, error, refetch } = useQuery(GET_CLIENT_FAVORITE_MEMBERS, {
    variables: { id: clientId },
    skip: !enabled || !clientId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const members = data?.GetClientFavoriteMembers ?? [];

  return { members, loading, error, refetch };
};

export default useClientFavoriteMembers;
