"use client";

import React from "react";
import MetricCard from "./MetricCard";
import KpiBarChart from "./KpiBarChart";
import TopPerformersCard from "./TopPerformersCard";
import TopContributorsList from "./TopContributorsList";
import { TeamOverview } from "@/graphql/types/team";

type Props = {
  data?: TeamOverview;
  loading?: boolean;
};

export default function OverviewMetrics({ data, loading }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      <MetricCard title="Avg Task Completion (days)" value={data?.avgTaskCompletionDays ?? '-'} loading={loading} />
      <MetricCard title="Revision Rate" value={data?.revisionRate ?? '-'} loading={loading} />
      <MetricCard title="Overall Client Rating" value={data?.overallClientRating ?? '-'} loading={loading} />
      <MetricCard title="Task Volume" value={data?.taskVolume ?? '-'} loading={loading} />

      <div className="md:col-span-2 lg:col-span-3">
        <KpiBarChart data={data?.kpiTrend} loading={loading} />
      </div>

      <div className="lg:col-span-1 space-y-4">
        <TopPerformersCard title="Top Performers" items={data?.topPerformers} loading={loading} />
        <TopContributorsList items={data?.topContributors} loading={loading} />
      </div>
    </div>
  );
}
