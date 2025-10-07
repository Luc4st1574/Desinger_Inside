"use client";
import React from 'react';
import { ArrowRight } from 'lucide-react';

// Import your SVG icons as React components
import Focus7Icon from '@/assets/icons/focus7.svg';
import LoadingIcon from '@/assets/icons/circle dot.svg';
import BillingIcon from '@/assets/icons/icon_billing.svg';
import ResourcesIcon from '@/assets/icons/forms_geometric.svg';

export default function DashboardResources() {
  const iconColor = "#697d67";

  return (
    <section className="pt-6 mb-6">
      <h2 className="text-lg font-light text-black mb-6 flex items-center gap-2">
        Resources & Tutorials <ArrowRight className="h-6 w-6" />
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Create Order */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition cursor-pointer">
          <Focus7Icon 
            className="h-7 w-7 mb-3" 
            style={{ color: iconColor }} 
            strokeWidth={1.5} 
          />
          <h3 className="font-light text-black">How to create your first order</h3>
        </div>

        {/* Card 2: Add Users */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition cursor-pointer">
          <LoadingIcon 
            className="h-7 w-7 mb-3" 
            style={{ color: iconColor }} 
            strokeWidth={1.5} 
          />
          <h3 className="font-light text-black">How to add new users</h3>
        </div>

        {/* Card 3: Manage Billing */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition cursor-pointer">
          <BillingIcon 
            className="h-7 w-7 mb-3" 
            style={{ color: iconColor }} 
            strokeWidth={1.5} 
          />
          <h3 className="font-light text-black">How to manage your billing</h3>
        </div>

        {/* Card 4: Manage Brands */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition cursor-pointer">
          <ResourcesIcon 
            className="h-7 w-7 mb-3" 
            style={{ color: iconColor }} 
            strokeWidth={1.5} 
          />
          <h3 className="font-light text-black">How to manage your brands</h3>
        </div>

      </div>
    </section>
  );
}