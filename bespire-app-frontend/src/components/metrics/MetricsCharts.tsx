'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartData } from '@/types/performance';

interface PerformanceChartsProps {
  chartData: ChartData[];
}

const PerformanceCharts = ({ chartData }: PerformanceChartsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceCharts;