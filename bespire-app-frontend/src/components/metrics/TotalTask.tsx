import React, { useState, useMemo, Fragment } from 'react';
import type { RawTask } from '@/types/metrics';
import { ArrowUpRight, ArrowDownRight, ChevronRight, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';

interface TotalTaskProps {
    tasks: RawTask[];
}

type Period = 'Day' | 'Week' | 'Month' | 'Year';
const periods: Period[] = ['Day', 'Week', 'Month', 'Year'];

// Reusable component for rendering the list of task types
const TaskTypeList = ({ distribution }: { distribution: { name: string; count: number; percentage: number }[] }) => {
    return (
        <div className="space-y-4">
        {distribution.length > 0 ? (
            distribution.map((taskType) => (
            <div key={taskType.name}>
                <div className="flex justify-between items-center mb-1.5 text-sm">
                <span className="text-gray-600 font-medium">{taskType.name}</span>
                <span className="font-semibold text-gray-800">{taskType.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                    className="bg-[#697d67] h-1.5 rounded-full"
                    style={{ width: `${taskType.percentage}%` }}
                ></div>
                </div>
            </div>
            ))
        ) : (
            <div className="flex items-center justify-center h-full pt-10">
            <p className="text-gray-500">No task data for this period.</p>
            </div>
        )}
        </div>
    );
};

// MODIFIED: Chart component is now fully dynamic based on the selected period and has smoothed peaks
const TaskTrendChart = ({ tasks, activePeriod, now }: { tasks: RawTask[], activePeriod: Period, now: Date }) => {
    const chartData = useMemo(() => {
        let labels: string[] = [];
        let dataValues: number[] = [];
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentDate = now.getDate();

        switch (activePeriod) {
        case 'Year': {
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthCounts = Array(12).fill(0);
            tasks.forEach(task => {
            const taskDate = new Date(task.completedAt);
            if (taskDate.getFullYear() === currentYear) {
                monthCounts[taskDate.getMonth()]++;
            }
            });
            dataValues = monthCounts;
            break;
        }
        case 'Month': {
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const numWeeks = Math.ceil(daysInMonth / 7);
            labels = Array.from({ length: numWeeks }, (_, i) => `W${i + 1}`);
            const weekCounts = Array(numWeeks).fill(0);
            tasks.forEach(task => {
            const taskDate = new Date(task.completedAt);
            if (taskDate.getFullYear() === currentYear && taskDate.getMonth() === currentMonth) {
                const weekOfMonth = Math.floor((taskDate.getDate() - 1) / 7);
                if(weekCounts[weekOfMonth] !== undefined) {
                weekCounts[weekOfMonth]++;
                }
            }
            });
            dataValues = weekCounts;
            break;
        }
        case 'Week': {
            const countsByDate: { [key: string]: number } = {};
            const weekDates: string[] = [];
            for (let i = 6; i >= 0; i--) {
            const d = new Date(currentYear, currentMonth, currentDate - i);
            labels.push(d.toLocaleString('en-US', { weekday: 'short' }));
            const dateKey = d.toISOString().split('T')[0];
            countsByDate[dateKey] = 0;
            weekDates.push(dateKey);
            }
            tasks.forEach(task => {
            const taskDateKey = new Date(task.completedAt).toISOString().split('T')[0];
            if (countsByDate.hasOwnProperty(taskDateKey)) {
                countsByDate[taskDateKey]++;
            }
            });
            dataValues = weekDates.map(dateKey => countsByDate[dateKey]);
            break;
        }
        case 'Day': {
            labels = ['12-6a', '6a-12p', '12p-6p', '6p-12a'];
            const hourCounts = Array(4).fill(0);
            tasks.forEach(task => {
            const taskDate = new Date(task.completedAt);
            if ( taskDate.getFullYear() === currentYear && taskDate.getMonth() === currentMonth && taskDate.getDate() === currentDate ) {
                const hour = taskDate.getHours();
                const bucket = Math.floor(hour / 6);
                hourCounts[bucket]++;
            }
            });
            dataValues = hourCounts;
            break;
        }
        }

        const maxCount = Math.max(...dataValues, 1);
        return { labels, values: dataValues, maxCount };
    }, [tasks, activePeriod, now]);
    
    const { labels, values, maxCount } = chartData;

    // Dynamic titles for the chart
    const { title, subtitle } = useMemo(() => {
        switch(activePeriod) {
        case 'Year': return { title: `Tasks in ${now.getFullYear()}`, subtitle: "Distribution of tasks per month" };
        case 'Month': return { title: `Tasks in ${now.toLocaleString('en-US', { month: 'long' })}`, subtitle: "Distribution of tasks per week" };
        case 'Week': return { title: "Last 7 Days", subtitle: "Distribution of tasks per day" };
        case 'Day': return { title: "Today's Tasks", subtitle: "Distribution by time of day" };
        default: return { title: "Task Trend", subtitle: "" };
        }
    }, [activePeriod, now]);
    
    const width = 300;
    const height = 100;
    const paddingX = 20;
    const paddingY = 15;
    const chartWidth = width - 2 * paddingX;
    const chartHeight = height - 2 * paddingY;

    // Calculate actual coordinates for data points
    const coords = values.map((value, index) => {
        const x = (index / (values.length > 1 ? values.length - 1 : 1)) * chartWidth;
        const y = chartHeight - (value / maxCount) * chartHeight;
        return { x: x + paddingX, y: y + paddingY };
    });

    // Function to create a smoothed SVG path (cubic bezier spline)
    const getSmoothedPath = (points: {x: number, y: number}[]) => {
        if (points.length === 0) return "";
        if (points.length === 1) return `M${points[0].x},${points[0].y}`;

        let path = `M${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = (i > 0) ? points[i - 1] : points[0];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = (i < points.length - 2) ? points[i + 2] : p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            path += `C${cp1x},${cp1y},${cp2x},${cp2y},${p2.x},${p2.y}`;
        }
        return path;
    };

    const smoothedLinePath = getSmoothedPath(coords);

    // Create the area path based on the smoothed line path
    const areaPath = smoothedLinePath 
        ? `${smoothedLinePath} L${coords[coords.length - 1].x},${chartHeight + paddingY} L${coords[0].x},${chartHeight + paddingY} Z`
        : "";


    return (
        <div className="mt-2">
        <h4 className="text-base font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
        
        <div className="relative w-full"> 
            <svg viewBox={`0 0 ${width} ${height + 25}`} width="100%" className="max-w-full">
            <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d3f8a0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d3f8a0" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            {areaPath && <path d={areaPath} fill="url(#trendGradient)" stroke="none" />}
            {smoothedLinePath && <path d={smoothedLinePath} fill="none" stroke="#697d67" strokeWidth="2.5" />}
            {labels.map((label, index) => {
                const xPos = coords[index] ? coords[index].x : width / 2; // Fallback for single point
                return (
                <text key={label} x={xPos} y={height + paddingY + 5} textAnchor="middle" fontSize="12" fill="#6B7280">
                    {label}
                </text>
                );
            })}
            </svg>
        </div>
        </div>
    );
};


const TotalTask = ({ tasks }: TotalTaskProps) => {
    const [activePeriod, setActivePeriod] = useState<Period>('Month');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const now = useMemo(() => new Date('2025-09-19T14:30:39-05:00'), []);

    const { currentPeriodTasks, previousPeriodTasks } = useMemo(() => {
        const endDate = new Date(now);
        let startDate = new Date(now);
        let prevStartDate = new Date(now);
        let prevEndDate = new Date(now);

        switch (activePeriod) {
        case 'Day':
            startDate.setHours(0, 0, 0, 0);
            prevStartDate = new Date(startDate);
            prevStartDate.setDate(startDate.getDate() - 1);
            prevEndDate = new Date(endDate);
            prevEndDate.setDate(endDate.getDate() - 1);
            break;
        case 'Week':
            startDate.setDate(startDate.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);
            prevStartDate = new Date(startDate);
            prevStartDate.setDate(startDate.getDate() - 7);
            prevEndDate = new Date(endDate);
            prevEndDate.setDate(endDate.getDate() - 7);
            break;
        case 'Month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            prevEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
            break;
        case 'Year':
            startDate = new Date(now.getFullYear(), 0, 1);
            prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
            prevEndDate = new Date(now.getFullYear() - 1, 11, 31);
            break;
        }

        const filterTasksByDate = (start: Date, end: Date) =>
        tasks.filter(task => {
            const completedDate = new Date(task.completedAt);
            return completedDate >= start && completedDate <= end;
        });

        return {
        currentPeriodTasks: filterTasksByDate(startDate, endDate),
        previousPeriodTasks: filterTasksByDate(prevStartDate, prevEndDate),
        };
    }, [tasks, activePeriod, now]);

    const totalTasksMetric = useMemo(() => {
        const currentCount = currentPeriodTasks.length;
        const previousCount = previousPeriodTasks.length;

        if (previousCount === 0) {
        return { value: currentCount, change: 'N/A', isIncrease: true };
        }
        const changePercentage = ((currentCount - previousCount) / previousCount) * 100;
        return {
        value: currentCount,
        change: `${Math.abs(changePercentage).toFixed(0)}%`,
        isIncrease: changePercentage >= 0,
        };
    }, [currentPeriodTasks, previousPeriodTasks]);

    // MODIFIED: Cleaned up logic to always use the correctly filtered tasks
    const taskTypeDistribution = useMemo(() => {
        if (currentPeriodTasks.length === 0) return [];
        
        const counts: { [type: string]: number } = {};
        currentPeriodTasks.forEach(task => {
        counts[task.type] = (counts[task.type] || 0) + 1;
        });
        const maxScale = 40;
        return Object.entries(counts)
        .map(([name, count]) => ({
            name,
            count,
            percentage: Math.min((count / maxScale) * 100, 100),
        }))
        .sort((a, b) => b.count - a.count);
    }, [currentPeriodTasks]);

    return (
        <Fragment>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg flex flex-col">
            {/* Top Section */}
            <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
                <span className="text-base text-gray-500">Total Tasks</span>
                <div className="flex items-center space-x-2">
                <span className="text-3xl font-semibold text-gray-900">{totalTasksMetric.value}</span>
                <div className={`flex items-center space-x-0.5 text-[11px] font-normal pl-1.5 pr-0 py-px rounded-full text-gray-900 ${totalTasksMetric.isIncrease ? 'bg-[#f3fee7]' : 'bg-[#ffe8e8]'}`}>
                    <span>{totalTasksMetric.change}</span>
                    <span className="mt-px">
                    {totalTasksMetric.isIncrease ? <ArrowUpRight size={10} strokeWidth={3} className="text-[#62864d]" /> : <ArrowDownRight size={10} strokeWidth={3} className="text-[#f01616]" />}
                    </span>
                </div>
                </div>
                <span className="text-sm text-gray-400 mt-1">
                compared last {activePeriod.toLowerCase()}
                </span>
            </div>
            </div>

            {/* Period Buttons */}
            <div className="flex items-center justify-center space-x-1 rounded-full border border-[#deefcf] bg-white p-1 my-4">
            {periods.map((period) => (
                <button key={period} onClick={() => setActivePeriod(period)} className={`w-full rounded-full py-2 text-sm font-medium transition-colors focus:outline-none ${activePeriod === period ? 'bg-[#ceffa3] text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
                {period}
                </button>
            ))}
            </div>

            {/* Task Type Breakdown (Top 5) */}
            <div>
            <TaskTypeList distribution={taskTypeDistribution.slice(0, 5)} />
            </div>

            {/* Separator line */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Tasks per month chart */}
            <TaskTrendChart tasks={tasks} activePeriod={activePeriod} now={now} />

            {/* View All Button */}
            {taskTypeDistribution.length > 5 && (
                <div className="text-center mt-6">
                    <button onClick={() => setIsModalOpen(true)} className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center justify-center w-full">
                        View all <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                </div>
            )}
        </div>

        {/* --- View All Modal --- */}
        <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
                <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 z-20 text-white opacity-75 hover:opacity-100 focus:outline-none rounded-full p-1" aria-label="Close">
                <X className="h-12 w-12" />
                </button>
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                    <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                        Detailed Task Breakdown
                        </Dialog.Title>
                        <div className="flex items-center space-x-1 rounded-full border border-[#deefcf] bg-white p-1 mt-4 sm:mt-0">
                        {periods.map((period) => (
                            <button key={`modal-${period}`} onClick={() => setActivePeriod(period)} className={`w-20 rounded-full py-1.5 text-sm font-medium transition-colors focus:outline-none ${activePeriod === period ? 'bg-[#ceffa3] text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}>
                            {period}
                            </button>
                        ))}
                        </div>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto pr-3">
                        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-10">
                        {/* Left Column: All Task Types */}
                        <div className="lg:pr-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">All Task Types</h4>
                            <TaskTypeList distribution={taskTypeDistribution} />
                        </div>

                        {/* Right Column: Dynamic Trend Chart */}
                        <div className="mt-8 lg:mt-0">
                            <TaskTrendChart tasks={tasks} activePeriod={activePeriod} now={now} />
                        </div>
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

export default TotalTask;