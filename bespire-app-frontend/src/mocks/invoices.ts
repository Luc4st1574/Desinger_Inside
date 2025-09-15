// Mock data for invoices

export interface Client {
  id: string;
  name: string;
  logo: string;
  successManager: {
    id: string;
    name: string;
    avatar: string;
  };
  mainContact: {
    id: string;
    name: string;
    avatar: string;
  };
  contractStart: string;
  contractRenew: string;
  status: 'Active' | 'Inactive' | 'Pending';
  isNew?: boolean;
}

export interface Invoice {
  id: string;
  clientId: string;
  date: string;
  plan: string;
  total: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Draft';
}

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Spherule',
    logo: '🔮',
    successManager: {
      id: '1',
      name: 'Glinda Bren',
      avatar: '/assets/avatars/glinda.jpg'
    },
    mainContact: {
      id: '1',
      name: 'Gerard Santos',
      avatar: '/assets/avatars/gerard.jpg'
    },
    contractStart: 'Mar 10, 2023',
    contractRenew: 'Apr 10, 2025',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Quantum Nexus Solutions',
    logo: '⚛️',
    successManager: {
      id: '1',
      name: 'Glinda Bren',
      avatar: '/assets/avatars/glinda.jpg'
    },
    mainContact: {
      id: '2',
      name: 'Lila Martinez',
      avatar: '/assets/avatars/lila.jpg'
    },
    contractStart: 'Feb 15, 2024',
    contractRenew: 'Apr 15, 2025',
    status: 'Active',
    isNew: true
  },
  {
    id: '3',
    name: 'NeuroWave Technologies',
    logo: '🧠',
    successManager: {
      id: '1',
      name: 'Glinda Bren',
      avatar: '/assets/avatars/glinda.jpg'
    },
    mainContact: {
      id: '3',
      name: 'Liam Carter',
      avatar: '/assets/avatars/liam.jpg'
    },
    contractStart: 'Oct 5, 2024',
    contractRenew: 'Apr 20, 2025',
    status: 'Active'
  },
  {
    id: '4',
    name: 'Aether Dynamics',
    logo: '💨',
    successManager: {
      id: '1',
      name: 'Glinda Bren',
      avatar: '/assets/avatars/glinda.jpg'
    },
    mainContact: {
      id: '4',
      name: 'Sofia Ramirez',
      avatar: '/assets/avatars/sofia.jpg'
    },
    contractStart: 'Jan 20, 2024',
    contractRenew: 'Apr 25, 2025',
    status: 'Active'
  },
  {
    id: '5',
    name: 'Cortex Innovations',
    logo: '🔴',
    successManager: {
      id: '1',
      name: 'Glinda Bren',
      avatar: '/assets/avatars/glinda.jpg'
    },
    mainContact: {
      id: '5',
      name: 'Noah Bennett',
      avatar: '/assets/avatars/noah.jpg'
    },
    contractStart: 'Apr 30, 2024',
    contractRenew: 'Apr 30, 2025',
    status: 'Active'
  }
];

export const mockInvoices: Invoice[] = [
  // Spherule invoices
  {
    id: 'inv-001',
    clientId: '1',
    date: 'Dec 19, 2024',
    plan: 'Pro',
    total: 3495,
    status: 'Paid'
  },
  {
    id: 'inv-002',
    clientId: '1',
    date: 'Nov 19, 2024',
    plan: 'Pro',
    total: 3495,
    status: 'Paid'
  },
  {
    id: 'inv-003',
    clientId: '1',
    date: 'Oct 19, 2024',
    plan: 'Pro',
    total: 3495,
    status: 'Paid'
  },
  {
    id: 'inv-004',
    clientId: '1',
    date: 'Sep 19, 2024',
    plan: 'Pro',
    total: 3495,
    status: 'Paid'
  },
  {
    id: 'inv-005',
    clientId: '1',
    date: 'Aug 19, 2024',
    plan: 'Pro',
    total: 3495,
    status: 'Paid'
  },
  // Quantum Nexus Solutions invoices
  {
    id: 'inv-006',
    clientId: '2',
    date: 'Dec 15, 2024',
    plan: 'Enterprise',
    total: 7995,
    status: 'Paid'
  },
  {
    id: 'inv-007',
    clientId: '2',
    date: 'Nov 15, 2024',
    plan: 'Enterprise',
    total: 7995,
    status: 'Paid'
  },
  {
    id: 'inv-008',
    clientId: '2',
    date: 'Oct 15, 2024',
    plan: 'Enterprise',
    total: 7995,
    status: 'Pending'
  },
  // NeuroWave Technologies invoices
  {
    id: 'inv-009',
    clientId: '3',
    date: 'Dec 05, 2024',
    plan: 'Growth',
    total: 1995,
    status: 'Paid'
  },
  {
    id: 'inv-010',
    clientId: '3',
    date: 'Nov 05, 2024',
    plan: 'Growth',
    total: 1995,
    status: 'Paid'
  },
  {
    id: 'inv-011',
    clientId: '3',
    date: 'Oct 05, 2024',
    plan: 'Growth',
    total: 1995,
    status: 'Overdue'
  },
  // Aether Dynamics invoices
  {
    id: 'inv-012',
    clientId: '4',
    date: 'Dec 20, 2024',
    plan: 'Pro',
    total: 3495,
    status: 'Paid'
  },
  {
    id: 'inv-013',
    clientId: '4',
    date: 'Nov 20, 2024',
    plan: 'Pro',
    total: 3495,
    status: 'Paid'
  },
  // Cortex Innovations invoices
  {
    id: 'inv-014',
    clientId: '5',
    date: 'Dec 30, 2024',
    plan: 'Starter',
    total: 995,
    status: 'Draft'
  },
  {
    id: 'inv-015',
    clientId: '5',
    date: 'Nov 30, 2024',
    plan: 'Starter',
    total: 995,
    status: 'Paid'
  }
];

// Helper functions
export const getClientInvoices = (clientId: string): Invoice[] => {
  return mockInvoices.filter(invoice => invoice.clientId === clientId);
};

export const getClientById = (clientId: string): Client | undefined => {
  return mockClients.find(client => client.id === clientId);
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString()}`;
};
