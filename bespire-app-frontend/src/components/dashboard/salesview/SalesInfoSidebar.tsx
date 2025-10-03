"use client";
import React from 'react';
import salesData from '@/data/salesData.json';

export default function SalesInfoSidebar() {
    const { salesManager, team } = salesData;

    return (
        <aside className="w-full lg:w-96 bg-gray-50 p-6 rounded-lg shadow-md h-full">
        {/* Sales Manager Profile */}
        <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-300 mx-auto mb-3 flex items-center justify-center font-bold text-gray-600">
                {/* Placeholder for avatar image */}
                TB
            </div>
            <h2 className="text-xl font-bold text-gray-900">{salesManager.name}</h2>
            <p className="text-gray-500">{salesManager.title}</p>
        </div>

        {/* Active Prospects */}
        <div className="mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-1">Active Prospects</h3>
            <p className="text-4xl font-bold text-gray-900">{salesManager.stats.activeProspects} <span className="text-base text-gray-500 font-normal">Prospects</span></p>
            <p className="text-sm text-gray-500">{salesManager.stats.breakdown}</p>
            <div className="flex justify-between mt-4">
            <div>
                <p className="text-gray-500">Deals Won</p>
                <p className="text-xl font-bold text-gray-900">{salesManager.stats.dealsWon}</p>
            </div>
            <div>
                <p className="text-gray-500">Conversion Rate</p>
                <p className="text-xl font-bold text-gray-900">{salesManager.stats.conversionRate}</p>
            </div>
            </div>
        </div>

        {/* Recent Prospects */}
        <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4">Recent Prospects →</h3>
            <ul className="space-y-4">
            {salesManager.recentProspects.map((prospect) => (
                <li key={prospect.name} className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {prospect.name.charAt(0)}
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{prospect.name}</p>
                    <p className="text-sm text-gray-500">{prospect.type} {prospect.time}</p>
                </div>
                </li>
            ))}
            </ul>
        </div>

        {/* Team on Bespire */}
        <div className="mb-8">
            <h3 className="font-bold text-gray-800 mb-4">Team on Bespire</h3>
            <ul className="space-y-3">
            {team.map((member) => (
                <li key={member.name} className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
                        {/* Placeholder for avatar image */}
                        {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                    <p className="font-semibold text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">💬</button>
                </li>
            ))}
            </ul>
        </div>
        
        {/* Go to Account Button */}
        <button className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-colors">
            Go to Account
        </button>
        </aside>
    );
}