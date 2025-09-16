"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { RequestList } from "@/types/requests";
import PriorityBadge from '../ui/PriorityBadge';

// --- ICONS (from lucide-react) ---
import {
  MoreHorizontal,
  Calendar,
} from 'lucide-react';

import IconRequests from "@/assets/icons/requests.svg";
import IconInProgress from "@/assets/icons/in_progress.svg";
import IconPending from "@/assets/icons/pending.svg";
import IconCompleted from "@/assets/icons/completed.svg";

// --- PROPS DEFINITION ---
interface RequestBoardProps {
  requests: RequestList[];
  onSetRequest: (request: any) => void;
}

// --- COLUMN CONFIGURATION ---
const columns = [
  { id: 'all_requests', title: 'Requests', status: null, icon: <IconRequests className="w-4 h-4  text-[#697D67]"  /> },
  { id: 'in_progress', title: 'In Progress', status: 'in_progress', icon: <IconInProgress className="w-4 h-4  text-[#697D67]" /> },
  { id: 'pending', title: 'Pending', status: 'queued', icon: <IconPending className="w-4 h-4  text-[#697D67]" /> },
  { id: 'completed', title: 'Completed', status: 'completed', icon: <IconCompleted className="w-4 h-4  text-[#697D67]" /> },
];

// --- CATEGORY STYLES ---
const categoryColors: Record<string, string> = {
  "Email Marketing": "bg-[#EBFDD8] text-black",
  "Short-forms": "bg-[#E6AE2] text-black",
  "E-books": "bg-[#F0F3F4] text-black",
  "Print Design": "bg-[#C3EF9A] text-[#004049]",
  "Illustration": "bg-[#C3EF9A] text-[#004049]",
  "Social Media": "bg-[#EBFDD8] text-black",
};

// --- HELPER FUNCTIONS ---
const formatDate = (dateStr?: string) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

const getInitials = (nameOrEmail: string) => {
  if (!nameOrEmail) return "";
  const parts = nameOrEmail.split(/[ @.]/).filter(Boolean);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "";
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

// --- MAIN BOARD COMPONENT ---
export default function RequestBoard({ requests, onSetRequest }: RequestBoardProps) {
  return (
    // FIX: Removed background from the main grid container. It now only controls layout and spacing.
    <div className="grid grid-cols-4 gap-x-4 p-4">
      {columns.map(column => {
        const columnRequests = column.status === null
          ? requests
          : requests.filter(req => req.status === column.status);
        
        return (
          // FIX: Added background, rounding, and padding to each individual column.
          <div key={column.id} className="bg-[#f6f7f7] rounded-lg p-3 flex flex-col">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1 flex-shrink-0">
              <div className="flex items-center gap-2">
                {column.icon}
                <h2 className="font-semibold text-gray-700">{column.title}</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">
                  {columnRequests.length}
                </span>
                <button
                  aria-label="Column options"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
            
            {/* Cards Container - Height adjusted for the new column padding */}
            <div className="space-y-3 overflow-y-auto no-scrollbar pr-2 h-[calc(100vh-320px)]">
              {columnRequests.map(request => (
                <div 
                  key={request.id} 
                  className="bg-white p-3 rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => onSetRequest(request)}
                >
                  <div className="flex flex-col space-y-2.5">
                    <p className="font-semibold text-gray-800 text-sm">{request.title}</p>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar size={14} className="mr-1.5" />
                      {formatDate(request.dueDate)}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <PriorityBadge
                        requestId={request.id}
                        priority={request.priority}
                        editable={false}
                      />
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                        categoryColors[request.category] ?? "bg-gray-200 text-gray-600"
                      }`}>
                        {request.category}
                      </span>
                    </div>
                    
                    <hr className="my-1 border-gray-200" />

                    <div className="flex items-center justify-between pt-1">
                      {/* Assignees */}
                      <div className="flex -space-x-2">
                        {request.assignees.map(assignee => (
                          <div key={assignee.id} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-gray-200 flex items-center justify-center">
                            {assignee.avatarUrl ? (
                              <img src={assignee.avatarUrl} alt={assignee.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-gray-600">{getInitials(assignee.name)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Activity Metrics */}
                      <div className="flex items-center space-x-2 text-gray-500 text-xs">
                        {request.commentsCount > 0 && (
                          <div className="flex items-center space-x-1 border border-gray-200 rounded-md px-1.5 py-0.5 text-black">
                            <img src="/assets/icons/comments_icon.svg" alt="Comments" className="w-3 h-3" />
                            <div>{request.commentsCount}</div>
                          </div>
                        )}
                        {request.attachmentsCount > 0 && (
                           <div className="flex items-center space-x-1 border border-gray-200 rounded-md px-1.5 py-0.5 text-black">
                             <img src="/assets/icons/attachments_icon.svg" alt="Attachments" className="w-3 h-3" />
                             <div>{request.attachmentsCount}</div>
                           </div>
                        )}
                        {request.subtasksCount > 0 && (
                           <div className="flex items-center space-x-1 border border-gray-200 rounded-md px-1.5 py-0.5 text-black">
                             <img src="/assets/icons/subtasks.svg" alt="Subtasks" className="w-3 h-3" />
                             <div>{request.subtasksCount}</div>
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}