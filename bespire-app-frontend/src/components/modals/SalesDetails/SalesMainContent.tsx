// components/SalesMainContent.tsx
import SalesMainHeader from "./SalesMainHeader";
import SalesTabs from "./SalesTabs";
import SalesTabDetails from "./SalesTabDetails";
import SalesTabFiles from "./SalesTabFiles";
import SalesTabFollowUps from "./SalesTabFollowUps"; // Import new component
import SalesTabInfo from "./SalesTabInfo";         // Import new component
import { useRef, useState } from "react";

import salesData from "@/data/salesData.json";
type Prospect = typeof salesData.prospects.list[0];

interface SalesMainContentProps {
  prospect: Prospect;
  onClose: () => void;
  stage: string;
  changeStage: (stage: string) => void;
}

export default function SalesMainContent({
  prospect,
  onClose,
  stage,
  changeStage,
}: SalesMainContentProps) {
  const [activeTab, setActiveTab] = useState<"details" | "files" | "follow-ups" | "info">("details");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="p-6 flex flex-col">
        <SalesMainHeader
          stage={stage}
          title={prospect.title}
          prospectId={prospect.id}
          onClose={onClose}
          changeStage={changeStage}
          loadingStage={false}
        />
        <SalesTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showSubtasks={false}
        />
      </div>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {activeTab === "details" && <SalesTabDetails prospect={prospect} />}
        {activeTab === "files" && <SalesTabFiles prospect={prospect} />}
        {activeTab === "follow-ups" && <SalesTabFollowUps prospect={prospect} />}
        {activeTab === "info" && <SalesTabInfo prospect={prospect} />}
      </div>
    </div>
  );
}