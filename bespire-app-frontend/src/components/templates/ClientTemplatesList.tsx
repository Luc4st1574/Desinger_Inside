'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTemplates } from '@/hooks/templates/useTemplates';
import { Template } from '@/mocks/templates';
import { FileText, Search } from 'lucide-react';

const categoryTagColors: Record<string, string> = {
  'Branding Templates': 'bg-[#defcbd] text-800',
  'Marketing Templates': 'bg-[#f3fee7] text-800',
  'General Templates': 'bg-blue-100 text-grey-800',
  'UI/UX Templates': 'bg-purple-100 text-800',
  'Calendar Templates': 'bg-yellow-100 text-800',
};

// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // State to track if the user has clicked '...'
  const [isExpanded, setIsExpanded] = useState(false);

  if (totalPages <= 1) return null;

  const getPageButtons = () => {
    const pages = [];
    const maxVisibleInitial = 4; // How many page numbers to show before the '...'
    const DOTS = '...';

    // If expanded or not enough pages to hide, show all pages.
    if (isExpanded || totalPages <= maxVisibleInitial) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Otherwise, show the first few pages and '...'
      for (let i = 1; i <= maxVisibleInitial; i++) {
        pages.push(i);
      }
      pages.push(DOTS);
      // The last page number is now hidden behind the DOTS until clicked.
    }
    return pages;
  };

  const pageItems = getPageButtons();
  
  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {pageItems.map((page, index) => {
        const isSelected = page === currentPage;
        
        // If the item is the ellipsis '...'
        if (typeof page === 'string') {
          return (
            <button
              key={`ellipsis-${index}`}
              onClick={() => setIsExpanded(true)} // Click to expand
              className="w-10 h-10 flex items-center justify-center rounded-full font-medium bg-gray-200 text-black transition-colors hover:bg-gray-300"
            >
              ...
            </button>
          );
        }

        // Otherwise, it's a regular page number button
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-full font-medium text-sm transition-colors
              ${isSelected
                ? 'bg-[#697d67] text-white'
                : 'bg-transparent border border-[#697d67] text-[#697d67] hover:bg-gray-100'
              }`}
          >
            {page}
          </button>
        );
      })}
      
      {/* Next Button */}
      <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-5 py-2 flex items-center justify-center rounded-full font-medium text-sm bg-[#697d67] text-white transition-colors hover:bg-opacity-90 disabled:opacity-50"
          disabled={currentPage === totalPages}
      >
          Next
      </button>
    </div>
  );
};


const ClientTemplatesList: React.FC = () => {
  const { templates, loading, error, searchTemplates } = useTemplates();
  const [activeCategory, setActiveCategory] = useState<string>('All Templates');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 5;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    searchTemplates(e.target.value);
  };

  const categories = useMemo(() => {
    if (!templates) return ['All Templates'];
    const types = new Set(templates.map(t => t.type));
    return ['All Templates', ...Array.from(types)];
  }, [templates]);
  
  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    if (activeCategory === 'All Templates') {
      return templates;
    }
    return templates.filter(template => template.type === activeCategory);
  }, [templates, activeCategory]);

  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const paginatedTemplates = useMemo(() => {
    const startIndex = (currentPage - 1) * templatesPerPage;
    return filteredTemplates.slice(startIndex, startIndex + templatesPerPage);
  }, [filteredTemplates, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchTerm]);


  if (loading) return <div>Loading templates...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section>
      <div className="border-b border-gray-200 mb-2">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 -mb-px overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                className={`py-2 px-3 text-sm font-medium whitespace-nowrap border-b-2 ${
                  activeCategory === category
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search Templates"
              className="pl-4 pr-9 py-2 bg-transparent focus:outline-none text-right text-[#5e6b66] placeholder:text-[#5e6b66]"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>
      
      <div>
        {paginatedTemplates.length === 0 ? (
          <p className="p-4 text-center text-gray-500">
            {templates.length > 0 ? "No templates found on this page." : "No templates found for your search."}
          </p>
        ) : (
          <div>
            {paginatedTemplates.map((template: Template) => (
              <div key={template.id} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                <div className="flex items-center space-x-3 w-[300px]">
                  <FileText className="h-5 w-5 text-[#697d67]" />
                  <span className="font-medium text-gray-800 truncate">{template.title}</span>
                </div>
                <div className="flex-grow flex justify-start pl-4">
                  <span className={`inline-flex px-3 py-0.5 rounded-full text-xs font-semibold ${categoryTagColors[template.type] || 'bg-gray-100 text-gray-600'}`}>
                    {template.type.replace(' Templates', '')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default ClientTemplatesList;