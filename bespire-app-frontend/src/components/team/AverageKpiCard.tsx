// team/AverageKpiCard.tsx
"use client";

import React from "react";
import KpiBarChart from "./KpiBarChart";
import { KpiPoint } from "@/graphql/types/team";
import TrendBadge from "../ui/TrendBadge";

type Props = {
  score: number;
  trendValue: string;
  comparisonText: string;
  chartData: KpiPoint[];
  loading?: boolean;
};

const TrendIndicator = ({ value, direction }: { value: string; direction: "up" | "down" }) => {
  const isUp = direction === "up";
  const colorClass = isUp ? "text-green-600" : "text-red-600";
  const arrow = isUp ? "↑" : "↗";

  return (
    <span className={`inline-flex items-center text-sm font-semibold ${colorClass}`}>
      {value} {arrow}
    </span>
  );
};


export default function AverageKpiCard({ score, trendValue, comparisonText, chartData, loading }: Props) {
  return (
     <div className="bg-white rounded-lg border border-green-gray-100 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-green-gray-500">Average KPI Score</h3>
        <a href="#" className="text-base font-medium text-green-gray-950 ">View all →</a>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading KPI...</div>
      ) : (
        <>
          <div className="flex items-baseline gap-3">
            <p className="text-5xl font-medium text-gray-900">{score}%</p>

             <TrendBadge percentage={trendValue} trend="up" trendColor="green" />
          </div>
          <p className="text-base text-green-gray-500">{comparisonText}</p>
          
          {/* Contenedor que se estira para dar espacio al gráfico */}
          <div className="mt-4 flex-1 min-h-[200px]">
            <KpiBarChart data={chartData} loading={loading} />
          </div>
        </>
      )}
    </div>
  );
}