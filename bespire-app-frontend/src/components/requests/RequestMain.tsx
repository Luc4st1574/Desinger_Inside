"use client";
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import Spinner from "../Spinner";
import { useAppContext } from "@/context/AppContext";
import { UserMember } from "@/types/users";

// Data Hooks
import { useRequests } from "@/hooks/useRequests";
import { useMembersBespire } from "@/hooks/useMembersBespire";

// View Components
import ViewModeSwitcher, { ViewMode } from "./ViewModeSwitcher";
import RequestsList from "./RequestsList";
import RequestBoard from "./RequestBoard";
import RequestGantt from "./RequestGantt";
import RequestDetailsModal from "../modals/RequestDetails/RequestDetailsModal";
import CreateRequestModal from "../modals/CreateRequestModal"; // Import the modal

// Configuration for the list view tabs
const tabs = [
  { id: "all", statusFilter: null },
  { id: "in_progress", statusFilter: "in_progress" },
  { id: "pending", statusFilter: "queued" },
  { id: "completed", statusFilter: "completed" },
];

export default function RequestMain() {
  const { loadingUser } = useAppContext();
  
  const { requests, loading: loadingRequests, error, assignUsers } = useRequests();
  const { members } = useMembersBespire();
  
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState("all");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [parentRequest, setParentRequest] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  
  // State for Create Modal
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // --- HANDLER FUNCTIONS ---
  const handleOpenRequest = (request: any) => {
    if (request.parentRequest) {
      const parent = requests.find((r: { id: any; }) => r.id === request.parentRequest);
      if (!parent) {
        console.error("Parent request not found in requests list");
        return;
      }
      setParentRequest(parent);
      setRequestId(request.id);
      setOpenModal(true);
      return;
    }
    setRequestId(request.id);
    setParentRequest(null);
    setOpenModal(true);
  };

  const handleUpdateAssignees = (requestId: string, newUsers: UserMember[]) => {
    assignUsers(requestId, newUsers.map((u) => u.id));
  };
  
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  // --- MEMOIZED CALCULATIONS ---
  const counts = useMemo(() => {
    if (!requests) return {};
    const c: Record<string, number> = {};
    tabs.forEach(({ id, statusFilter }) => {
      c[id] = statusFilter === null
        ? requests.length
        : requests.filter((r: { status: string; }) => r.status === statusFilter).length;
    });
    return c;
  }, [requests]);

  const filteredRequests = useMemo(() => {
    if (activeTab === "all" || !requests) return requests || [];
    const statusFilter = tabs.find((t) => t.id === activeTab)?.statusFilter;
    return requests.filter((r: { status: string; }) => r.status === statusFilter);
  }, [activeTab, requests]);

  // --- RENDER LOGIC ---
  if (loadingUser || loadingRequests) return <Spinner />;
  if (error) return <p>Error loading requests</p>;

  return (
    <div>
      <ViewModeSwitcher activeMode={viewMode} onModeChange={setViewMode} />
      
      {viewMode === "list" && (
        <RequestsList
          requests={filteredRequests}
          members={members}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
          onUpdateAssignees={handleUpdateAssignees}
          onOpenRequest={handleOpenRequest}
        />
      )}

      {viewMode === "board" && (
        <RequestBoard
          requests={requests || []}
          onSetRequest={handleOpenRequest}
        />
      )}
      
      {viewMode === "gantt" && (
        <RequestGantt
          requests={requests || []}
          onAddRequest={handleOpenCreateModal} 
        />
      )}

      {/* Details Modal */}
      <RequestDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        //@ts-ignore
        requestId={requestId}
        parentRequest={parentRequest}
        //@ts-ignore
        onOpenSubtask={(subtaskId, requestParent) => {
          setRequestId(subtaskId);
          setParentRequest(requestParent);
          setOpenModal(true);
        }}
        onBackToMain={() => {
          if (parentRequest) {
            setRequestId(parentRequest.id || parentRequest._id);
            setParentRequest(null);
          }
        }}
      />
      
      {/* Create Modal */}
      <CreateRequestModal 
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}