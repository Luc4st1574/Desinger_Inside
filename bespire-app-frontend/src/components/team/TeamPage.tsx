"use client";

import { useEffect } from "react";
import OverviewMetricsComponent from "./OverviewMetricsComponent";
import TeamMetricsTable from "./TeamMetricsTable";
import TeamFilters from "./TeamFilters";
import { useTeamOverview, useTeamMembers } from "@/hooks/team/useTeamMetrics";
import { ReportRange } from "@/graphql/types/team";
import ClientList from "../clients/ClientList";
import { mockClients } from "@/mocks/clients";
import TeamList from "./TeamList";

export default function TeamPage() {
  const range: ReportRange = "WEEK";
    const workspaceId = process.env.NEXT_PUBLIC_WORKSPACE_ID || "workspace_1";

  const { data: overview, loading: loadingOverview, refetch: refetchOverview } = useTeamOverview({ workspaceId, range });
  const { data: membersData, loading: loadingMembers, refetch: refetchMembers } = useTeamMembers({ workspaceId, range, page: 1, limit: 25 });

    useEffect(() => {
        refetchOverview?.();
        refetchMembers?.();
    }, [range, refetchOverview, refetchMembers]);

  return (
    <section className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 flex flex-col gap-6">
      <OverviewMetricsComponent data={overview?.teamOverview} loading={loadingOverview} />

       <TeamList />
    </section>
  );
}
