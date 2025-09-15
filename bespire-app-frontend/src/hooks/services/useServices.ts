import { useQuery } from "@apollo/client";
import { GET_SERVICES } from "@/graphql/queries/services/services";

export interface Service {
  id: string;
  title: string;
  credits: number;
  description?: string;
  status: "active" | "inactive";
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
}

export function useServices() {
  const { data, loading, error, refetch } = useQuery(GET_SERVICES, {
    fetchPolicy: "cache-first", // Usa cache primero, luego red si es necesario
  });

  return {
    services: data?.services || [],
    loading,
    error,
    refetch,
  };
}
