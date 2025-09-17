"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { RequestList } from "@/types/requests";
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { UserMember } from '@/types/users';

// --- ICONS ---
import IconRequests from "@/assets/icons/requests.svg";
import IconInProgress from "@/assets/icons/in_progress.svg";
import IconPending from "@/assets/icons/pending.svg";
import IconCompleted from "@/assets/icons/completed.svg";

// --- HELPER FUNCTIONS ---
const dayDiff = (startDate: Date, endDate: Date): number => {
  const difference = endDate.getTime() - startDate.getTime();
  return Math.ceil(difference / (1000 * 3600 * 24));
};

const getWeekNumber = (d: Date): number => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
};

const weekDiff = (startDate: Date, endDate: Date): number => {
  const msInWeek = 1000 * 60 * 60 * 24 * 7;
  return (endDate.getTime() - startDate.getTime()) / msInWeek;
}

// --- COMPONENT PROPS ---
interface RequestGanttProps {
  requests: RequestList[];
  onAddRequest: () => void;
  onOpenRequest: (request: RequestList) => void;
}

// --- MAIN GANTT COMPONENT ---
export default function RequestGantt({ requests, onAddRequest, onOpenRequest }: RequestGanttProps) {
  const [openSections, setOpenSections] = useState({
    all_requests: true,
    in_progress: true,
    pending: true,
    completed: true
  });
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  const requestGroups = [
    { id: 'all_requests', title: 'Requests', status: null, icon: <IconRequests className="w-4 h-4 text-[#697D67]" /> },
    { id: 'in_progress', title: 'In Progress', status: 'in_progress', icon: <IconInProgress className="w-4 h-4 text-[#697D67]" /> },
    { id: 'pending', title: 'Pending', status: 'queued', icon: <IconPending className="w-4 h-4 text-[#697D67]" /> },
    { id: 'completed', title: 'Completed', status: 'completed', icon: <IconCompleted className="w-4 h-4 text-[#697D67]" /> },
  ];

  const plottableRequests = useMemo(() => {
    return requests.filter(r => r.createdAt && r.dueDate);
  }, [requests]);

  const { chartStartDate, chartEndDate } = useMemo(() => {
    if (!plottableRequests || plottableRequests.length === 0) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 4, 0);
      return { chartStartDate: start, chartEndDate: end };
    }
    const firstRequestDate = new Date(
      Math.min(...plottableRequests.map(r => new Date(r.createdAt!).getTime()))
    );
    const start = new Date(firstRequestDate.getFullYear(), firstRequestDate.getMonth(), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 4, 0);
    return { chartStartDate: start, chartEndDate: end };
  }, [plottableRequests]);

  const { monthHeaders, weekHeaders } = useMemo(() => {
    const weeks: { weekNum: number; startDate: Date }[] = [];
    const monthMap = new Map<string, number>();
    const currentDate = new Date(chartStartDate);
    while (currentDate.getDay() !== 1) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    while (currentDate <= chartEndDate) {
      weeks.push({ weekNum: getWeekNumber(currentDate), startDate: new Date(currentDate) });
      const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
      monthMap.set(monthYear, (monthMap.get(monthYear) || 0) + 1);
      currentDate.setDate(currentDate.getDate() + 7);
    }
    const months = Array.from(monthMap.entries()).map(([name, weekCount]) => ({ name, weekCount }));
    return { monthHeaders: months, weekHeaders: weeks };
  }, [chartStartDate, chartEndDate]);

  const weekWidth = 60;
  const totalWidth = weekHeaders.length * weekWidth;

  useEffect(() => {
    if (timelineContainerRef.current) {
      timelineContainerRef.current.scrollLeft = 0;
    }
  }, [chartStartDate]);

  const getTaskStyle = (task: RequestList) => {
    if (!task.createdAt || !task.dueDate) return { display: 'none' };
    const startDate = new Date(task.createdAt);
    const endDate = new Date(task.dueDate);
    if (startDate > chartEndDate || endDate < chartStartDate) return { display: 'none' };
    const leftOffsetInWeeks = weekDiff(chartStartDate, startDate);
    const durationInWeeks = weekDiff(startDate, endDate);
    const left = `${leftOffsetInWeeks * weekWidth}px`;
    const width = `${durationInWeeks * weekWidth}px`;
    return { left, width };
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId as keyof typeof openSections] }));
  };

  const getInitials = (user?: UserMember) => {
    if (!user || !user.name) return "";
    const parts = user.name.split(/[ @.]/).filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "";
    return (parts[0]?.[0] + parts[1]?.[0]).toUpperCase();
  };

  const rowHeight = 48;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex text-sm">
        {/* Left Panel: Task List */}
        <div className="w-[450px] border-r border-gray-200 flex-shrink-0">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <div className="w-3/5 font-medium text-gray-600 border-r border-gray-200 h-full flex items-center">Task Name</div>
            <div className="w-2/5 font-medium text-gray-600 h-full flex items-center pl-4">Duration</div>
          </div>
          <div className="divide-y divide-gray-200">
            {requestGroups.map(group => {
              const groupRequests = group.status === null
                ? plottableRequests
                : plottableRequests.filter(r => r.status === group.status);
              if (groupRequests.length === 0) return null;
              const isOpen = openSections[group.id as keyof typeof openSections];
              return (
                <div key={group.id}>
                  <div onClick={() => toggleSection(group.id)} className="flex items-center justify-between h-10 px-4 bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      {group.icon}
                      <span className="font-medium text-[#697D67]">{group.title}</span>
                    </div>
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                  {isOpen && groupRequests.map(task => {
                    const duration = dayDiff(new Date(task.createdAt!), new Date(task.dueDate!)) + 1;
                    const start = new Date(task.createdAt!).toLocaleDateString('default', { month: 'short', day: 'numeric' });
                    const end = new Date(task.dueDate!).toLocaleDateString('default', { month: 'short', day: 'numeric' });
                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between h-12 px-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => onOpenRequest(task)}
                      >
                        <div className="flex items-center justify-between w-3/5 pr-4">
                          <span className="truncate">{task.title}</span>
                          <div className="flex -space-x-2 flex-shrink-0">
                            {task.assignees.map(assignee => (
                              <div key={assignee.id} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-gray-200 flex items-center justify-center">
                                {assignee.avatarUrl ? (
                                  <img src={assignee.avatarUrl} alt={assignee.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xs font-bold text-gray-600">{getInitials(assignee)}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="w-2/5 text-gray-500 pl-4">{`${start} - ${end} (${duration} days)`}</div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
            <div onClick={onAddRequest} className="flex items-center h-12 px-4 text-gray-500 cursor-pointer hover:bg-gray-50">
              <Plus size={16} className="mr-2" /> Add Request
            </div>
          </div>
        </div>

        {/* Right Panel: Timeline */}
        <div ref={timelineContainerRef} className="flex-1 overflow-x-auto">
          <div style={{ width: totalWidth }}>
            <div className="sticky top-0 bg-white z-10">
              <div className="flex h-8 border-b border-gray-200">
                {monthHeaders.map(month => (
                  <div key={month.name} className="flex items-center justify-center font-medium text-gray-600 border-r border-gray-200" style={{ width: `${month.weekCount * weekWidth}px` }}>
                    {month.name}
                  </div>
                ))}
              </div>
              <div className="flex h-8 border-b border-gray-200">
                {weekHeaders.map((week, i) => (
                  <div key={i} className="flex-shrink-0 text-center text-gray-500 border-r border-gray-200" style={{ width: weekWidth }}>
                    W{week.weekNum}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex">
                {weekHeaders.map((_week, i) => (
                  <div key={i} className="flex-shrink-0 border-r border-gray-200" style={{ width: weekWidth }}></div>
                ))}
              </div>
              <div className="relative">
                {requestGroups.map(group => {
                  const groupRequests = group.status === null
                    ? plottableRequests
                    : plottableRequests.filter(r => r.status === group.status);
                  if (groupRequests.length === 0) return null;
                  const isOpen = openSections[group.id as keyof typeof openSections];
                  return (
                    <div key={group.id}>
                      <div style={{ height: 40 }}></div>
                      {isOpen && groupRequests.map((task) => (
                        <div key={task.id} className="relative" style={{ height: rowHeight }}>
                          <div
                            className="absolute top-2 bottom-2 bg-lime-200 rounded flex items-center px-2 cursor-pointer"
                            style={getTaskStyle(task)}
                            onClick={() => onOpenRequest(task)}
                          >
                            <p className="text-xs font-medium text-lime-800 truncate">{task.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}