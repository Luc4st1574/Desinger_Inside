"use client";

import React, { useState, useMemo } from "react";
import { TeamMembersMetricsResponse } from "@/graphql/types/team";

type Props = {
  data?: TeamMembersMetricsResponse | null;
  loading?: boolean;
};

export default function TeamMetricsTable({ data, loading }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const items = useMemo(() => data?.items || [], [data]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="h-8 bg-gray-100 rounded w-40 mb-4" />
        <div className="space-y-2">
          <div className="h-6 bg-gray-100 rounded" />
          <div className="h-6 bg-gray-100 rounded" />
          <div className="h-6 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium">Team Members</h3>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">{data?.total ?? 0}</span>
        </div>

        <div className="flex items-center gap-3">
          <input placeholder="Search member" value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded-full px-4 py-2 text-sm" />
          <button className="bg-green-600 text-white px-3 py-2 rounded">Add</button>
        </div>
      </div>

      <div className="overflow-auto max-h-[600px]">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 min-w-[220px]">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">KPI</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ave Rating</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Tasks</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Work Hours</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Time/Request</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Accept Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Response</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Revisions</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Late Rate</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 sticky right-0 bg-gray-50">View</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-[#353B38]">
            {items.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}`} alt={m.name} className="w-10 h-10 rounded-full" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-[#353B38]">{m.name}</div>
                      <div className="text-sm text-gray-500">{m.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{m.kpi}%</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.avgRating}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.tasks}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.workHours}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.timePerRequest}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.acceptTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.responseTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.revisions}</td>
                <td className="px-6 py-4 whitespace-nowrap">{m.lateRate}%</td>
                <td className="px-6 py-4 whitespace-nowrap sticky right-0 bg-white">
                  <button className="text-blue-600">View</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={11} className="p-6 text-center text-gray-500">No members found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 border-t flex items-center justify-between">
        <div className="text-sm text-gray-500">Showing {items.length} of {data?.total ?? 0}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p-1))} className="px-3 py-1 border rounded">Prev</button>
          <div className="px-3 py-1 border rounded">{page}</div>
          <button onClick={() => setPage(p => p+1)} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
