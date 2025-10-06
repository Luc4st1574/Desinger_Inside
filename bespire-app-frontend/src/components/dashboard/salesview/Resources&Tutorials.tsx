"use client";
import React from 'react';
import { ArrowRight } from 'lucide-react';
import FlagGolf from '@/assets/icons/flag_golf.svg';
import FolderClosed from '@/assets/icons/closed_folder.svg';
import CroppedCircle from '@/assets/icons/cropped_circle.svg';
import FormsGeometric from '@/assets/icons/forms_geometric.svg';

export default function ResourcesAndTutorials() {
    const iconColor = "#697d67";

    return (
        <div className="pt-6">
            <h2 className="text-2xl font-light text-black mb-6 flex items-center gap-2">
                Resources & Tutorials <ArrowRight className="h-6 w-6" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* UPDATED: Changed p-6 to p-4 to reduce height */}
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <FlagGolf className="h-7 w-7 mb-3" style={{ color: iconColor }} strokeWidth={1.5}/>
                    <h3 className="font-light text-black">How to Qualify <br/> Leads Efficiently</h3>
                </div>

                {/* UPDATED: Changed p-6 to p-4 to reduce height */}
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <FolderClosed className="h-7 w-7 mb-3" style={{ color: iconColor }} strokeWidth={1.5} />
                    <h3 className="font-light text-black">How to Organize <br/> Contracts and Files</h3>
                </div>

                {/* UPDATED: Changed p-6 to p-4 to reduce height */}
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <CroppedCircle className="h-7 w-7 mb-3" style={{ color: iconColor }} strokeWidth={1.5}/>
                    <h3 className="font-light text-black">How to Track <br/> Proposal Status</h3>
                </div>

                {/* UPDATED: Changed p-6 to p-4 to reduce height */}
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <FormsGeometric className="h-7 w-7 mb-3" style={{ color: iconColor }} strokeWidth={1.5}/>
                    <h3 className="font-light text-black">How to Analyze <br/> your Conversion</h3>
                </div>

            </div>
        </div>
    );
}