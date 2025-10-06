"use client";
import React from 'react';
import Image from 'next/image';
import salesDataJson from '@/data/salesData.json';
import { ArrowRight, ChevronRight, MessageSquareTextIcon } from 'lucide-react';

// Assert the type of the imported JSON
const salesData = salesDataJson;

export default function SalesInfoSidebar() {
    const { prospects, salesManager: managerInfo } = salesData;

    // Helper function to calculate relative time from a date string
    const getRelativeTime = (dateString) => {
        const pastDate = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - pastDate.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays < 1) {
            return "today";
        }
        if (diffInDays === 1) {
            return "1 day ago";
        }
        return `${diffInDays} days ago`;
    };

    // Calculate counts for each prospect stage
    const stageCounts = prospects.list.reduce((acc, prospect) => {
        const stage = prospect.stage;
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
    }, {});

    const dealsWon = stageCounts["Deal"] || 0;
    const activeProspectsCount = (stageCounts["Prospecting"] || 0) + (stageCounts["Meeting"] || 0) + (stageCounts["Proposal"] || 0);
    const totalProspects = prospects.list.length;

    const conversionRate = totalProspects > 0
        ? `${((dealsWon / totalProspects) * 100).toFixed(2)}%`
        : '0.00%';

    const breakdown = `${stageCounts["Prospecting"] || 0} New • ${stageCounts["Meeting"] || 0} Meeting • ${stageCounts["Proposal"] || 0} Proposals`;

    // Get the 3 most recent prospects
    const recentProspects = [...prospects.list]
        .sort((a, b) => new Date(b.since).getTime() - new Date(a.since).getTime())
        .slice(0, 3);
        
    // Create a unique list of team members
    const teamMap = new Map();
    prospects.list.flatMap(p => p.assigned).forEach(member => {
        if (!teamMap.has(member.name)) {
            teamMap.set(member.name, member);
        }
    });
    const team = Array.from(teamMap.values());
    
    // Consolidate sales manager data with calculated stats
    const salesManager = {
        ...managerInfo,
        stats: {
            activeProspects: activeProspectsCount,
            breakdown: breakdown,
            dealsWon: dealsWon,
            conversionRate: conversionRate
        }
    };

    return (
        <aside className="w-full lg:w-80 bg-white rounded-lg shadow-md h-full border border-gray-200 flex flex-col overflow-hidden">
            
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="flex items-center gap-4 mb-4">
                    <Image
                        src={salesManager.avatar}
                        alt={salesManager.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{salesManager.name}</h2>
                        <p className="text-gray-500">{salesManager.title}</p>
                    </div>
                </div>

                <div className="mb-2">
                    <h3 className="font-light text-lg text-[#5e6b66] mb-1">Active Prospects</h3>
                    <p className="text-2xl font-bold text-gray-900">{salesManager.stats.activeProspects} <span className="text-2xl font-bold text-gray-900">Prospects</span></p>
                    <div className="border-t border-gray-200 my-2"></div>
                    <p className="text-sm text-[#697d67] text-center">{salesManager.stats.breakdown}</p>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between mt-4">
                        <div>
                            <p className="text-[#5e6b66]">Deals Won</p>
                            <p className="text-xl font-semibold text-gray-900">{salesManager.stats.dealsWon}</p>
                        </div>
                        <div>
                            <p className="text-[#5e6b66]">Conversion Rate</p>
                            <p className="text-xl font-semibold text-gray-900">{salesManager.stats.conversionRate}</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <div className="mb-4">
                    <h2 className="font-light text-lg text-[#5e6b66] mb-4 flex items-center gap-2">
                        Recent Prospects <ArrowRight className="w-3 h-3" />
                    </h2>
                    <ul className="space-y-4">
                        {recentProspects.map((prospect) => (
                            <li key={prospect.id} className="flex items-center space-x-3">
                                <Image
                                    src={prospect.logo}
                                    alt={`${prospect.title} Logo`}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full object-contain"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{prospect.title}</p>
                                    <p className="text-sm text-gray-500">
                                        {prospect.source} {getRelativeTime(prospect.since)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div>
                    <h2 className="font-light text-lg text-[#5e6b66] mb-4 flex items-center gap-2">
                        Team on Bespire<ArrowRight className="w-3 h-3" />
                    </h2>
                    <ul className="space-y-3">
                        {team.map((member) => (
                            <li key={member.name} className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <Image
                                        src={member.avatar}
                                        alt={member.name}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800">{member.name}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600" title={`Message ${member.name}`}>
                                    <MessageSquareTextIcon className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <button className="w-full bg-[#ebfdd8] text-black font-semibold underline py-3 flex items-center justify-center gap-2 hover:brightness-95 transition-all">
                Go to Account <ChevronRight className="w-5 h-5" />
            </button>
        </aside>
    );
}