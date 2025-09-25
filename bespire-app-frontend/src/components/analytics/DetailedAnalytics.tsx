"use client";

import React, { FC, useState, useMemo, Fragment } from 'react';
import type { AnalyticsRecord, Client } from '@/types/analytics';
import { Listbox, Transition } from '@headlessui/react';
import {
    ChevronDown, ArrowUpRight, ArrowDownRight, MoreVertical,
    Link, Clock, MousePointerClick, TrendingUp, UserCircle, Globe, MailOpen, Contact2Icon, Repeat2, Info, Minus
} from 'lucide-react';
import Facebook from "@/assets/icons/FACEBOOK.svg";
import Twitter from "@/assets/icons/X.svg";
import Instagram from "@/assets/icons/IG.svg";
import Linkedin from "@/assets/icons/LINKEDIN.svg";
import Music from "@/assets/icons/Tiktok.svg";
import KeyRound from "@/assets/icons/organic_keywords.svg";

// --- Type Definitions ---
type Period = '1 month' | '4 months' | '6 months' | '1 year';
const periods: Period[] = ['1 month', '4 months', '6 months', '1 year'];
type Trend = 'up' | 'down' | 'stable';

type NumericRecordKeys = {
  [K in keyof AnalyticsRecord]: AnalyticsRecord[K] extends number | undefined | null ? K : never;
}[keyof AnalyticsRecord];

type MonthlyAggregation = {
  [K in NumericRecordKeys]-?: number;
} & {
  date: string;
  clientId: string;
  recordId: string;
  recordCount: number;
};

// --- Utility Functions ---
const aggregateRecordsByMonth = (records: AnalyticsRecord[]): AnalyticsRecord[] => {
    if (!records || records.length === 0) return [];
    const monthlyData = new Map<string, MonthlyAggregation>();
    const sumKeys: NumericRecordKeys[] = [
        'social_fb_likes', 'social_twitter_followers', 'social_linkedin_followers',
        'social_instagram_followers', 'social_tiktok_followers', 'seo_organic_traffic',
        'seo_referring_domains', 'seo_backlinks', 'seo_organic_keywords', 'web_sessions',
        'web_new_users', 'email_total_contacts', 'email_open_rate', 'email_click_rate', 'email_conversion_rate'
    ];
    const avgKeys: NumericRecordKeys[] = ['web_avg_engagement_secs', 'web_bounce_rate'];
    records.forEach(record => {
        const date = new Date(record.date ?? 0);
        if (isNaN(date.getTime())) return;
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData.has(monthKey)) {
            const initialAggregation: Partial<MonthlyAggregation> = {};
            sumKeys.forEach(key => (initialAggregation[key] = 0));
            avgKeys.forEach(key => (initialAggregation[key] = 0));
            monthlyData.set(monthKey, {
                ...initialAggregation,
                date: new Date(date.getFullYear(), date.getMonth(), 1).toISOString(),
                clientId: record.clientId ?? '',
                recordId: `agg_${monthKey}`,
                recordCount: 0,
            } as MonthlyAggregation);
        }
        const monthAgg = monthlyData.get(monthKey)!;
        monthAgg.recordCount += 1;
        sumKeys.forEach(key => { monthAgg[key] += Number(record[key] ?? 0); });
        avgKeys.forEach(key => { monthAgg[key] += Number(record[key] ?? 0); });
    });
    return Array.from(monthlyData.values()).map(agg => {
        avgKeys.forEach(key => {
            if (agg.recordCount > 0) { agg[key] = agg[key] / agg.recordCount; }
        });
        // FIX: Revert to destructuring and add linter-ignore comment
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { recordCount, ...finalRecord } = agg;
        return finalRecord as AnalyticsRecord;
    });
};

const calculateChange = (
    current: number,
    previous: number,
    stabilityThreshold: number = 2.0
): { value: number; trend: Trend } => {
    if (previous === 0 && current > 0) return { value: 100, trend: 'up' };
    if (previous === 0) return { value: 0, trend: 'stable' };
    const change = ((current - previous) / previous) * 100;
    if (Math.abs(change) <= stabilityThreshold) return { value: change, trend: 'stable' };
    return { value: change, trend: change > 0 ? 'up' : 'down' };
};

// --- Sub-Components ---
interface GridItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    change: { value: number; trend: Trend };
}

