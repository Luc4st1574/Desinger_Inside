export interface Discount {
  id: string;
  code: string;
  type: "Percentage" | "Fixed Amount";
  status: "Active" | "Inactive" | "Expired" | "Draft";
  amount: string;
  usageLimit: string;
  assignedTo: string;
  createdBy: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  expirationDate: string | null;
  createdOn: string;
  appliesTo?: string;
  startDate?: string;
  limitPerCustomer?: number;
  totalLimit?: number;
  notes?: string;
  smartInsights?: {
    commonUsageTimeframe?: string;
    renewalAfterDiscount?: string;
    marketingCodeRedemptions?: string;
  };
  usageTracking?: {
    used: number;
    total: number;
    usageDetails?: Array<{
      clientName: string;
      plan: string;
      discountedPrice: string;
      dateRedeemed: string;
    }>;
  };
}

export const mockDiscounts: Discount[] = [
  {
    id: "1",
    code: "LAUNCH25",
    type: "Percentage",
    status: "Active",
    amount: "25% off",
    usageLimit: "24/100",
    assignedTo: "All Clients",
    createdBy: {
      id: "1",
      name: "Lila Hart",
      role: "Admin",
      avatar: "/assets/avatars/michelle.svg"
    },
    expirationDate: "Apr 25, 2025",
    createdOn: "Jan 15, 2025",
    appliesTo: "All Plans",
    startDate: "Jan 15, 2025",
    limitPerCustomer: 1,
    totalLimit: 100,
    notes: "Intended for all subscribers. Retarget via remarketing list on expiration.",
    smartInsights: {
      commonUsageTimeframe: "12PM-3PM",
      renewalAfterDiscount: "72% kept their subscription",
      marketingCodeRedemptions: "12 this week"
    },
    usageTracking: {
      used: 24,
      total: 100,
      usageDetails: [
        {
          clientName: "Orion Studio",
          plan: "Growth Plan",
          discountedPrice: "$521.25",
          dateRedeemed: "Feb 22, 2025, 11:30AM"
        },
        {
          clientName: "Nebula Forge",
          plan: "Starter Plan",
          discountedPrice: "$521.25",
          dateRedeemed: "Mar 3, 2025, 2:15PM"
        },
        {
          clientName: "Galactic Hub",
          plan: "Growth Plan",
          discountedPrice: "$2621.25",
          dateRedeemed: "Apr 1, 2025, 4:00PM"
        }
      ]
    }
  },
  {
    id: "2",
    code: "APRIL50",
    type: "Fixed Amount",
    status: "Expired",
    amount: "$50 off",
    usageLimit: "30/30",
    assignedTo: "Ethan Corp.",
    createdBy: {
      id: "2",
      name: "Liam Parker",
      role: "Product Manager",
      avatar: "/assets/avatars/bernard.svg"
    },
    expirationDate: "Jun 15, 2025",
    createdOn: "Feb 20, 2025",
    appliesTo: "Growth Plan",
    startDate: "Feb 20, 2025",
    limitPerCustomer: 1,
    totalLimit: 30
  },
  {
    id: "3",
    code: "STARTUP30",
    type: "Percentage",
    status: "Active",
    amount: "30% off",
    usageLimit: "24/100",
    assignedTo: "All Clients",
    createdBy: {
      id: "1",
      name: "Lila Hart",
      role: "Admin",
      avatar: "/assets/avatars/glinda.svg"
    },
    expirationDate: "May 10, 2025",
    createdOn: "Mar 05, 2025",
    appliesTo: "All Plans",
    startDate: "Mar 05, 2025",
    limitPerCustomer: 1,
    totalLimit: 100
  },
  {
    id: "4",
    code: "CODE15",
    type: "Percentage",
    status: "Draft",
    amount: "15% off",
    usageLimit: "15/50",
    assignedTo: "New Clients",
    createdBy: {
      id: "3",
      name: "Avery Hayes",
      role: "Marketing Specialist",
      avatar: "/assets/avatars/avatar3.svg"
    },
    expirationDate: null,
    createdOn: "Feb 28, 2025",
    appliesTo: "Starter Plan",
    startDate: "Feb 28, 2025",
    limitPerCustomer: 1,
    totalLimit: 50
  },
  {
    id: "5",
    code: "DEAL25",
    type: "Fixed Amount",
    status: "Expired",
    amount: "$25 off",
    usageLimit: "20/20",
    assignedTo: "Spherule Inc.",
    createdBy: {
      id: "2",
      name: "Liam Parker",
      role: "Product Manager",
      avatar: "/assets/avatars/avatar1.svg"
    },
    expirationDate: "May 20, 2025",
    createdOn: "Mar 12, 2025",
    appliesTo: "Growth Plan",
    startDate: "Mar 12, 2025",
    limitPerCustomer: 1,
    totalLimit: 20
  },
  {
    id: "6",
    code: "OFFER35",
    type: "Percentage",
    status: "Inactive",
    amount: "35% off",
    usageLimit: "22/80",
    assignedTo: "All Clients",
    createdBy: {
      id: "1",
      name: "Lila Hart",
      role: "Admin",
      avatar: "/assets/avatars/avatar4.svg"
    },
    expirationDate: "Jun 30, 2025",
    createdOn: "Jan 30, 2025",
    appliesTo: "All Plans",
    startDate: "Jan 30, 2025",
    limitPerCustomer: 1,
    totalLimit: 80
  },
  {
    id: "7",
    code: "PROMO45",
    type: "Percentage",
    status: "Active",
    amount: "45% off",
    usageLimit: "10/40",
    assignedTo: "Camille P.",
    createdBy: {
      id: "3",
      name: "Avery Hayes",
      role: "Marketing Specialist",
      avatar: "/assets/avatars/avatar3.svg"
    },
    expirationDate: "Apr 22, 2025",
    createdOn: "Apr 01, 2025",
    appliesTo: "Premium Plan",
    startDate: "Apr 01, 2025",
    limitPerCustomer: 1,
    totalLimit: 40
  },
  {
    id: "8",
    code: "SAVE55",
    type: "Fixed Amount",
    status: "Expired",
    amount: "$55 off",
    usageLimit: "25/25",
    assignedTo: "M. Tanaka",
    createdBy: {
      id: "2",
      name: "Liam Parker",
      role: "Product Manager",
      avatar: "/assets/avatars/avatar1.svg"
    },
    expirationDate: "May 15, 2025",
    createdOn: "Feb 14, 2025",
    appliesTo: "Enterprise Plan",
    startDate: "Feb 14, 2025",
    limitPerCustomer: 1,
    totalLimit: 25
  },
  {
    id: "9",
    code: "DISCOUNT50",
    type: "Percentage",
    status: "Active",
    amount: "50% off",
    usageLimit: "5/60",
    assignedTo: "All Clients",
    createdBy: {
      id: "3",
      name: "Avery Hayes",
      role: "Marketing Specialist",
      avatar: "/assets/avatars/avatar3.svg"
    },
    expirationDate: "Jul 10, 2025",
    createdOn: "Mar 22, 2025",
    appliesTo: "All Plans",
    startDate: "Mar 22, 2025",
    limitPerCustomer: 1,
    totalLimit: 60
  },
  {
    id: "10",
    code: "SUPERDEAL40",
    type: "Fixed Amount",
    status: "Inactive",
    amount: "$40 off",
    usageLimit: "12/50",
    assignedTo: "New Clients",
    createdBy: {
      id: "1",
      name: "Lila Hart",
      role: "Admin",
      avatar: "/assets/avatars/avatar4.svg"
    },
    expirationDate: "Aug 15, 2025",
    createdOn: "Jun 10, 2025",
    appliesTo: "Growth Plan",
    startDate: "Jun 10, 2025",
    limitPerCustomer: 1,
    totalLimit: 50
  }
];
