import { useMutation } from '@apollo/client';
import { CREATE_REQUEST } from '@/graphql/mutations/requests/createRequest';
import { GET_REQUESTS } from '@/graphql/mutations/requests/getRequests';
import { showSuccessToast, showErrorToast } from '@/components/ui/toast';
import { GET_REQUESTS_LIST_FOR_INTERNAL } from '@/graphql/queries/requests/requestsListForInternal';

export const useCreateRequest = () => {
  const [createRequestMutation, { loading }] = useMutation(CREATE_REQUEST, {
    refetchQueries: [
      { query: GET_REQUESTS },
      { query: GET_REQUESTS_LIST_FOR_INTERNAL }
    ],
    onCompleted: (data) => {
      if (data?.createRequest) {
        showSuccessToast('Request Created!');
      }
    },
    onError: (error) => {
      showErrorToast(error.message || 'Error creating request');
    },
  });

  const createRequest = async (input: Record<string, unknown>) => {
    try {
      const result = await createRequestMutation({ variables: { input } });
      return result.data?.createRequest;
    } catch (err) {
      throw err;
    }
  };

  return { createRequest, loading };
};