const GridItem: FC<GridItemProps> = ({ icon, label, value, change }) => {
    const trendVisuals = {
        up: { icon: <ArrowUpRight size={8} strokeWidth={3} className="text-[#62864d]" />, textColor: 'text-gray-900' },
        down: { icon: <ArrowDownRight size={8} strokeWidth={3} className="text-[#f01616]" />, textColor: 'text-gray-900' },
        stable: { icon: <Minus size={8} strokeWidth={3} className="text-gray-500" />, textColor: 'text-gray-500' }
    };
    const currentVisuals = trendVisuals[change.trend];

    return (
        <div className="flex items-center gap-2">
            <div>{icon}</div>
            <div>
                <div className="flex items-center gap-1">
                    <p className="text-base font-semibold text-[#62864d]">{value}</p>
                    <div className={`flex items-center space-x-0.5 text-[10px] font-normal pl-1.5 pr-1 py-px rounded-full bg-white ${currentVisuals.textColor}`}>
                        <span>{change.value.toFixed(1)}%</span>
                        <span className="mt-px">{currentVisuals.icon}</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );
};

const AnalyticsCardPlaceholder: FC<{ title: string; message: string }> = ({ title, message }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
        <div className="flex justify-between items-center">
            <h3 className="font-light text-xl text-gray-800">{title}</h3>
            <MoreVertical className="h-6 w-6 text-gray-300" />
        </div>
        <div className="flex-grow mt-4 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4 text-center">
            <Info className="h-10 w-10 text-gray-400 mb-3" />
            <p className="text-sm font-medium text-gray-600">No Data Available</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">{message}</p>
        </div>
    </div>
);

// --- Main Detailed Analytics Component ---
interface DetailedAnalyticsProps {
    client: Client | null;
    clientRecords: AnalyticsRecord[];
}

