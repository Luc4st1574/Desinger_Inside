import { useQuery } from '@apollo/client';
import { FIND_REQUEST_BY_ID } from '@/graphql/queries/requests/findRequestById';

export const useRequestById = (id: string | null) => {
  const { data, loading, error, refetch } = useQuery(FIND_REQUEST_BY_ID, {
    variables: { id },
    skip: !id, // Solo ejecuta si hay id
    fetchPolicy: 'network-only', // Siempre trae datos frescos
  });

  return {
    request: data?.findRequestById || null,
    loading,
    error,
    refetch,
  };
};
