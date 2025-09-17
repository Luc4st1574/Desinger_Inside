import React from 'react';
import type { TotalTasks } from '@/types/metrics';

interface TotalTasksProps {
  data: TotalTasks;
}

const TotalTasks = ({ data }: TotalTasksProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700">Total Tasks</h3>
      <p className="text-4xl font-bold mt-4">{data.count}</p>
      <div className="mt-2 flex items-center">
        <span className={`text-sm font-semibold ${data.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
          {data.change}
        </span>
        <span className="text-gray-400 text-sm ml-2">in the last 30 days</span>
      </div>
    </div>
  );
};

export default TotalTasks;