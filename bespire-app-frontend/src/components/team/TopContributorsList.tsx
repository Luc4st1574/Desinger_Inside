// team/TopContributorsList.tsx
"use client";

import React from "react";
import Image from "next/image";

// Definimos un tipo más detallado para el mock
export type Contributor = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  kpi: number;
  stars: number;
  tasks: number;
};

type Props = {
  items?: Contributor[];
  loading?: boolean;
};

export default function TopContributorsList({ items, loading }: Props) {
  return (
    <div className="bg-white rounded-lg  p-4 h-full flex flex-col gap-2 justify-between">
      <h3 className="text-lg font-medium text-green-gray-500 mb-4">Top Contributors</h3>
      <div className="space-y-3">
        {loading && (
          <>
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
          </>
        )}
        {!loading && (items ?? []).map((it, idx) => (
          <div key={it.id ?? it.name ?? idx} className="flex items-center gap-4">
            <span className="text-lg font-medium text-green-gray-500 w-8 text-center border-r border-green-gray-100">{idx + 1}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden ">
              <Image src={it.avatar ?? "/assets/avatars/default.png"} alt={it.name ?? "avatar"} width={40} height={40} />
            </div>
            <div className="flex-1">
              <div className="text-base font-medium text-green-gray-950">{it.name ?? "—"}</div>
              <div className="text-xs text-green-gray-500">{it.role ?? "Member"}</div>
            </div>
            <div className="text-sm text-right">
              <div className="font-semibold text-pale-green-700">{it.kpi ?? "-"}%</div>
              <div className="text-xs text-green-gray-500">KPI</div>
            </div>
            <div className="text-sm text-right">
              <div className="font-semibold text-pale-green-700">{it.stars ?? "-"}</div>
              <div className="text-xs text-green-gray-500">stars</div>
            </div>
            <div className="text-sm text-right">
              <div className="font-semibold text-pale-green-700">{it.tasks ?? "-"}</div>
              <div className="text-xs text-green-gray-500">tasks</div>
            </div>
          </div>
        ))}
      </div>
      <button className="text-sm font-medium text-green-gray-950 mt-4 w-full text-left">
        View all →
      </button>
    </div>
  );
}