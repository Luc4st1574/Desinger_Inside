"use client";
import React from "react";
import List from "@/assets/icons/icon_listswap.svg";
import LayoutGrid from "@/assets/icons/board_icon.svg";
import GanttChartSquare from "@/assets/icons/gantt_icon.svg";

export type ViewMode = "list" | "board" | "gantt";

const MODES_CONFIG = [
    { name: "List", icon: List, mode: "list" as ViewMode },
    { name: "Board", icon: LayoutGrid, mode: "board" as ViewMode },
    { name: "Gantt", icon: GanttChartSquare, mode: "gantt" as ViewMode },
];

interface ViewModeSwitcherProps {
    activeMode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
}

export default function ViewModeSwitcher({ activeMode, onModeChange }: ViewModeSwitcherProps) {
    return (
        <div className="flex items-center justify-center px-4 pt-0 pb-8">
        <div className="flex items-center space-x-1 rounded-full border border-[#deefcf] bg-white p-1">
            {MODES_CONFIG.map((m) => {
            const isActive = activeMode === m.mode;
            return (
                <button
                key={m.mode}
                onClick={() => onModeChange(m.mode)}
                className={`
                    flex w-40 items-center justify-center gap-2 rounded-full
                    py-2 text-sm font-medium transition-colors focus:outline-none
                    ${isActive ? 'bg-[#ceffa3] text-gray-900' : 'text-gray-500 hover:bg-[#ceffa3]'}
                `}
                >
                <m.icon
                    size={16}
                    strokeWidth={2.5}
                    className={isActive ? 'text-gray-900' : 'text-[#697D67]'}
                />
                <span>{m.name}</span>
                </button>
            );
            })}
        </div>
        </div>
    );
}