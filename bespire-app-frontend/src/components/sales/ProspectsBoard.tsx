// ProspectsBoard.tsx (Corrected with Horizontal Scroll)
"use client";
import React from 'react';
import Image from 'next/image';
import salesData from '@/data/salesData.json';

// --- ICONS (from lucide-react) ---
import {
    MoreHorizontal,
    BarChartBig,
    Wallet,
    Send,
    MessageSquare,
    Paperclip,
} from 'lucide-react';

// --- STAGE ICONS ---
import Prospecting from '@/assets/icons/prospecting_sales.svg';
import Meeting from '@/assets/icons/meeting_sales.svg';
import Proposal from '@/assets/icons/proposal_sales.svg';
import Deal from '@/assets/icons/deal_sales.svg';
import Lost from '@/assets/icons/lost_sales.svg';

// --- TYPE DEFINITIONS ---
interface Assignee {
    name: string;
    avatar?: string;
}
type Priority = 'High' | 'Medium' | 'Low';
type StageName = 'Prospecting' | 'Meeting' | 'Proposal' | 'Deal' | 'Lost';
interface Prospect {
    id: number;
    title: string;
    logo: string;
    since: string;
    value: number;
    stage: StageName;
    targetPlan: string;
    priority: Priority;
    industry: string;
    bgColor?: string;
    assigned: Assignee[];
    term: number;
    followUps?: unknown[];
    comments?: unknown[];
    files?: unknown[];
}
interface Stage {
    name: StageName;
}
interface ProspectsBoardProps {
    onSetProspect: (prospect: Prospect) => void;
}

// --- STYLES FOR PRIORITY BADGE ---
const priorityStyles: { [key in Priority]: { container: string; bar: string } } = {
    High: { container: "bg-[#ff6a6a] text-white", bar: "bg-[#c70000]" },
    Medium: { container: "bg-[#fedaa0] text-black", bar: "bg-[#ca820e]" },
    Low: { container: "bg-[#defcbd] text-black", bar: "bg-[#b8df91]" },
};

// --- MAP STAGE NAMES TO ICONS ---
const stageIcons: { [key in StageName]: React.ReactElement } = {
    Prospecting: <Prospecting className="w-4 h-4 text-[#5e6b66]" />,
    Meeting: <Meeting className="w-4 h-4 text-[#5e6b66]" />,
    Proposal: <Proposal className="w-4 h-4 text-[#5e6b66]" />,
    Deal: <Deal className="w-4 h-4 text-[#5e6b66]" />,
    Lost: <Lost className="w-4 h-4 text-[#5e6b66]" />,
};

// --- HELPER FUNCTIONS ---
const getInitials = (name: string): string => {
    if (!name) return "";
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0][0]?.toUpperCase() || "";
    return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
};
const calculateMonthsSince = (sinceDateStr: string): number => {
    const sinceDate = new Date(sinceDateStr);
    const currentDate = new Date();
    if (isNaN(sinceDate.getTime())) return 1;
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const sinceYear = sinceDate.getFullYear();
    const sinceMonth = sinceDate.getMonth();
    if (currentYear < sinceYear || (currentYear === sinceYear && currentMonth < sinceMonth)) return 1;
    const totalMonths = (currentYear - sinceYear) * 12 + (currentMonth - sinceMonth) + 1;
    return Math.max(1, totalMonths);
};


