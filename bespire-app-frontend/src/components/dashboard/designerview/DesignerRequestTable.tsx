"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import designerData from '@/data/designerRequest.json';
import { ArrowRight, ChevronDown } from 'lucide-react';

// Define a specific type for the priority keys

const priorityStyles = {
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

export default function DesignerRequestTable() {
    const { designerRequests: requests } = designerData;
    const [activeStage, setActiveStage] = useState('Requests');
    
    // Filter the list based on the currently active stage
    const filteredList = requests.list.filter(
        (request) => request.stage === activeStage
    );

    const rowLayout = "grid items-center gap-4 px-6";
    
    // Adjusted grid layout for the new columns
    const gridTemplateColumns = { 
        gridTemplateColumns: '190px 130px 100px 110px 100px 100px' 
    };

    return (
        <div>
            <a href="#" className="text-2xl font-light text-gray-800 flex items-center gap-3 group mb-4">
                Requests
                <ArrowRight className="h-5 w-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-fit">
                {/* Stages Summary */}
                <div className="grid grid-cols-4">
                    {requests.stages.map((stage) => {
                        const isActive = stage.name === activeStage;
                        // Calculate count for each stage dynamically
                        const count = requests.list.filter(p => p.stage === stage.name).length;
                        return (
                            <div
                                key={stage.name}
                                className={`p-4 cursor-pointer transition-colors ${isActive ? 'bg-white border-t-8 border-teal-800' : 'bg-gray-50 hover:bg-gray-100'}`}
                                onClick={() => setActiveStage(stage.name)}
                            >
                                <p className="text-gray-600">{stage.name}</p>
                                <p className="text-3xl font-light text-gray-800">{count}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Table Headers */}
                <div 
                    className={`${rowLayout} py-3 text-gray-600 text-sm font-medium border-b border-gray-200`}
                    style={gridTemplateColumns}
                >
                    <div className="flex items-center">Title <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Client <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Category <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Deadline <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Assigned <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Priority <ChevronDown className="w-4 h-4" /></div>
                </div>

                <div className="overflow-y-auto h-[260px]">
                    {filteredList.map((request) => (
                        <div 
                            key={request.id} 
                            className={`${rowLayout} py-4 border-t border-gray-200 hover:bg-gray-50 text-sm`}
                            style={gridTemplateColumns}
                        >
                            {/* Title */}
                            <div>
                                <p className="font-medium text-gray-800 truncate">{request.title}</p>
                                <p className="text-xs text-gray-500">Requested on {request.requestDate}</p>
                            </div>

                            {/* Client */}
                            <div className="text-gray-700 truncate">{request.client}</div>
                            
                            {/* Category - MODIFIED to use bgColor */}
                            <div>
                                <span 
                                    className="px-2 py-1 text-xs font-medium rounded-full text-gray-700"
                                    style={{ backgroundColor: request.bgColor }}
                                >
                                    {request.category}
                                </span>
                            </div>

                            {/* Deadline */}
                            <div className="text-gray-700">{request.deadline}</div>

                            {/* Assigned */}
                            <div className="flex justify-start">
                                <div className="flex -space-x-2">
                                    {request.assigned.map((person) => (
                                        <Image
                                            key={person.name}
                                            src={person.avatar}
                                            alt={person.name}
                                            title={person.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full object-cover border-2 border-white"
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            {/* Priority */}
                            <div className="flex justify-start">
                                <div 
                                    className={`inline-flex items-center gap-x-2 px-3 py-1 text-sm font-medium rounded-lg ${priorityStyles[request.priority] ? priorityStyles[request.priority].container : ''}`}
                                >
                                    <span 
                                        className={`w-1 h-4 ${priorityStyles[request.priority] ? priorityStyles[request.priority].bar : ''}`}
                                    ></span>
                                    <span>
                                        {request.priority}
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