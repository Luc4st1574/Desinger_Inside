// types/workspaceFiles.ts
export interface WorkspaceFile {
  _id: string;
  name: string;
  type: 'file' | 'folder';
  url?: string;
  ext?: string;
  size?: number;
  uploadedBy?: string;
  uploadedAt?: string;
  parentId?: string;
  workspaceId?: string;
  deletedAt?: string;
  tags?: string[];
  access?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateFolderInput {
  name: string;
  type: 'folder';
  parentId?: string;
  workspaceId: string;
  tags?: string[];
  access?: string[];
}
