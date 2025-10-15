// components/sales/SalesMain.tsx
"use client";

import React, { useState } from 'react';
import ProspectsBoard from './ProspectsBoard';
import SalesDetailsModal from '@/components/modals/SalesDetails/SalesDetailsModal';

// Define the Prospect type here so we can use it for our state
type Prospect = {
    id: number;
    title: string;
    logo: string;
    since: string;
    value: number;
    stage: 'Prospecting' | 'Meeting' | 'Proposal' | 'Deal' | 'Lost';
    targetPlan: string;
    priority: 'High' | 'Medium' | 'Low';
    industry: string;
    bgColor?: string;
    assigned: { name: string; avatar?: string; }[];
    followUps?: unknown[];
    comments?: unknown[];
    term: number;
    files?: unknown[];
};

export default function SalesMain() {
    // State to manage which prospect is currently selected
    const [selectedProspectId, setSelectedProspectId] = useState<number | null>(null);

    // This function is triggered by the ProspectsBoard when a card is clicked
    const handleSetProspect = (prospect: Prospect) => {
        setSelectedProspectId(prospect.id);
    };

    // This function closes the modal
    const handleCloseModal = () => {
        setSelectedProspectId(null);
    };

    return (
        <>
            <ProspectsBoard onSetProspect={handleSetProspect} />

            <SalesDetailsModal
                open={!!selectedProspectId}
                onClose={handleCloseModal}
                prospectId={selectedProspectId}
            />
        </>
    );
}