import React from 'react';
import type { Metric, Rating, Task, DistributionData, TotalTasks } from '@/types/metrics';
import performanceData from '@/data/performanceMetrics.json';
import KeyPerformance from './KeyPerformance';
import RatingsOverview from './RatingsOverview';
import TaskCompletion from './TaskCompletion';
import TaskDistribution from './TaskDistribution';
import TotalTasksComponent from './TotalTasks';

const MetricsMain = () => {
  const { keyMetrics, ratingsOverview, taskCompletion, taskDistribution, totalTasks } = performanceData as {
    keyMetrics: Metric[];
    ratingsOverview: Rating[];
    taskCompletion: Task[];
    taskDistribution: DistributionData[];
    totalTasks: TotalTasks;
  };

  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <KeyPerformance metrics={keyMetrics} />
          <RatingsOverview ratings={ratingsOverview} />
          <TaskCompletion tasks={taskCompletion} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <TaskDistribution data={taskDistribution} />
          <TotalTasksComponent data={totalTasks} />
        </div>
      </div>
  );
};

export default MetricsMain;