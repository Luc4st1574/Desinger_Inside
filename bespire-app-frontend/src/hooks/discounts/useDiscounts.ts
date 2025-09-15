import { useState, useEffect } from 'react';
import { Discount, mockDiscounts } from '@/mocks/discounts';

export interface UseDiscountsReturn {
  discounts: Discount[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createDiscount: (discount: Omit<Discount, 'id' | 'createdOn'>) => Promise<void>;
  updateDiscount: (id: string, discount: Partial<Discount>) => Promise<void>;
  deleteDiscount: (id: string) => Promise<void>;
}

export const useDiscounts = (): UseDiscountsReturn => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDiscounts(mockDiscounts);
    } catch {
      setError('Failed to fetch discounts');
    } finally {
      setLoading(false);
    }
  };

  const createDiscount = async (discountData: Omit<Discount, 'id' | 'createdOn'>) => {
    try {
      setLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newDiscount: Discount = {
        ...discountData,
        id: (discounts.length + 1).toString(),
        createdOn: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      };
      
      setDiscounts(prev => [newDiscount, ...prev]);
    } catch (err) {
      setError('Failed to create discount');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDiscount = async (id: string, discountData: Partial<Discount>) => {
    try {
      setLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDiscounts(prev => 
        prev.map(discount => 
          discount.id === id ? { ...discount, ...discountData } : discount
        )
      );
    } catch (err) {
      setError('Failed to update discount');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDiscount = async (id: string) => {
    try {
      setLoading(true);
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDiscounts(prev => prev.filter(discount => discount.id !== id));
    } catch (err) {
      setError('Failed to delete discount');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchDiscounts();
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return {
    discounts,
    loading,
    error,
    refetch,
    createDiscount,
    updateDiscount,
    deleteDiscount
  };
};
