'use client';

import React from 'react';
import OverviewMetricsTemplates from './OverviewMetricsTemplates';
import TemplatesList from './TemplatesList';
import { useTemplates } from '@/hooks/templates/useTemplates';
import FeaturedTemplatesSection from './FeaturedTemplatesSection';
import ClientTemplatesList from './ClientTemplatesList';

// Props: isClientView determines which view to render
interface TemplatesPageProps {
  isClientView?: boolean;
  isSalesManager?: boolean;
  isTeamMember?: boolean;
}

const TemplatesPage: React.FC<TemplatesPageProps> = ({ isClientView, isSalesManager, isTeamMember }) => {
  const { loading, error } = useTemplates();

  // Render Client View
  if (isClientView || isSalesManager || isTeamMember) {
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