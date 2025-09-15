// Hook for managing invoices data
import { useState, useEffect, useMemo } from 'react';
import { mockClients, mockInvoices, getClientInvoices, type Invoice } from '@/mocks/invoices';

export const useInvoices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const clients = useMemo(() => mockClients, []);
  const allInvoices = useMemo(() => mockInvoices, []);

  const getInvoicesForClient = (clientId: string): Invoice[] => {
    return getClientInvoices(clientId);
  };

  return {
    clients,
    allInvoices,
    isLoading,
    error,
    getInvoicesForClient
  };
};

export const useClientInvoices = (clientId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [clientId]);

  const invoices = useMemo(() => getClientInvoices(clientId), [clientId]);

  return {
    invoices,
    isLoading,
    error
  };
};
