"use client";

import React from "react";

type Props = {
  value: "DAY" | "WEEK" | "MONTH" | "YEAR";
  onChange: (v: "DAY" | "WEEK" | "MONTH" | "YEAR") => void;
  ariaLabel?: string;
};

export default function RangeTabs({ value, onChange, ariaLabel }: Props) {
  const options: { key: Props['value']; label: string }[] = [
    { key: "DAY", label: "Day" },
    { key: "WEEK", label: "Week" },
    { key: "MONTH", label: "Month" },
    { key: "YEAR", label: "Year" },
  ];

  return (
    <div role="tablist" aria-label={ariaLabel} className="inline-flex rounded-md bg-gray-100 p-1">
      {options.map((o) => (
        <button
          key={o.key}
          role="tab"
          aria-selected={value === o.key}
          onClick={() => onChange(o.key)}
          className={`px-3 py-1 text-sm font-medium rounded-md focus:outline-none ${
            value === o.key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
