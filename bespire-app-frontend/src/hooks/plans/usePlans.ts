import { useQuery } from "@apollo/client";
import { GET_PLANS } from "@/graphql/queries/plans/plans";

export interface Plan {
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

export function usePlans() {
  const { data, loading, error, refetch } = useQuery(GET_PLANS, {
    fetchPolicy: "cache-first",
  });

  return {
    plans: data?.findAllPlans || [],
    loading,
    error,
    refetch,
  };
}
