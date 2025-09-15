"use client";

import React, { useState } from "react";

export default function TeamFilters() {
  const [roles, setRoles] = useState<string[]>([]);
  const [minKpi, setMinKpi] = useState<number | undefined>(undefined);
  const [maxLateRate, setMaxLateRate] = useState<number | undefined>(undefined);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-700">Filters</div>
        <div className="text-xs text-gray-400">Clear</div>
      </div>

      <div className="mt-3 space-y-3">
        <div>
          <label className="text-xs text-gray-500">Roles</label>
          <input className="w-full mt-1 border rounded p-2 text-sm" placeholder="e.g. Designer, PM" value={roles.join(', ')} onChange={(e) => setRoles(e.target.value.split(',').map(s => s.trim()))} />
        </div>

        <div>
          <label className="text-xs text-gray-500">Min KPI</label>
          <input type="number" className="w-full mt-1 border rounded p-2 text-sm" value={minKpi ?? ''} onChange={(e) => setMinKpi(e.target.value ? Number(e.target.value) : undefined)} />
        </div>

        <div>
          <label className="text-xs text-gray-500">Max Late Rate (%)</label>
          <input type="number" className="w-full mt-1 border rounded p-2 text-sm" value={maxLateRate ?? ''} onChange={(e) => setMaxLateRate(e.target.value ? Number(e.target.value) : undefined)} />
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-gray-100 p-2 rounded">Clear</button>
          <button className="flex-1 bg-blue-600 text-white p-2 rounded">Apply</button>
        </div>
      </div>
    </div>
  );
}
