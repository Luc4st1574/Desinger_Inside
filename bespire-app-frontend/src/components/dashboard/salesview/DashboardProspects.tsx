"use client";
import React, { useState } from 'react';
import Image from 'next/image'; 
import salesData from '@/data/salesData.json';
import { ArrowRight, ChevronDown } from 'lucide-react';

// 1. Define a specific type for the priority keys
type Priority = 'High' | 'Medium' | 'Low';

// 2. Use the 'Record' utility type to tell TypeScript that
//    priorityStyles is an object indexed by our 'Priority' type.
const priorityStyles: Record<Priority, { container: string; bar: string }> = {
    High: {
        container: "bg-[#ff6a6a] text-white",
        bar: "bg-[#c70000]",
    },
    Medium: {
        container: "bg-[#fedaa0] text-black",
        bar: "bg-[#ca820e]",
    },
    Low: {
        container: "bg-[#defcbd] text-black",
        bar: "bg-[#b8df91]",
    },
};

export default function DashBoardProspects() {
    const { prospects } = salesData;
    const [activeStage, setActiveStage] = useState('Prospecting');
    const filteredList = prospects.list.filter(
        (prospect) => prospect.stage === activeStage
    );

    const rowLayout = "grid items-center gap-2 px-6";
    
    const gridTemplateColumns = { 
        gridTemplateColumns: '190px 130px 100px 110px 150px 100px' 
    };

    return (
        <div>
            <div className="flex items-center gap-3 group cursor-pointer mb-4">
                <h1 className="text-2xl font-light text-gray-800">Prospects</h1>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-fit">
                {/* Stages Summary */}
                <div className="grid grid-cols-4">
                    {prospects.stages.map((stage) => {
                        const isActive = stage.name === activeStage;
                        const count = prospects.list.filter(p => p.stage === stage.name).length;
                        return (
                            <div
                                key={stage.name}
                                className={`p-4 cursor-pointer transition-colors text-[#5e6b66] ${isActive ? 'bg-white border-t-8 border-[#004049]' : 'bg-gray-100'}`}
                                onClick={() => setActiveStage(stage.name)}
                            >
                                <p className="text-[#5e6b66]">{stage.name}</p>
                                <p className="text-3xl text-[#5e6b66]">{count}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Table Headers */}
                <div 
                    className={`${rowLayout} py-3 text-[#5e6b66] text-sm font-medium border-b border-gray-200`}
                    style={gridTemplateColumns}
                >
                    <div className="flex items-center">Title <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Contact <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Industry <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center mx-2">Target Plan <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center mx-8">Assigned <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Priority <ChevronDown className="w-4 h-4" /></div>
                </div>

                <div className="overflow-y-auto h-[260px]">
                    {filteredList.map((prospect) => (
                        <div 
                            key={prospect.id} 
                            className={`${rowLayout} py-4 border-t border-gray-200 hover:bg-gray-50 text-sm`}
                            style={gridTemplateColumns}
                        >
                            {/* Title */}
                            <div>
                                <p className="font-medium text-gray-800 truncate">{prospect.title}</p>
                                <p className="text-xs text-[#7a8882]">Since {prospect.since}</p>
                            </div>
                            {/* Contact */}
                            <div className="text-gray-700 truncate">{prospect.contact}</div>
                            
                            {/* Industry */}
                            <div>
                                <span 
                                    className="px-2 py-1 text-xs font-medium rounded-full text-gray-700"
                                    style={{ backgroundColor: prospect.bgColor }}
                                >
                                    {prospect.industry}
                                </span>
                            </div>

                            {/* Target Plan */}
                            <div className="text-gray-700 mx-2">{prospect.targetPlan}</div>

                            {/* Assigned */}
                            <div className="mx-8">
                                <div className="flex -space-x-2">
                                    {prospect.assigned.map((person) => (
                                        <Image
                                            key={person.name}
                                            src={person.avatar}
                                            alt={person.name}
                                            title={person.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full object-cover"
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            {/* Priority */}
                            <div className="flex justify-start">
                                {/* 3. Now, TypeScript knows `prospect.priority` is of type `Priority`, so this is safe */}
                                <div 
                                    className={`inline-flex items-center gap-x-2 px-3 py-1 text-sm font-medium rounded-lg ${priorityStyles[prospect.priority as Priority].container}`}
                                >
                                    <span 
                                        className={`w-1 h-4 ${priorityStyles[prospect.priority as Priority].bar}`}
                                    ></span>
                                    <span>
                                        {prospect.priority}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}