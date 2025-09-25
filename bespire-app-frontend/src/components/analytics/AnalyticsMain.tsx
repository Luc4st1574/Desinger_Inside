/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from 'react';
import type { AnalyticsData, AnalyticsRecord } from '@/types/analytics';
import analyticsData from '@/data/analyticsData.json';
import AnalyticsHeader from './AnalyticsHeader';
import OverviewMetrics from './OverviewMetrics';
import DetailedAnalytics from './DetailedAnalytics';
import AddDataModal from '../modals/AddDataModal';

const AnalyticsMain = () => {
    const [localAnalyticsData, setLocalAnalyticsData] = useState<AnalyticsData>(analyticsData as AnalyticsData);
    const { clients, analytics_records } = localAnalyticsData;

    const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.clientId || '');
    const [isAddDataModalOpen, setIsAddDataModalOpen] = useState(false);

    const { currentClient, clientRecords } = useMemo(() => {
        const client = clients.find(c => c.clientId === selectedClientId);
        if (!client) {
            return { currentClient: null, clientRecords: [] };
        }

        const records = analytics_records
            .filter(r => r.clientId === selectedClientId)
            .sort((a, b) => {
                if (!a.date) return 1;
                if (!b.date) return -1;
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            });

        return { currentClient: client, clientRecords: records };
    }, [selectedClientId, clients, analytics_records]);
 
    const handleAddData = (newData: Partial<AnalyticsRecord>, clientId: string) => {
        if (!newData.date) return;

        const newDate = new Date(newData.date);
        const year = newDate.getUTCFullYear();
        const month = newDate.getUTCMonth();
        
        setLocalAnalyticsData(prevData => {
            const newRecords = [...prevData.analytics_records];
            const recordIndex = newRecords.findIndex(r => {
                if (!r.date || r.clientId !== clientId) return false;
                const existingDate = new Date(r.date);
                return existingDate.getUTCFullYear() === year && existingDate.getUTCMonth() === month;
            });

            if (recordIndex > -1) {
                const existingRecord = { ...newRecords[recordIndex] };
                
                const summableKeys: (keyof AnalyticsRecord)[] = [
                    'social_fb_likes', 'social_twitter_followers', 'social_linkedin_followers',
                    'social_instagram_followers', 'social_tiktok_followers', 'seo_organic_traffic',
                    'seo_referring_domains', 'seo_backlinks', 'seo_organic_keywords',
                    'web_sessions', 'web_new_users', 'email_open_rate', 'email_click_rate',
                    'email_conversion_rate'
                ];

                for (const key in newData) {
                    const typedKey = key as keyof AnalyticsRecord;
                    const value = newData[typedKey];
                    
                    if (value !== null && value !== undefined && typeof value === 'number') {
                        if (summableKeys.includes(typedKey)) {
                            (existingRecord as any)[typedKey] = ((existingRecord[typedKey] as number | null) ?? 0) + value;
                        } else {
                            (existingRecord as any)[typedKey] = value;
                        }
                    }
                }
                newRecords[recordIndex] = existingRecord;
            } else {
                const baseRecord: AnalyticsRecord = {
                    recordId: `rec_${Date.now()}`,
                    clientId: clientId,
                    date: new Date(Date.UTC(year, month, 1)).toISOString(),
                    social_fb_likes: 0, social_twitter_followers: 0, social_linkedin_followers: 0,
                    social_instagram_followers: 0, social_tiktok_followers: 0, seo_organic_traffic: 0,
                    seo_referring_domains: 0, seo_backlinks: 0, seo_organic_keywords: 0,
                    web_sessions: 0, web_new_users: 0, web_avg_engagement_secs: 0,
                    web_bounce_rate: 0, email_total_contacts: 0, email_open_rate: 0,
                    email_click_rate: 0, email_conversion_rate: 0,
                };
                
                const newRecord = { ...baseRecord, ...newData };
                newRecords.push(newRecord);
            }
            
            return { ...prevData, analytics_records: newRecords };
        });
    };

    if (!currentClient) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-800">Analytics</h1>
                <p className="text-gray-500 mt-2">Loading client data...</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8 p-1">
                <AnalyticsHeader 
                    client={currentClient} 
                    clients={clients} 
                    setSelectedClientId={setSelectedClientId}
                    onAddDataClick={() => setIsAddDataModalOpen(true)}
                />
                {clientRecords.length > 0 ? (
                    <>
                        <OverviewMetrics clientRecords={clientRecords} />
                        <DetailedAnalytics client={currentClient} clientRecords={clientRecords} />
                    </>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>No analytics records available for this client.</p>
                    </div>
                )}
            </div>

            <AddDataModal
                isOpen={isAddDataModalOpen}
                onClose={() => setIsAddDataModalOpen(false)}
                onAddData={handleAddData}
                clients={clients}
                initialClientId={selectedClientId}
            />
        </>
    );
};

export default AnalyticsMain;