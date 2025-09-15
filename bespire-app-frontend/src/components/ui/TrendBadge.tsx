"use client";

import React from "react";
import Image from "next/image";

type Trend = "up" | "down" | "neutral";

interface Props {
  percentage: React.ReactNode;
  trend: Trend;
  trendColor?: "green" | "red" | "gray";
  className?: string;
}

const getTrendIcon = (trend: Trend) => {
  switch (trend) {
    case "up":
      return <Image src="/assets/icons/trend_icon-up.svg" alt="up" width={16} height={16} />;
    case "down":
      return <Image src="/assets/icons/trend_icon-down.svg" alt="down" width={16} height={16} />;
    case "neutral":
    default:
      return <Image src="/assets/icons/trend_icon-neutral.svg" alt="neutral" width={16} height={16} />;
  }
};

const getTrendColorClass = (trendColor?: Props["trendColor"]) => {
  switch (trendColor) {
    case "green":
      return "text-green-600";
    case "red":
      return "text-red-600";
    case "gray":
    default:
      return "text-gray-600";
  }
};

const getTrendBackgroundClass = (trend: Trend) => {
  switch (trend) {
    case "up":
      return "bg-[#F3FEE7]";
    case "down":
      return "bg-[#FFE8E8]";
    case "neutral":
    default:
      return "bg-gray-100";
  }
};

export default function TrendBadge({ percentage, trend, trendColor, className = "" }: Props) {
  return (
    <span className={`ml-2 text-sm font-medium px-2 py-1 flex items-center gap-2 rounded-md ${getTrendBackgroundClass(trend)} ${getTrendColorClass(trendColor)} ${className}`}>
      <span>{percentage}</span>
      {getTrendIcon(trend)}
    </span>
  );
}