// --- MAIN BOARD COMPONENT ---
export default function ProspectsBoard({ onSetProspect }: ProspectsBoardProps) {
    const columns: Stage[] = salesData.prospects.stages as Stage[];
    const prospectsList: Prospect[] = salesData.prospects.list as Prospect[];

    return (
        <div className="grid grid-flow-col auto-cols-[minmax(285px,1fr)] gap-x-4 p-4 overflow-x-auto">
            {columns.map(column => {
                const columnProspects = prospectsList.filter(p => p.stage === column.name);
                return (
                    <div key={column.name} className="bg-[#f6f7f7] rounded-lg p-3 flex flex-col">
                        <div className="flex items-center justify-between mb-4 px-1 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 flex items-center justify-center">
                                    {stageIcons[column.name] || <div className="w-2 h-2 bg-gray-400 rounded-full"></div>}
                                </div>
                                <h2 className="font-semibold text-[#5e6b66]">{column.name}</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-[#5e6b66]">
                                    {columnProspects.length}
                                </span>
                                <button
                                    aria-label="Column options"
                                    className="text-[#5e6b66] hover:text-gray-600"
                                >
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3 overflow-y-auto no-scrollbar pr-2 h-[calc(100vh-230px)]">
                            {columnProspects.map(prospect => {
                                const months = calculateMonthsSince(prospect.since);
                                const totalValue = prospect.value * months;
                                const followUpCount = prospect.followUps?.length || 0;
                                const messageCount = prospect.comments?.length || 0;
                                const attachmentCount = prospect.files?.length || 0;
                                return (
                                    <div
                                        key={prospect.id}
                                        className="bg-white p-4 rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                        onClick={() => onSetProspect(prospect)}
                                    >
                                        <div className="flex flex-col space-y-3">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Image
                                                    src={prospect.logo}
                                                    alt={`${prospect.title} logo`}
                                                    width={32}
                                                    height={32}
                                                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                                />
                                                <div>
                                                    <span className="text-black text-sm leading-tight">{prospect.title}</span>
                                                    <p className="text-xs text-gray-500">Since: {prospect.since}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <BarChartBig size={16} />
                                                    <span className="font-medium text-sm">{prospect.targetPlan}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Wallet size={16} />
                                                    <span className="font-medium text-sm">
                                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalValue)}
                                                        <span className="text-gray-500 font-normal"> ({months} {months === 1 ? 'month' : 'months'})</span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
                                                    <div className={`inline-flex items-center gap-x-1.5 px-2 py-0.5 font-medium rounded-md ${priorityStyles[prospect.priority]?.container}`}>
                                                        <span className={`w-1 h-3 rounded-full ${priorityStyles[prospect.priority]?.bar}`}></span>
                                                        <span>{prospect.priority}</span>
                                                    </div>
                                                    <span
                                                        className="inline-flex items-center px-3 py-0.5 rounded-full font-medium text-black"
                                                        style={{ backgroundColor: prospect.bgColor ?? '#e5e7eb' }}
                                                    >
                                                        {prospect.industry}
                                                    </span>
                                                </div>
                                            </div>
                                            <hr className="border-gray-200/70" />
                                            <div className="flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {prospect.assigned.map((assignee, index) => (
                                                        <div key={index} className="relative w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-200 flex items-center justify-center" title={assignee.name}>
                                                            {assignee.avatar ? (
                                                                <Image src={assignee.avatar} alt={assignee.name} fill className="object-cover" />
                                                            ) : (
                                                                <span className="text-xs font-bold text-gray-600">{getInitials(assignee.name)}</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex items-center gap-x-1">
                                                    {followUpCount > 0 && (
                                                        <div className="flex items-center justify-center gap-1 bg-transparent border border-[#c4ccc8] px-1.5 py-1 rounded-xl w-fit">
                                                            <Send size={14} className="text-[#7a8882]" />
                                                            <span className="text-xs font-semibold text-black">{followUpCount}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-center gap-1 bg-transparent border border-[#c4ccc8] px-1.5 py-1 rounded-xl w-fit">
                                                        <MessageSquare size={14} className="text-[#7a8882]" />
                                                        <span className="text-xs font-semibold text-black">{messageCount}</span>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-1 bg-transparent border border-[#c4ccc8] px-1.5 py-1 rounded-xl w-fit">
                                                        <Paperclip size={14} className="text-[#7a8882]" />
                                                        <span className="text-xs font-semibold text-black">{attachmentCount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}