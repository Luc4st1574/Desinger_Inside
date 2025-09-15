import { useMutation } from "@apollo/client";
import { UPDATE_REQUEST_FIELDS } from "@/graphql/mutations/requests/UpdateRequestFields";
import { GET_REQUESTS } from "@/graphql/mutations/requests/getRequests";
import { GET_REQUEST_CHANGE_LOG } from "@/graphql/queries/requests/getRequestChangeLog";
import { GET_COMMENTS_FOR_ENTITY } from "@/graphql/queries/comments/getCommentsForEntity";

export function useRequestPriority(requestId: string | null = null) {
  const [updateRequestFields, { loading, error }] = useMutation(
    UPDATE_REQUEST_FIELDS,
  );

  const updatePriority = async (requestId: string, newPriority: string) => {
    if (!requestId) return;

    try {
      await updateRequestFields({
        variables: {
          input: {
            requestId,
            priority: newPriority,
          },
        },
        // Actualizar múltiples queries que podrían mostrar la prioridad
        refetchQueries: [
          {
            query: GET_REQUEST_CHANGE_LOG,
            variables: { requestId: requestId },
          },
          { query: GET_REQUESTS },
          {
            query: GET_COMMENTS_FOR_ENTITY,
            variables: { linkedToId: requestId },
          },
        ],
        awaitRefetchQueries: true,
      });
    } catch (err) {
      console.error("Error updating priority:", err);
      throw err;
    }
  };

  return {
    updatePriority,
    loading,
    error,
  };
}
