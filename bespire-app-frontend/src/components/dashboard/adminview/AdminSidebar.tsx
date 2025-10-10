/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import Image from 'next/image';
import adminData from '@/data/adminData.json'; // Assuming this is the correct path
import { ChevronRight, MessageSquare } from 'lucide-react';

export default function AdminSidebar() {
    const { user, team, clients, tasks } = adminData.dashboardData;

    // --- Calculate Client Plan Distribution ---
    const activeClientsList = clients.filter(c => c.status === 'Active');
    const totalActiveClients = activeClientsList.length;

    const planCounts = {
        starter: activeClientsList.filter(c => c.planId === 'starter').length,
        growth: activeClientsList.filter(c => c.planId === 'growth').length,
        pro: activeClientsList.filter(c => c.planId === 'pro').length,
    };

    // Handle division by zero if there are no active clients
    const planPercentages = {
        starter: totalActiveClients > 0 ? (planCounts.starter / totalActiveClients) * 100 : 0,
        growth: totalActiveClients > 0 ? (planCounts.growth / totalActiveClients) * 100 : 0,
        pro: totalActiveClients > 0 ? (planCounts.pro / totalActiveClients) * 100 : 0,
    };

    const planStyles = {
        starter: { name: "Starter", color: "#3a76ff", count: planCounts.starter, percentage: planPercentages.starter },
        growth: { name: "Growth", color: "#5b6f59", count: planCounts.growth, percentage: planPercentages.growth },
        pro: { name: "Pro", color: "#ffe664", count: planCounts.pro, percentage: planPercentages.pro },
    };

    // --- Determine Recent Clients from latest tasks ---
    const clientMap = new Map(clients.map(c => [c.id, c]));
    // Sort tasks by ID descending to get the newest ones
    const recentTasks = [...tasks.list].sort((a, b) => b.id - a.id);
    const recentClientsWithTasks: { client: any, task: any }[] = [];
    const processedClientIds = new Set();

    for (const task of recentTasks) {
        if (!processedClientIds.has(task.clientId)) {
            processedClientIds.add(task.clientId);
            const client = clientMap.get(task.clientId);
            if (client) {
                recentClientsWithTasks.push({ client, task });
            }
        }
        if (recentClientsWithTasks.length >= 3) break;
    }

    return (
        <aside className="bg-white rounded-lg shadow-sm flex flex-col overflow-hidden w-80">
            <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                {/* Admin Info */}
                <div className="flex items-center gap-4">
                    <Image
                        src={user.avatar}
                        alt={user.name}
                        width={56}
                        height={56}
                        className="rounded-full"
                    />
                    <div>
                        <div className="font-semibold text-xl text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{user.title}</div>
                    </div>
                </div>

                {/* Active Clients */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-600">Active Clients</h3>
                    <p className="text-2xl font-bold text-gray-800">{totalActiveClients} Clients</p>
                    
                    {/* --- MODIFIED PROGRESS BAR --- */}
                    <div className="w-full flex items-center gap-1 h-2">
                        {Object.values(planStyles)
                            .filter(plan => plan.percentage > 0) // Only show plans with clients
                            .map(plan => (
                                <div
                                    key={plan.name}
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${plan.percentage}%`,
                                        backgroundColor: plan.color,
                                    }}
                                />
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex justify-between items-center w-full pt-1">
                        {Object.values(planStyles).map(plan => (
                            <div key={plan.name} className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: plan.color }}></span>
                                <span className="text-sm text-gray-700">{plan.count}</span>
                                <span className="text-sm text-gray-500">{plan.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Clients */}
                <div className="space-y-4">
                    <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center justify-between">
                        <span>Recent Clients</span>
                        <ChevronRight className="w-4 h-4" />
                    </a>
                    <ul className="space-y-6">
                        {recentClientsWithTasks.map(({ client, task }) => (
                            <li key={client.id} className="flex items-center gap-3">
                                <Image src={client.logoUrl} alt={client.name} width={36} height={36} className="rounded-full bg-gray-100" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-800">{client.name}</div>
                                    <div className="text-xs text-gray-400 truncate" title={task.title}>{task.title}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Team on Bespire */}
                <div className="space-y-4">
                    <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center justify-between">
                        <span>Team on Bespire</span>
                        <ChevronRight className="w-4 h-4" />
                    </a>
                    <ul className="space-y-6">
                        {team.map((member) => (
                            <li key={member.id} className="flex items-center gap-3">
                                <Image src={member.avatar} className="w-9 h-9 rounded-full" alt={member.name} width={36} height={36} />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-800">{member.name}</div>
                                    <div className="text-xs text-gray-400">{member.role}</div>
                                </div>
                                <button className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full" title={`Message ${member.name}`}>
                                    <MessageSquare className="w-5 h-5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Footer Button */}
            <a href="#" className="w-full bg-[#ebfdd8] text-gray-800 font-semibold py-4 flex items-center justify-center gap-2 hover:brightness-95 transition-all">
                Go to Account <ChevronRight className="w-5 h-5" />
            </a>
        </aside>
    );
}