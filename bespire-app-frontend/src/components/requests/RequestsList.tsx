/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import RequestsTabs from "./requestList/RequestsTabs";
import RequestsTable from "./requestList/RequestsTable";
import { UserMember } from "@/types/users";

// Define the props this component will receive
interface RequestsListProps {
  requests: any[];
  members: UserMember[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  counts: Record<string, number>;
  onUpdateAssignees: (requestId: string, newUsers: UserMember[]) => void;
  onOpenRequest: (request: any) => void;
}

export default function RequestsList({
  requests,
  members,
  activeTab,
  onTabChange,
  counts,
  onUpdateAssignees,
  onOpenRequest,
}: RequestsListProps) {

  return (
    <div className="bg-white rounded-lg border border-[#bcbcbc47] max-w-full overflow-x-auto">
      <RequestsTabs
        activeTab={activeTab}
        onChange={onTabChange}
        counts={counts}
      />
      <RequestsTable
        usersMembers={members}
        requests={requests}
        onUpdateAssignees={onUpdateAssignees}
        onSetRequest={onOpenRequest}
      />
    </div>
  );
}