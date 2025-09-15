import { useMutation } from "@apollo/client";
import { UPDATE_REQUEST } from "@/graphql/mutations/requests/updateRequest";
import { GET_REQUESTS } from "@/graphql/mutations/requests/getRequests";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { GET_REQUEST_DETAIL } from "@/graphql/queries/requests/getRequestDetail";
import { FILES_BY_LINKED_TO_ID } from "@/graphql/queries/files/files";
import { LINKS_BY_LINKED_TO_ID } from "@/graphql/queries/links/links";
import { GET_REQUEST_CHANGE_LOG } from "@/graphql/queries/requests/getRequestChangeLog";
import { GET_REQUESTS_LIST_FOR_INTERNAL } from "@/graphql/queries/requests/requestsListForInternal";

export const useUpdateRequest = (requestId: string | null = null) => {
  const [updateRequestMutation, { loading }] = useMutation(UPDATE_REQUEST, {
    refetchQueries: [
      { query: GET_REQUESTS },
      { query: GET_REQUEST_CHANGE_LOG, variables: { requestId: requestId } },
      { query: GET_REQUEST_DETAIL, variables: { id: requestId } },
      { query: FILES_BY_LINKED_TO_ID, variables: { linkedToId: requestId } },
      { query: LINKS_BY_LINKED_TO_ID, variables: { linkedToId: requestId } },
      { query: GET_REQUESTS_LIST_FOR_INTERNAL },
    ],
    onCompleted: (data) => {
      if (data?.updateRequest) {
        showSuccessToast("Request Updated!");
      }
    },
    onError: (error) => {
      showErrorToast(error.message || "Error updating request");
    },
  });

  const updateRequest = async (
    requestId: string,
    input: Record<string, unknown>
  ) => {
    try {
      const result = await updateRequestMutation({
        variables: { requestId, input },
      });
      return result.data?.updateRequest;
    } catch (err) {
      throw err;
    }
  };

  return { updateRequest, loading };
};
