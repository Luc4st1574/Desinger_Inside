"use client";

import React, { useState, useMemo, Fragment } from 'react';
import type { AnalyticsRecord, Client } from '@/types/analytics';
import { Listbox, Transition } from '@headlessui/react';
import {
    ChevronDown, ArrowUpRight, ArrowDownRight, MoreVertical,
    Link , Clock, MousePointerClick, TrendingUp, UserCircle, Globe, MailOpen, Contact2Icon, Repeat2
} from 'lucide-react';
import Facebook from "@/assets/icons/FACEBOOK.svg";
import Twitter from "@/assets/icons/X.svg";
import Instagram from "@/assets/icons/IG.svg";
import Linkedin from "@/assets/icons/LINKEDIN.svg";
import Music from "@/assets/icons/Tiktok.svg";
import KeyRound from "@/assets/icons/organic_keywords.svg";


type Period = '1 month' | '4 months' | '6 months' | '1 year';
const periods: Period[] = ['1 month', '4 months', '6 months', '1 year'];

const calculateChange = (current: number, previous: number) => {
    if (previous === 0 && current > 0) return { value: 100, trend: 'up' as const };
    if (previous === 0) return { value: 0, trend: 'up' as const };
    const change = (((current - previous) / previous) * 100);
    return { value: change, trend: change >= 0 ? 'up' as const : 'down' as const };
};

// --- Reusable Sub-components ---
const GridItem = ({ icon, label, value, change }: { icon: React.ReactNode; label: string; value: string; change: { value: number, trend: 'up' | 'down'} }) => {
    const isIncrease = change.trend === 'up';
    return (
        <div className="flex items-center gap-2">
            {/* MODIFIED: Removed default text color here so the passed-in className works */}
            <div>{icon}</div>
            <div>
                <div className="flex items-center gap-1">
                    <p className="text-base font-semibold text-[#62864d]">{value}</p>
                    <div className={`flex items-center space-x-0.5 text-[10px] font-normal pl-1.5 pr-1 py-px rounded-full bg-white text-gray-900`}>
                        <span>{change.value.toFixed(1)}%</span>
                        <span className="mt-px">
                            {isIncrease ? (
                                <ArrowUpRight size={8} strokeWidth={3} className="text-[#62864d]" />
                            ) : (
                                <ArrowDownRight size={8} strokeWidth={3} className="text-[#f01616]" />
                            )}
                        </span>
                    </div>
                </div>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );
};

// --- Main Detailed Analytics Component ---
interface DetailedAnalyticsProps {
  client: Client | null;
  clientRecords: AnalyticsRecord[];
}

