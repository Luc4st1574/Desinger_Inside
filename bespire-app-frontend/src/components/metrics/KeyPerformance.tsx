import React, { useState, useMemo } from 'react';
import type { ElementType } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Hourglass from "@/assets/icons/sand_clock.svg";
import RotateCw from "@/assets/icons/Revision_rate.svg";
import Star from "@/assets/icons/rating_star.svg";
import Layers from "@/assets/icons/task_volume.svg";

// This interface represents the RAW data from the backend
export interface RawTask {
    id: string;
    completedAt: string;
    completionTimeHours: number;
    requiredRevision: boolean;
    clientRating?: number;
}

// This interface represents the final, CALCULATED metric to be displayed
export interface CalculatedMetric {
    title: MetricTitle;
    value: string;
    change: string;
    changeType: "increase" | "decrease";
    description: string;
}

type MetricTitle =
    | 'Average Task Completion Time'
    | 'Revision Rate'
    | 'Overall Client Ratings'
    | 'Task Volume';

const iconMap: Record<MetricTitle, ElementType> = {
    'Average Task Completion Time': Hourglass,
    'Revision Rate': RotateCw,
    'Overall Client Ratings': Star,
    'Task Volume': Layers,
};

type Period = 'Day' | 'Week' | 'Month' | 'Year';
const periods: Period[] = ['Day', 'Week', 'Month', 'Year'];

// --- Helper function to get date ranges ---
const getPeriodRange = (period: Period, referenceDate: Date): { start: Date; end: Date } => {
    const end = new Date(referenceDate);
    const start = new Date(referenceDate);

    switch (period) {
        case 'Day':
            start.setDate(end.getDate() - 1);
            break;
        case 'Week':
            start.setDate(end.getDate() - 7);
            break;
        case 'Month':
            start.setMonth(end.getMonth() - 1);
            break;
        case 'Year':
            start.setFullYear(end.getFullYear() - 1);
            break;
    }
    return { start, end };
};


