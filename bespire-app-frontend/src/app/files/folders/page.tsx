"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { showSuccessToast } from "@/components/ui/toast";
import FileManagerMain from "@/components/file_manager/FileManagerMain";
import PermissionGuard from "@/guards/PermissionGuard";
import { PERMISSIONS } from "@/constants/permissions";
import { useWorkspaceFiles } from "@/hooks/files/useWorkspaceFiles";
import { WorkspaceFile } from "@/types/workspaceFiles";
import { MockFile } from "@/data/mock-files";
import DashboardLayout from "@/app/dashboard/layout/DashboardLayout";

export default function FoldersPage() {
    const [isClient, setIsClient] = useState(false);
    const { setIsEditorMode, setEditorFileName, user } = useAppContext();
    const router = useRouter();
    
    // Obtener workspaceId del usuario
    const workspaceId = user?.workspaceSelected;
    
    // Usar el hook para obtener archivos del workspace (solo root level)
    const { 
        files, 
        loading, 
        error, 
        createFolder, 
        refetch 
    } = useWorkspaceFiles({ 
        workspaceId: workspaceId || '', 
        type:'folder'
        
    });

    useEffect(() => {
        setIsClient(true);
        // Asegurar que no estamos en modo editor
        setIsEditorMode(false);
        setEditorFileName("File Manager");
        
        // Verificar si necesitamos refrescar después de crear un documento
        if (typeof window !== 'undefined') {
            const needsRefresh = localStorage.getItem('filesNeedRefresh');
            if (needsRefresh === 'true') {
                localStorage.removeItem('filesNeedRefresh');
                // Pequeño delay para asegurar que el componente esté montado
                setTimeout(() => {
                    refetch();
                }, 100);
            }
        }
    }, [setIsEditorMode, setEditorFileName, refetch]);

    // Escuchar cuando la página se vuelve visible (ej. cuando el usuario regresa del editor)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && typeof window !== 'undefined') {
                const needsRefresh = localStorage.getItem('filesNeedRefresh');
                if (needsRefresh === 'true') {
                    localStorage.removeItem('filesNeedRefresh');
                    refetch();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [refetch]);

    // Convertir WorkspaceFile a MockFile para compatibilidad con FileManagerMain
    const convertToMockFiles = (workspaceFiles: WorkspaceFile[]) => {
        return workspaceFiles.map(file => {
            // Mapear tipos del backend a tipos del MockFile
            let mockType: 'Folder' | 'MS Powerpoint File' | 'PDF File' | 'MS Word File' | 'MS Excel Sheet';
            if (file.type === 'folder') {
                mockType = 'Folder';
            } else {
                // Mapear por extensión - podrías expandir esto
                switch (file.ext?.toLowerCase()) {
                    case 'pdf':
                        mockType = 'PDF File';
                        break;
                    case 'doc':
                    case 'docx':
                        mockType = 'MS Word File';
                        break;
                    case 'xls':
                    case 'xlsx':
                        mockType = 'MS Excel Sheet';
                        break;
                    case 'ppt':
                    case 'pptx':
                        mockType = 'MS Powerpoint File';
                        break;
                    default:
                        mockType = 'PDF File'; // Default fallback
                }
            }

            return {
                id: file._id,
                name: file.name,
                type: mockType,
                tags: file.tags || [],
                access: (file.access?.[0] || 'All') as 'All' | 'Team' | 'Private',
                lastModified: new Date(file.updatedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                }),
                modifiedBy: 'me', // TODO: Obtener del uploadedBy
                parentId: file.parentId || null,
                isDeleted: !!file.deletedAt,
                // Propiedades adicionales para archivos
                url: file.url,
                ext: file.ext,
                size: file.size,
            };
        });
    };

    const mockFiles = convertToMockFiles(files);

    const handleFolderCreated = async (folderData: { name: string; tags?: string[]; access?: string }) => {
        if (!workspaceId) return;
        
        try {
            await createFolder({
                name: folderData.name,
                type: 'folder',
                workspaceId,
                parentId: undefined, // Root level
                tags: folderData.tags || [],
                access: folderData.access ? [folderData.access] : ['All'],
            });
            showSuccessToast("Folder created successfully");
            refetch();
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    };

    const handleDeleteFolder = (folderId: string) => {
        // TODO: Implementar delete en el backend
        console.log('Delete folder:', folderId);
        showSuccessToast("Folder creation undone");
    };

    const handleFilesChange = (updatedFiles: MockFile[]) => {
        // Para compatibilidad - en el futuro esto debería hacer mutations al backend
        console.log('Files changed:', updatedFiles);
    };

    const handleRestore = (fileIdsToRestore: string[]) => {
        // TODO: Implementar restore en el backend
        console.log('Restore files:', fileIdsToRestore);
        showSuccessToast(`${fileIdsToRestore.length} ${fileIdsToRestore.length === 1 ? 'file has' : 'files have'} been restored.`);
    };

    // Manejar navegación programática
    const handleFolderNavigation = (newFolderId: string | null) => {
        if (newFolderId === null) {
            // Ya estamos en la raíz, no hacer nada
            return;
        } else {
            // Navegar a la nueva carpeta
            router.push(`/files/folder/${newFolderId}`);
        }
    };

    if (!isClient) {
        return <DashboardLayout><div className="p-8 text-center text-gray-500">Loading File Manager...</div></DashboardLayout>;
    }

    if (!workspaceId) {
        return <DashboardLayout><div className="p-8 text-center text-gray-500">No workspace selected</div></DashboardLayout>;
    }

    if (loading) {
        return <DashboardLayout><div className="p-8 text-center text-gray-500">Loading files...</div></DashboardLayout>;
    }

    if (error) {
        return <DashboardLayout><div className="p-8 text-center text-red-500">Error loading files: {error.message}</div></DashboardLayout>;
    }

    return (
        <PermissionGuard required={PERMISSIONS.VIEW_FILES}>
            <DashboardLayout>
                <FileManagerMain
                    files={mockFiles}
                    onFilesChange={handleFilesChange}
                    viewMode="folders"
                    setViewMode={() => {}} // No switching needed in dedicated routes
                    currentFolderId={null} // Root level
                    setCurrentFolderId={handleFolderNavigation}
                    onFolderCreated={handleFolderCreated}
                    onDeleteFolder={handleDeleteFolder}
                    onRestore={handleRestore}
                    activeFilter="all"
                    filterMessage={null}
                    showFilterMessage={false}
                    onRefresh={refetch}
                    workspaceId={workspaceId}
                />
            </DashboardLayout>
        </PermissionGuard>
    );
}