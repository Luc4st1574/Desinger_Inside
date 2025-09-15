"use client";

import { useState, useMemo } from "react";
import { overviewMetricsOrdersByPeriod } from "@/mocks/orders"; // <-- Importa la nueva mock data
import TabSelector from "@/components/ui/TabSelector";
import MetricsGrid from "@/components/ui/MetricsGrid";
import UpdatesCard from "@/components/cards/UpdatesCard"; // <-- El componente genérico
import PlanIcon from "@/assets/icons/plan.svg";
import NewPlan from "@/assets/icons/icon_dashboard.svg";
import PopularPlans from "@/assets/icons/rocket.svg";
import TotalCredits from "@/assets/icons/in_progress.svg";
import { overviewMetricsPlansByPeriod } from "@/mocks/plans";

export default function OverviewMetricsPlans() {
  const [selectedSegment, setSelectedSegment] = useState("status"); // Estado para el dropdown de la UpdatesCard
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const periodItems = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];
const currentMetrics = useMemo(() => {
    return overviewMetricsPlansByPeriod[selectedPeriod as keyof typeof overviewMetricsPlansByPeriod] || overviewMetricsPlansByPeriod.week;
  }, [selectedPeriod]);

  // Preparar datos para MetricsGrid con la nueva estructura de planes
  const metricsData = useMemo(() => [
    {
      id: "active-subscriptions",
      title: "Active Subscriptions",
      value: currentMetrics.activeSubscriptions.value,
      badge: currentMetrics.activeSubscriptions.badge,
      badgeColor: currentMetrics.activeSubscriptions.badgeColor,
      description: currentMetrics.activeSubscriptions.description,
      icon: PlanIcon,
      trend: currentMetrics.activeSubscriptions.trend,
      trendColor: "gray",
    },
    {
      id: "new-plan-subscriptions",
      title: "New Plan Subscriptions",
      value: currentMetrics.newSubscriptions.value,
      percentage: currentMetrics.newSubscriptions.percentage,
      description: currentMetrics.newSubscriptions.description,
      icon: NewPlan,
      trend: currentMetrics.newSubscriptions.trend,
      trendColor: currentMetrics.newSubscriptions.trend === "up" ? "green" : "red",
    },
    {
      id: "most-popular-plan",
      title: "Most Popular Plan",
      value: currentMetrics.mostPopularPlan.value,
      badge: currentMetrics.mostPopularPlan.badge,
      badgeColor: currentMetrics.mostPopularPlan.badgeColor,
      description: currentMetrics.mostPopularPlan.description,
      icon: PopularPlans,
      trend: currentMetrics.mostPopularPlan.trend,
      trendColor: "gray",
    },
    {
      id: "total-credits-consumed",
      title: "Total Credits Consumed",
      value: currentMetrics.totalCreditsConsumed.value,
      percentage: currentMetrics.totalCreditsConsumed.percentage,
      description: currentMetrics.totalCreditsConsumed.description,
      icon: TotalCredits,
      trend: currentMetrics.totalCreditsConsumed.trend,
      trendColor: currentMetrics.totalCreditsConsumed.trend === "down" ? "red" : "green",
    },
  ], [currentMetrics]);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium text-gray-900">Overview Metrics</h2>
        <div className="flex space-x-2">
          <TabSelector
            items={periodItems}
            selectedValue={selectedPeriod}
            onChange={setSelectedPeriod}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] items-start gap-4">
        {/* Updates Card - Ahora es más declarativo */}
        <UpdatesCard
          data={currentMetrics.updates}
          selectedSegment={selectedSegment}
          onSegmentChange={setSelectedSegment}
        />

        {/* Metrics Grid (sin cambios) */}
        <MetricsGrid
          metrics={metricsData}
          columns="grid-cols-1 md:grid-cols-2"
          className=""
          cardClassName="bg-white"
        />
      </div>
    </div>
  );
}