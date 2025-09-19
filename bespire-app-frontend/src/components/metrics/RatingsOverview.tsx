import React, { useMemo, useState, Fragment } from 'react';
import type { RawTask } from '@/types/metrics';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';

interface RatingsOverviewProps {
  tasks: RawTask[];
}

const viewOptions = [
  { id: 1, name: 'Date' },
  { id: 2, name: 'Designer' },
  { id: 3, name: 'Client' },
];

type Period = 'Day' | 'Week' | 'Month' | 'Year';
const periods: Period[] = ['Day', 'Week', 'Month', 'Year'];

const calculateStats = (tasks: RawTask[]) => {
    const ratedTasks = tasks.filter(task => task.clientRating !== undefined && task.clientRating >= 1);
    if (ratedTasks.length === 0) {
        return { min: 0, max: 0, count: 0, average: 0 };
    }
    const ratings = ratedTasks.map(task => task.clientRating!);
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return {
        min: Math.min(...ratings),
        max: Math.max(...ratings),
        count: ratedTasks.length,
        average: sum / ratedTasks.length,
    };
};

const RatingsOverview = ({ tasks }: RatingsOverviewProps) => {
  const [selectedView, setSelectedView] = useState(viewOptions[0]);
  const [activePeriod, setActivePeriod] = useState<Period>('Month');
  
  const now = useMemo(() => new Date('2025-09-18T14:17:04-05:00'), []);

  const periodTasks = useMemo(() => {
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    let startDate: Date;

    switch (activePeriod) {
        case 'Day':
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'Week':
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            startDate.setDate(startDate.getDate() - 6);
            break;
        case 'Month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'Year':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        default:
            return tasks;
    }

    return tasks.filter(task => {
        const completedDate = new Date(task.completedAt);
        return completedDate >= startDate && completedDate <= endDate;
    });
  }, [tasks, activePeriod, now]);

  const baselineTasks = useMemo(() => {
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setDate(now.getDate() - 30);
    return tasks.filter(task => {
        const completedDate = new Date(task.completedAt);
        return completedDate >= oneMonthAgo && completedDate <= now;
    });
  }, [tasks, now]);

  const periodStats = useMemo(() => calculateStats(periodTasks), [periodTasks]);
  const baselineStats = useMemo(() => calculateStats(baselineTasks), [baselineTasks]);
  
  // MODIFIED: This logic now changes the chart's granularity based on the active period.
  const chartData = useMemo(() => {
    if (selectedView.name === 'Date') {
        switch (activePeriod) {
            case 'Year': {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const tasksThisYear = tasks.filter(task => new Date(task.completedAt).getFullYear() === now.getFullYear());
                const groupedByMonth: { [month: number]: RawTask[] } = {};
                tasksThisYear.forEach(task => {
                    const month = new Date(task.completedAt).getMonth();
                    if (!groupedByMonth[month]) groupedByMonth[month] = [];
                    groupedByMonth[month].push(task);
                });
                return months.map((name, index) => {
                    const stats = calculateStats(groupedByMonth[index] || []);
                    if (stats.count > 0) {
                      // Note: avg is not a property of stats, so renaming here.
                      return { name, min: stats.min, max: stats.max, avg: stats.average };
                    }
                    return null;
                }).filter(Boolean) as { name: string; min: number; max: number; avg: number }[];
            }
            case 'Month': {
                const groupedByDay: { [day: number]: RawTask[] } = {};
                periodTasks.forEach(task => { // `periodTasks` is already filtered for the current month
                    const day = new Date(task.completedAt).getDate();
                    if (!groupedByDay[day]) groupedByDay[day] = [];
                    groupedByDay[day].push(task);
                });
                return Object.entries(groupedByDay).map(([day, tasksInDay]) => {
                    const stats = calculateStats(tasksInDay);
                    return { name: day, min: stats.min, max: stats.max, avg: stats.average };
                }).sort((a,b) => parseInt(a.name) - parseInt(b.name));
            }
            case 'Week': {
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const groupedByDate: { [date: string]: RawTask[] } = {};
                periodTasks.forEach(task => { // `periodTasks` is already filtered for the last 7 days
                    const dateStr = new Date(task.completedAt).toDateString();
                    if (!groupedByDate[dateStr]) groupedByDate[dateStr] = [];
                    groupedByDate[dateStr].push(task);
                });
                return Object.entries(groupedByDate).map(([dateStr, tasksOnDate]) => {
                    const date = new Date(dateStr);
                    const stats = calculateStats(tasksOnDate);
                    return {
                        name: `${dayNames[date.getDay()]} ${date.getDate()}`,
                        date: date,
                        min: stats.min,
                        max: stats.max,
                        avg: stats.average
                    };
                }).sort((a,b) => a.date.getTime() - b.date.getTime());
            }
            case 'Day':
            default:
                return []; // No chart for a single day
        }
    } 
    else { // 'Designer' or 'Client' view logic (unchanged)
        const key = selectedView.name.toLowerCase() as 'designer' | 'client';
        const groupedTasks: { [name: string]: RawTask[] } = {};
        periodTasks.forEach(task => {
            const groupName = task[key]?.name;
            if (groupName) {
                if (!groupedTasks[groupName]) groupedTasks[groupName] = [];
                groupedTasks[groupName].push(task);
            }
        });
        return Object.entries(groupedTasks).map(([name, tasksInGroup]) => {
            const stats = calculateStats(tasksInGroup);
            if (stats.count > 0) {
              return { name: name.split(' ')[0], min: stats.min, max: stats.max, avg: stats.average };
            }
            return null;
        }).filter(Boolean) as { name: string; min: number; max: number; avg: number }[];
    }
  }, [tasks, periodTasks, selectedView, activePeriod, now]);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 px-2">
        <div className="flex items-center mb-3 sm:mb-0">
          <h2 className="text-xl font-light text-gray-800 pr-2">Ratings Overview by</h2>
          <Listbox value={selectedView} onChange={setSelectedView}>
            <div className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-full border border-[#5b6f59] bg-transparent py-1 pl-4 pr-10 text-left text-sm font-medium text-[#5b6f59] focus:outline-none">
                <span className="block truncate">{selectedView.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                  <ChevronDown className="h-4 w-4 text-[#5b6f59]" aria-hidden="true" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none focus:ring-0 sm:text-sm z-10">
                  {viewOptions.map((view) => (
                    <Listbox.Option
                      key={view.id}
                      className={({ active }) => `relative cursor-default select-none py-2 px-4 ${active ? 'bg-gray-100' : 'text-gray-900'}`}
                      value={view}
                    >
                      {({ selected }) => (
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{view.name}</span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        <div className="flex items-center space-x-1 rounded-full border border-[#deefcf] bg-white p-1">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`w-20 rounded-full py-1.5 text-sm font-medium transition-colors focus:outline-none ${
                activePeriod === period ? 'bg-[#ceffa3] text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 mb-8 relative">
            <div className="flex-1">
                <p className="text-sm text-gray-500">Average {activePeriod}</p>
                <p className="text-2xl font-semibold text-gray-800">
                    {periodStats.count > 0 ? `${periodStats.min.toFixed(2)}-${periodStats.max.toFixed(2)}` : 'N/A'} <span className="text-lg font-normal">stars</span>
                </p>
                <p className="text-xs text-gray-400">Across {periodStats.count} completed tasks</p>
            </div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden sm:block"></div> 
            <div className="flex-1 pl-4 sm:pl-0">
                <p className="text-sm text-gray-500">1-month Baseline</p>
                <p className="text-2xl font-semibold text-gray-800">
                    {baselineStats.count > 0 ? `${baselineStats.min.toFixed(2)}-${baselineStats.max.toFixed(2)}` : 'N/A'} <span className="text-lg font-normal">stars</span>
                </p>
                <p className="text-xs text-gray-400">Across {baselineStats.count} completed tasks</p>
            </div>
        </div>
        
        <div className="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] h-56 mt-8">
          
          <div className="col-start-1 row-start-1 flex flex-col justify-between pr-4 text-right">
            {[5, 4, 3, 2, 1, 0].map(label => (
                <div key={label} className="text-xs text-gray-400">
                    {label}
                </div>
            ))}
          </div>

          <div className="col-start-2 row-start-1 relative">
            {/* Horizontal Grid Lines */}
            {[0, 1, 2, 3, 4, 5].map(level => (
              <div 
                key={level} 
                className={`absolute left-0 right-0 h-px ${level === 0 ? 'bg-gray-300' : 'bg-gray-100'}`}
                style={{ bottom: `calc(${level / 5 * 100}%)` }}
              ></div>
            ))}
            {/* Data Bars */}
            <div className="absolute inset-0 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(chartData.length, 1)}, minmax(0, 1fr))` }}>
              {chartData.map((data) => (
                <div key={data.name} className="flex items-end justify-center">
                  <div className="w-4 h-full relative">
                    {/* Range Bar */}
                    <div className="absolute w-full bg-[#697d67] rounded-full" style={{ top: `${(5 - data.max) / 5 * 100}%`, height: `${Math.max((data.max - data.min) / 5 * 100, 2)}%` }}></div>
                    {/* Average Dot */}
                    <div className="absolute w-2.5 h-2.5 bg-[#b9c3b4] rounded-full transform -translate-x-1/2 -translate-y-1/2" style={{ left: '50%', top: `${(5 - data.avg) / 5 * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* X-Axis Labels */}
          <div className="col-start-2 row-start-2 grid gap-2 mt-1" style={{ gridTemplateColumns: `repeat(${Math.max(chartData.length, 1)}, minmax(0, 1fr))` }}>
            {chartData.map((data) => (
              <div key={data.name} className="text-center text-xs text-[#6e7b75] pt-2 truncate">
                {data.name}
              </div>
            ))}
          </div>
        </div>

        {/* Legend Section */}
        <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#697d67] mr-2"></div>
                    <span className="text-sm text-[#6e7b75]">Range</span>
                </div>
                <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-[#b9c3b4] mr-2"></div>
                    <span className="text-sm text-[#7a8882]">Average</span>
                </div>
            </div>
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
                View all <ChevronRight className="ml-1 h-4 w-4" />
            </a>
        </div>
      </div>
    </>
  );
};

export default RatingsOverview;