import { useQuery } from "@apollo/client";
import { GET_CLIENTS_LIST_ADMIN } from "@/graphql/queries/clients/getClientListAdmin";

export interface ClientListAdmin {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  roleTitle?: string;
  workspaceId: string;
  workspaceName: string;
  companyId: string;
  companyName: string;
  plan?: {
    name: string;
    icon?: string;
    bg?: string;
  };
  rating: number;
  timeRequest?: string;
  revisions?: string;
  lastSession?: Date;
  contractStart?: Date;
  status: string;
}

export interface UseClientsListAdminResult {
  clients: ClientListAdmin[];
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

export const useClientsListAdmin = (role: string | null = "admin"): UseClientsListAdminResult => {
  const { data, loading, error, refetch } = useQuery(GET_CLIENTS_LIST_ADMIN, {
    skip: role !== "admin",
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const clients = data?.getClientListAdmin || [];

  return {
    clients,
    loading,
    error,
    refetch,
  };
};
