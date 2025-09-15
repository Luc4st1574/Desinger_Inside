/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// src/components/clients/ClientList.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useRef } from "react";
import DataTable, { Column } from "../ui/DataTable";
import ActionMenu, { ActionMenuItem } from "../ui/ActionMenu";

import { Edit, Trash } from "lucide-react";
import { getInitials } from "@/utils/utils";
import AssignMembersDropdownUniversal from "../ui/AssignMembersDropdownUniversal";
import { useMembersBespire } from "@/hooks/useMembersBespire";
import PriorityBadge from "../ui/PriorityBadge";
import { useRequests } from "@/hooks/useRequests";
import CommonPhrasesBadge from "../ui/CommonPhrasesBadge";
import RequestStatusBadge from "../ui/RequestStatusBadge";
import RequestDetailsModal from "../modals/RequestDetails/RequestDetailsModal";
import { useAppContext } from "@/context/AppContext";
import GenericTabs, { TabConfig } from "../ui/GenericTabs";
import AllIcon from "@/assets/icons/icon_dashboard.svg";
import QueuedIcon from "@/assets/icons/requests.svg";
import InProgressIcon from "@/assets/icons/in_progress.svg";
import PendingIcon from "@/assets/icons/pending.svg";
import CompletedIcon from "@/assets/icons/completed.svg";

