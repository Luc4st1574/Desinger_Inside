"use client";
import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import requestData from '@/data/requestData.json';

const timeRanges = [
  { value: '1m', label: '1 month' },
  { value: '3m', label: '3 months' },
  { value: '6m', label: '6 months' },
];

type Priority = 'High' | 'Medium' | 'Low';

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

export default function DashboardRequestsPreview() {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[0]);
  const { requests } = requestData;
  const [activeStage, setActiveStage] = useState('Requests');

  // --- CORRECTED FILTERING LOGIC STARTS HERE ---
  const filteredList = requests.list.filter((request) => {
    // 1. First, filter by the active stage (no change here)
    const isInStage = request.stage === activeStage;
    if (!isInStage) return false;

    // 2. Corrected date filtering logic
    const today = new Date(); // Current date: Oct 6, 2025
    const deadline = new Date(request.deadline);

    // Set the end of our filter range to the last moment of the current month
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    // Determine how many past months to include based on the selection
    let monthsToSubtract = 0;
    if (selectedTimeRange.value === '1m') {
      monthsToSubtract = 0; // Current month
    } else if (selectedTimeRange.value === '3m') {
      monthsToSubtract = 2; // Current month + 2 previous months
    } else if (selectedTimeRange.value === '6m') {
      monthsToSubtract = 5; // Current month + 5 previous months
    }
    
    // Set the start of our filter range to the first moment of the calculated month
    const startDate = new Date(today.getFullYear(), today.getMonth() - monthsToSubtract, 1);
    startDate.setHours(0, 0, 0, 0);

    // 3. Return true only if the deadline falls within this new range
    return deadline >= startDate && deadline <= endDate;
  });
  // --- CORRECTED FILTERING LOGIC ENDS HERE ---

  const rowLayout = "grid items-center gap-4 px-6";
  const gridTemplateColumns = { 
      gridTemplateColumns: 'minmax(200px, 1fr) 130px 120px 120px 100px 100px' 
  };

  return (
    <section className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <a href="#" className="text-2xl font-light text-gray-800 flex items-center gap-3 group">
          Requests
          <ArrowRight className="h-5 w-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
        </a>
        
        <Listbox value={selectedTimeRange} onChange={setSelectedTimeRange}>
          <div className="relative w-fit"> 
            <Listbox.Button className="relative w-full cursor-default rounded-full border border-gray-300 bg-white py-1 pl-4 pr-10 text-left text-sm text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
              <span className="block truncate">{selectedTimeRange.label}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {timeRanges.map((range, rangeIdx) => (
                <Listbox.Option
                  key={rangeIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-4 pr-4 ${
                      active ? 'bg-gray-100' : 'text-gray-900'
                    }`
                  }
                  value={range}
                >
                  {({ selected }) => (
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {range.label}
                      </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-4">
          {requests.stages.map((stage) => {
              const isActive = stage.name === activeStage;
              
              // Also update the count logic to use the same corrected date filter
              const count = requests.list.filter(p => {
                const today = new Date();
                const deadline = new Date(p.deadline);
                const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                let monthsToSubtract = 0;
                if (selectedTimeRange.value === '1m') monthsToSubtract = 0;
                else if (selectedTimeRange.value === '3m') monthsToSubtract = 2;
                else if (selectedTimeRange.value === '6m') monthsToSubtract = 5;
                const startDate = new Date(today.getFullYear(), today.getMonth() - monthsToSubtract, 1);
                
                return p.stage === stage.name && (deadline >= startDate && deadline <= endDate);
              }).length;

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

        <div 
          className={`${rowLayout} py-3 text-gray-500 text-sm font-medium border-b border-gray-200`}
          style={gridTemplateColumns}
        >
          <div className="flex items-center">Title <ChevronDown className="w-4 h-4 ml-1" /></div>
          <div className="flex items-center">Category <ChevronDown className="w-4 h-4 ml-1" /></div>
          <div className="flex items-center">Deadline <ChevronDown className="w-4 h-4 ml-1" /></div>
          <div className="flex items-center">Assigned <ChevronDown className="w-4 h-4 ml-1" /></div>
          <div className="flex items-center">Credits <ChevronDown className="w-4 h-4 ml-1" /></div>
          <div className="flex items-center">Priority <ChevronDown className="w-4 h-4 ml-1" /></div>
        </div>

        <div className="overflow-y-auto h-[260px]">
          {filteredList.map((request) => (
            <div 
              key={request.id} 
              className={`${rowLayout} py-4 border-t border-gray-100 hover:bg-gray-50 text-sm`}
              style={gridTemplateColumns}
            >
              <div>
                <p className="font-medium text-gray-800 truncate">{request.title}</p>
                <p className="text-xs text-gray-500">Submitted {request.submittedDate}</p>
              </div>
              <div>
                <span 
                  className="px-2 py-1 text-xs font-medium rounded-full"
                  style={{ backgroundColor: request.bgColor }}
                >
                  {request.category}
                </span>
              </div>
              <div className="text-gray-700">{request.deadline}</div>
              <div>
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
              <div className="flex items-center text-[#62864d]">
                <span className="w-2 h-2 mr-2 bg-[#62864d] rounded-full"></span>
                {request.credits} Credits
              </div>
              
              <div>
                <div 
                  className={`inline-flex items-center gap-x-2 px-3 py-1 text-sm font-medium rounded-lg ${priorityStyles[request.priority as Priority].container}`}
                >
                  <span 
                    className={`w-1 h-4 ${priorityStyles[request.priority as Priority].bar}`}
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
    </section>
  );
}