"use client";
import React from 'react';
import salesData from '@/data/salesData.json';

// A helper map to get colors for priority tags
const priorityColors = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
};

export default function DashBoardProspects() {
    const { prospects } = salesData;

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Prospects →</h1>
        </div>

        {/* Stages Summary */}
        <div className="grid grid-cols-4 border-b">
            {prospects.stages.map((stage) => (
            <div key={stage.name} className={`p-4 ${stage.name === 'Prospecting' ? 'border-b-2 border-black' : ''}`}>
                <p className="text-gray-500">{stage.name}</p>
                <p className="text-3xl font-bold text-gray-800">{stage.count}</p>
            </div>
            ))}
        </div>

        {/* Prospects Table */}
        <div className="mt-4">
            <table className="w-full text-left">
            <thead>
                <tr className="text-gray-500 text-sm">
                <th className="p-3">Title ⌄</th>
                <th className="p-3">Contact ⌄</th>
                <th className="p-3">Industry ⌄</th>
                <th className="p-3">Target Plan ⌄</th>
                <th className="p-3">Assigned ⌄</th>
                <th className="p-3">Priority ⌄</th>
                </tr>
            </thead>
            <tbody>
                {prospects.list.map((prospect) => (
                <tr key={prospect.id} className="border-t">
                    <td className="p-3">
                    <p className="font-semibold text-gray-800">{prospect.title}</p>
                    <p className="text-xs text-gray-500">Since {prospect.since}</p>
                    </td>
                    <td className="p-3 text-gray-700">{prospect.contact}</td>
                    <td className="p-3">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-md">{prospect.industry}</span>
                    </td>
                    <td className="p-3 text-gray-700">{prospect.targetPlan}</td>
                    <td className="p-3">
                    {/* Placeholder for avatars */}
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-blue-600">GB</div>
                        <div className="w-8 h-8 rounded-full bg-purple-200 border-2 border-white flex items-center justify-center text-purple-600">LH</div>
                        <div className="w-8 h-8 rounded-full bg-green-200 border-2 border-white flex items-center justify-center text-green-600">BC</div>
                    </div>
                    </td>
                    <td className="p-3">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-lg border ${priorityColors[prospect.priority]}`}>
                        {prospect.priority}
                    </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    );
    }