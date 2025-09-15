import { useMutation } from "@apollo/client";
import { UPDATE_SERVICE } from "@/graphql/mutations/services/updateService";

export interface UpdateServiceInput {
  id: string;
  title?: string;
  description?: string;
  credits?: number;
  categoryId?: string;
  inclusions?: string[];
  exclusions?: string[];
}

export function useUpdateService() {
  const [updateService, { loading, error }] = useMutation(UPDATE_SERVICE);

  const update = async (input: UpdateServiceInput) => {
    const result = await updateService({
      variables: { input },
      refetchQueries: ['GetServices'], // Refetch la lista de servicios
    });
    return result.data?.updateService;
  };

  return {
    update,
    loading,
    error,
  };
}
