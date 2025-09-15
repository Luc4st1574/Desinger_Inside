import { useMutation } from "@apollo/client";
import DELETE_REQUEST from "@/graphql/team/deleteRequest";
import { GET_REQUESTS } from "@/graphql/mutations/requests/getRequests";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import { GET_REQUESTS_LIST_FOR_INTERNAL } from "@/graphql/queries/requests/requestsListForInternal";

type UseDeleteRequestReturn = {
  deleteRequest: (id: string) => Promise<void>;
  loading: boolean;
};

export default function useDeleteRequest(): UseDeleteRequestReturn {
  const [mutate, { loading }] = useMutation(DELETE_REQUEST, {
    refetchQueries: [
      { query: GET_REQUESTS },

      { query: GET_REQUESTS_LIST_FOR_INTERNAL },
    ],
  });

  const deleteRequest = async (id: string) => {
    try {
      const res = await mutate({ variables: { id } });
      const data = res && (res as { data?: { deleteRequest?: string } }).data;
      const message = data?.deleteRequest ?? "Request deleted";
      showSuccessToast(message);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete request";
      showErrorToast(String(message));
      throw err;
    }
  };

  return { deleteRequest, loading: !!loading };
}
