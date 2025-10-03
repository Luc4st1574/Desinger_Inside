"use client";
import React from 'react';
import salesData from '@/data/salesData.json';

// Placeholder for icons. In a real app, you'd use an icon library like Heroicons.
const icons = {
    flag: '🚩',
    folder: '📁',
    pie: '🥧',
    chart: '📊',
};

export default function ResourcesAndTutorials() {
    return (
        <div className="p-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Resources & Tutorials →</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {salesData.resources.map((resource) => (
            <div key={resource.title} className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <div className="text-4xl mb-4">{icons[resource.icon]}</div>
                <h3 className="font-semibold text-gray-700">{resource.title}</h3>
            </div>
            ))}
        </div>
        </div>
    );
}