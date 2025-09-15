import { useQuery } from '@apollo/client';
import { GET_REQUEST_CHANGE_LOG } from '../../graphql/queries/requests/getRequestChangeLog';

export const useRequestChangeLog = (requestId: string | null) => {
  const { data, loading, error, refetch } = useQuery(GET_REQUEST_CHANGE_LOG, {
    variables: { requestId },
    skip: !requestId,
    fetchPolicy: 'network-only',
  });

  return {
    changeLog: data?.requestChangeLog || [],
    loading,
    error,
    refetch,
  };
};
