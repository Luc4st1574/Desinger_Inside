"use client";

import { useState, useMemo } from "react";
import TabSelector from "@/components/ui/TabSelector";
import MetricsGrid from "@/components/ui/MetricsGrid";
import UpdatesCard from "@/components/cards/UpdatesCard";
import ClientFeedbackIcon from "@/assets/icons/people.svg";
import InternalFeedbackIcon from "@/assets/icons/internalFeedback.svg";
import ResolvedFeedbackIcon from "@/assets/icons/started.svg";
import ResponseTimeIcon from "@/assets/icons/hourglass-start.svg";
import { overviewMetricsFeedbackByPeriod } from "@/mocks/feedback";

export default function OverviewMetricsFeedBack() {
  const [selectedSegment, setSelectedSegment] = useState("category"); // Estado para el dropdown de la UpdatesCard
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const periodItems = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];
const currentMetrics = useMemo(() => {
    return overviewMetricsFeedbackByPeriod[selectedPeriod as keyof typeof overviewMetricsFeedbackByPeriod] || overviewMetricsFeedbackByPeriod.week;
  }, [selectedPeriod]);

  // Preparar datos para MetricsGrid con la nueva estructura de feedback
  const metricsData = useMemo(() => [
    {
      id: "client-feedback",
      title: "Client Feedback",
      value: currentMetrics.clientFeedback.value,
      badge: currentMetrics.clientFeedback.badge,
      badgeColor: currentMetrics.clientFeedback.badgeColor,
      description: currentMetrics.clientFeedback.description,
      icon: ClientFeedbackIcon,
      trend: currentMetrics.clientFeedback.trend,
      trendColor: (currentMetrics.clientFeedback.trend === "up" ? "green" : currentMetrics.clientFeedback.trend === "down" ? "red" : "gray") as "green" | "red" | "gray",
    },
    {
      id: "internal-feedback",
      title: "Internal Feedback",
      value: currentMetrics.internalFeedback.value,
      percentage: currentMetrics.internalFeedback.percentage,
      description: currentMetrics.internalFeedback.description,
      icon: InternalFeedbackIcon,
      trend: currentMetrics.internalFeedback.trend,
      trendColor: (currentMetrics.internalFeedback.trend === "up" ? "green" : currentMetrics.internalFeedback.trend === "down" ? "red" : "gray") as "green" | "red" | "gray",
    },
    {
      id: "resolved-feedback-rate",
      title: "Resolved Feedback Rate",
      value: currentMetrics.resolvedFeedbackRate.value,
      badge: currentMetrics.resolvedFeedbackRate.badge,
      badgeColor: currentMetrics.resolvedFeedbackRate.badgeColor,
      description: currentMetrics.resolvedFeedbackRate.description,
      icon: ResolvedFeedbackIcon,
      trend: currentMetrics.resolvedFeedbackRate.trend,
      trendColor: (currentMetrics.resolvedFeedbackRate.trend === "up" ? "green" : currentMetrics.resolvedFeedbackRate.trend === "down" ? "red" : "gray") as "green" | "red" | "gray",
    },
    {
      id: "feedback-response-time",
      title: "Feedback Response Time",
      value: currentMetrics.feedbackResponseTime.value,
      percentage: currentMetrics.feedbackResponseTime.percentage,
      description: currentMetrics.feedbackResponseTime.description,
      icon: ResponseTimeIcon,
      trend: currentMetrics.feedbackResponseTime.trend,
      trendColor: (currentMetrics.feedbackResponseTime.trend === "up" ? "green" : currentMetrics.feedbackResponseTime.trend === "down" ? "red" : "gray") as "green" | "red" | "gray",
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

      <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] items-center gap-4">
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