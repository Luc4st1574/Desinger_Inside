"use client";
import React, { useState, Fragment } from 'react';
import Image from 'next/image';
import adminData from '@/data/adminData.json'; // Assuming this is the correct path
import { ArrowRight, ChevronDown, Plus, User } from 'lucide-react';
import { Popover, Transition } from '@headlessui/react';

// Destructure the necessary data from the imported JSON
const { clients, team } = adminData.dashboardData;

// Create lookup maps for efficient data retrieval
const clientMap = new Map(clients.map(client => [client.id, client.name]));
const teamMap = new Map(team.map(member => [member.id, member]));

// Define a specific type for the priority keys for better type safety
type Priority = "High" | "Medium" | "Low";

const priorityStyles: Record<Priority, { container: string; bar: string }> = {
    High: { container: "bg-[#ff6a6a] text-white", bar: "bg-[#c70000]" },
    Medium: { container: "bg-[#fedaa0] text-black", bar: "bg-[#ca820e]" },
    Low: { container: "bg-[#defcbd] text-black", bar: "bg-[#b8df91]" },
};

export default function AdminRequestTable() {
    // --- STATE MANAGEMENT ---
    const [tasksList, setTasksList] = useState(adminData.dashboardData.tasks.list);
    const [activeStage, setActiveStage] = useState('Requests');

    // --- ASSIGNMENT HANDLER (MODIFIED) ---
    const handleAssignMember = (taskId: number, memberId: number) => {
        // Update the tasksList state to reflect the new assignment
        setTasksList(currentTasks =>
            currentTasks.map(task => {
                if (task.id === taskId) {
                    // Create a new task object with the updated assignees
                    return {
                        ...task,
                        assignedTeamMemberIds: [...task.assignedTeamMemberIds, memberId]
                    };
                }
                return task;
            })
        );
        console.log(`Assigned Team Member ID: ${memberId} to Task ID: ${taskId}`);
    };

    // --- DATA DERIVED FROM STATE ---
    // Get a unique set of all team member IDs that are assigned to at least one task.
    const allAssignedIds = new Set(tasksList.flatMap(task => task.assignedTeamMemberIds));
    // Get the full member objects for these unique IDs to show in the popup.
    const activeTeamMembers = team.filter(member => allAssignedIds.has(member.id));

    // Filter the task list based on the currently active stage
    const filteredList = tasksList.filter(
        (task) => task.status === activeStage
    );

    const rowLayout = "grid items-center gap-4 px-6";
    const gridTemplateColumns = { gridTemplateColumns: '190px 130px 100px 110px 100px 100px' };

    return (
        <div>
            <a href="#" className="text-2xl font-light text-gray-800 flex items-center gap-3 group mb-4">
                Requests
                <ArrowRight className="h-5 w-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-fit">
                {/* Stages Summary Tabs (Now reads from stateful tasksList) */}
                <div className="grid grid-cols-4">
                    {adminData.dashboardData.tasks.stages.map((stage) => {
                        const isActive = stage.name === activeStage;
                        const count = tasksList.filter(p => p.status === stage.name).length;
                        return (
                            <div key={stage.name} className={`p-4 cursor-pointer transition-colors ${isActive ? 'bg-white border-t-8 border-teal-800' : 'bg-gray-50 hover:bg-gray-100'}`} onClick={() => setActiveStage(stage.name)}>
                                <p className="text-gray-600">{stage.name}</p>
                                <p className="text-3xl font-light text-gray-800">{count}</p>
                            </div>
                        )
                    })}
                </div>

                {/* Table Headers */}
                <div className={`${rowLayout} py-3 text-gray-600 text-sm font-medium border-b border-gray-200`} style={gridTemplateColumns}>
                    <div className="flex items-center">Title <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Client <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Category <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Deadline <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Assigned <ChevronDown className="w-4 h-4" /></div>
                    <div className="flex items-center">Priority <ChevronDown className="w-4 h-4" /></div>
                </div>

                <div className="overflow-y-auto h-[250px]">
                    {filteredList.map((task) => {
                        const clientName = clientMap.get(task.clientId) || 'N/A';
                        const assignedMembers = task.assignedTeamMemberIds.map(id => teamMap.get(id)).filter(Boolean);
                        return (
                            <div key={task.id} className={`${rowLayout} py-4 border-t border-gray-200 hover:bg-gray-50 text-sm`} style={gridTemplateColumns}>
                                {/* Columns... */}
                                <div><p className="font-medium text-gray-800 truncate">{task.title}</p></div>
                                <div className="text-gray-700 truncate">{clientName}</div>
                                <div><span className="px-2 py-1 text-xs font-medium rounded-full text-gray-700" style={{ backgroundColor: task.categoryBg }}>{task.category}</span></div>
                                <div className="text-gray-700">{task.deadline}</div>
                                
                                {/* Assigned Column */}
                                <div className="flex justify-start">
                                    {assignedMembers.length > 0 ? (
                                        <div className="flex -space-x-2">
                                            {assignedMembers.map((person) => person && (
                                                <Image key={person.id} src={person.avatar} alt={person.name} title={person.name} width={32} height={32} className="rounded-full object-cover border-2 border-white"/>
                                            ))}
                                        </div>
                                    ) : (
                                        <Popover className="relative">
                                            <Popover.Button className="relative w-8 h-8 outline-none" title="Assign team member">
                                                <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full rounded-full bg-gray-200"><User className="h-5 w-5 text-gray-500" /></div>
                                                <div className="absolute -bottom-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full" style={{ backgroundColor: '#ceffa3' }}><Plus className="h-3 w-3 text-gray-800" /></div>
                                            </Popover.Button>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0"
                                                leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1"
                                            >
                                                <Popover.Panel className="absolute z-50 mt-2 w-64 -translate-x-1/2 left-1/2 bg-white rounded-lg shadow-xl">
                                                    <div className="p-2">
                                                        <h3 className="text-sm font-medium text-gray-600 mb-2">Assign to...</h3>
                                                        <ul className="space-y-1 max-h-48 overflow-y-auto">
                                                            {activeTeamMembers.map(member => (
                                                                <li key={member.id}>
                                                                    <Popover.Button as="button" onClick={() => handleAssignMember(task.id, member.id)} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors text-left">
                                                                        <Image src={member.avatar} alt={member.name} width={32} height={32} className="rounded-full object-cover"/>
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-800">{member.name}</p>
                                                                            <p className="text-xs text-gray-500">{member.role}</p>
                                                                        </div>
                                                                    </Popover.Button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </Popover.Panel>
                                            </Transition>
                                        </Popover>
                                    )}
                                </div>
                                
                                {/* Priority Column */}
                                <div className="flex justify-start">
                                    <div className={`inline-flex items-center gap-x-2 px-3 py-1 text-sm font-medium rounded-lg ${priorityStyles[task.priority as Priority]?.container || ''}`}>
                                        <span className={`w-1 h-4 ${priorityStyles[task.priority as Priority]?.bar || ''}`}></span>
                                        <span>{task.priority}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}