import { useQuery } from "@apollo/client";
import { GET_PLAN_BY_ID } from "@/graphql/queries/plans/plan";

export interface PlanDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  stripePriceId: string;
  price: number;
  creditsPerMonth: number;
  brandsAllowed: number;
  activeOrdersAllowed: number;
  includedServices: string[];
  excludedServices: string[];
  active: boolean;
  icon?: string;
  bg?: string;
}

export function usePlan(id: string) {
  const { data, loading, error, refetch } = useQuery(GET_PLAN_BY_ID, {
    variables: { id },
    fetchPolicy: "cache-first",
    skip: !id,
  });

  return {
    plan: data?.findPlanById || null,
    loading,
    error,
    refetch,
  };
}
