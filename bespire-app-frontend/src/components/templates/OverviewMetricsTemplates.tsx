"use client";

import { useState } from "react";
import MetricsGrid from "../ui/MetricsGrid";
import UpdatesCard from "../cards/UpdatesCard";
import { templateMetrics, templateUpdatesChart } from "@/mocks/templates";
import TabSelector from "../ui/TabSelector";
import TemplatesUsedIcon from "@/assets/icons/two-books.svg";
import NewTemplatesIcon from "@/assets/icons/cursor-plus.svg";
import MostUsedTemplatesIcon from "@/assets/icons/LandingPage.svg";
import ActiveTemplatesIcon from "@/assets/icons/blocks.svg";

export default function OverviewMetricsTemplates() {
  type Period = "day" | "week" | "month" | "year";
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week");
  const periodItems = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];
  const currentMetrics = templateMetrics[selectedPeriod];

  const metrics = [
    {
      id: "templates-used",
      title: "Templates Used",
      value: currentMetrics.templatesUsed.value.toString(),
      percentage: `${currentMetrics.templatesUsed.change > 0 ? '+' : ''}${currentMetrics.templatesUsed.change}%`,
      trend: currentMetrics.templatesUsed.trend,
      description: `Across all teams this ${selectedPeriod}`,
      icon: TemplatesUsedIcon
    },
    {
      id: "new-templates",
      title: "New Templates Added", 
      value: currentMetrics.newTemplatesAdded.value.toString(),
      percentage: `${currentMetrics.newTemplatesAdded.change > 0 ? '+' : ''}${currentMetrics.newTemplatesAdded.change}%`,
      trend: currentMetrics.newTemplatesAdded.trend,
      description: `Uploaded to the library this ${selectedPeriod}`,
      icon: NewTemplatesIcon
    },
    {
      id: "most-used",
      title: "Most Used Template",
      value: currentMetrics.mostUsedTemplate.name,
      description: `Used ${currentMetrics.mostUsedTemplate.usage} times this ${selectedPeriod}`,
      trend: "neutral" as const,
      icon: MostUsedTemplatesIcon
    },
    {
      id: "active-templates",
      title: "Active Templates",
      value: currentMetrics.activeTemplates.value.toString(),
      percentage: `${currentMetrics.activeTemplates.change > 0 ? '+' : ''}${currentMetrics.activeTemplates.change}%`,
      trend: currentMetrics.activeTemplates.trend,
      description: `Across all templates this ${selectedPeriod}`,
      icon: ActiveTemplatesIcon
    }
  ];

  const updatesCardData = {
    title: "Updates",
    insight: {
      text: "Published blogs increased",
      value: "24%",
      trend: "up" as const
    },
    chartData: templateUpdatesChart.map(item => ({
      name: item.label,
      value: item.value,
      color: item.color
    })),
    dropdownItems: [
      { value: "status", label: "Status" }
    ]
  };

  

  const [selectedSegment, setSelectedSegment] = useState("status");

  const periodOptions = [
    { value: "day" as const, label: "Day" },
    { value: "week" as const, label: "Week" },
    { value: "month" as const, label: "Month" },
    { value: "year" as const, label: "Year" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Overview Metrics</h2>
        <div className="flex space-x-2">
          <TabSelector
            items={periodOptions}
            selectedValue={selectedPeriod}
            onChange={setSelectedPeriod}
          />
        </div>
      </div>
<div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] items-start gap-4">
 <UpdatesCard 
            data={updatesCardData}
            selectedSegment={selectedSegment}
            onSegmentChange={setSelectedSegment}
          />

           <MetricsGrid metrics={metrics} />

</div>
    
    </div>
  );
}