type Client = {
  id: string | number;
  name: string;
  roleTitle?: string;
  companyName: string;
  plan?: { name: string; icon: string };
  rating: number;
  timeRequest: string;
  revisions: number;
  lastSession?: string;
  contractStart?: string;
  status: "new" | "recurring";
};
type Tab = "all" | "queued" | "in-progress" | "pending" | "completed";
export default function OrderList() {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const { setShowModalRequest } = useAppContext();
  const { requests, loading, refetch, error } = useRequests(activeTab);

  console.log("Requests in OrderList:", requests);
  const { members } = useMembersBespire();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const clickedRef = useRef<HTMLDivElement | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<
    string | number | null
  >(null);
  const [openDropdownFor, setOpenDropdownFor] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [parentRequest, setParentRequest] = useState<any>(null); // Puede ser solo {id, title}, o todo el objeto

  const [open, setOpen] = useState(false);


  // Handler para cambio de tab
  const handleTabChange = (tabId: string) => {
    console.log("Tab changed to:", tabId);
    setActiveTab(tabId as Tab);
  };
  // Opciones para el dropdown de filtro
  const statusFilterOptions = [
    { value: "all", label: "Filter" },
    { value: "new", label: "New" },
    { value: "recurring", label: "Recurring" },
  ];

  const handleRowClick = (client: Client) => {
    setSelectedClientId(client.id);
    setIsDetailModalOpen(true);
  };

  const handleEditClient = (clientId: string | number) => {
    console.log("Editing client:", clientId);
  };

  const handleDeleteClient = (clientId: string | number) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      console.log("Deleting client:", clientId);
    }
  };

  const handleOpenRequest = (request: any) => {
    console.log("Opening request:", request);
    if (request.parentRequest) {
      console.log("This is a subtask, fetching parent request");
      //buscar el request parent en la lista de request
      const parentRequestId = request.parentRequest;
      const parent = requests.find(
        (r: { id: any }) => r.id === parentRequestId
      );
      console.log("Parent request found:", parent);
      if (!parent) {
        console.error("Parent request not found in requests list");
        return;
      }
      setParentRequest(parent);
      setRequestId(request.id);
      setOpen(true);
      return;
    }
    setRequestId(request.id);
    setParentRequest(null);
    setOpen(true);
  };

  const formatDate = (dateString?: string | null): string | null => {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleOpenDropdown = (
    requestId: string,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    setAnchorRect(rect);
    setOpenDropdownFor(openDropdownFor === requestId ? null : requestId);
    clickedRef.current = e.currentTarget;
  };

  const columns: Column<any>[] = [
    {
      header: "Title",
      accessor: "title",
      minWidth: "200px",
      maxWidth: "280px",
      render: (r) => (
        <div
          className="flex flex-col gap-2 cursor-pointer"
          onClick={() => handleOpenRequest(r)}
        >
          <div className="font-medium text-gray-900 truncate" title={r.title}>
            {r.title}
          </div>
          <div className="text-xs text-[#7A8882]">{formatDate(r.dueDate)}</div>
        </div>
      ),
    },
    {
      header: "Client",
      accessor: "client",
      minWidth: "120px",
      maxWidth: "160px",
      render: (r) => (
        <div
          className="text-sm font-medium text-[#353B38] truncate"
          title={r.client}
        >
          {r.client}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      minWidth: "100px",
      maxWidth: "130px",
      render: (r) => <RequestStatusBadge value={r.status} />,
    },
    {
      header: "Deadline",
      accessor: "dueDate",
      minWidth: "120px",
      maxWidth: "150px",
      render: (r) => (
        <div className="text-xs text-[#7A8882]">{formatDate(r.dueDate)}</div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      minWidth: "120px",
      maxWidth: "160px",
      render: (r) => (
        <CommonPhrasesBadge phrase={r.category} variant="colored" key={r.id} />
      ),
    },
    {
      header: "Assigned",
      accessor: "assignees",
      minWidth: "150px",
      maxWidth: "220px",
      render: (r) => (
        <div>
          <div
            className="flex -space-x-3 cursor-pointer"
            onClick={(e) => handleOpenDropdown(r.id, e)}
          >
            {r.assignees.length > 0 ? (
              r.assignees.map((a) => {
                const initials = getInitials(a.name);
                return (
                  <div
                    key={a.id}
                    className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                    title={a.name}
                  >
                    {a.avatarUrl ? (
                      <img
                        src={a.avatarUrl}
                        alt={a.name}
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

          {openDropdownFor === r.id && anchorRect && (
            <AssignMembersDropdownUniversal
              teamMembers={members}
              linkedToId={r.id}
              linkedToType="request"
              anchorRect={anchorRect}
              onClose={() => setOpenDropdownFor(null)}
            />
          )}
        </div>
      ),
    },
    {
      header: "Credits",
      accessor: "credits",
      minWidth: "90px",
      maxWidth: "120px",
      render: (r) => (
        <div className="text-sm font-medium text-green-bg-700">
          {r.credits} Credits
        </div>
      ),
    },
    {
      header: "Priority",
      accessor: "priority",
      minWidth: "120px",
      maxWidth: "160px",
      render: (r) => (
        <PriorityBadge requestId={r.id} priority={r.priority} editable={true} />
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      minWidth: "60px",
      maxWidth: "80px",
      sticky: "right",
      render: (request) => {
        const menuItems: ActionMenuItem[] = [
          {
            label: "Edit",
            icon: <Edit size={14} />,
            action: () => handleEditClient(request.id),
          },
          {
            label: "Delete",
            icon: <Trash size={14} />,
            action: () => handleDeleteClient(request.id),
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

  const clientTabs: TabConfig[] = [
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
      id: "in_progress",
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
        <h2 className="text-2xl font-medium text-gray-900">Order Requests</h2>

        <div className="">
          <GenericTabs
            tabs={clientTabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>
      <DataTable
        title="Orders Requests"
        data={requests}
        columns={columns}
        isLoading={loading}
        error={error}
        itemCount={requests.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search a client"
        filterOptions={statusFilterOptions}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onAddButtonClick={() => setShowModalRequest(true)}
        onRowClick={handleRowClick}
        onRetry={refetch}
      />

      <RequestDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        //@ts-ignore
        requestId={requestId}
        parentRequest={parentRequest}
        //@ts-ignore
        onOpenSubtask={(subtaskId, requestParent) => {
          console.log("Opening subtask:", subtaskId);
          setRequestId(subtaskId);
          setParentRequest(requestParent);

          setOpen(true);
        }}
        onBackToMain={() => {
          console.log("Back to main request clicked", parentRequest);
          if (parentRequest) {
            setRequestId(parentRequest.id || parentRequest._id);
            setParentRequest(null);
          }
        }}
      />
    </>
  );
}
