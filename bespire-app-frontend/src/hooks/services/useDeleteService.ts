import { useMutation } from "@apollo/client";
import { DELETE_SERVICE } from "@/graphql/mutations/services/deleteService";

export function useDeleteService() {
  const [deleteService, { loading, error }] = useMutation(DELETE_SERVICE);

  const remove = async (id: string) => {
    const result = await deleteService({
      variables: { id },
      refetchQueries: ['GetServices'], // Refetch la lista de servicios
    });
    return result.data?.removeService;
  };

  return {
    remove,
    loading,
    error,
  };
}
