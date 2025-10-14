// components/SalesTabs.tsx
import DetailsIcon from "@/assets/icons/request_tabs/details.svg";
import FilesIcon from "@/assets/icons/request_tabs/files.svg";
import SubtasksIcon from "@/assets/icons/request_tabs/subtasks.svg";

type SalesTabsProps = {
  activeTab: string;
  onTabChange: (tabId: "details" | "files") => void;
  showSubtasks?: boolean;
};

export default function SalesTabs({ activeTab, onTabChange, showSubtasks = false }: SalesTabsProps) {
  const tabs = [
    { id: "details", label: "Details", icon: <DetailsIcon /> },
    { id: "files", label: "Files", icon: <FilesIcon /> },
    ...(showSubtasks ? [{ id: "subtasks", label: "Subtasks", icon: <SubtasksIcon /> }] : [])
  ];

  return (
    <div className="flex mt-2 border-b border-[#E2E6E4]">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id as "details" | "files")}
          className={`px-5 py-2 text-sm font-medium border-b-2 flex items-center gap-2 ${
            activeTab === tab.id
              ? "border-[#181B1A] text-[#181B1A]"
              : "border-transparent text-gray-500"
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}