"use client";

import { useState, useMemo } from "react";
import { overviewMetricsOrdersByPeriod } from "@/mocks/orders"; // <-- Importa la nueva mock data
import TabSelector from "@/components/ui/TabSelector";
import MetricsGrid from "@/components/ui/MetricsGrid";
import UpdatesCard from "@/components/cards/UpdatesCard"; // <-- El componente genérico
import AveOrders from "@/assets/icons/icon_requests.svg";
import Revision from "@/assets/icons/revision.svg";
import StarCircle from "@/assets/icons/star-circle.svg";
import Customize from "@/assets/icons/customize.svg";

export default function OverviewMetricsOrders() {
  const [selectedSegment, setSelectedSegment] = useState("status"); // Estado para el dropdown de la UpdatesCard
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const periodItems = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  const currentMetrics = useMemo(() => {
    return overviewMetricsOrdersByPeriod[selectedPeriod as keyof typeof overviewMetricsOrdersByPeriod];
  }, [selectedPeriod]);

  // Preparar datos para MetricsGrid con la nueva estructura
  const metricsData = useMemo(() => [
    {
      id: "completion-time",
      title: "Ave Order Completion Time",
      value: currentMetrics.completionTime.value,
      percentage: currentMetrics.completionTime.percentage,
      description: currentMetrics.completionTime.description,
      icon: AveOrders, // Reemplaza con el ícono correcto de tu figma
      trend: currentMetrics.completionTime.trend,
      trendColor: currentMetrics.completionTime.trend === "down" ? "red" : "green",
    },
    {
      id: "revision-rate",
      title: "Revision Rate",
      value: currentMetrics.revisionRate.value,
      percentage: currentMetrics.revisionRate.percentage,
      description: currentMetrics.revisionRate.description,
      icon: Revision,
      trend: currentMetrics.revisionRate.trend,
      trendColor: currentMetrics.revisionRate.trend === "down" ? "red" : "green",
    },
    {
      id: "client-ratings",
      title: "Overall Client Ratings",
      value: currentMetrics.clientRatings.value,
      percentage: currentMetrics.clientRatings.percentage,
      description: currentMetrics.clientRatings.description,
      icon: StarCircle,
      trend: currentMetrics.clientRatings.trend,
      trendColor: currentMetrics.clientRatings.trend === "up" ? "green" : "red",
    },
    {
      id: "task-volume",
      title: "Task Volume",
      value: currentMetrics.taskVolume.value,
      percentage: currentMetrics.taskVolume.percentage,
      description: currentMetrics.taskVolume.description,
      icon: Customize,
      trend: currentMetrics.taskVolume.trend,
      trendColor: currentMetrics.taskVolume.trend === "down" ? "red" : "green",
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