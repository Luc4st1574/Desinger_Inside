// components/SalesTabs.tsx
import DetailsIcon from "@/assets/icons/request_tabs/details.svg";
import FilesIcon from "@/assets/icons/request_tabs/files.svg";
import SubtasksIcon from "@/assets/icons/request_tabs/subtasks.svg";
import { Send, Info } from "lucide-react";

type SalesTabsProps = {
  activeTab: string;
  onTabChange: (tabId: "details" | "files" | "follow-ups" | "info") => void;
  showSubtasks?: boolean;
};

export default function SalesTabs({ activeTab, onTabChange, showSubtasks = false }: SalesTabsProps) {
  const tabs = [
    { id: "details", label: "Details", icon: <DetailsIcon className="w-4 h-4" /> },
    { id: "files", label: "Files", icon: <FilesIcon className="w-4 h-4" /> },
    // FIX: Set a specific size for lucide-react icons to match the others
    { id: "follow-ups", label: "Follow-Ups", icon: <Send size={16} /> },
    { id: "info", label: "Info", icon: <Info size={16} /> },
    ...(showSubtasks ? [{ id: "subtasks", label: "Subtasks", icon: <SubtasksIcon className="w-4 h-4" /> }] : [])
  ];

  return (
    <div className="flex mt-2 border-b border-[#E2E6E4]">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as "details" | "files" | "follow-ups" | "info")}
          className={`px-5 py-2 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors duration-150 ${
            activeTab === tab.id
              ? "border-[#181B1A] text-[#181B1A]"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}