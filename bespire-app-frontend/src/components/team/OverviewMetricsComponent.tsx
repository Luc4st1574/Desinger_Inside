// team/OverviewMetrics.tsx
"use client";

import { useState } from "react";
import AverageKpiCard from "./AverageKpiCard";
import TopPerformersCard from "./TopPerformersCard";
import TopContributorsList from "./TopContributorsList";
import TabSelector from "../ui/TabSelector";
import MetricsGrid from "../ui/MetricsGrid";
import People from "@/assets/icons/people.svg";
import Revision from "@/assets/icons/revision.svg";
import StarCircle from "@/assets/icons/star-circle.svg";
import Customize from "@/assets/icons/customize.svg";
import { useMemo } from "react";

// --- Mock Data (sin cambios) ---
const mockData = {
  summaryMetrics: [
    {
     id: "active-clients",
      title: "Ave Task Completion",
      value: 2.5,
      percentage: "5.27%",
      description: "Average time taken to complete tasks",
      icon: People,
      trend: "up" as const,
      trendColor: "green" as const,
    },
     {
      id: "revision-rate",
      title: "Revision Rate",
      value: 1.8,
      percentage: "8.35%",
      description: "Tasks required revisions",
      icon: Revision,
      trend: "down" as const,
      trendColor: "red" as const,
    },
    {
      id: "overall-rating",
      title: "Overall Client Ratings",
      value: 4.8,
      percentage: "8.35%",
      description: "Across 32 completed tasks",
      icon: StarCircle,
      trend: "up" as const,
      trendColor: "green" as const,
    },
    {
      id: "task-volume",
      title: "Task Volume",
      value: 120,
      percentage: "5.27%",
      description: "Total tasks created",
      icon: Customize,
      trend: "down" as const,
      trendColor: "red" as const,
    },
  
  ],
  averageKpi: {
    score: 98,
    trendValue: "18%",
    comparisonText: "compared last week",
    chartData: [
      { label: "Mar 1-7", value: 96 },
      { label: "Mar 8-14", value: 92 },
      { label: "Mar 15-21", value: 82 },
      { label: "Mar 22-28", value: 98 },
    ],
  },
  topPerformers: {
    memberCount: 9,
    trendValue: "18%",
    performers: [
      { id: "1", name: "User A", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
      { id: "2", name: "User B", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
      { id: "3", name: "User C", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
    ],
    needsReview: [
      { id: "4", name: "User D", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
      { id: "5", name: "User E", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
      { id: "6", name: "User F", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
    ],
  },
  topContributors: [
    { id: "1", name: "Michelle Cruz", role: "Designer", avatar: "https://randomuser.me/api/portraits/women/10.jpg", kpi: 98, stars: 4.8, tasks: 24 },
    { id: "2", name: "Liam Patel", role: "Product Manager", avatar: "https://randomuser.me/api/portraits/men/11.jpg", kpi: 96, stars: 4.74, tasks: 18 },
    { id: "3", name: "Richard Foster", role: "UI/UX Designer", avatar: "https://randomuser.me/api/portraits/men/12.jpg", kpi: 96, stars: 4.65, tasks: 12 },
    { id: "4", name: "Sophie Reynolds", role: "Graphic Designer", avatar: "https://randomuser.me/api/portraits/women/13.jpg", kpi: 93, stars: 4.61, tasks: 16 },
  ],
};

type Props = {
  loading?: boolean;
};

export default function OverviewMetrics({ loading }: Props) {
  const [range, setRange] = useState("week");
   const periodItems = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];
  const displayData = mockData;

  

  


  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">Overview Metrics</h2>
         <TabSelector
                    items={periodItems}
                    selectedValue={range}
                    onChange={setRange}
                  />
      </div>

        <MetricsGrid metrics={mockData.summaryMetrics} cols={4} className="" cardClassName="bg-white" />

      {/* --- Fila 2: KPI, Performers, Contributors (CORREGIDA) --- */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        <div className="lg:col-span-4">
           <AverageKpiCard
            loading={loading}
            score={displayData.averageKpi.score}
            trendValue={displayData.averageKpi.trendValue}
            comparisonText={displayData.averageKpi.comparisonText}
            chartData={displayData.averageKpi.chartData}
          />
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 xl:grid-cols-[40%_60%] gap-1 items-stretch bg-white p-4 rounded-lg border border-green-gray-100 ">
                <TopPerformersCard 
                    loading={loading}
                    memberCount={displayData.topPerformers.memberCount}
                    trendValue={displayData.topPerformers.trendValue}
                    topPerformers={displayData.topPerformers.performers}
                    needsReview={displayData.topPerformers.needsReview}
                />
                <TopContributorsList loading={loading} items={displayData.topContributors} />
        </div>

      </div>
    </div>
  );
}