import React from 'react';
import type { RawTask } from '@/types/metrics';
import performanceData from '@/data/performanceMetrics.json';
import KeyPerformance from './KeyPerformance';
import RatingsOverview from './RatingsOverview';
import TaskCompletion from './TaskCompletion';

const MetricsMain = () => {
  const { tasks } = performanceData as {
    tasks: RawTask[];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <KeyPerformance tasks={tasks} />
        <RatingsOverview tasks={tasks} />
        <TaskCompletion tasks={tasks} />
      </div>
    </div>
  );
};

export default MetricsMain;