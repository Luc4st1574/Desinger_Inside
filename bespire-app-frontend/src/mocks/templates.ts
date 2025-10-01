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
export type TemplateType = 'General Templates' | 'Branding Templates' | 'Marketing Templates' | 'UI/UX Templates' | 'Calendar Templates';
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

// Mock templates data - SIGNIFICANTLY EXPANDED
export const mockTemplates: Template[] = [
  // Page 1
  { id: "1", title: "Startup Brief", type: "General Templates", status: "Active", timesUsed: 86, visibility: "Team Only", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Jan 15, 2025", lastUpdated: "Mar 15, 2025", description: "A comprehensive startup brief template.", files: [] },
  { id: "15", title: "Onboarding Checklist", type: "General Templates", status: "Active", timesUsed: 112, visibility: "Team Only", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Jan 22, 2025", lastUpdated: "Apr 18, 2025", description: "A checklist for onboarding new team members.", files: [] },
  { id: "6", title: "Product Landing Page", type: "UI/UX Templates", status: "Inactive", timesUsed: 21, visibility: "Custom", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Jan 30, 2025", lastUpdated: "Mar 30, 2025", description: "High-converting product landing page template.", files: [] },
  { id: "8", title: "Email Campaign – Q2", type: "Marketing Templates", status: "Expired", timesUsed: 70, visibility: "Team Only", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar3.svg", role: "Product Manager" }, createdOn: "Feb 14, 2025", lastUpdated: "Mar 25, 2025", description: "Quarterly email campaign template.", files: [] },
  { id: "2", title: "Brand Strategy Deck", type: "Branding Templates", status: "Expired", timesUsed: 60, visibility: "Public", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "Feb 20, 2025", lastUpdated: "Apr 05, 2025", description: "Strategic branding template.", files: [] },
  // Page 2
  { id: "16", title: "SEO Keyword Report", type: "Marketing Templates", status: "Active", timesUsed: 41, visibility: "Team Only", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Feb 25, 2025", lastUpdated: "Mar 10, 2025", files: [] },
  { id: "4", title: "Instagram Carousel", type: "Marketing Templates", status: "Draft", timesUsed: 12, visibility: "Public", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Feb 28, 2025", lastUpdated: "Mar 23, 2025", description: "Social media carousel template.", files: [] },
  { id: "3", title: "Pitch Deck – V2", type: "General Templates", status: "Active", timesUsed: 25, visibility: "Custom", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar3.svg", role: "Admin" }, createdOn: "Mar 05, 2025", lastUpdated: "Mar 20, 2025", description: "Updated pitch deck template.", files: [] },
  { id: "17", title: "User Persona Kit", type: "UI/UX Templates", status: "Active", timesUsed: 55, visibility: "Public", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "Mar 10, 2025", lastUpdated: "Apr 20, 2025", files: [] },
  { id: "5", title: "App Wireframe Kit", type: "UI/UX Templates", status: "Expired", timesUsed: 36, visibility: "Team Only", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "Mar 12, 2025", lastUpdated: "Apr 01, 2025", description: "Comprehensive wireframe kit.", files: [] },
  // Page 3
  { id: "9", title: "Product Feature Brief", type: "General Templates", status: "Active", timesUsed: 45, visibility: "Custom", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Mar 22, 2025", lastUpdated: "Apr 08, 2025", description: "Detailed product feature documentation.", files: [] },
  { id: "18", title: "Business Card Design", type: "Branding Templates", status: "Draft", timesUsed: 8, visibility: "Team Only", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Mar 28, 2025", lastUpdated: "Apr 02, 2025", files: [] },
  { id: "7", title: "Brand Voice Guide", type: "Branding Templates", status: "Active", timesUsed: 54, visibility: "Public", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Apr 01, 2025", lastUpdated: "Apr 02, 2025", description: "A foundational document on tone.", files: [] },
  { id: "10", title: "Mobile UI Kit", type: "UI/UX Templates", status: "Inactive", timesUsed: 38, visibility: "Public", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar3.svg", role: "Admin" }, createdOn: "Apr 10, 2025", lastUpdated: "Apr 14, 2025", description: "Complete mobile UI component library.", files: [] },
  { id: "19", title: "Content Brief", type: "Marketing Templates", status: "Active", timesUsed: 92, visibility: "Custom", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Apr 15, 2025", lastUpdated: "May 01, 2025", files: [] },
  // Page 4
  { id: "20", title: "Customer Journey Map", type: "UI/UX Templates", status: "Draft", timesUsed: 19, visibility: "Team Only", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "Apr 22, 2025", lastUpdated: "May 05, 2025", files: [] },
  { id: "11", title: "Monthly Content Calendar", type: "Calendar Templates", status: "Active", timesUsed: 15, visibility: "Team Only", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "May 01, 2025", lastUpdated: "May 02, 2025", files: [] },
  { id: "12", title: "Social Media Schedule", type: "Calendar Templates", status: "Active", timesUsed: 22, visibility: "Public", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "May 05, 2025", lastUpdated: "May 10, 2025", files: [] },
  { id: "21", title: "Project Proposal", type: "General Templates", status: "Active", timesUsed: 67, visibility: "Public", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "May 12, 2025", lastUpdated: "May 20, 2025", files: [] },
  { id: "13", title: "Product Launch Timeline", type: "Calendar Templates", status: "Draft", timesUsed: 5, visibility: "Team Only", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "May 15, 2025", lastUpdated: "May 18, 2025", files: [] },
  // Page 5
  { id: "14", title: "Quarterly Marketing Plan", type: "Calendar Templates", status: "Active", timesUsed: 9, visibility: "Custom", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "May 20, 2025", lastUpdated: "May 21, 2025", files: [] },
  { id: "22", title: "Company Letterhead", type: "Branding Templates", status: "Active", timesUsed: 130, visibility: "Public", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "May 25, 2025", lastUpdated: "Jun 01, 2025", files: [] },
  { id: "23", title: "Q3 Campaign Schedule", type: "Calendar Templates", status: "Draft", timesUsed: 2, visibility: "Team Only", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Jun 02, 2025", lastUpdated: "Jun 05, 2025", files: [] },
  { id: "24", title: "Usability Testing Script", type: "UI/UX Templates", status: "Active", timesUsed: 29, visibility: "Team Only", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "Jun 08, 2025", lastUpdated: "Jun 15, 2025", files: [] },
  { id: "25", title: "Meeting Minutes - Formal", type: "General Templates", status: "Active", timesUsed: 150, visibility: "Custom", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Jun 12, 2025", lastUpdated: "Jun 14, 2025", files: [] },
  // Page 6
  { id: "26", title: "LinkedIn Post Series", type: "Marketing Templates", status: "Active", timesUsed: 33, visibility: "Public", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Jun 18, 2025", lastUpdated: "Jun 22, 2025", files: [] },
  { id: "27", title: "Annual Holiday Calendar", type: "Calendar Templates", status: "Inactive", timesUsed: 18, visibility: "Public", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Jun 25, 2025", lastUpdated: "Jul 01, 2025", files: [] },
  { id: "28", title: "Expense Report", type: "General Templates", status: "Active", timesUsed: 205, visibility: "Team Only", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Jul 05, 2025", lastUpdated: "Jul 06, 2025", files: [] },
  { id: "29", title: "A/B Test Results", "type": "Marketing Templates", "status": "Active", "timesUsed": 58, "visibility": "Team Only", "createdBy": { "id": "2", "name": "Liam Parker", "avatar": "/assets/avatars/avatar2.svg", "role": "Product Manager" }, "createdOn": "Jul 10, 2025", "lastUpdated": "Jul 15, 2025", "files": [] },
  { id: "30", title: "Design System Components", type: "UI/UX Templates", status: "Active", timesUsed: 76, visibility: "Public", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Jul 12, 2025", lastUpdated: "Jul 20, 2025", files: [] },
  // Page 7
  { id: "31", title: "Event Planning Checklist", type: "Calendar Templates", status: "Draft", timesUsed: 11, visibility: "Custom", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Jul 18, 2025", lastUpdated: "Jul 22, 2025", files: [] },
  { id: "32", title: "Logo Usage Guidelines", type: "Branding Templates", status: "Active", timesUsed: 99, visibility: "Public", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Jul 25, 2025", lastUpdated: "Jul 28, 2025", files: [] },
  { id: "33", title: "Quarterly Investor Update", type: "General Templates", status: "Active", timesUsed: 14, visibility: "Custom", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "Aug 01, 2025", lastUpdated: "Aug 05, 2025", files: [] },
  { id: "34", title: "Press Release Kit", type: "Marketing Templates", status: "Expired", timesUsed: 43, visibility: "Public", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Aug 08, 2025", lastUpdated: "Aug 10, 2025", files: [] },
  { id: "35", title: "Iconography Set", type: "UI/UX Templates", status: "Draft", timesUsed: 23, visibility: "Team Only", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Aug 15, 2025", lastUpdated: "Aug 20, 2025", files: [] },
  // Page 8
  { id: "36", title: "Employee Handbook", type: "General Templates", status: "Inactive", timesUsed: 88, visibility: "Team Only", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Aug 22, 2025", lastUpdated: "Aug 25, 2025", files: [] },
  { id: "37", title: "Webinar Presentation Deck", type: "Marketing Templates", status: "Active", timesUsed: 39, visibility: "Public", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "Sep 01, 2025", lastUpdated: "Sep 05, 2025", files: [] },
  { id: "38", title: "Typography Guide", type: "Branding Templates", status: "Active", timesUsed: 62, visibility: "Public", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Sep 10, 2025", lastUpdated: "Sep 12, 2025", files: [] },
  { id: "39", title: "Sprint Planning Schedule", type: "Calendar Templates", status: "Active", timesUsed: 28, visibility: "Team Only", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "Sep 15, 2025", lastUpdated: "Sep 18, 2025", files: [] },
  { id: "40", title: "Competitive Analysis", type: "General Templates", status: "Active", timesUsed: 73, visibility: "Custom", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Sep 22, 2025", lastUpdated: "Sep 28, 2025", files: [] },
  // Page 9
  { id: "41", title: "Blog Post Template", type: "Marketing Templates", status: "Active", timesUsed: 102, visibility: "Public", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Oct 01, 2025", lastUpdated: "Oct 03, 2025", files: [] },
  { id: "42", title: "Style Guide", type: "Branding Templates", status: "Draft", timesUsed: 15, visibility: "Team Only", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Oct 05, 2025", lastUpdated: "Oct 08, 2025", files: [] },
  { id: "43", title: "404 Error Page Design", type: "UI/UX Templates", status: "Active", timesUsed: 31, visibility: "Public", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "Oct 12, 2025", lastUpdated: "Oct 15, 2025", files: [] },
  { id: "44", title: "Project Retrospective", type: "General Templates", status: "Active", timesUsed: 49, visibility: "Team Only", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Oct 18, 2025", lastUpdated: "Oct 20, 2025", files: [] },
  { id: "45", title: "Q4 OKR Planning", type: "Calendar Templates", status: "Active", timesUsed: 20, visibility: "Custom", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "Oct 25, 2025", lastUpdated: "Oct 28, 2025", files: [] },
   // Page 10
  { id: "46", title: "Infographic Elements", type: "Marketing Templates", status: "Draft", timesUsed: 18, visibility: "Public", createdBy: { id: "3", name: "Avery Hayes", avatar: "/assets/avatars/avatar3.svg", role: "Marketing Specialist" }, createdOn: "Nov 01, 2025", lastUpdated: "Nov 04, 2025", files: [] },
  { id: "47", title: "Creative Brief", type: "Branding Templates", status: "Active", timesUsed: 81, visibility: "Team Only", createdBy: { id: "1", name: "Lila Hart", avatar: "/assets/avatars/avatar1.svg", role: "Admin" }, createdOn: "Nov 07, 2025", lastUpdated: "Nov 10, 2025", files: [] },
  { id: "48", title: "Onboarding Flow Mockup", type: "UI/UX Templates", status: "Inactive", timesUsed: 25, visibility: "Team Only", createdBy: { id: "2", name: "Liam Parker", avatar: "/assets/avatars/avatar2.svg", role: "Product Manager" }, createdOn: "Nov 15, 2025", lastUpdated: "Nov 20, 2025", files: [] },
];


// Get templates by category
export const getTemplatesByCategory = (category: string): Template[] => {
  if (category === "all") return mockTemplates;

  const categoryMap: Record<string, TemplateType> = {
    general: "General Templates",
    branding: "Branding Templates",
    marketing: "Marketing Templates",
    uiux: "UI/UX Templates",
    calendar: "Calendar Templates",
  };

  const templateType = categoryMap[category];
  return mockTemplates.filter(template => template.type === templateType);
};