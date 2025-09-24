"use client";

import React, { useState, useMemo } from 'react';
import type { AnalyticsData } from '@/types/analytics';
import analyticsData from '@/data/analyticsData.json';
import AnalyticsHeader from './AnalyticsHeader';
import OverviewMetrics from './OverviewMetrics';
import DetailedAnalytics from './DetailedAnalytics';

const AnalyticsMain = () => {
  const { clients, analytics_records } = analyticsData as AnalyticsData;
  
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.clientId || '');

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

  if (!currentClient || clientRecords.length === 0) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-800">Analytics</h1>
            <p className="text-gray-500 mt-2">Loading client data or no records available.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      <AnalyticsHeader client={currentClient} clients={clients} setSelectedClientId={setSelectedClientId} />
      <OverviewMetrics clientRecords={clientRecords} />
      <DetailedAnalytics client={currentClient} clientRecords={clientRecords} />
    </div>
  );
};

export default AnalyticsMain;