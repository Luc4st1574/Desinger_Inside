import React from 'react';
import type { PerformanceRecord } from '@/types/performance';
import Image from 'next/image';

interface PerformanceTableProps {
  records: PerformanceRecord[];
}

const PerformanceTable = ({ records }: PerformanceTableProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-lg font-semibold mb-4">Detailed Metrics</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.metricName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {record.value}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.trend === 'up' && <Image src="/assets/icons/trend_icon-up.svg" alt="Up" width={20} height={20} />}
                  {record.trend === 'down' && <Image src="/assets/icons/trend_icon-down.svg" alt="Down" width={20} height={20} />}
                  {record.trend === 'stable' && <span>-</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.period}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceTable;