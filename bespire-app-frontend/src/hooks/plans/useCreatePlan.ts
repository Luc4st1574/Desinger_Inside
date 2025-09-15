import { useMutation } from "@apollo/client";
import { CREATE_PLAN } from "@/graphql/mutations/plans/createPlan";

export interface CreatePlanInput {
  name: string;
  slug: string;
  description: string;
  stripePriceId: string;
  price: number;
  creditsPerMonth: number;
  brandsAllowed: number;
  activeOrdersAllowed: number;
  includedServices?: string[];
  excludedServices?: string[];
  active?: boolean;
  icon?: string;
  bg?: string;
}

export function useCreatePlan() {
  const [createPlan, { loading, error }] = useMutation(CREATE_PLAN);

  const create = async (input: CreatePlanInput) => {
    const result = await createPlan({
      variables: { createPlanInput: input },
      refetchQueries: ['GetPlans'],
    });
    return result.data?.createPlan;
  };

  return {
    create,
    loading,
    error,
  };
}