const DetailedAnalytics: FC<DetailedAnalyticsProps> = ({ client, clientRecords }) => {
    const [activePeriod, setActivePeriod] = useState<Period>('1 month');

    const { latestRecord, previousRecord } = useMemo(() => {
        const periodMap: Record<Period, number> = { '1 month': 1, '4 months': 4, '6 months': 6, '1 year': 12 };
        const monthsToCompare = periodMap[activePeriod];
        const aggregatedData = aggregateRecordsByMonth(clientRecords);
        const records = aggregatedData.sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());
        if (records.length === 0) return { latestRecord: null, previousRecord: null };
        const current = records[0];
        const previous = records[monthsToCompare] || records[records.length - 1];
        return { latestRecord: current, previousRecord: previous };
    }, [clientRecords, activePeriod]);

    if (!client) return <div className="text-center py-10 text-gray-500">Select a client to see detailed analytics.</div>;

    const getComparisonText = (period: Period) => period === '1 month' ? 'vs last month' : `vs last ${period}`;
    const getTrendVisuals = (trend: Trend) => ({
        up: { icon: <ArrowUpRight size={12} strokeWidth={3} className="text-[#62864d]" />, bgColor: 'bg-[#f3fee7]' },
        down: { icon: <ArrowDownRight size={12} strokeWidth={3} className="text-[#f01616]" />, bgColor: 'bg-[#ffe8e8]' },
        stable: { icon: <Minus size={12} strokeWidth={3} className="text-gray-600" />, bgColor: 'bg-gray-100' }
    })[trend];

    const hasData = latestRecord && previousRecord;
    const lastUpdatedDate = hasData ? new Date(latestRecord.date ?? 0).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A';
    const comparisonText = getComparisonText(activePeriod);
    const prev = previousRecord;
    
    const getTotalFollowers = (record: AnalyticsRecord) => (record.social_fb_likes ?? 0) + (record.social_twitter_followers ?? 0) + (record.social_linkedin_followers ?? 0) + (record.social_instagram_followers ?? 0) + (record.social_tiktok_followers ?? 0);
    const latestTotalFollowers = hasData ? getTotalFollowers(latestRecord) : 0;
    const prevTotalFollowers = hasData ? getTotalFollowers(prev!) : 0;
    const latestConversionRate = hasData ? ((latestRecord.email_conversion_rate ?? 0) / (latestRecord.email_total_contacts ?? 1)) : 0;
    const prevConversionRate = hasData ? ((prev!.email_conversion_rate ?? 0) / (prev!.email_total_contacts ?? 1)) : 0;
    
    const socialChange = hasData ? calculateChange(latestTotalFollowers, prevTotalFollowers) : { value: 0, trend: 'stable' as const };
    const seoChange = hasData ? calculateChange(latestRecord.seo_organic_traffic ?? 0, prev!.seo_organic_traffic ?? 0) : { value: 0, trend: 'stable' as const };
    const webChange = hasData ? calculateChange(latestRecord.web_sessions ?? 0, prev!.web_sessions ?? 0) : { value: 0, trend: 'stable' as const };
    const emailChange = hasData ? calculateChange(latestConversionRate, prevConversionRate) : { value: 0, trend: 'stable' as const };
    
    const socialVisuals = getTrendVisuals(socialChange.trend), seoVisuals = getTrendVisuals(seoChange.trend);
    const webVisuals = getTrendVisuals(webChange.trend), emailVisuals = getTrendVisuals(emailChange.trend);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-light text-gray-700">{client.clientName} Analytics</h2>
                <Listbox value={activePeriod} onChange={setActivePeriod}>
                    <div className="relative w-auto">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-full border border-[#697d67] bg-transparent py-1.5 pl-4 pr-10 text-left text-sm font-medium text-[#697d67] focus:outline-none ring-0">
                            <span className="block truncate whitespace-nowrap">{activePeriod}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><ChevronDown className="h-5 w-5 text-[#697d67]" aria-hidden="true" /></span>
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute right-0 mt-1 max-h-60 w-full min-w-max overflow-auto rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm z-10">
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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {hasData ? (<>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center"><h3 className="font-light text-xl text-gray-800">Social Following</h3><MoreVertical className="h-6 w-6 text-gray-400 cursor-pointer" /></div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-3xl font-semibold text-gray-900">{latestTotalFollowers.toLocaleString()}</p>
                            <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-900 ${socialVisuals.bgColor}`}><span>{socialChange.value.toFixed(2)}%</span><span className="mt-px">{socialVisuals.icon}</span></div>
                            <span className="text-sm text-gray-500">{comparisonText}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Total Follower Growth for {lastUpdatedDate}</p>
                        <div className="flex-grow mt-4"><div className="bg-gray-50 rounded-lg p-4 flex flex-col h-full">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 flex-grow">
                                <GridItem icon={<Facebook size={24} className="text-[#004049]" />} label="Page Likes" value={(latestRecord.social_fb_likes ?? 0).toLocaleString()} change={calculateChange(latestRecord.social_fb_likes ?? 0, prev!.social_fb_likes ?? 0)} />
                                <GridItem icon={<Twitter size={24} className="text-[#004049]" />} label="Page Followers" value={(latestRecord.social_twitter_followers ?? 0).toLocaleString()} change={calculateChange(latestRecord.social_twitter_followers ?? 0, prev!.social_twitter_followers ?? 0)} />
                                <GridItem icon={<Linkedin size={24} className="text-[#004049]" />} label="Page Followers" value={(latestRecord.social_linkedin_followers ?? 0).toLocaleString()} change={calculateChange(latestRecord.social_linkedin_followers ?? 0, prev!.social_linkedin_followers ?? 0)} />
                                <GridItem icon={<Instagram size={24} className="text-[#004049]" />} label="Page Followers" value={(latestRecord.social_instagram_followers ?? 0).toLocaleString()} change={calculateChange(latestRecord.social_instagram_followers ?? 0, prev!.social_instagram_followers ?? 0)} />
                                <GridItem icon={<Music size={24} className="text-[#004049]" />} label="Page Followers" value={(latestRecord.social_tiktok_followers ?? 0).toLocaleString()} change={calculateChange(latestRecord.social_tiktok_followers ?? 0, prev!.social_tiktok_followers ?? 0)} />
                            </div>
                        </div></div>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center"><h3 className="font-light text-xl text-gray-800">SEO Performance</h3><MoreVertical className="h-6 w-6 text-gray-400 cursor-pointer" /></div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-3xl font-semibold text-gray-900">{(latestRecord.seo_organic_traffic ?? 0).toLocaleString()}</p>
                            <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-900 ${seoVisuals.bgColor}`}><span>{seoChange.value.toFixed(2)}%</span><span className="mt-px">{seoVisuals.icon}</span></div>
                            <span className="text-sm text-gray-500">{comparisonText}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Organic Traffic Insights for {lastUpdatedDate}</p>
                        <div className="flex-grow mt-4"><div className="bg-gray-50 rounded-lg p-4 flex flex-col h-full">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 flex-grow">
                                <GridItem icon={<TrendingUp size={24} className="text-black" />} label="Referring Domains" value={(latestRecord.seo_referring_domains ?? 0).toLocaleString()} change={calculateChange(latestRecord.seo_referring_domains ?? 0, prev!.seo_referring_domains ?? 0)} />
                                <GridItem icon={<Link size={24} className="text-black" />} label="Backlinks" value={(latestRecord.seo_backlinks ?? 0).toLocaleString()} change={calculateChange(latestRecord.seo_backlinks ?? 0, prev!.seo_backlinks ?? 0)} />
                                <GridItem icon={<UserCircle size={24} className="text-black" />} label="Organic Traffic" value={(latestRecord.seo_organic_traffic ?? 0).toLocaleString()} change={calculateChange(latestRecord.seo_organic_traffic ?? 0, prev!.seo_organic_traffic ?? 0)} />
                                <GridItem icon={<KeyRound size={24} className="text-black" />} label="Organic Keywords" value={(latestRecord.seo_organic_keywords ?? 0).toLocaleString()} change={calculateChange(latestRecord.seo_organic_keywords ?? 0, prev!.seo_organic_keywords ?? 0)} />
                            </div>
                        </div></div>
                    </div>
                     <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center"><h3 className="font-light text-xl text-gray-800">Web Analytics</h3><MoreVertical className="h-6 w-6 text-gray-400 cursor-pointer" /></div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-3xl font-semibold text-gray-900">{(latestRecord.web_sessions ?? 0).toLocaleString()}</p>
                            <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-900 ${webVisuals.bgColor}`}><span>{webChange.value.toFixed(2)}%</span><span className="mt-px">{webVisuals.icon}</span></div>
                            <span className="text-sm text-gray-500">{comparisonText}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Website Sessions for {lastUpdatedDate}</p>
                        <div className="flex-grow mt-4"><div className="bg-gray-50 rounded-lg p-4 flex flex-col h-full">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 flex-grow">
                                <GridItem icon={<Globe size={24} className="text-black" />} label="Number of Sessions" value={(latestRecord.web_sessions ?? 0).toLocaleString()} change={calculateChange(latestRecord.web_sessions ?? 0, prev!.web_sessions ?? 0)} />
                                <GridItem icon={<UserCircle size={24} className="text-black" />} label="New Users" value={(latestRecord.web_new_users ?? 0).toLocaleString()} change={calculateChange(latestRecord.web_new_users ?? 0, prev!.web_new_users ?? 0)} />
                                <GridItem icon={<Clock size={24} className="text-black" />} label="Avg Engagement Time" value={`${(latestRecord.web_avg_engagement_secs ?? 0).toFixed(1)}s`} change={calculateChange(latestRecord.web_avg_engagement_secs ?? 0, prev!.web_avg_engagement_secs ?? 0)} />
                                <GridItem icon={<TrendingUp size={24} className="text-black" />} label="Bounce Rate" value={`${((latestRecord.web_bounce_rate ?? 0) / 100).toFixed(2)}%`} change={calculateChange(latestRecord.web_bounce_rate ?? 0, prev!.web_bounce_rate ?? 0)} />
                            </div>
                        </div></div>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center"><h3 className="font-light text-xl text-gray-800">Email Analytics</h3><MoreVertical className="h-6 w-6 text-gray-400 cursor-pointer" /></div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-3xl font-semibold text-gray-900">{`${(latestConversionRate * 100).toFixed(2)}%`}</p>
                            <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-900 ${emailVisuals.bgColor}`}><span>{emailChange.value.toFixed(2)}%</span><span className="mt-px">{emailVisuals.icon}</span></div>
                            <span className="text-sm text-gray-500">{comparisonText}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Conversion Rate for {lastUpdatedDate}</p>
                        <div className="flex-grow mt-4"><div className="bg-gray-50 rounded-lg p-4 flex flex-col h-full">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 flex-grow">
                                <GridItem icon={<Contact2Icon size={24} className="text-black" />} label="Total Contacts" value={(latestRecord.email_total_contacts ?? 0).toLocaleString()} change={calculateChange(latestRecord.email_total_contacts ?? 0, prev!.email_total_contacts ?? 0)} />
                                <GridItem icon={<MailOpen size={24} className="text-black" />} label="Open Rate" value={`${(((latestRecord.email_open_rate ?? 0) / (latestRecord.email_total_contacts ?? 1)) * 100).toFixed(2)}%`} change={calculateChange(latestRecord.email_open_rate ?? 0, prev!.email_open_rate ?? 0)} />
                                <GridItem icon={<MousePointerClick size={24} className="text-black" />} label="Click Rate" value={`${(((latestRecord.email_click_rate ?? 0) / (latestRecord.email_total_contacts ?? 1)) * 100).toFixed(2)}%`} change={calculateChange(latestRecord.email_click_rate ?? 0, prev!.email_click_rate ?? 0)} />
                                <GridItem icon={<Repeat2 size={24} className="text-black" />} label="Conversion Rate" value={`${(latestConversionRate * 100).toFixed(2)}%`} change={calculateChange(latestRecord.email_conversion_rate ?? 0, prev!.email_conversion_rate ?? 0)} />
                            </div>
                        </div></div>
                    </div>
                </>) : (<>
                    <AnalyticsCardPlaceholder title="Social Following" message="We are currently pulling this data from publicly available sources." />
                    <AnalyticsCardPlaceholder title="SEO Performance" message="We are updating this data via sources at Ahrefs." />
                    <AnalyticsCardPlaceholder title="Web Analytics" message="If we have access to your Google Analytics, it will be reported here." />
                    <AnalyticsCardPlaceholder title="Email Analytics" message="If we manage any of your email marketing, it will be reported here." />
                </>)}
            </div>
        </div>
    );
};

export default DetailedAnalytics;