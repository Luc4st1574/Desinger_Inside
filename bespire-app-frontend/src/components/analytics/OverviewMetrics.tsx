"use client";

import React, { useState, useMemo, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { AnalyticsRecord } from '@/types/analytics';

type Period = '1 month' | '4 months' | '6 months' | '1 year';
const periods: Period[] = ['1 month', '4 months', '6 months', '1 year'];

type Trend = 'up' | 'down' | 'stable';

// --- HELPER FUNCTIONS ---

const aggregateRecordsByMonth = (records: AnalyticsRecord[]): AnalyticsRecord[] => {
    const monthlyData: { [key: string]: AnalyticsRecord } = {};

    records.forEach(record => {
        if (!record.date || typeof record.date !== 'string') return;
        
        const year = parseInt(record.date.substring(0, 4), 10);
        const month = parseInt(record.date.substring(5, 7), 10);
        const monthKey = `${year}-${month}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                ...record,
                date: new Date(Date.UTC(year, month - 1, 1)).toISOString(),
                social_fb_likes: 0,
                social_twitter_followers: 0,
                social_linkedin_followers: 0,
                social_instagram_followers: 0,
                social_tiktok_followers: 0,
                seo_organic_traffic: 0,
                web_sessions: 0,
                web_new_users: 0,
                email_conversion_rate: 0,
            };
        }

        const currentMonth = monthlyData[monthKey];
        currentMonth.social_fb_likes = (currentMonth.social_fb_likes ?? 0) + (record.social_fb_likes ?? 0);
        currentMonth.social_twitter_followers = (currentMonth.social_twitter_followers ?? 0) + (record.social_twitter_followers ?? 0);
        currentMonth.social_linkedin_followers = (currentMonth.social_linkedin_followers ?? 0) + (record.social_linkedin_followers ?? 0);
        currentMonth.social_instagram_followers = (currentMonth.social_instagram_followers ?? 0) + (record.social_instagram_followers ?? 0);
        currentMonth.social_tiktok_followers = (currentMonth.social_tiktok_followers ?? 0) + (record.social_tiktok_followers ?? 0);
        currentMonth.seo_organic_traffic = (currentMonth.seo_organic_traffic ?? 0) + (record.seo_organic_traffic ?? 0);
        currentMonth.web_sessions = (currentMonth.web_sessions ?? 0) + (record.web_sessions ?? 0);
        currentMonth.web_new_users = (currentMonth.web_new_users ?? 0) + (record.web_new_users ?? 0);
        currentMonth.email_conversion_rate = (currentMonth.email_conversion_rate ?? 0) + (record.email_conversion_rate ?? 0);
        currentMonth.email_total_contacts = record.email_total_contacts;
    });

    return Object.values(monthlyData);
};


const calculateChange = (
    current: number,
    previous: number,
    stabilityThreshold: number = 2.0
): { value: number, trend: Trend } => {
    if (previous === 0 && current > 0) return { value: 100, trend: 'up' };
    if (previous === 0) return { value: 0, trend: 'stable' };

    const change = ((current - previous) / previous) * 100;

    if (Math.abs(change) <= stabilityThreshold) return { value: change, trend: 'stable' };
    
    return { value: change, trend: change > 0 ? 'up' : 'down' };
};

// --- CHART COMPONENT (Unchanged) ---
interface MetricChartProps {
    data: { labels: string[], values: number[] };
    lineColor: string;
    gradientColor: string;
}

const MetricChart = ({ data, lineColor, gradientColor }: MetricChartProps) => {
    const { labels, values } = data;
    if (!values || values.length < 2) {
        return <div className="h-24 flex items-center justify-center text-xs text-gray-400">Not enough data for trend</div>;
    }

    const width = 300;
    const height = 80;
    const paddingX = 15;
    const paddingY = 10;
    const chartWidth = width - 2 * paddingX;
    const chartHeight = height - 2 * paddingY;
    
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const valueRange = dataMax - dataMin;

    const coords = values.map((value, index) => {
        const x = (index / (values.length - 1)) * chartWidth;
        const y = chartHeight - (valueRange > 0 ? ((value - dataMin) / valueRange) * chartHeight : chartHeight / 2);
        return { x: x + paddingX, y: y + paddingY };
    });

    const getSmoothedPath = (points: {x: number, y: number}[]) => {
        let path = `M${points[0].x},${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = (i > 0) ? points[i - 1] : points[0];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = (i < points.length - 2) ? points[i + 2] : p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
        return path;
    };
    
    const smoothedLinePath = getSmoothedPath(coords);
    const areaPath = `${smoothedLinePath} L${coords[coords.length - 1].x},${chartHeight + paddingY} L${coords[0].x},${chartHeight + paddingY} Z`;
    
    const gradientId = `trendGradient-${gradientColor.replace('#', '')}`;

    return (
        <div className="mt-4 h-24 w-full">
            <svg viewBox={`0 0 ${width} ${height + 20}`} width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={gradientColor} stopOpacity="0.4" />
                        <stop offset="100%" stopColor={gradientColor} stopOpacity="0.05" />
                    </linearGradient>
                </defs>
                <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
                <path d={smoothedLinePath} fill="none" stroke={lineColor} strokeWidth="2.5" />
                
                {labels.map((label, index) => (
                    <text
                        key={index}
                        x={coords[index]?.x ?? 0}
                        y={height + 15}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#6B7280"
                    >
                        {label}
                    </text>
                ))}
            </svg>
        </div>
    );
};


// --- MAIN COMPONENT ---
interface OverviewMetricsProps {
    clientRecords: AnalyticsRecord[];
}

const OverviewMetrics = ({ clientRecords }: OverviewMetricsProps) => {
    const [activePeriod, setActivePeriod] = useState<Period>('4 months');
    
    const { chartRecords, latestRecord, comparisonRecord, chartLabels } = useMemo(() => {
        const aggregated = aggregateRecordsByMonth(clientRecords);

        const sortedRecords = aggregated.sort((a, b) => 
            new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
        );

        if (sortedRecords.length < 2) {
            return { chartRecords: [], latestRecord: sortedRecords[0] || null, comparisonRecord: null, chartLabels: [] };
        }
        
        const latest = sortedRecords[0];
        const comparison = sortedRecords[1];

        const periodMap: Record<Period, number> = {
            '1 month': 2, '4 months': 4, '6 months': 6, '1 year': 12,
        };
        const monthsToShow = periodMap[activePeriod];
        
        const recordsForChart = sortedRecords.slice(0, monthsToShow).reverse();
        
        /**
         * [FINAL FIX] Get month label by manually parsing the ISO string.
         * This is immune to system date formats and timezones.
         */
        const getMonthLabel = (dateString: string): string => {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            if (!dateString || dateString.length < 7) return '';
            
            // Extract month number (e.g., "09") from "YYYY-MM-DD..."
            const monthNumber = parseInt(dateString.substring(5, 7), 10);
            
            // Return the correct abbreviation from the array (adjusting for 0-index)
            return monthNames[monthNumber - 1] || '';
        };

        let labels: string[] = [];
        if (activePeriod === '1 year') {
            labels = recordsForChart.map((r, i) => 
                (i % 3 === 0) ? getMonthLabel(r.date ?? '') : ''
            );
        } else {
            labels = recordsForChart.map(r => getMonthLabel(r.date ?? ''));
        }

        return { 
            chartRecords: recordsForChart, 
            latestRecord: latest, 
            comparisonRecord: comparison, 
            chartLabels: labels 
        };
    }, [clientRecords, activePeriod]);
    
    if (!latestRecord || !comparisonRecord) {
        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-light text-gray-700">Overview Metrics</h2>
                </div>
                <div className="text-center py-10 text-gray-500">
                    <p>Not enough data to display metrics.</p>
                </div>
            </div>
        );
    }
    
    const getTotalFollowers = (record: AnalyticsRecord) => 
        (record.social_fb_likes ?? 0) + 
        (record.social_twitter_followers ?? 0) + 
        (record.social_linkedin_followers ?? 0) + 
        (record.social_instagram_followers ?? 0) +
        (record.social_tiktok_followers ?? 0);
    
    const latestTotalFollowers = getTotalFollowers(latestRecord);
    const comparisonTotalFollowers = getTotalFollowers(comparisonRecord);

    const metricsConfig = [
        { title: "Social Following", value: latestTotalFollowers.toLocaleString(), subtitle: "Total Follower Growth", change: calculateChange(latestTotalFollowers, comparisonTotalFollowers), dataKey: 'social_total_followers', colors: { line: '#81c7e9', gradient: '#81c7e9' }},
        { title: "SEO Performance", value: (latestRecord.seo_organic_traffic ?? 0).toLocaleString(), subtitle: "Organic Traffic Insights", change: calculateChange(latestRecord.seo_organic_traffic ?? 0, comparisonRecord.seo_organic_traffic ?? 0), dataKey: 'seo_organic_traffic', colors: { line: '#a5d6a7', gradient: '#a5d6a7' }},
        { title: "Web Analytics", value: (latestRecord.web_sessions ?? 0).toLocaleString(), subtitle: "Website Sessions Tracked", change: calculateChange(latestRecord.web_sessions ?? 0, comparisonRecord.web_sessions ?? 0), dataKey: 'web_sessions', colors: { line: '#ffcc80', gradient: '#ffcc80' }},
        { title: "Email Analytics", value: `${(((latestRecord.email_conversion_rate ?? 0) / (latestRecord.email_total_contacts ?? 1)) * 100).toFixed(2)}%`, subtitle: "Conversion Rate Growth", change: calculateChange(latestRecord.email_conversion_rate ?? 0, comparisonRecord.email_conversion_rate ?? 0), dataKey: 'email_conversion_rate', colors: { line: '#616161', gradient: '#bdbdbd' }}
    ];

    const getTrendVisuals = (trend: Trend) => {
        switch (trend) {
            case 'up': return { icon: <ArrowUpRight className="h-4 w-4 text-[#89a479]" />, colorClass: 'text-[#89a479]' };
            case 'down': return { icon: <ArrowDownRight className="h-4 w-4 text-[#f01616]" />, colorClass: 'text-[#f01616]' };
            default: return { icon: <Minus className="h-4 w-4 text-gray-500" />, colorClass: 'text-gray-500' };
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-light text-gray-700">Overview Metrics</h2>
                <Listbox value={activePeriod} onChange={setActivePeriod}>
                    <div className="relative w-auto">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-full border border-[#697d67] bg-transparent py-1.5 pl-4 pr-10 text-left text-sm font-medium text-[#697d67] focus:outline-none ring-0">
                            <span className="block truncate whitespace-nowrap">{activePeriod}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDown className="h-5 w-5 text-[#697d67]" aria-hidden="true" />
                            </span>
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute right-0 mt-1 max-h-60 w-auto min-w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm z-10">
                                {periods.map((period) => (
                                    <Listbox.Option key={period} className={({ active }) => `relative cursor-default select-none py-2 px-4 ${active ? 'bg-gray-100' : ''}`} value={period}>
                                        {({ selected }) => <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{period}</span>}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {metricsConfig.map(metric => {
                    const chartData = {
                        labels: chartLabels,
                        values: chartRecords.map((r: AnalyticsRecord) => {
                            if (metric.dataKey === 'social_total_followers') return getTotalFollowers(r);
                            return (r[metric.dataKey as keyof AnalyticsRecord] as number) ?? 0;
                        })
                    };
                    
                    const visuals = getTrendVisuals(metric.change.trend);

                    return (
                        <div key={metric.title} className="bg-white p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">{metric.title}</p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">{metric.value}</p>
                                    <p className="text-xs text-gray-400 mt-1">{metric.subtitle}</p>
                                </div>
                                <div className={`flex items-center gap-1 ${visuals.colorClass}`}>
                                    <span className="text-xs font-semibold text-gray-900">
                                        {metric.change.value.toFixed(2)}%
                                    </span>
                                    {visuals.icon}
                                </div>
                            </div>
                            <MetricChart data={chartData} lineColor={metric.colors.line} gradientColor={metric.colors.gradient} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OverviewMetrics;