"use client";

import React, { Fragment } from 'react';
import type { Client } from '@/types/analytics';
import { Listbox, Transition } from '@headlessui/react';
import { Plus, ChevronDown } from 'lucide-react';
import Image from 'next/image';

interface AnalyticsHeaderProps {
    client: Client;
    clients: Client[];
    setSelectedClientId: (id: string) => void;
}

const AnalyticsHeader = ({ client, clients, setSelectedClientId }: AnalyticsHeaderProps) => {
    
    const selectedClient = clients.find(c => c.clientId === client.clientId) || client;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center w-full">
            {/* Left Side: Client Selector */}
            <div className="flex items-center gap-3">
                <span className="text-gray-800 font-light text-sm">Client</span>
                
                <Listbox value={selectedClient.clientId} onChange={setSelectedClientId}>
                    <div className="relative w-48">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-full border-2 border-[#5b6f59] bg-transparent py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm">
                            <span className="flex items-center">
                                <div className="w-6 h-6 mr-2 flex-shrink-0 rounded-full border border-[#c4ccc8] flex items-center justify-center overflow-hidden">
                                    <Image
                                        src={selectedClient.logoUrl}
                                        alt={selectedClient.clientName}
                                        width={20}
                                        height={20}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <span className="block truncate font-medium text-[#5b6f59]">{selectedClient.clientName}</span>
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDown className="h-5 w-5 text-[#5b6f59]" aria-hidden="true" />
                            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm z-10">
                                {clients.map((c) => (
                                    <Listbox.Option
                                        key={c.clientId}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'
                                            }`
                                        }
                                        value={c.clientId}
                                    >
                                        {({ selected }) => (
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 mr-3 flex-shrink-0 rounded-full border border-[#c4ccc8] flex items-center justify-center overflow-hidden">
                                                    <Image
                                                        src={c.logoUrl}
                                                        alt={c.clientName}
                                                        width={20}
                                                        height={20}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                    {c.clientName}
                                                </span>
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>

            {/* Right Side: Add Data Button */}
            <div className="mt-4 sm:mt-0">
                <button
                    type="button"
                    className="flex items-center gap-2 rounded-full bg-[#697d67] px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none"
                >
                    <span>Add Data</span>
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};

export default AnalyticsHeader;