"use client";

import { useState, useMemo } from "react";
import TabSelector from "@/components/ui/TabSelector";
import MetricsGrid from "@/components/ui/MetricsGrid";
import UpdatesCard from "@/components/cards/UpdatesCard";
import TotalServices from "@/assets/icons/requests.svg";
import Revision from "@/assets/icons/revision.svg";
import StarCircle from "@/assets/icons/star-circle.svg";
import Customize from "@/assets/icons/customize.svg";
import MostRequest from "@/assets/icons/icon_requests.svg";
import { overviewMetricsServicesByPeriod } from "@/mocks/services";

export default function MetricsServices() {
  const [selectedSegment, setSelectedSegment] = useState("type"); // El dropdown ahora por defecto es 'type'
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const periodItems = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  const currentMetrics = useMemo(() => {
    // Aseguramos un fallback si el período no existe
    return overviewMetricsServicesByPeriod[selectedPeriod as keyof typeof overviewMetricsServicesByPeriod] || overviewMetricsServicesByPeriod.week;
  }, [selectedPeriod]);

  // Preparar datos para MetricsGrid con la nueva estructura de servicios
  const metricsData = useMemo(() => [
    {
      id: "total-services-created",
      title: "Total Services Created",
      value: currentMetrics.totalServices.value,
      percentage: currentMetrics.totalServices.percentage,
      description: currentMetrics.totalServices.description,
      icon: TotalServices, // Reemplaza con el ícono correcto
      trend: currentMetrics.totalServices.trend,
      trendColor: currentMetrics.totalServices.trend === "up" ? "green" : "red",
    },
    {
      id: "most-requested-service",
      title: "Most Requested Service",
      value: currentMetrics.mostRequested.value,
      percentage: currentMetrics.mostRequested.percentage,
      description: currentMetrics.mostRequested.description,
      icon: MostRequest, // Reemplaza con el ícono correcto
      trend: currentMetrics.mostRequested.trend,
      trendColor: currentMetrics.mostRequested.trend === "up" ? "green" : "red",
    },
    {
      id: "avg-credits-per-service",
      title: "Ave Credits Per Service",
      value: currentMetrics.avgCredits.value,
      percentage: currentMetrics.avgCredits.percentage,
      description: currentMetrics.avgCredits.description,
      icon: Revision, // Reemplaza con el ícono correcto
      trend: currentMetrics.avgCredits.trend,
      trendColor: currentMetrics.avgCredits.trend === "up" ? "green" : "red",
    },
    {
      id: "total-credits-assigned",
      title: "Total Credits Assigned",
      value: currentMetrics.totalCreditsAssigned.value,
      percentage: currentMetrics.totalCreditsAssigned.percentage,
      description: currentMetrics.totalCreditsAssigned.description,
      icon: StarCircle, // Reemplaza con el ícono correcto
      trend: currentMetrics.totalCreditsAssigned.trend,
      trendColor: currentMetrics.totalCreditsAssigned.trend === "down" ? "red" : "green",
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
        {/* Updates Card - Consume la nueva data de servicios */}
        <UpdatesCard
          data={currentMetrics.updates}
          selectedSegment={selectedSegment}
          onSegmentChange={setSelectedSegment}
        />

        {/* Metrics Grid - Consume la nueva data de servicios */}
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