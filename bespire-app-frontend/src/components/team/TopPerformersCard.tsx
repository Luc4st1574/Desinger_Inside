// team/TopPerformersCard.tsx
"use client";

import React from "react";
import { TopPerformer } from "@/graphql/types/team"; // Usamos el tipo existente
import TrendBadge from "../ui/TrendBadge";
import AvatarListLink from "@/components/ui/AvatarListLink";

type Props = {
  memberCount: number;
  trendValue: string;
  topPerformers: TopPerformer[];
  needsReview: TopPerformer[];
  loading?: boolean;
};

export default function TopPerformersCard({
  memberCount,
  trendValue,
  topPerformers,
  needsReview,
  loading,
}: Props) {
  return (
    <div className="bg-green-bg-400 rounded-lg  p-4 h-full">
      <div className="flex flex-col items-start">
        <div>
          <h3 className="text-lg font-medium text-green-gray-500">
            Top Performers
          </h3>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-medium text-gray-900">{memberCount} members</p>

            <TrendBadge percentage={trendValue} trend="up" trendColor="green" />
          </div>
        </div>
      </div>
      <p className="text-base text-green-gray-500">compared last week</p>

      {loading ? (
        <div className="mt-6 space-y-4">
          <div className="h-10 bg-white/50 rounded-lg animate-pulse"></div>
          <div className="h-10 bg-white/50 rounded-lg animate-pulse"></div>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          <AvatarListLink title="Top Performers" users={topPerformers} href="#top-performers" />
          <AvatarListLink title="Needs Review" users={needsReview} href="#needs-review" />
        </div>
      )}
    </div>
  );
}
