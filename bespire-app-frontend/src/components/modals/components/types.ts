export type UploadedFile = {
  url: string;
  key?: string;
  size?: number;
  contentType?: string;
  hash?: string;
  createdAt?: string;
  name?: string;
  family?: string;
  category?: "headings" | "body" | string;
  fileId?: string;
};

export type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
};

export type BrandPayload = {
  name: string;
  logos?: UploadedFile[];
  fonts?: UploadedFile[];
  description?: string;
  buyer?: string;
  tone?: string;
  likes?: string;
  dislikes?: string;
  archetype?: string;
  primaryColors?: string[];
  secondaryColors?: string[];
};
