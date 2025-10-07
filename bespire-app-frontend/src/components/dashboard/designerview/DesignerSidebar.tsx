"use client";
import React from 'react';
import Image from 'next/image';
import designerDataJson from '@/data/designerRequest.json'; // Using the new designer data file
import { ArrowRight, ChevronRight, MessageSquareTextIcon } from 'lucide-react';

// Assert the type of the imported JSON
const designerData = designerDataJson;

export default function DesignerSidebar() {
    const { designerRequests: requests, designManager: managerInfo } = designerData;

    // Helper function to calculate relative time from a date string (no changes needed)
    const getRelativeTime = (dateString) => {
        const pastDate = new Date(dateString);
        const now = new Date(); // Current time is mocked as Oct 6, 2025 for consistency
        now.setFullYear(2025, 9, 6); // Set date to Oct 6, 2025
        const diffInMs = now.getTime() - pastDate.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays < 1) return "today";
        if (diffInDays === 1) return "1 day ago";
        return `${diffInDays} days ago`;
    };

    // Calculate counts for each request stage
    const stageCounts = requests.list.reduce((acc, request) => {
        const stage = request.stage;
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
    }, {});

    // ### METRIC CALCULATIONS FOR DESIGNER DASHBOARD ###

    // 1. Active Requests (all requests not completed)
    const activeRequestsCount = (stageCounts["Requests"] || 0) + (stageCounts["In Progress"] || 0) + (stageCounts["Pending"] || 0);
    const breakdown = `${stageCounts["Requests"] || 0} New • ${stageCounts["In Progress"] || 0} In Progress • ${stageCounts["Pending"] || 0} Pending`;

    // 2. Total Unique Clients
    const totalClients = new Set(requests.list.map(req => req.client)).size;

    // 3. Average rating of completed projects
    const completedRequests = requests.list.filter(req => req.stage === 'Completed');
    const averageRating = completedRequests.length > 0
        ? (completedRequests.reduce((sum, req) => sum + req.rating, 0) / completedRequests.length).toFixed(1)
        : '0.0';

    // Get the 3 most recent requests
    const recentRequests = [...requests.list]
        .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
        .slice(0, 3);
        
    // Create a unique list of team members (logic remains the same)
    const teamMap = new Map();
    requests.list.flatMap(p => p.assigned).forEach(member => {
        if (!teamMap.has(member.name)) {
            teamMap.set(member.name, member);
        }
    });
    const team = Array.from(teamMap.values());
    
    // Consolidate design manager data with calculated stats
    const designManager = {
        ...managerInfo,
        stats: {
            activeRequests: activeRequestsCount,
            breakdown: breakdown,
            totalClients: totalClients,
            averageRating: `${averageRating} /5`
        }
    };

    return (
        <aside className="w-full lg:w-80 bg-white rounded-lg shadow-md h-full border border-gray-200 flex flex-col overflow-hidden">
            
            <div className="flex-grow p-6 overflow-y-auto">
                <div className="flex items-center gap-4 mb-4">
                    <Image
                        src={designManager.avatar}
                        alt={designManager.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{designManager.name}</h2>
                        <p className="text-gray-500">{designManager.title}</p>
                    </div>
                </div>

                <div className="mb-2">
                    <h3 className="font-light text-lg text-[#5e6b66] mb-1">Active Requests</h3>
                    <p className="text-2xl font-bold text-gray-900">{designManager.stats.activeRequests} <span className="text-2xl font-bold text-gray-900">Requests</span></p>
                    <div className="border-t border-gray-200 my-2"></div>
                    <p className="text-sm text-[#697d67] text-center">{designManager.stats.breakdown}</p>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between mt-4">
                        <div>
                            <p className="text-[#5e6b66]">Total Clients</p>
                            <p className="text-xl font-semibold text-gray-900">{designManager.stats.totalClients}</p>
                        </div>
                        <div>
                            <p className="text-[#5e6b66]">Average Rating</p>
                            <p className="text-xl font-semibold text-gray-900 flex items-center gap-1">
                                {designManager.stats.averageRating}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                <div className="mb-4">
                    <h2 className="font-light text-lg text-[#5e6b66] mb-4 flex items-center gap-2">
                        Recent Clients <ArrowRight className="w-3 h-3" />
                    </h2>
                    <ul className="space-y-4">
                        {recentRequests.map((request) => (
                            <li key={request.id} className="flex items-center space-x-3">
                                <Image
                                    src={request.logo}
                                    alt={`${request.client} Logo`}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full object-contain"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{request.title}</p>
                                    <p className="text-sm text-gray-500">
                                        {getRelativeTime(request.requestDate)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div>
                    <h2 className="font-light text-lg text-[#5e6b66] mb-4 flex items-center gap-2">
                        Team on Bespire <ArrowRight className="w-3 h-3" />
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
                Go to Dashboard <ChevronRight className="w-5 h-5" />
            </button>
        </aside>
    );
}