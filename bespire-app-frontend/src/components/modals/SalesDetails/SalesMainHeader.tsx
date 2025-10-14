// components/SalesMainHeader.tsx
import React from 'react';
import { Bell, Link, X } from "lucide-react";
import ActionMenu, { ActionMenuItem } from "@/components/ui/ActionMenu";
import salesData from "@/data/salesData.json";
// Import the new component
import SalesStageDropdown from './SalesStageDropdown';

type SalesMainHeaderProps = {
  stage: string;
  title: string;
  prospectId: number;
  onClose: () => void;
  loadingStage: boolean;
  changeStage: (stage: string) => void;
};

export default function SalesMainHeader({
  stage,
  title,
  prospectId,
  onClose,
  loadingStage,
  changeStage,
}: SalesMainHeaderProps) {

  const menuActions: ActionMenuItem[] = [
    {
      label: "Add to Watchlist",
      action: () => alert(`Watching prospect: ${prospectId}`),
    },
    {
      label: "Delete Prospect",
      action: () => alert(`Deleting prospect: ${prospectId}`),
      isDanger: true,
      hasSeparator: true,
    },
  ];

  const salesStages = salesData.prospects.stages.map(s => s.name);

  return (
    <>
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {/* Use the new SalesStageDropdown component */}
            <SalesStageDropdown
              status={stage}
              loading={loadingStage}
              onChange={changeStage}
              statuses={salesStages} // Pass the correct stages
            />
          </div>
          <div className="font-bold text-2xl">{title}</div>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            title="Copy Link"
            className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
          >
            <Link className="w-5 h-5" />
          </button>
          <button
            type="button"
            title="Notify"
            className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
          >
            <Bell className="w-5 h-5" />
          </button>
          <div
            title="More"
            onClick={(e) => e.stopPropagation()}
            className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
          >
            <ActionMenu items={menuActions} isHorizontal />
          </div>
          <button
            type="button"
            title="Close"
            className="hover:bg-gray-200 p-2 rounded-full cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}