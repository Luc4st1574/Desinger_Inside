import { useQuery } from "@apollo/client";
import { GET_SERVICE } from "@/graphql/queries/services/service";

export interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  credits: number;
  status: "active" | "inactive";
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
  inclusions: string[];
  exclusions: string[];
}

export function useService(id: string) {
  const { data, loading, error, refetch } = useQuery(GET_SERVICE, {
    variables: { id },
    fetchPolicy: "cache-first",
    skip: !id, // No ejecutar si no hay ID
  });

  return {
    service: data?.service || null,
    loading,
    error,
    refetch,
  };
}
