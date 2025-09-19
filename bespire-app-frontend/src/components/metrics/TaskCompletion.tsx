import React, { useMemo, useState, Fragment } from 'react';
import type { RawTask } from '@/types/metrics';
import { ChevronDown, ChevronRight, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
import { Listbox, Transition, Dialog } from '@headlessui/react';

interface TaskCompletionProps {
  tasks: RawTask[];
}

const viewOptions = [
  { id: 1, name: 'Designer' },
  { id: 2, name: 'Client' },
];

type Period = 'Day' | 'Week' | 'Month' | 'Year';
const periods: Period[] = ['Day', 'Week', 'Month', 'Year'];

const calculateCompletionStats = (tasks: RawTask[]) => {
  if (tasks.length === 0) {
    return { rate: 0, completedWithoutRevision: 0, totalCount: 0 };
  }
  const completedWithoutRevision = tasks.filter(task => !task.requiredRevision).length;
  return {
    rate: (completedWithoutRevision / tasks.length) * 100,
    completedWithoutRevision,
    totalCount: tasks.length,
  };
};

const TaskCompletion = ({ tasks }: TaskCompletionProps) => {
  const [selectedView, setSelectedView] = useState(viewOptions[0]);
  const [activePeriod, setActivePeriod] = useState<Period>('Month');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const now = useMemo(() => new Date('2025-09-18T14:17:04-05:00'), []);

  const periodTasks = useMemo(() => {
    const endDate = new Date(now);
    let startDate = new Date(now);

    switch (activePeriod) {
      case 'Day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Week':
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'Year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }
    return tasks.filter(task => {
      const completedDate = new Date(task.completedAt);
      return completedDate >= startDate && completedDate <= endDate;
    });
  }, [tasks, activePeriod, now]);
  
  const previousPeriodTasks = useMemo(() => {
    let startDate: Date;
    let endDate: Date;
    
    switch (activePeriod) {
      case 'Day':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'Week':
        endDate = new Date(now);
        endDate.setDate(endDate.getDate() - 7);
        endDate.setHours(23, 59, 59, 999);
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'Year':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
    }
     return tasks.filter(task => {
      const completedDate = new Date(task.completedAt);
      return completedDate >= startDate && completedDate <= endDate;
    });
  }, [tasks, activePeriod, now]);

  const teamStats = useMemo(() => calculateCompletionStats(periodTasks), [periodTasks]);
  const prevTeamStats = useMemo(() => calculateCompletionStats(previousPeriodTasks), [previousPeriodTasks]);
  
  const changeInRate = teamStats.rate - prevTeamStats.rate;
  const isIncrease = changeInRate >= 0;

  const chartData = useMemo(() => {
    const key = selectedView.name.toLowerCase() as 'designer' | 'client';
    const groupedTasks: { [name: string]: RawTask[] } = {};

    periodTasks.forEach(task => {
      const groupName = task[key]?.name;
      if (groupName) {
        if (!groupedTasks[groupName]) groupedTasks[groupName] = [];
        groupedTasks[groupName].push(task);
      }
    });

    return Object.entries(groupedTasks)
      .map(([name, tasksInGroup]) => {
        const stats = calculateCompletionStats(tasksInGroup);
        return {
          name,
          rate: stats.rate,
          totalCount: stats.totalCount,
        };
      })
      .sort((a, b) => b.rate - a.rate);
  }, [periodTasks, selectedView]);

  const topPerformer = chartData.length > 0 ? chartData[0] : null;

  // --- Chart Constants ---
  const chartAxis = [55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  const chartMin = 55;
  const chartRange = 100 - chartMin;
  const axisStartOffset = 8; 
  const axisVisibleWidth = 92;

  const modalChartMin = 10;
  const modalChartRange = 100 - modalChartMin;
  const modalChartAxis = Array.from({ length: (100 - modalChartMin) / 10 + 1 }, (_, i) => modalChartMin + i * 10);

  // --- Reusable Bar Rendering Logic ---
  const renderBarRow = (
    data: { name: string; rate: number }, 
    config: { min: number, range: number, threshold: number }
  ) => {
    const barWidth = Math.max(0, (data.rate - config.min) / config.range * 100);
    
    const showContentInside = data.rate >= config.min && barWidth > config.threshold;
    
    return (
      <div className="relative h-8 text-sm">
        <div
          className="absolute top-0 left-0 h-full bg-[#ceffa3] rounded-md"
          style={{ width: `${barWidth}%` }}
        >
          {showContentInside && (
            <div className="w-full h-full flex items-center justify-between px-3">
              <span className="font-medium text-gray-800">{data.name}</span>
              <div className="flex items-center space-x-2 shrink-0">
                <span className="font-bold text-gray-600">{data.rate.toFixed(0)}%</span>
                <div className="w-1 h-4 bg-[#62864d] rounded-sm"></div>
              </div>
            </div>
          )}
        </div>

        {!showContentInside && (
          <div 
            className="absolute top-0 left-0 h-full flex items-center"
            style={{ left: `${barWidth}%` }}
          >
            <div className="flex items-center space-x-2 pl-2">
              <span className="font-medium text-gray-800">{data.name}</span>
              <span className="font-bold text-gray-500">({data.rate.toFixed(0)}%)</span>
            </div>
          </div>
        )}
      </div>
    );
  };


  return (
    <Fragment>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 px-2">
        <div className="flex items-center mb-3 sm:mb-0">
          <h2 className="text-xl font-light text-gray-800 pr-2">Task Completion Rate by</h2>
          <Listbox value={selectedView} onChange={setSelectedView}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-full border border-[#5b6f59] bg-transparent py-1 pl-4 pr-10 text-left text-sm font-medium text-[#5b6f59] focus:outline-none">
                <span className="block truncate">{selectedView.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                  <ChevronDown className="h-4 w-4 text-[#5b6f59]" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none focus:ring-0 sm:text-sm z-10">
                  {viewOptions.map((view) => (
                    <Listbox.Option key={view.id} className={({ active }) => `relative cursor-default select-none py-2 px-4 ${active ? 'bg-gray-100' : 'text-gray-900'}`} value={view}>
                      {({ selected }) => (<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{view.name}</span>)}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        <div className="flex items-center space-x-1 rounded-full border border-[#deefcf] bg-white p-1">
          {periods.map((period) => (
            <button key={period} onClick={() => setActivePeriod(period)} className={`w-20 rounded-full py-1.5 text-sm font-medium transition-colors focus:outline-none ${activePeriod === period ? 'bg-[#ceffa3] text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
              {period}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Container for Stats and Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 mb-6 relative">
          <div className="flex-1">
            <p className="text-base text-gray-500">Average Team Completion Rate</p>
            <div className="flex items-center space-x-2">
               <p className="text-3xl font-semibold text-gray-800">{teamStats.rate.toFixed(0)}%</p>
                {prevTeamStats.totalCount > 0 && (
                  <div className={`flex items-center space-x-0.5 text-xs font-medium pl-1.5 pr-1 py-0.5 rounded-full ${isIncrease ? 'bg-[#f3fee7] text-[#62864d]' : 'bg-[#ffe8e8] text-[#f01616]'}`}>
                      <span>{changeInRate.toFixed(0)}%</span>
                      <span className="mt-px">
                          {isIncrease ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                      </span>
                  </div>
                )}
            </div>
            <p className="text-sm text-gray-400">Across {teamStats.totalCount} completed tasks</p>
          </div>
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden sm:block"></div>
          <div className="flex-1 sm:pl-8">
              <p className="text-base text-gray-500">Top Performer</p>
              <p className="text-3xl font-semibold text-gray-800 truncate">{topPerformer ? topPerformer.name : 'N/A'}</p>
              <p className="text-sm text-gray-400">{topPerformer ? `Across ${topPerformer.totalCount} completed tasks` : ''}</p>
          </div>
        </div>

        <div className="mt-2 px-4">
            <div className="relative h-4 mb-2">
                {chartAxis.map(p => (
                    <div key={`axis-${p}`} className="absolute top-0 h-full" style={{ left: `${axisStartOffset + (((p - chartMin) / chartRange) * axisVisibleWidth)}%` }}>
                        <span className="absolute text-xs text-gray-400" style={{ transform: 'translateX(-50%)' }}>
                            {p}%
                        </span>
                    </div>
                ))}
            </div>
            <div className="relative space-y-3">
                 <div className="absolute inset-0">
                    {chartAxis.map(p => (
                        <div key={`grid-${p}`} className="absolute top-0 bottom-0 w-px bg-gray-200/80" style={{ left: `${axisStartOffset + (((p - chartMin) / chartRange) * axisVisibleWidth)}%` }}
                        ></div>
                    ))}
                </div>
                {chartData.slice(0, 6).map((data, index) => (
                  <div key={data.name} style={{ opacity: index > 4 ? 0.4 : 1 }}>
                    {renderBarRow(data, { min: chartMin, range: chartRange, threshold: 25 })}
                  </div>
                ))}
            </div>
        </div>

        <div className="flex justify-between items-center pt-10">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-[#ceffa3] mr-2"></div>
              <span className="text-sm text-[#6e7b75]">Completion Rate</span>
            </div>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
            View all <ChevronRight className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>

      {/* --- View All Modal --- */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 z-10 text-white opacity-75 hover:opacity-100 focus:outline-none rounded-full p-1" aria-label="Close">
              <X className="h-14 w-14" />
            </button>
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <Dialog.Title as="div" className="flex items-center mb-3 sm:mb-0">
                      <h2 className="text-xl font-light text-gray-800 pr-2">Task Completion Rate by</h2>
                        <Listbox value={selectedView} onChange={setSelectedView}>
                          <div className="relative">
                            <Listbox.Button className="relative w-full cursor-default rounded-full border border-[#5b6f59] bg-transparent py-1 pl-4 pr-10 text-left text-sm font-medium text-[#5b6f59] focus:outline-none">
                              <span className="block truncate">{selectedView.name}</span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                                <ChevronDown className="h-4 w-4 text-[#5b6f59]" aria-hidden="true" />
                              </span>
                            </Listbox.Button>
                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none focus:ring-0 sm:text-sm z-10">
                                {viewOptions.map((view) => (
                                  <Listbox.Option key={view.id} className={({ active }) => `relative cursor-default select-none py-2 px-4 ${active ? 'bg-gray-100' : 'text-gray-900'}`} value={view}>
                                    {({ selected }) => (<span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{view.name}</span>)}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                    </Dialog.Title>
                    <div className="flex items-center space-x-1 rounded-full border border-[#deefcf] bg-white p-1">
                      {periods.map((period) => (
                        <button key={period} onClick={() => setActivePeriod(period)} className={`w-20 rounded-full py-1.5 text-sm font-medium transition-colors focus:outline-none ${activePeriod === period ? 'bg-[#ceffa3] text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 max-h-[70vh] overflow-y-auto px-4">
                    <div className="relative h-4 mb-2">
                        {modalChartAxis.map(p => (
                            <span key={`modal-axis-${p}`} className="absolute text-xs text-gray-400" 
                                style={{ 
                                    left: `${axisStartOffset + (((p - modalChartMin) / modalChartRange) * axisVisibleWidth)}%`, 
                                    transform: 'translateX(-50%)' 
                                }}>
                                {p}%
                            </span>
                        ))}
                    </div>
                    <div className="relative space-y-3">
                         <div className="absolute inset-0">
                            {modalChartAxis.map(p => (
                                <div key={`modal-grid-${p}`} className="absolute top-0 bottom-0 w-px bg-gray-200/80" 
                                    style={{ 
                                        left: `${axisStartOffset + (((p - modalChartMin) / modalChartRange) * axisVisibleWidth)}%` 
                                    }}>
                                </div>
                            ))}
                        </div>
                        {chartData.map((data) => (
                           <div key={data.name}>
                             {renderBarRow(data, { min: modalChartMin, range: modalChartRange, threshold: 20 })}
                           </div>
                        ))}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  );
};

export default TaskCompletion;