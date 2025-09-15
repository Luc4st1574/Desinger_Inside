/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MockFile {
  id: string;
  parentId: string | null;
  name: string;
  type: any;
  tags: string[];
  access: 'All' | 'Team' | 'Private';
  lastModified: string;
  modifiedBy: string;
  icon?: string; // Ahora es opcional porque se calcula dinámicamente
  isDeleted?: boolean;
  // Propiedades adicionales para archivos del backend
  url?: string;
  ext?: string;
  size?: number;
  content?: string; // Nuevo: contenido del archivo (HTML, texto, etc.)
}

export const mockFiles: MockFile[] = [
  {
    id: '0',
    parentId: null,
    name: 'Christmas Campaign',
    type: 'Folder',
    tags: ['Email Marketing'],
    access: 'All',
    lastModified: 'Dec 21, 2024',
    modifiedBy: 'me',
    icon: 'folder',
    isDeleted: false,
  },
  {
    id: '1',
    parentId: null,
    name: 'Branding Files',
    type: 'Folder',
    tags: ['Email Marketing'],
    access: 'All',
    lastModified: 'Dec 21, 2024',
    modifiedBy: 'me',
    icon: 'folder',
    isDeleted: false,
  },
  {
    id: '2',
    parentId: null,
    name: 'Waymax Pitch Deck 2024.pptx',
    type: 'MS Powerpoint File',
    tags: [],
    access: 'All',
    lastModified: 'Dec 21, 2024',
    modifiedBy: 'me',
    icon: 'Waymax Pitch Deck 2024.pptx',
    isDeleted: false,
    content: '',
  },
  // --- NEW ROOT LEVEL FILES ---
  {
    id: '3',
    parentId: null,
    name: 'Q4 Financial Report.xlsx',
    type: 'MS Excel Sheet',
    tags: ['Finance', 'Reports'],
    access: 'Private',
    lastModified: 'Jan 15, 2025',
    modifiedBy: 'John Doe',
    icon: 'Waymax Financial Report 2024.xlsx',
    isDeleted: false,
    content: '',
  },
  {
    id: '4',
    parentId: null,
    name: 'Marketing Strategy Q1 2025.docx',
    type: 'MS Word File',
    tags: ['Marketing', 'Strategy'],
    access: 'Team',
    lastModified: 'Jan 10, 2025',
    modifiedBy: 'Jane Smith',
    icon: 'Waymax Marketing Plan 2024.docx',
    isDeleted: false,
    content: '<p>Contenido de ejemplo para Marketing Strategy Q1 2025</p>',
  },
  {
    id: '5',
    parentId: null,
    name: 'Competitor Analysis.pdf',
    type: 'PDF File',
    tags: ['Research'],
    access: 'All',
    lastModified: 'Feb 01, 2025',
    modifiedBy: 'me',
    icon: 'Waymax Brand Guide 2024.pdf',
    isDeleted: false,
    content: '',
  },
  // --- Files inside "Christmas Campaign" (id: '0') ---
  {
    id: '10',
    parentId: '0',
    name: 'Email Draft.docx',
    type: 'MS Word File',
    tags: [],
    access: 'Team',
    lastModified: 'Dec 15, 2024',
    modifiedBy: 'Jane',
    icon: 'Waymax Marketing Plan 2024.docx',
    isDeleted: false,
    content: '<p>Contenido de ejemplo para Email Draft</p>',
  },
  {
    id: '11',
    parentId: '0',
    name: 'Ad Spend.xlsx',
    type: 'MS Excel Sheet',
    tags: [],
    access: 'Private',
    lastModified: 'Dec 18, 2024',
    modifiedBy: 'me',
    icon: 'Waymax Financial Report 2024.xlsx',
    isDeleted: false,
    content: '',
  },
  {
    id: '12',
    parentId: '0',
    name: 'Social Media Assets',
    type: 'Folder',
    tags: [],
    access: 'All',
    lastModified: 'Dec 19, 2024',
    modifiedBy: 'me',
    icon: 'folder',
    isDeleted: false,
  },
  {
    id: '20',
    parentId: '12',
    name: 'Instagram Post.pdf',
    type: 'PDF File',
    tags: [],
    access: 'All',
    lastModified: 'Dec 20, 2024',
    modifiedBy: 'me',
    icon: 'Waymax Brand Guide 2024.pdf',
    isDeleted: false,
    content: '',
  },
];
