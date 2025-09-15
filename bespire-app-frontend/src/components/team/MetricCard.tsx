// team/MetricCard.tsx
"use client";

import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trendValue: string;
  trendDirection: "up" | "down";
  subtitle: string;
  loading?: boolean;
};

const TrendIndicator = ({ value, direction }: { value: string; direction: "up" | "down" }) => {
  const isUp = direction === "up";
  const colorClass = isUp ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
  const arrow = isUp ? "↑" : "↓";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {value} {arrow}
    </span>
  );
};

export default function MetricCard({
  icon,
  title,
  value,
  trendValue,
  trendDirection,
  subtitle,
  loading,
}: Props) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col h-full">
      <div className="flex items-center text-gray-500 mb-4">
        {icon}
        <h3 className="text-sm font-medium ml-2">{title}</h3>
      </div>
      {loading ? (
        <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
            <TrendIndicator value={trendValue} direction={trendDirection} />
          </div>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </>
      )}
    </div>
  );
}