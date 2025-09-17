import React from 'react';
import type { Metric } from '@/types/metrics';

interface KeyPerformanceProps {
    metrics: Metric[];
}

const KeyPerformance = ({ metrics }: KeyPerformanceProps) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-gray-500 text-sm font-medium">{metric.title}</h4>
                <p className="text-3xl font-bold mt-2">{metric.value}</p>
                <div className="mt-2 flex items-center">
                <span className={`text-sm font-semibold ${metric.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.change}
                </span>
                <span className="text-gray-400 text-sm ml-2">vs last month</span>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export default KeyPerformance;