import { useState, useEffect, useCallback } from 'react';
import { getTemplatesByCategory, Template } from '@/mocks/templates';

interface UseTemplatesReturn {
  templates: Template[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  searchTemplates: (query: string) => void;
  filterByCategory: (category: string) => void;
}

export const useTemplates = (): UseTemplatesReturn => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredTemplates = getTemplatesByCategory(activeCategory);
      
      // Apply search filter
      if (searchQuery) {
        filteredTemplates = filteredTemplates.filter(template =>
          template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.createdBy.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setTemplates(filteredTemplates);
    } catch {
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  const refetch = () => {
    fetchTemplates();
  };

  const searchTemplates = (query: string) => {
    setSearchQuery(query);
  };

  const filterByCategory = (category: string) => {
    setActiveCategory(category);
  };

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    refetch,
    searchTemplates,
    filterByCategory
  };
};