const DetailedAnalytics = ({ client, clientRecords }: DetailedAnalyticsProps) => {
    const [activePeriod, setActivePeriod] = useState<Period>('1 month');

    const { latestRecord, previousRecord } = useMemo(() => {
        const periodMap: Record<Period, number> = {
            '1 month': 1, '4 months': 4, '6 months': 6, '1 year': 12,
        };
        const monthsToShow = periodMap[activePeriod];
        const records = Array.isArray(clientRecords) ? [...clientRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];
        
        if (records.length === 0) return { latestRecord: null, previousRecord: null };

        const current = records[0];
        const previous = records[monthsToShow] || records[records.length - 1];
        
        return { latestRecord: current, previousRecord: previous };
    }, [clientRecords, activePeriod]);

    if (!latestRecord || !previousRecord || !client) {
        return <div className="text-center py-10 text-gray-500">Select a client and period to see detailed analytics.</div>;
    }

    const getComparisonText = (period: Period): string => {
        if (period === '1 month') return 'vs last month';
        if (period === '1 year') return 'vs last year';
        return `vs last ${period}`;
    };
    const comparisonText = getComparisonText(activePeriod);


    const prev = previousRecord;
    const lastUpdatedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // --- Social Data ---
    const getTotalFollowers = (record: AnalyticsRecord) =>
        record.social_fb_likes +
        record.social_twitter_followers +
        record.social_linkedin_followers +
        record.social_instagram_followers +
        record.social_tiktok_followers;
    const latestTotalFollowers = getTotalFollowers(latestRecord);
    const prevTotalFollowers = getTotalFollowers(prev);
    const socialChange = calculateChange(latestTotalFollowers, prevTotalFollowers);
    const socialIsIncrease = socialChange.trend === 'up';

    // --- SEO Data ---
    const seoChange = calculateChange(latestRecord.seo_organic_traffic, prev.seo_organic_traffic);
    const seoIsIncrease = seoChange.trend === 'up';

    // --- Web Data ---
    const webChange = calculateChange(latestRecord.web_sessions, prev.web_sessions);
    const webIsIncrease = webChange.trend === 'up';

    // --- Email Data ---
    const emailChange = calculateChange(latestRecord.email_conversion_rate, prev.email_conversion_rate);
    const emailIsIncrease = emailChange.trend === 'up';

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
                <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
                    <div className="flex justify-between items-center">
                        <h3 className="font-light text-xl text-gray-800">Social Following</h3>
                        <MoreVertical className="h-6 w-6 text-gray-400 cursor-pointer" />
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-3xl font-semibold text-gray-900">{latestTotalFollowers.toLocaleString()}</p>
                        <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-900 ${socialIsIncrease ? 'bg-[#f3fee7]' : 'bg-[#ffe8e8]'}`}>
                            <span>{socialChange.value.toFixed(2)}%</span>
                            <span className="mt-px">
                                {socialIsIncrease ? <ArrowUpRight size={12} strokeWidth={3} className="text-[#62864d]" /> : <ArrowDownRight size={12} strokeWidth={3} className="text-[#f01616]" />}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">{comparisonText}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Total Follower Growth</p>
                    <div className="flex-grow mt-4">
                        <div className="bg-gray-50 rounded-lg p-4 flex flex-col h-full">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 flex-grow">
                                <GridItem icon={<Facebook size={24} className="text-[#004049]" />} label="Page Likes" value={latestRecord.social_fb_likes.toLocaleString()} change={calculateChange(latestRecord.social_fb_likes, prev.social_fb_likes)} />
                                <GridItem icon={<Twitter size={24} className="text-[#004049]" />} label="Page Followers" value={latestRecord.social_twitter_followers.toLocaleString()} change={calculateChange(latestRecord.social_twitter_followers, prev.social_twitter_followers)} />
                                <GridItem icon={<Linkedin size={24} className="text-[#004049]" />} label="Page Followers" value={latestRecord.social_linkedin_followers.toLocaleString()} change={calculateChange(latestRecord.social_linkedin_followers, prev.social_linkedin_followers)} />
                                <GridItem icon={<Instagram size={24} className="text-[#004049]" />} label="Page Followers" value={latestRecord.social_instagram_followers.toLocaleString()} change={calculateChange(latestRecord.social_instagram_followers, prev.social_instagram_followers)} />
                                <GridItem icon={<Music size={24} className="text-[#004049]" />} label="Page Followers" value={latestRecord.social_tiktok_followers.toLocaleString()} change={calculateChange(latestRecord.social_tiktok_followers, prev.social_tiktok_followers)} />
                            </div>
                            <div className="mt-4 pt-4 border-t-2 border-gray-200 w-[95%] mx-auto">
                               <p className="text-xs text-black text-center">Last Updated: {lastUpdatedDate}</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-black text-center mt-3">
                        We are currently pulling this data from publicly available sources.
                    </p>
                </div>

                {/* --- SEO Performance Card --- */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
                    <div className="flex justify-between items-center">
                        <h3 className="font-light text-xl text-gray-800">SEO Performance</h3>
                        <MoreVertical className="h-6 w-6 text-gray-400 cursor-pointer" />
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-3xl font-semibold text-gray-900">{latestRecord.seo_organic_traffic.toLocaleString()}</p>
                         <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-900 ${seoIsIncrease ? 'bg-[#f3fee7]' : 'bg-[#ffe8e8]'}`}>
                            <span>{seoChange.value.toFixed(2)}%</span>
                            <span className="mt-px">
                                {seoIsIncrease ? <ArrowUpRight size={12} strokeWidth={3} className="text-[#62864d]" /> : <ArrowDownRight size={12} strokeWidth={3} className="text-[#f01616]" />}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">{comparisonText}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Organic Traffic Insights</p>
                     <div className="flex-grow mt-4">
                        <div className="bg-gray-50 rounded-lg p-4 flex flex-col h-full">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 flex-grow">
                                {/* MODIFIED: Icons in this card are now black */}
                                <GridItem icon={<TrendingUp size={24} className="text-black" />} label="Referring Domains" value={latestRecord.seo_referring_domains.toLocaleString()} change={calculateChange(latestRecord.seo_referring_domains, prev.seo_referring_domains)} />
                                <GridItem icon={<Link size={24} className="text-black" />} label="Backlinks" value={latestRecord.seo_backlinks.toLocaleString()} change={calculateChange(latestRecord.seo_backlinks, prev.seo_backlinks)} />
                                <GridItem icon={<UserCircle size={24} className="text-black" />} label="Organic Traffic" value={latestRecord.seo_organic_traffic.toLocaleString()} change={calculateChange(latestRecord.seo_organic_traffic, prev.seo_organic_traffic)} />
                                <GridItem icon={<KeyRound size={24} className="text-black" />} label="Organic Keywords" value={latestRecord.seo_organic_keywords.toLocaleString()} change={calculateChange(latestRecord.seo_organic_keywords, prev.seo_organic_keywords)} />
                            </div>
                            <div className="mt-4 pt-4 border-t-2 border-gray-200 w-[95%] mx-auto">
                               <p className="text-xs text-black text-center">Last Updated: {lastUpdatedDate}</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-black text-center mt-3">
                        We are updating this data via sources at Ahrefs.
                    </p>
                </div>

                {/* --- Web Analytics Card --- */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
                     <div className="flex justify-between items-center">
                        <h3 className="font-light text-xl text-gray-800">Web Analytics</h3>
                        <MoreVertical className="h-6 w-6 text-gray-400 cursor-pointer" />
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-3xl font-semibold text-gray-900">{latestRecord.web_sessions.toLocaleString()}</p>
                        <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-900 ${webIsIncrease ? 'bg-[#f3fee7]' : 'bg-[#ffe8e8]'}`}>
                            <span>{webChange.value.toFixed(2)}%</span>
                            <span className="mt-px">
                                {webIsIncrease ? <ArrowUpRight size={12} strokeWidth={3} className="text-[#62864d]" /> : <ArrowDownRight size={12} strokeWidth={3} className="text-[#f01616]" />}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">{comparisonText}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Website Sessions Tracked</p>
                     <div className="flex-grow mt-4">
                        <div className="bg-gray-50 rounded-lg p-4 flex flex-col h-full">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 flex-grow">
                                {/* MODIFIED: Icons in this card are now black */}
                                <GridItem icon={<Globe size={24} className="text-black" />} label="Number of Sessions" value={latestRecord.web_sessions.toLocaleString()} change={calculateChange(latestRecord.web_sessions, prev.web_sessions)} />
                                <GridItem icon={<UserCircle size={24} className="text-black" />} label="New Users" value={latestRecord.web_new_users.toLocaleString()} change={calculateChange(latestRecord.web_new_users, prev.web_new_users)} />
                                <GridItem icon={<Clock size={24} className="text-black" />} label="Avg Engagement Time" value={`${latestRecord.web_avg_engagement_secs}s`} change={calculateChange(latestRecord.web_avg_engagement_secs, prev.web_avg_engagement_secs)} />
                                <GridItem icon={<TrendingUp size={24} className="text-black" />} label="Bounce Rate" value={`${(latestRecord.web_bounce_rate * 100).toFixed(2)}%`} change={calculateChange(latestRecord.web_bounce_rate, prev.web_bounce_rate)} />
                            </div>
                            <div className="mt-4 pt-4 border-t-2 border-gray-200 w-[95%] mx-auto">
                               <p className="text-xs text-black text-center">Last Updated: {lastUpdatedDate}</p>
                            </div>
                        </div>
                    </div>
                     <p className="text-xs text-black text-center mt-3">
                        If we have access to your Google Analytics, it will be reported here.
                    </p>
                </div>

                {/* --- Email Analytics Card --- */}
                 <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col">
                    <div className="flex justify-between items-center">
                        <h3 className="font-light text-xl text-gray-800">Email Analytics</h3>
                        <MoreVertical className="h-6 w-6 text-gray-400 cursor-pointer" />
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-3xl font-semibold text-gray-900">{`${(latestRecord.email_conversion_rate * 100).toFixed(2)}%`}</p>
                         <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full text-gray-900 ${emailIsIncrease ? 'bg-[#f3fee7]' : 'bg-[#ffe8e8]'}`}>
                            <span>{emailChange.value.toFixed(2)}%</span>
                            <span className="mt-px">
                                {emailIsIncrease ? <ArrowUpRight size={12} strokeWidth={3} className="text-[#62864d]" /> : <ArrowDownRight size={12} strokeWidth={3} className="text-[#f01616]" />}
                            </span>
                        </div>
                        <span className="text-sm text-gray-500">{comparisonText}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Conversion Rate Growth</p>
                    <div className="flex-grow mt-4">
                        <div className="bg-gray-50 rounded-lg p-4 flex flex-col h-full">
                             <div className="grid grid-cols-2 gap-y-4 gap-x-2 flex-grow">
                                {/* MODIFIED: Icons in this card are now black */}
                                <GridItem icon={<Contact2Icon size={24} className="text-black" />} label="Total Contacts" value={latestRecord.email_total_contacts.toLocaleString()} change={calculateChange(latestRecord.email_total_contacts, prev.email_total_contacts)} />
                                <GridItem icon={<MailOpen size={24} className="text-black" />} label="Open Rate" value={`${(latestRecord.email_open_rate * 100).toFixed(2)}%`} change={calculateChange(latestRecord.email_open_rate, prev.email_open_rate)} />
                                <GridItem icon={<MousePointerClick size={24} className="text-black" />} label="Click Rate" value={`${(latestRecord.email_click_rate * 100).toFixed(2)}%`} change={calculateChange(latestRecord.email_click_rate, prev.email_click_rate)} />
                                <GridItem icon={<Repeat2 size={24} className="text-black" />} label="Conversion Rate" value={`${(latestRecord.email_conversion_rate * 100).toFixed(2)}%`} change={calculateChange(latestRecord.email_conversion_rate, prev.email_conversion_rate)} />
                            </div>
                             <div className="mt-4 pt-4 border-t-2 border-gray-200 w-[95%] mx-auto">
                               <p className="text-xs text-black text-center">Last Updated: {lastUpdatedDate}</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-black text-center mt-3">
                        If we manage any of your email marketing, it will be reported here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DetailedAnalytics;