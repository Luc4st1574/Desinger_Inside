'use client';

import React from 'react';
import { useTemplates } from '@/hooks/templates/useTemplates';
import {
  NotebookTabs,
} from 'lucide-react';

// Import SVGs as default exports
import General from "@/assets/icons/general_templates.svg";
import Branding from "@/assets/icons/branding_templates.svg";
import Calendar from "@/assets/icons/calendar_templates.svg";
import Marketing from "@/assets/icons/marketing_templates.svg";
import UIUX from "@/assets/icons/uiux_templates.svg";

const templateVisuals = {
  'General Templates': { icon: General, bgColor: '#ffbebe' },
  'Branding Templates': { icon: Branding, bgColor: '#fedaa0' },
  'Calendar Templates': { icon: Calendar, bgColor: '#e0e5da' },
  'Marketing Templates': { icon: Marketing, bgColor: '#ebf1ff' },
  'UI/UX Templates': { icon: UIUX, bgColor: '#defcbd' },
  default: { icon: NotebookTabs, bgColor: '#f3f4f6' },
};

const FeaturedTemplatesSection = () => {
  const { templates, loading, error } = useTemplates();

  if (loading || error || !templates) {
    return null;
  }

  const getFeaturedTemplates = () => {
    const featured = [];
    const typesToShow = [
      'General Templates',
      'Branding Templates',
      'Calendar Templates',
      'Marketing Templates',
      'UI/UX Templates',
    ];

    typesToShow.forEach(type => {
      const template = templates.find(t => t.type === type);
      if (template) {
        featured.push(template);
      }
    });

    return featured.slice(0, 5);
  };

  const featuredTemplates = getFeaturedTemplates();

  return (
    <section>
      <h2 className="text-xl font-light mb-2">Featured Templates</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {featuredTemplates.map((template) => {
          const visual = templateVisuals[template.type] || templateVisuals.default;
          const IconComponent = visual.icon;
          return (
            <div
              key={template.id}
              className="flex flex-col items-center justify-start p-4 rounded-lg cursor-pointer group"
            >
              <div
                className="w-24 h-24 rounded-lg flex items-center justify-center p-4 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: visual.bgColor }}
              >
                <IconComponent className="justify-center" />
              </div>
              <p className="text-sm font-medium text-gray-800 mt-4 text-center">{template.title}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedTemplatesSection;