import { useQuery } from '@apollo/client';
import { GET_COMMENTS_FOR_ENTITY } from '../../graphql/queries/comments/getCommentsForEntity';

export const useCommentsForEntity = (linkedToId: string | null) => {
  const { data, loading, error, refetch } = useQuery(GET_COMMENTS_FOR_ENTITY, {
    variables: { linkedToId },
    skip: !linkedToId,
    fetchPolicy: 'network-only',
  });

  return {
    comments: data?.getCommentsForEntity || [],
    loading,
    error,
    refetch,
  };
};
