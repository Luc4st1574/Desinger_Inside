import { useMutation } from "@apollo/client";
import { DELETE_PLAN } from "@/graphql/mutations/plans/deletePlan";

export function useDeletePlan() {
  const [deletePlan, { loading, error }] = useMutation(DELETE_PLAN);

  const remove = async (id: string) => {
    const result = await deletePlan({
      variables: { id },
      refetchQueries: ['GetPlans'], // Refetch la lista de planes
    });
    return result.data?.removePlan;
  };

  return {
    remove,
    loading,
    error,
  };
}
