// src/hooks/files/useFolderInfo.ts
import { useQuery } from '@apollo/client';
import { GET_FOLDER_PATH } from '@/graphql/queries/files/getFolderInfo';
import { WorkspaceFile } from '@/types/workspaceFiles';

type UseFolderInfoProps = { 
  workspaceId: string; 
  folderId: string | null; 
};

export function useFolderInfo({ workspaceId, folderId }: UseFolderInfoProps) {
  // Solo hacer la query si tenemos un folderId
  const { data, loading, error } = useQuery(GET_FOLDER_PATH, { 
    variables: { folderId: folderId || '' },
    skip: !workspaceId || !folderId,
  });

  // Construir el path de breadcrumbs desde los datos del backend
  const buildBreadcrumbPath = (folderPath: WorkspaceFile[]): { id: string | null; name: string }[] => {
    const path: { id: string | null; name: string }[] = [{ id: null, name: "All Files" }];
    
    // El backend ya nos devuelve el path completo en orden correcto
    folderPath.forEach(folder => {
      path.push({ id: folder._id, name: folder.name });
    });
    
    return path;
  };

  const folderPath = data?.getFolderPath || [];
  const currentFolder = folderPath.length > 0 ? folderPath[folderPath.length - 1] : null;
  const breadcrumbPath = folderPath.length > 0 ? buildBreadcrumbPath(folderPath) : [{ id: null, name: "All Files" }];

  return {
    currentFolder,
    breadcrumbPath,
    folderPath, // El path completo de carpetas
    loading,
    error,
  };
}
