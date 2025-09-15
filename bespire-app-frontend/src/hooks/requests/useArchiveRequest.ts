import { showErrorToast, showSuccessToast } from '@/components/ui/toast';
import { GET_REQUESTS } from '@/graphql/mutations/requests/getRequests';
import { useMutation, gql } from '@apollo/client';
import toast from 'react-hot-toast'; // Ajusta si usas otra librería de toasts

const ARCHIVE_REQUEST = gql`
  mutation ArchiveRequest($id: ID!) {
    archiveRequest(id: $id)
  }
`;

export const useArchiveRequest = (onSuccess?: () => void) => {
  const [archiveRequestMutation, { loading, error }] = useMutation(ARCHIVE_REQUEST, {
    refetchQueries: [
          { query: GET_REQUESTS },
        ],
    onCompleted: (data) => {
      showSuccessToast('Request archived successfully');
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      console.log(err);
      showErrorToast(`Error archiving request: ${err.message}`);
    },
  });

  const archiveRequest = async (id: string) => {
    try {
      await archiveRequestMutation({ variables: { id } });
      
    } catch (err) {
      // Error ya manejado en onError
      console.log(err);
    }
  };

  return { archiveRequest, loading, error };
};