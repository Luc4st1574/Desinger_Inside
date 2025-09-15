import { useQuery } from "@apollo/client";
import { GET_SERVICE_CATEGORIES } from "@/graphql/queries/services/serviceCategories";

export interface ServiceCategory {
  id: string;
  name: string;
}

export function useServiceCategories() {
  const { data, loading, error, refetch } = useQuery(GET_SERVICE_CATEGORIES, {
    fetchPolicy: "cache-first",
  });

  return {
    categories: data?.serviceCategories || [],
    loading,
    error,
    refetch,
  };
}
