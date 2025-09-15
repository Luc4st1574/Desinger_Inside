import { useMutation } from "@apollo/client";
import { UPDATE_PLAN } from "@/graphql/mutations/plans/updatePlan";

export interface UpdatePlanInput {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  stripePriceId?: string;
  price?: number;
  creditsPerMonth?: number;
  brandsAllowed?: number;
  activeOrdersAllowed?: number;
  includedServices?: string[];
  excludedServices?: string[];
  active?: boolean;
  icon?: string;
  bg?: string;
}

export function useUpdatePlan() {
  const [updatePlan, { loading, error }] = useMutation(UPDATE_PLAN);

  const update = async (input: UpdatePlanInput) => {
    const result = await updatePlan({
      variables: { updatePlanInput: input },
      refetchQueries: ['GetPlans'],
    });
    return result.data?.updatePlan;
  };

  return {
    update,
    loading,
    error,
  };
}
