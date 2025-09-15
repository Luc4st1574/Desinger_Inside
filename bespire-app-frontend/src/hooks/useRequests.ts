import { useQuery, useMutation } from "@apollo/client";
import { GET_REQUESTS } from "@/graphql/mutations/requests/getRequests";
import { UPDATE_REQUEST_ASSIGNEES } from "@/graphql/mutations/requests/updateRequestAssignees";
import { useAppContext } from "@/context/AppContext";
import { GET_REQUESTS_LIST_FOR_INTERNAL } from "@/graphql/queries/requests/requestsListForInternal";

// Lista de roles internos (ajusta si agregas más)

export function useRequests(statusFilter?: string) {
  console.log("useRequests called with statusFilter:", statusFilter);
  const { role } = useAppContext(); // <-- Asegúrate de obtener el rol del contexto global
  const userRole = role || "client"; // Fallback a "client" si no hay rol
  // Decide qué query usar según el rol
  const isInternal = userRole !== "client";

  const query = isInternal ? GET_REQUESTS_LIST_FOR_INTERNAL : GET_REQUESTS;

  const variables = statusFilter && statusFilter !== "all" ? { status: statusFilter } : {};
  console.log("useQuery variables:", variables); // Debug: verifica qué variables se envían

  const { data, loading, error, refetch, networkStatus } = useQuery(query, {
    fetchPolicy: "cache-and-network",
    variables,
    notifyOnNetworkStatusChange: true,
  });

  // Ajusta según el nombre del campo en tu query interna
  const requests = isInternal
    ? data?.requestsListForInternal || []
    : data?.getRequestList || [];

  const [
    updateRequestAssignees,
    { loading: loadingUpdate, error: errorUpdate },
  ] = useMutation(UPDATE_REQUEST_ASSIGNEES);

  // Mutación para actualizar los asignados (puedes condicionar si solo admin puede usar esto)
  const assignUsers = async (requestId: string, assigneeIds: string[]) => {
    await updateRequestAssignees({
      variables: {
        input: { requestId, assignees: assigneeIds },
      },
      refetchQueries: [{ query }],
    });
  };
  const isLoading = loading && networkStatus !== 7; // True en la carga inicial y refetches.
  return {
    requests,
    loading: isLoading, // 
    error,
    refetch,
    assignUsers,
    loadingUpdate,
    errorUpdate,
    isInternal, // Por si quieres condicionar UI en el componente
  };
}
