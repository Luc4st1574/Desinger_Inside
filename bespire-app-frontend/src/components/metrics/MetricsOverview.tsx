import React from 'react';
import type { Metric } from '@/types/performance';

interface OverviewMetricsProps {
  metrics: Metric[];
}

const OverviewMetrics = ({ metrics }: OverviewMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">{metric.title}</h3>
          <p className="text-3xl font-bold mt-2">{metric.value}</p>
          <div className="mt-2 flex items-center">
            <span className={`text-sm font-semibold ${metric.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
              {metric.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewMetrics;