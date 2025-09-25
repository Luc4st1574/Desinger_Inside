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

type Period = '1 month' | '4 months' | '6 months' | '1 year';
const periods: Period[] = ['1 month', '4 months', '6 months', '1 year'];

type Trend = 'up' | 'down' | 'stable';

// --- HELPER FUNCTIONS ---

const getTotalFollowers = (record: AnalyticsRecord) =>
    (record.social_fb_likes ?? 0) +
    (record.social_twitter_followers ?? 0) +
    (record.social_linkedin_followers ?? 0) +
    (record.social_instagram_followers ?? 0) +
    (record.social_tiktok_followers ?? 0);

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
                seo_referring_domains: 0,
                seo_backlinks: 0,
                seo_organic_keywords: 0,
                web_sessions: 0,
                web_new_users: 0,
                web_avg_engagement_secs: 0,
                web_bounce_rate: 0,
                email_total_contacts: 0,
                email_open_rate: 0,
                email_click_rate: 0,
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
        currentMonth.seo_referring_domains = (currentMonth.seo_referring_domains ?? 0) + (record.seo_referring_domains ?? 0);
        currentMonth.seo_backlinks = (currentMonth.seo_backlinks ?? 0) + (record.seo_backlinks ?? 0);
        currentMonth.seo_organic_keywords = (currentMonth.seo_organic_keywords ?? 0) + (record.seo_organic_keywords ?? 0);
        currentMonth.web_sessions = (currentMonth.web_sessions ?? 0) + (record.web_sessions ?? 0);
        currentMonth.web_new_users = (currentMonth.web_new_users ?? 0) + (record.web_new_users ?? 0);
        currentMonth.email_open_rate = (currentMonth.email_open_rate ?? 0) + (record.email_open_rate ?? 0);
        currentMonth.email_click_rate = (currentMonth.email_click_rate ?? 0) + (record.email_click_rate ?? 0);
        currentMonth.email_conversion_rate = (currentMonth.email_conversion_rate ?? 0) + (record.email_conversion_rate ?? 0);
        currentMonth.web_avg_engagement_secs = record.web_avg_engagement_secs;
        currentMonth.web_bounce_rate = record.web_bounce_rate;
        currentMonth.email_total_contacts = record.email_total_contacts;
    });

    return Object.values(monthlyData);
};


const calculateChange = (
    current: number,
    previous: number,
    stabilityThreshold: number = 2.0
): { value: number; trend: Trend } => {
    if (previous === 0 && current > 0) return { value: 100, trend: 'up' };
    if (previous === 0) return { value: 0, trend: 'stable' };

    const change = ((current - previous) / previous) * 100;

    if (Math.abs(change) <= stabilityThreshold) {
        return { value: change, trend: 'stable' };
    }

    return { value: change, trend: change > 0 ? 'up' : 'down' };
};

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


// --- MAIN COMPONENT ---
interface DetailedAnalyticsProps {
    client: Client | null;
    clientRecords: AnalyticsRecord[];
}

