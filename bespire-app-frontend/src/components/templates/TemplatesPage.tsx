// src/components/templates/TemplatesPage.tsx
'use client';

import React from 'react';
import OverviewMetricsTemplates from './OverviewMetricsTemplates';
import TemplatesList from './TemplatesList';
import { useTemplates } from '@/hooks/templates/useTemplates';
import FeaturedTemplatesSection from './FeaturedTemplatesSection';
import ClientTemplatesList from './ClientTemplatesList';

interface TemplatesPageProps {
  isClientView: boolean;
}

const TemplatesPage: React.FC<TemplatesPageProps> = ({ isClientView }) => {
  // Data fetching is now only for the default (non-client) view
  const { loading, error } = useTemplates();

  // Render Client View
  if (isClientView) {
    return (
      <div className="container mx-auto">
        <FeaturedTemplatesSection />
        <ClientTemplatesList />
      </div>
    );
  }

  // Render Default (Admin/Internal) View with proper loading/error handling
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Template Library</h1>
      <OverviewMetricsTemplates />
      <TemplatesList/>
    </div>
  );
};

export default TemplatesPage;