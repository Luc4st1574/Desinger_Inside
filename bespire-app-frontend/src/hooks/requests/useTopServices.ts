import { useQuery } from "@apollo/client";
import { GET_TOP_SERVICES_BY_WORKSPACE } from "@/graphql/queries/requests/topServicesByWorkspace";
import { useMemo } from "react";

export type TopService = {
  _id: string;
  Type: string;
  count: number;
};

export default function useTopServices(workspaceId?: string | null) {
  const { data, loading, error, refetch } = useQuery<{ topServicesByWorkspace: TopService[] }>(GET_TOP_SERVICES_BY_WORKSPACE, {
    variables: { workspaceId },
    skip: !workspaceId,
    fetchPolicy: "cache-first",
  });

  const services = useMemo(() => data?.topServicesByWorkspace ?? [], [data]);

  return { services, loading, error, refetch };
}
