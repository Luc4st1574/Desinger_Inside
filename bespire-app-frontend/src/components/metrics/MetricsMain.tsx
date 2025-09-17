import React from 'react';
import type { Metric, ChartData, PerformanceRecord } from '@/types/performance';
import performanceData from '@/data/performanceMetrics.json';
import OverviewMetrics from './MetricsOverview';
import PerformanceCharts from './MetricsCharts';
import PerformanceTable from './MetricsTable';

const PerformanceMain = () => {
  const { overviewMetrics, performanceChartData, performanceRecords } = performanceData as {
    overviewMetrics: Metric[];
    performanceChartData: ChartData[];
    performanceRecords: PerformanceRecord[];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Performance Metrics</h1>
      <OverviewMetrics metrics={overviewMetrics} />
      <PerformanceCharts chartData={performanceChartData} />
      <PerformanceTable records={performanceRecords} />
    </div>
  );
};

export default PerformanceMain;