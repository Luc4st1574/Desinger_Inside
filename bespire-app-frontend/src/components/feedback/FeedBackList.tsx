/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import DataTable, { Column } from "../ui/DataTable";
import ActionMenu, { ActionMenuItem } from "../ui/ActionMenu";
import { Edit, Trash } from "lucide-react";
import { getInitials } from "@/utils/utils";
import AssignMembersDropdownUniversal from "../ui/AssignMembersDropdownUniversal";
import { useMembersBespire } from "@/hooks/useMembersBespire";
import CommonPhrasesBadge from "../ui/CommonPhrasesBadge";
import GenericTabs, { TabConfig } from "../ui/GenericTabs";
import AllIcon from "@/assets/icons/icon_dashboard.svg";
import QueuedIcon from "@/assets/icons/requests.svg";
import InProgressIcon from "@/assets/icons/in_progress.svg";
import PendingIcon from "@/assets/icons/pending.svg";
import CompletedIcon from "@/assets/icons/completed.svg";
import FeedbackDetailsModal from "../modals/FeedbackDetailsModal";
import { useFeedbackList, FeedbackStatus, FeedbackItem } from "@/hooks/feedback/useFeedbackList";

export default function FeedBackList() {
  const [activeTab, setActiveTab] = useState<FeedbackStatus>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { feedback, loading, refetch, error } = useFeedbackList(activeTab);
  const { members } = useMembersBespire();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const clickedRef = useRef<HTMLDivElement | null>(null);
  const [openDropdownFor, setOpenDropdownFor] = useState<string | null>(null);

  // Handler para cambio de tab
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as FeedbackStatus);
  };

  // Opciones para el dropdown de filtro
  const statusFilterOptions = [
    { value: "all", label: "Filter" },
    { value: "queued", label: "Queued" },
    { value: "in-progress", label: "In Progress" },
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
  ];

  const handleRowClick = (feedbackItem: FeedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setIsDetailModalOpen(true);
  };

  const handleEditFeedback = (feedbackId: string) => {
    console.log("Editing feedback:", feedbackId);
  };

  const handleDeleteFeedback = (feedbackId: string) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      console.log("Deleting feedback:", feedbackId);
    }
  };

  const formatDate = (dateString: string): string => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleOpenDropdown = (
    feedbackId: string,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setAnchorRect(rect);
    setOpenDropdownFor(openDropdownFor === feedbackId ? null : feedbackId);
    clickedRef.current = e.currentTarget;
  };

  const columns: Column<FeedbackItem>[] = [
     {
      header: "Code",
      accessor: "code",
      minWidth: "120px",
      maxWidth: "140px",
      render: (feedback) => (
         <div className="ont-medium">{feedback.id}</div>
      ),
    },
    {
      header: "Title",
      accessor: "title",
      minWidth: "200px",
      maxWidth: "280px",
      render: (feedback) => (
        <div
          className="flex flex-col gap-2 cursor-pointer"
          onClick={() => handleRowClick(feedback)}
        >
          <div className="font-medium truncate" title={feedback.title}>
            {feedback.title}
          </div>
          <div className="text-xs text-[#7A8882]">{feedback.id}</div>
        </div>
      ),
    },
    {
      header: "Submitted By",
      accessor: "submittedBy",
      minWidth: "150px",
      maxWidth: "200px",
      render: (feedback) => (
        <div className="flex items-center gap-2">
        
          <span className="text-sm font-medium text-[#353B38] truncate" title={feedback.submittedBy.name}>
            {feedback.submittedBy.name}
          </span>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      minWidth: "120px",
      maxWidth: "160px",
      render: (feedback) => (
        <div className="text-sm font-medium text-[#353B38]">
          {feedback.role}
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      minWidth: "140px",
      maxWidth: "180px",
      render: (feedback) => (
        <CommonPhrasesBadge phrase={feedback.category} variant="colored" />
      ),
    },
    {
      header: "Submitted Date",
      accessor: "submittedDate",
      minWidth: "120px",
      maxWidth: "150px",
      render: (feedback) => (
        <div className="text-xs text-[#7A8882]">{formatDate(feedback.submittedDate)}</div>
      ),
    },
    {
      header: "Assigned",
      accessor: "assignees",
      minWidth: "150px",
      maxWidth: "220px",
      render: (feedback) => (
        <div>
          <div
            className="flex -space-x-3 cursor-pointer"
            onClick={(e) => handleOpenDropdown(feedback.id, e)}
          >
            {feedback.assignees.length > 0 ? (
              feedback.assignees.map((assignee) => {
                const initials = getInitials(assignee.name);
                return (
                  <div
                    key={assignee.id}
                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                    title={assignee.name}
                  >
                    {assignee.avatarUrl ? (
                      <img
                        src={assignee.avatarUrl}
                        alt={assignee.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-semibold text-xs">
                        {initials}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src="/assets/icons/avatars.svg"
                  alt="No assigned"
                  title="No assigned"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            )}
          </div>

          {openDropdownFor === feedback.id && anchorRect && (
            <AssignMembersDropdownUniversal
              teamMembers={members}
              linkedToId={feedback.id}
              linkedToType="feedback"
              anchorRect={anchorRect}
              onClose={() => setOpenDropdownFor(null)}
            />
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      minWidth: "60px",
      maxWidth: "80px",
      sticky: "right",
      render: (feedback) => {
        const menuItems: ActionMenuItem[] = [
          {
            label: "Edit",
            icon: <Edit size={14} />,
            action: () => handleEditFeedback(feedback.id),
          },
          {
            label: "Delete",
            icon: <Trash size={14} />,
            action: () => handleDeleteFeedback(feedback.id),
            isDanger: true,
            hasSeparator: true,
          },
        ];

        return (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex justify-center"
          >
            <ActionMenu items={menuItems} />
          </div>
        );
      },
    },
  ];

  const feedbackTabs: TabConfig[] = [
    {
      id: "all",
      label: "All",
      icon: <AllIcon className="h-5 w-5" />,
    },
    {
      id: "queued",
      label: "Queued",
      icon: <QueuedIcon className="h-5 w-5" />,
    },
    {
      id: "in-progress",
      label: "In Progress",
      icon: <InProgressIcon className="h-5 w-5" />,
    },
    {
      id: "pending",
      label: "Pending",
      icon: <PendingIcon className="h-5 w-5" />,
    },
    {
      id: "completed",
      label: "Completed",
      icon: <CompletedIcon className="h-5 w-5" />,
    },
  ];

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <h2 className="text-2xl font-medium text-gray-900">Feedback</h2>

        <div className="">
          <GenericTabs
            tabs={feedbackTabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>
      
      <DataTable
        title={`All Feedback ${feedback.length}`}
        data={feedback}
        columns={columns}
        isLoading={loading}
        error={error ? { message: error } : null}
        itemCount={feedback.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search a feedback"
        filterOptions={statusFilterOptions}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onAddButtonClick={() => console.log("Add feedback clicked")}
        onRowClick={handleRowClick}
        onRetry={refetch}
      />

      <FeedbackDetailsModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        feedback={selectedFeedback}
      />
    </>
  );
}