const DetailedAnalytics: FC<DetailedAnalyticsProps> = ({ client, clientRecords }) => {
    const [activePeriod, setActivePeriod] = useState<Period>('1 month');

    const {
        latestMonthRecord,
        previousMonthRecord,
        currentPeriodTotals,
        previousPeriodTotals,
    } = useMemo(() => {
        const defaultTotals = {
            social_total_followers: 0,
            seo_organic_traffic: 0,
            web_sessions: 0,
            email_conversion_rate: 0,
        };

        const aggregated = aggregateRecordsByMonth(clientRecords);
        const sortedRecords = aggregated.sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());

        if (sortedRecords.length === 0) {
            return {
                latestMonthRecord: null,
                previousMonthRecord: null,
                currentPeriodTotals: defaultTotals,
                previousPeriodTotals: defaultTotals
            };
        }

        const periodMap: Record<Period, number> = {
            '1 month': 1, '4 months': 4, '6 months': 6, '1 year': 12,
        };
        const monthsToShow = periodMap[activePeriod];

        const currentPeriodRecords = sortedRecords.slice(0, monthsToShow);
        const previousPeriodRecords = sortedRecords.slice(monthsToShow, monthsToShow * 2);

        const sumMetric = (records: AnalyticsRecord[], key: keyof AnalyticsRecord) =>
            records.reduce((sum, record) => sum + ((record[key] as number) ?? 0), 0);
        
        const sumFollowers = (records: AnalyticsRecord[]) =>
             records.reduce((sum, record) => sum + getTotalFollowers(record), 0);

        const totals = {
            social_total_followers: sumFollowers(currentPeriodRecords),
            seo_organic_traffic: sumMetric(currentPeriodRecords, 'seo_organic_traffic'),
            web_sessions: sumMetric(currentPeriodRecords, 'web_sessions'),
            email_conversion_rate: sortedRecords[0]?.email_conversion_rate ?? 0,
        };

        const prevTotals = {
            social_total_followers: sumFollowers(previousPeriodRecords),
            seo_organic_traffic: sumMetric(previousPeriodRecords, 'seo_organic_traffic'),
            web_sessions: sumMetric(previousPeriodRecords, 'web_sessions'),
            email_conversion_rate: sortedRecords[monthsToShow]?.email_conversion_rate ?? 0,
        };

        return {
            latestMonthRecord: sortedRecords[0] || null,
            previousMonthRecord: sortedRecords[1] || null,
            currentPeriodTotals: totals,
            previousPeriodTotals: prevTotals,
        };
    }, [clientRecords, activePeriod]);


    if (!client) {
        return <div className="text-center py-10 text-gray-500">Select a client to see detailed analytics.</div>;
    }

    const getComparisonText = (period: Period): string => {
        if (period === '1 month') return 'vs last month';
        if (period === '1 year') return 'vs last year';
        return `vs previous ${period}`;
    };

    const getTrendVisuals = (trend: Trend) => {
        switch (trend) {
            case 'up': return { icon: <ArrowUpRight size={12} strokeWidth={3} className="text-[#62864d]" />, bgColor: 'bg-[#f3fee7]' };
            case 'down': return { icon: <ArrowDownRight size={12} strokeWidth={3} className="text-[#f01616]" />, bgColor: 'bg-[#ffe8e8]' };
            default: return { icon: <Minus size={12} strokeWidth={3} className="text-gray-600" />, bgColor: 'bg-gray-100' };
        }
    };

    const hasData = latestMonthRecord && previousMonthRecord;
    const lastUpdatedDate = hasData ? new Date(latestMonthRecord.date ?? 0).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'N/A';
    const comparisonText = getComparisonText(activePeriod);

    const socialChange = calculateChange(currentPeriodTotals.social_total_followers, previousPeriodTotals.social_total_followers);
    const seoChange = calculateChange(currentPeriodTotals.seo_organic_traffic, previousPeriodTotals.seo_organic_traffic);
    const webChange = calculateChange(currentPeriodTotals.web_sessions, previousPeriodTotals.web_sessions);
    const emailChange = calculateChange(currentPeriodTotals.email_conversion_rate, previousPeriodTotals.email_conversion_rate);

    const socialVisuals = getTrendVisuals(socialChange.trend);
    const seoVisuals = getTrendVisuals(seoChange.trend);
    const webVisuals = getTrendVisuals(webChange.trend);
    const emailVisuals = getTrendVisuals(emailChange.trend);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-light text-gray-700">{client.clientName} Analytics</h2>
                <Listbox value={activePeriod} onChange={setActivePeriod}>
                    <div className="relative w-auto">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-full border border-[#697d67] bg-transparent py-1.5 pl-4 pr-10 text-left text-sm font-medium text-[#697d67] focus:outline-none ring-0">
                            <span className="block truncate whitespace-nowrap">{activePeriod}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDown className="h-5 w-5 text-[#697d67]" aria-hidden="true" />
                            </span>
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

                {/* --- Social Following Card --- */}
                {hasData ? (
                    <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center">
                            <h3 className="font-light text-xl text-gray-800">Social Following</h3>
                            <MoreVertical className="h-6 w-6 text-gray-400 cursor-pointer" />
                        </div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-3xl font-semibold text-gray-900">{currentPeriodTotals.social_total_followers.toLocaleString()}</p>
                            <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-900 ${socialVisuals.bgColor}`}>
                                <span>{socialChange.value.toFixed(2)}%</span>
                                <span className="mt-px">{socialVisuals.icon}</span>
                            </div>
                            <span className="text-sm text-gray-500">{comparisonText}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Total Follower Growth</p>
                        <div className="flex-grow mt-4 flex flex-col justify-between">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-2 grid-rows-3 gap-y-4 gap-x-2">
                                    <GridItem icon={<Facebook size={24} className="text-[#004049]" />} label="Page Likes" value={(latestMonthRecord.social_fb_likes ?? 0).toLocaleString()} change={calculateChange(latestMonthRecord.social_fb_likes ?? 0, previousMonthRecord.social_fb_likes ?? 0)} />
                                    <GridItem icon={<Twitter size={24} className="text-[#004049]" />} label="Page Followers" value={(latestMonthRecord.social_twitter_followers ?? 0).toLocaleString()} change={calculateChange(latestMonthRecord.social_twitter_followers ?? 0, previousMonthRecord.social_twitter_followers ?? 0)} />
                                    <GridItem icon={<Linkedin size={24} className="text-[#004049]" />} label="Page Followers" value={(latestMonthRecord.social_linkedin_followers ?? 0).toLocaleString()} change={calculateChange(latestMonthRecord.social_linkedin_followers ?? 0, previousMonthRecord.social_linkedin_followers ?? 0)} />
                                    <GridItem icon={<Instagram size={24} className="text-[#004049]" />} label="Page Followers" value={(latestMonthRecord.social_instagram_followers ?? 0).toLocaleString()} change={calculateChange(latestMonthRecord.social_instagram_followers ?? 0, previousMonthRecord.social_instagram_followers ?? 0)} />
                                    <GridItem icon={<Music size={24} className="text-[#004049]" />} label="Page Followers" value={(latestMonthRecord.social_tiktok_followers ?? 0).toLocaleString()} change={calculateChange(latestMonthRecord.social_tiktok_followers ?? 0, previousMonthRecord.social_tiktok_followers ?? 0)} />
                                </div>
                                <div className="mt-4 pt-4 border-t-2 border-gray-200 w-[95%] mx-auto">
                                    <p className="text-xs text-black text-center">Last Updated: {lastUpdatedDate}</p>
                                </div>
                            </div>
                            <p className="text-black text-center pt-4 text-sm">We are currently pulling this data from publicly available sources.</p>
                        </div>
                    </div>
                ) : (
                    <AnalyticsCardPlaceholder title="Social Following" message="No social following data available for the selected client or period." />
                )}

                {/* --- SEO Performance Card --- */}
                {hasData ? (
                     <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center">
                            <h3 className="font-light text-xl text-gray-800">SEO Performance</h3>
                            <MoreVertical className="h-6 w-6 text-gray-400 cursor-pointer" />
                        </div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-3xl font-semibold text-gray-900">{(currentPeriodTotals.seo_organic_traffic).toLocaleString()}</p>
                            <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-900 ${seoVisuals.bgColor}`}>
                                <span>{seoChange.value.toFixed(2)}%</span>
                                <span className="mt-px">{seoVisuals.icon}</span>
                            </div>
                            <span className="text-sm text-gray-500">{comparisonText}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Organic Traffic Insights</p>
                        <div className="flex-grow mt-4 flex flex-col justify-between">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-2 grid-rows-3 gap-y-4 gap-x-2">
                                    <GridItem icon={<TrendingUp size={24} className="text-black" />} label="Referring Domains" value={(latestMonthRecord.seo_referring_domains ?? 0).toLocaleString()} change={calculateChange(latestMonthRecord.seo_referring_domains ?? 0, previousMonthRecord.seo_referring_domains ?? 0)} />
                                    <GridItem icon={<Link size={24} className="text-black" />} label="Backlinks" value={(latestMonthRecord.seo_backlinks ?? 0).toLocaleString()} change={calculateChange(latestMonthRecord.seo_backlinks ?? 0, previousMonthRecord.seo_backlinks ?? 0)} />
                                    <GridItem icon={<UserCircle size={24} className="text-black" />} label="Organic Traffic" value={(latestMonthRecord.seo_organic_traffic ?? 0).toLocaleString()} change={calculateChange(latestMonthRecord.seo_organic_traffic ?? 0, previousMonthRecord.seo_organic_traffic ?? 0)} />
                                    <GridItem icon={<KeyRound size={24} className="text-black" />} label="Organic Keywords" value={(latestMonthRecord.seo_organic_keywords ?? 0).toLocaleString()} change={calculateChange(latestMonthRecord.seo_organic_keywords ?? 0, previousMonthRecord.seo_organic_keywords ?? 0)} />
                                </div>
                                <div className="mt-4 pt-4 border-t-2 border-gray-200 w-[95%] mx-auto">
                                    <p className="text-xs text-black text-center">Last Updated: {lastUpdatedDate}</p>
                                </div>
                            </div>
                            <p className="text-black text-center pt-4 text-sm">We are updating this data via sources at Ahrefs.</p>
                        </div>
                    </div>
                ) : (
                    <AnalyticsCardPlaceholder title="SEO Performance" message="No SEO performance data available for the selected client or period." />
                )}

                {/* --- Web Analytics Card --- */}
                {hasData ? (
                    <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center">
                            <h3 className="font-light text-xl text-gray-800">Web Analytics</h3>
                            <MoreVertical className="h-6 w-6 text-gray-400 cursor-pointer" />
                        </div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-3xl font-semibold text-gray-900">{(currentPeriodTotals.web_sessions).toLocaleString()}</p>
                            <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-900 ${webVisuals.bgColor}`}>
                                <span>{webChange.value.toFixed(2)}%</span>
                                <span className="mt-px">{webVisuals.icon}</span>
                            </div>
                            <span className="text-sm text-gray-500">{comparisonText}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Website Sessions Tracked</p>
                        <div className="flex-grow mt-4 flex flex-col justify-between">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-2 grid-rows-3 gap-y-4 gap-x-2">
                                    <GridItem icon={<Globe size={24} className="text-black" />} label="Number of Sessions" value={(latestMonthRecord.web_sessions ?? 0).toLocaleString()} change={calculateChange(latestMonthRecord.web_sessions ?? 0, previousMonthRecord.web_sessions ?? 0)} />
                                    <GridItem icon={<UserCircle size={24} className="text-black" />} label="New Users" value={(latestMonthRecord.web_new_users ?? 0).toLocaleString()} change={calculateChange(latestMonthRecord.web_new_users ?? 0, previousMonthRecord.web_new_users ?? 0)} />
                                    <GridItem icon={<Clock size={24} className="text-black" />} label="Avg Engagement Time" value={`${(latestMonthRecord.web_avg_engagement_secs ?? 0).toFixed(1)}s`} change={calculateChange(latestMonthRecord.web_avg_engagement_secs ?? 0, previousMonthRecord.web_avg_engagement_secs ?? 0)} />
                                    <GridItem icon={<TrendingUp size={24} className="text-black" />} label="Bounce Rate" value={`${((latestMonthRecord.web_bounce_rate ?? 0) / 100).toFixed(2)}%`} change={calculateChange(latestMonthRecord.web_bounce_rate ?? 0, previousMonthRecord.web_bounce_rate ?? 0)} />
                                </div>
                                <div className="mt-4 pt-4 border-t-2 border-gray-200 w-[95%] mx-auto">
                                    <p className="text-xs text-black text-center">Last Updated: {lastUpdatedDate}</p>
                                </div>
                            </div>
                            <p className="text-black text-center pt-4 text-sm">If we have access to your Google Analytics, it will be reported here.</p>
                        </div>
                    </div>
                ) : (
                    <AnalyticsCardPlaceholder title="Web Analytics" message="No web analytics data available for the selected client or period." />
                )}

                {/* --- Email Analytics Card --- */}
                {hasData ? (
                    <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center">
                            <h3 className="font-light text-xl text-gray-800">Email Analytics</h3>
                            <MoreVertical className="h-6 w-6 text-gray-400 cursor-pointer" />
                        </div>
                        <div className="flex items-baseline gap-2 mt-2">
                            <p className="text-3xl font-semibold text-gray-900">{`${((currentPeriodTotals.email_conversion_rate) / 100).toFixed(2)}%`}</p>
                            <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-900 ${emailVisuals.bgColor}`}>
                                <span>{emailChange.value.toFixed(2)}%</span>
                                <span className="mt-px">{emailVisuals.icon}</span>
                            </div>
                            <span className="text-sm text-gray-500">{comparisonText}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Conversion Rate Growth</p>
                        <div className="flex-grow mt-4 flex flex-col justify-between">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="grid grid-cols-2 grid-rows-3 gap-y-4 gap-x-2">
                                    <GridItem icon={<Contact2Icon size={24} className="text-black" />} label="Total Contacts" value={(latestMonthRecord.email_total_contacts ?? 0).toLocaleString()} change={calculateChange(latestMonthRecord.email_total_contacts ?? 0, previousMonthRecord.email_total_contacts ?? 0)} />
                                    <GridItem icon={<MailOpen size={24} className="text-black" />} label="Open Rate" value={`${((latestMonthRecord.email_open_rate ?? 0) / 100).toFixed(2)}%`} change={calculateChange(latestMonthRecord.email_open_rate ?? 0, previousMonthRecord.email_open_rate ?? 0)} />
                                    <GridItem icon={<MousePointerClick size={24} className="text-black" />} label="Click Rate" value={`${((latestMonthRecord.email_click_rate ?? 0) / 100).toFixed(2)}%`} change={calculateChange(latestMonthRecord.email_click_rate ?? 0, previousMonthRecord.email_click_rate ?? 0)} />
                                    <GridItem icon={<Repeat2 size={24} className="text-black" />} label="Conversion Rate" value={`${((latestMonthRecord.email_conversion_rate ?? 0) / 100).toFixed(2)}%`} change={calculateChange(latestMonthRecord.email_conversion_rate ?? 0, previousMonthRecord.email_conversion_rate ?? 0)} />
                                </div>
                                <div className="mt-4 pt-4 border-t-2 border-gray-200 w-[95%] mx-auto">
                                    <p className="text-xs text-black text-center">Last Updated: {lastUpdatedDate}</p>
                                </div>
                            </div>
                            <p className="text-black text-center pt-4 text-sm">If we manage any of your email marketing, it will be reported here.</p>
                        </div>
                    </div>
                ) : (
                    <AnalyticsCardPlaceholder title="Email Analytics" message="No email marketing data available for the selected client or period." />
                )}
            </div>
        </div>
    );
};

export default DetailedAnalytics;