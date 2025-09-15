"use client";

import GenericTabs, { TabConfig } from "../ui/GenericTabs";
import Plans from "@/assets/icons/plan.svg";
import Discounts from "@/assets/icons/discount.svg";
import ActivePlansList from "./ActivePlansList";
import DiscountsList from "./DiscountsList";
import { useState } from "react";
type Tab = "plans" | "discounts";

export default function PlansAndDiscounts() {
  const [activeTab, setActiveTab] = useState<Tab>("plans");

  // Handler para cambio de tab
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as Tab);
  };
  // Configuración de tabs para el cliente
  const clientTabs: TabConfig[] = [
    {
      id: "plans",
      label: "Plans",
      icon: <Plans className="h-5 w-5" />,
    },
    {
      id: "discounts",
      label: "Discounts",
      icon: <Discounts className="h-5 w-5" />,
    },
  ];

  const renderTab = (tab: Tab) => {
    switch (tab) {
      case "plans":
        return <ActivePlansList />;
      case "discounts":
        return <DiscountsList />;
      default:
        return <ActivePlansList />;
    }
  };
  return (
    <>
    <div className="w-full flex flex-col gap-4">
            <h2 className="text-2xl font-medium text-gray-900">Plans & Discounts</h2>

      <div className="">
        <GenericTabs
          tabs={clientTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      <div className="flex-grow overflow-y-auto  w-full mx-auto">
        <div className="w-full">{renderTab(activeTab)}</div>
      </div>
    </div>
    </>
  );
}