// --- Main Component ---
const KeyPerformance = ({ tasks }: { tasks: RawTask[] }) => {
    const [activePeriod, setActivePeriod] = useState<Period>('Month');

    const displayMetrics: CalculatedMetric[] = useMemo(() => {
        const now = new Date("2025-09-17T12:00:00Z");

        const currentPeriod = getPeriodRange(activePeriod, now);
        const previousPeriod = getPeriodRange(activePeriod, currentPeriod.start);

        const currentTasks = tasks.filter(t => {
        const taskDate = new Date(t.completedAt);
        return taskDate >= currentPeriod.start && taskDate < currentPeriod.end;
        });

        const previousTasks = tasks.filter(t => {
            const taskDate = new Date(t.completedAt);
            return taskDate >= previousPeriod.start && taskDate < previousPeriod.end;
        });

        const calculateMetricsForPeriod = (periodTasks: RawTask[]) => {
        if (periodTasks.length === 0) {
            return { avgTime: 0, revisionRate: 0, avgRating: 0, volume: 0, ratedTasks: 0 };
        }

        const totalTime = periodTasks.reduce((sum, task) => sum + task.completionTimeHours, 0);
        const totalRevisions = periodTasks.filter(task => task.requiredRevision).length;
        const ratedTasks = periodTasks.filter(task => task.clientRating !== undefined);
        const totalRating = ratedTasks.reduce((sum, task) => sum + (task.clientRating || 0), 0);
        
        return {
            avgTime: totalTime / periodTasks.length,
            revisionRate: (totalRevisions / periodTasks.length) * 100,
            avgRating: ratedTasks.length > 0 ? totalRating / ratedTasks.length : 0,
            volume: periodTasks.length,
            ratedTasks: ratedTasks.length
        };
        };

        const currentMetrics = calculateMetricsForPeriod(currentTasks);
        const previousMetrics = calculateMetricsForPeriod(previousTasks);

        const getChange = (current: number, previous: number) => {
            if (previous === 0 && current > 0) return { change: '100%', changeType: 'increase' as const };
            if (previous === 0) return { change: '0%', changeType: 'increase' as const };
            const change = ((current - previous) / previous) * 100;
            return {
                change: `${Math.abs(change).toFixed(1)}%`,
                changeType: change >= 0 ? 'increase' as const : 'decrease' as const,
            };
        };

        const finalMetrics: CalculatedMetric[] = [
        {
            title: 'Average Task Completion Time',
            value: `${currentMetrics.avgTime > 24 ? (currentMetrics.avgTime / 24).toFixed(1) + ' days' : currentMetrics.avgTime.toFixed(1) + ' hours'}`,
            description: `Per task this ${activePeriod.toLowerCase()}`,
            ...getChange(currentMetrics.avgTime, previousMetrics.avgTime),
        },
        {
            title: 'Revision Rate',
            value: `${currentMetrics.revisionRate.toFixed(0)}%`,
            description: 'Tasks required revisions',
            ...getChange(currentMetrics.revisionRate, previousMetrics.revisionRate),
        },
        {
            title: 'Overall Client Ratings',
            value: `${currentMetrics.avgRating.toFixed(1)}`,
            description: `Across ${currentMetrics.ratedTasks} completed tasks`,
            ...getChange(currentMetrics.avgRating, previousMetrics.avgRating),
        },
        {
            title: 'Task Volume',
            value: `${currentMetrics.volume} tasks`,
            description: `Tasks completed this ${activePeriod.toLowerCase()}`,
            ...getChange(currentMetrics.volume, previousMetrics.volume),
        },
        ];

        return finalMetrics;

    }, [activePeriod, tasks]);

        const parseMetricValue = (value: string): { number: string; unit: string } => {
            const match = value.match(/^([\d./]+)\s*(.*)$/);
            return match ? { number: match[1], unit: match[2] } : { number: value, unit: '' };
        };

    return (
        <div className="max-w-screen-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 px-2">
            <h2 className="text-xl font-light text-gray-800 mb-3 sm:mb-0">Key Performance Metrics</h2>
            <div className="flex items-center space-x-1 rounded-full border border-[#deefcf] bg-white p-1">
            {periods.map((period) => (
                <button
                key={period}
                onClick={() => setActivePeriod(period)}
                className={`w-20 rounded-full py-1.5 text-sm font-medium transition-colors focus-outline-none ${
                    activePeriod === period ? 'bg-[#ceffa3] text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-100'
                }`}
                >
                {period}
                </button>
            ))}
            </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-md">
            <div className="relative grid grid-cols-1 md:grid-cols-2">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200" />
            {displayMetrics.length > 0 && tasks.length > 0 ? (
                displayMetrics.map((metric, index) => {
                const IconComponent = iconMap[metric.title];
                const isIncrease = metric.changeType === 'increase';
                const paddingClasses = index < 2 ? 'pt-5 pb-4' : 'pt-4 pb-5';
                const { number, unit } = parseMetricValue(metric.value);

                return (
                    <div key={metric.title} className={`flex items-start space-x-4 pr-4 pl-8 ${paddingClasses}`}>
                    
                    <div className="mt-1 flex-shrink-0">
                        {IconComponent && <IconComponent className="h-6 w-6 text-[#697d67] [overflow:visible]" />}
                    </div>
                    
                    <div>
                        <h4 className="text-sm font-medium text-[#5e6b66]">{metric.title}</h4>
                        <div className="flex items-baseline space-x-2 mt-1">
                        <span className="text-3xl font-normal text-gray-900">
                            {number}
                            {metric.title === 'Overall Client Ratings' && <span className="text-gray-900">/5</span>}
                        </span>
                        <div className="flex items-center space-x-2">
                            {metric.title === 'Overall Client Ratings' ? (
                            <span className="text-2xl font-normal text-gray-900">stars</span>
                            ) : (
                            unit && <span className="text-2xl font-normal text-gray-900">{unit}</span>
                            )}
                            <div
                            className={`flex items-center space-x-0.5 text-[11px] font-normal pl-1.5 pr-0 py-px rounded-full text-gray-900 ${
                                isIncrease ? 'bg-[#f3fee7]' : 'bg-[#ffe8e8]'
                            }`}
                            >
                            <span>{metric.change}</span>
                            <span className="mt-px">
                                {isIncrease ? (
                                <ArrowUpRight size={10} strokeWidth={3} className="text-[#62864d]" />
                                ) : (
                                <ArrowDownRight size={10} strokeWidth={3} className="text-[#f01616]" />
                                )}
                            </span>
                            </div>
                        </div>
                        </div>
                        <p className="text-sm mt-1 text-[#5e6b66]">{metric.description}</p>
                    </div>
                    </div>
                );
                })
            ) : (
                <p className="text-gray-500 col-span-2 text-center py-8">No task data available for the selected period.</p>
            )}
            </div>
        </div>
        </div>
    );
};

export default KeyPerformance;