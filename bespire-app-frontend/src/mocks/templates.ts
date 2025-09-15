// Mock data for template metrics
export const templateMetrics = {
  day: {
    templatesUsed: { value: 12, change: 8.5, trend: "up" as const },
    newTemplatesAdded: { value: 2, change: -15.2, trend: "down" as const },
    mostUsedTemplate: { name: "Case Study Deck", usage: 5 },
    activeTemplates: { value: 8, change: 12.3, trend: "up" as const }
  },
  week: {
    templatesUsed: { value: 78, change: 5.27, trend: "up" as const },
    newTemplatesAdded: { value: 6, change: 8.35, trend: "down" as const },
    mostUsedTemplate: { name: "Case Study Deck", usage: 27 },
    activeTemplates: { value: 36, change: 8.35, trend: "down" as const }
  },
  month: {
    templatesUsed: { value: 324, change: 12.8, trend: "up" as const },
    newTemplatesAdded: { value: 18, change: 22.1, trend: "up" as const },
    mostUsedTemplate: { name: "Brand Strategy Deck", usage: 89 },
    activeTemplates: { value: 142, change: 15.7, trend: "up" as const }
  },
  year: {
    templatesUsed: { value: 2847, change: 18.9, trend: "up" as const },
    newTemplatesAdded: { value: 186, change: 28.4, trend: "up" as const },
    mostUsedTemplate: { name: "Pitch Deck - V2", usage: 456 },
    activeTemplates: { value: 1234, change: 24.6, trend: "up" as const }
  }
};

// Mock data for chart in updates card
export const templateUpdatesChart = [
  { label: "Active", value: 6, color: "bg-pale-green-700" },
  { label: "Draft", value: 4, color: "bg-green-gray-500" },
  { label: "Expired", value: 12, color: "bg-red-red-500" },
  { label: "Inactive", value: 5, color: "bg-red-red-100" }
];

// Template types
export type TemplateType = 'General Templates' | 'Branding Templates' | 'Marketing Templates' | 'UI/UX Templates';
export type TemplateStatus = 'Active' | 'Draft' | 'Expired' | 'Inactive';
export type TemplateVisibility = 'Public' | 'Team Only' | 'Custom';

export interface TemplateFile {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  type: string;
  size: string;
}

export interface Template {
  id: string;
  title: string;
  type: TemplateType;
  status: TemplateStatus;
  timesUsed: number;
  visibility: TemplateVisibility;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  createdOn: string;
  lastUpdated: string;
  description?: string;
  smartInsights?: string[];
  files: TemplateFile[];
}

