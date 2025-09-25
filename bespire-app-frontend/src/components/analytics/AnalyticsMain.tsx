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
            .sort((a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime());

        return { currentClient: client, clientRecords: records };
    }, [selectedClientId, clients, analytics_records]);
    
    const handleAddData = (newData: Partial<AnalyticsRecord>, clientId: string) => {
        const baseRecord: Omit<AnalyticsRecord, 'recordId' | 'clientId' | 'date'> = {
            social_fb_likes: null,
            social_twitter_followers: null,
            social_linkedin_followers: null,
            social_instagram_followers: null,
            social_tiktok_followers: null,
            seo_organic_traffic: null,
            seo_referring_domains: null,
            seo_backlinks: null,
            seo_organic_keywords: null,
            web_sessions: null,
            web_new_users: null,
            web_avg_engagement_secs: null,
            web_bounce_rate: null,
            email_total_contacts: null,
            email_open_rate: null,
            email_click_rate: null,
            email_conversion_rate: null,
        };

        const processedData: Partial<AnalyticsRecord> = {};
        (Object.keys(newData) as Array<keyof Partial<AnalyticsRecord>>).forEach(key => {
            const value = newData[key];

            if (key === 'recordId' || key === 'clientId' || key === 'date') {
                // --- FIX APPLIED HERE ---
                // Changed `as string | null` to `as string` to match the property's expected type (`string | undefined`).
                processedData[key] = value as string;
                return;
            }

            if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) {
                processedData[key] = Number(value);
            } else if (typeof value === 'number' && isFinite(value)) {
                processedData[key] = value;
            } else {
                processedData[key] = null;
            }
        });
        
        const newRecord: AnalyticsRecord = {
            ...baseRecord,
            ...processedData,
            recordId: `rec_${Date.now()}`,
            clientId: clientId,
            date: newData.date || new Date().toISOString(),
        };
        
        setLocalAnalyticsData(prevData => ({
            ...prevData,
            analytics_records: [...prevData.analytics_records, newRecord],
        }));
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