// Mock templates data
export const mockTemplates: Template[] = [
  {
    id: "1",
    title: "Startup Brief",
    type: "General Templates",
    status: "Active",
    timesUsed: 86,
    visibility: "Team Only",
    createdBy: {
      id: "1",
      name: "Lila Hart",
      avatar: "/assets/avatars/avatar1.svg",
      role: "Admin"
    },
    createdOn: "Jan 15, 2025",
    lastUpdated: "Mar 15, 2025",
    description: "A comprehensive startup brief template for initial project documentation and planning phases.",
    smartInsights: [
      "Most opened general template this month.",
      "Referenced by 8 active teams recently.", 
      "Updated after client feedback in February."
    ],
    files: [
      {
        id: "f1",
        name: "Startup Brief.docx",
        url: "/files/startup-brief.docx",
        uploadedBy: "Gerard",
        uploadedAt: "Apr 11, 2025",
        type: "docx",
        size: "2.4 MB"
      }
    ]
  },
  {
    id: "2",
    title: "Brand Strategy Deck",
    type: "Branding Templates",
    status: "Expired",
    timesUsed: 60,
    visibility: "Public",
    createdBy: {
      id: "2",
      name: "Liam Parker",
      avatar: "/assets/avatars/avatar2.svg",
      role: "Product Manager"
    },
    createdOn: "Feb 20, 2025",
    lastUpdated: "Apr 05, 2025",
    description: "Strategic branding template for developing comprehensive brand guidelines and positioning.",
    smartInsights: [
      "Most used branding template this quarter.",
      "Featured in 12 successful brand launches.",
      "Requires update based on new brand standards."
    ],
    files: [
      {
        id: "f2",
        name: "Brand Strategy Deck.pptx",
        url: "/files/brand-strategy.pptx",
        uploadedBy: "Liam Parker",
        uploadedAt: "Feb 20, 2025",
        type: "pptx",
        size: "5.8 MB"
      }
    ]
  },
  {
    id: "3",
    title: "Pitch Deck – V2",
    type: "General Templates",
    status: "Active",
    timesUsed: 25,
    visibility: "Custom",
    createdBy: {
      id: "1",
      name: "Lila Hart",
      avatar: "/assets/avatars/avatar3.svg",
      role: "Admin"
    },
    createdOn: "Mar 05, 2025",
    lastUpdated: "Mar 20, 2025",
    description: "Updated pitch deck template with modern design and improved content structure.",
    smartInsights: [
      "Improved conversion rate by 24% compared to V1.",
      "Used in 15 successful funding presentations.",
      "Highly rated by startup accelerator partners."
    ],
    files: [
      {
        id: "f3",
        name: "Pitch Deck V2.pptx",
        url: "/files/pitch-deck-v2.pptx",
        uploadedBy: "Lila Hart",
        uploadedAt: "Mar 05, 2025",
        type: "pptx",
        size: "7.2 MB"
      }
    ]
  },
  {
    id: "4",
    title: "Instagram Carousel",
    type: "Marketing Templates",
    status: "Draft",
    timesUsed: 12,
    visibility: "Public",
    createdBy: {
      id: "3",
      name: "Avery Hayes",
     avatar: "/assets/avatars/avatar3.svg",
      role: "Marketing Specialist"
    },
    createdOn: "Feb 28, 2025",
    lastUpdated: "Mar 23, 2025",
    description: "Social media carousel template optimized for Instagram engagement and brand consistency.",
    files: [
      {
        id: "f4",
        name: "Instagram Carousel.figma",
        url: "/files/instagram-carousel.figma",
        uploadedBy: "Avery Hayes",
        uploadedAt: "Feb 28, 2025",
        type: "figma",
        size: "1.8 MB"
      }
    ]
  },
  {
    id: "5",
    title: "App Wireframe Kit",
    type: "UI/UX Templates",
    status: "Expired",
    timesUsed: 36,
    visibility: "Team Only",
    createdBy: {
      id: "2",
      name: "Liam Parker",
      avatar: "/assets/avatars/avatar2.svg",
      role: "Product Manager"
    },
    createdOn: "Mar 12, 2025",
    lastUpdated: "Apr 01, 2025",
    description: "Comprehensive wireframe kit for mobile and web application design projects.",
    files: [
      {
        id: "f5",
        name: "App Wireframe Kit.sketch",
        url: "/files/wireframe-kit.sketch",
        uploadedBy: "Liam Parker",
        uploadedAt: "Mar 12, 2025",
        type: "sketch",
        size: "12.4 MB"
      }
    ]
  },
  {
    id: "6",
    title: "Product Landing Page",
    type: "UI/UX Templates",
    status: "Inactive",
    timesUsed: 21,
    visibility: "Custom",
    createdBy: {
      id: "1",
      name: "Lila Hart",
      avatar: "/assets/avatars/avatar1.svg",
      role: "Admin"
    },
    createdOn: "Jan 30, 2025",
    lastUpdated: "Mar 30, 2025",
    description: "High-converting product landing page template with modern design patterns.",
    files: [
      {
        id: "f6",
        name: "Product Landing Page.html",
        url: "/files/landing-page.html",
        uploadedBy: "Lila Hart",
        uploadedAt: "Jan 30, 2025",
        type: "html",
        size: "450 KB"
      }
    ]
  },
  {
    id: "7",
    title: "Brand Voice Guide",
    type: "Branding Templates",
    status: "Active",
    timesUsed: 54,
    visibility: "Public",
    createdBy: {
      id: "3",
      name: "Avery Hayes",
       avatar: "/assets/avatars/avatar3.svg",
      role: "Marketing Specialist"
    },
    createdOn: "Apr 01, 2025",
    lastUpdated: "Apr 02, 2025",
    description: "A foundational document defining the tone, language, and communication style that reflects Bespire's personality across touchpoints.",
    smartInsights: [
      "Most opened branding template this month.",
      "Referenced by 4 active teams recently.",
      "Updated after brand tone feedback in January."
    ],
    files: [
      {
        id: "f7",
        name: "Brand Voice Guide.docx",
        url: "/files/brand-voice-guide.docx",
        uploadedBy: "Gerard",
        uploadedAt: "Apr 11, 2025",
        type: "docx",
        size: "3.1 MB"
      }
    ]
  },
  {
    id: "8",
    title: "Email Campaign – Q2",
    type: "Marketing Templates",
    status: "Expired",
    timesUsed: 70,
    visibility: "Team Only",
    createdBy: {
      id: "2",
      name: "Liam Parker",
     avatar: "/assets/avatars/avatar3.svg",
      role: "Product Manager"
    },
    createdOn: "Feb 14, 2025",
    lastUpdated: "Mar 25, 2025",
    description: "Quarterly email campaign template with segmentation strategies and performance tracking.",
    files: [
      {
        id: "f8",
        name: "Email Campaign Q2.html",
        url: "/files/email-campaign-q2.html",
        uploadedBy: "Liam Parker",
        uploadedAt: "Feb 14, 2025",
        type: "html",
        size: "680 KB"
      }
    ]
  },
  {
    id: "9",
    title: "Product Feature Brief",
    type: "General Templates",
    status: "Active",
    timesUsed: 45,
    visibility: "Custom",
    createdBy: {
      id: "3",
      name: "Avery Hayes",
      avatar: "/assets/avatars/avatar3.svg",
      role: "Marketing Specialist"
    },
    createdOn: "Mar 22, 2025",
    lastUpdated: "Apr 08, 2025",
    description: "Detailed product feature documentation template for development and marketing alignment.",
    files: [
      {
        id: "f9",
        name: "Product Feature Brief.docx",
        url: "/files/product-feature-brief.docx",
        uploadedBy: "Avery Hayes",
        uploadedAt: "Mar 22, 2025",
        type: "docx",
        size: "2.8 MB"
      }
    ]
  },
  {
    id: "10",
    title: "Mobile UI Kit",
    type: "UI/UX Templates",
    status: "Inactive",
    timesUsed: 38,
    visibility: "Public",
    createdBy: {
      id: "1",
      name: "Lila Hart",
      avatar: "/assets/avatars/avatar3.svg",
      role: "Admin"
    },
    createdOn: "Jun 10, 2025",
    lastUpdated: "Apr 04, 2025",
    description: "Complete mobile UI component library with design system and interaction patterns.",
    files: [
      {
        id: "f10",
        name: "Mobile UI Kit.sketch",
        url: "/files/mobile-ui-kit.sketch",
        uploadedBy: "Lila Hart",
        uploadedAt: "Jun 10, 2025",
        type: "sketch",
        size: "15.7 MB"
      }
    ]
  }
];


// Get templates by category
export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === "all") return mockTemplates;
  
  const categoryMap: Record<string, TemplateType> = {
    general: "General Templates",
    branding: "Branding Templates", 
    marketing: "Marketing Templates",
    uiux: "UI/UX Templates"
  };
  
  const templateType = categoryMap[category];
  return mockTemplates.filter(template => template.type === templateType);
};
