"use client";

import { useMemo, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMutation } from '@apollo/client';
import { UPDATE_FILE_TAGS } from '@/graphql/mutations/files/updateFileTags';
import { useRenameFile } from '@/hooks/files/useRenameFile';
import { useTrashActions } from '../../hooks/files/useTrashActions';
import { usePermanentDeleteFile } from '../../hooks/files/usePermanentDeleteFile';
import { MockFile } from "@/data/mock-files";
import AllFilesSection from "./AllFilesSection";
import FileActionButtons from "./FileActionButtons";

// Helper function can stay here
const mapFilesToMockFiles = (uploadedFiles: File[], parentId: string | null): MockFile[] => {
    // ... function implementation is unchanged
    return uploadedFiles.map(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        let fileType: MockFile['type'] = 'PDF File';
        switch (extension) {
            case 'pptx': fileType = 'MS Powerpoint File'; break;
            case 'docx': fileType = 'MS Word File'; break;
            case 'xlsx': fileType = 'MS Excel Sheet'; break;
        }
    return {
        id: `file_${Date.now()}_${Math.random()}`,
        parentId: parentId,
        name: file.name,
        type: fileType,
        lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        modifiedBy: "me",
        tags: [],
        access: "Private",
        icon: file.name,
        isDeleted: false,
        };
    });
};

interface FileManagerMainProps {
    files: MockFile[];
    onFilesChange: (files: MockFile[]) => void;
    onFolderCreated: (newFolder: MockFile) => void;
    onDeleteFolder: (folderId: string) => void;
    onRestore: (fileIds: string[]) => void;
    filterMessage: string | null;
    showFilterMessage: boolean;
    activeFilter: string;
    setViewMode: (mode: 'files' | 'trash' | 'folders' | 'documents') => void;
    viewMode: 'files' | 'trash' | 'folders' | 'documents';
    currentFolderId: string | null;
    setCurrentFolderId: (id: string | null) => void;
    customBreadcrumbs?: { id: string | null; name: string }[];
    onRefresh?: () => void;
    workspaceId?: string; // Optional workspaceId prop
}

// THIS COMPONENT IS NOW MUCH SIMPLER
export default function FileManagerMain({
    files,
    onFilesChange,
    onFolderCreated,
    onDeleteFolder,
    onRestore,
    filterMessage,
    showFilterMessage,
    activeFilter,
    setViewMode,
    viewMode,
    currentFolderId,
    setCurrentFolderId,
    customBreadcrumbs,
    onRefresh,
    workspaceId, // Added workspaceId prop
}: FileManagerMainProps) {

    console.log("files in <FileManagerMain />:", files);

    // ALL useAppContext and useEffect LOGIC HAS BEEN REMOVED DE AQUÍ
    // Hook para trash y restore
    const { moveFilesToTrash, restoreFiles } = useTrashActions();

    const handleNavigate = (folderId: string | null) => {
        setCurrentFolderId(folderId);
    };

    const { renameFile } = useRenameFile();
    const onRenameFile = async (fileId: string, newName: string) => {
        try {
            const res = await renameFile(fileId, newName);
            if (res?.data?.updateFileName) {
                const updatedFiles = files.map((file) =>
                    file.id === fileId ? { ...file, name: res.data.updateFileName.name } : file
                );
                onFilesChange(updatedFiles);
            }
        } catch (e) {
            // Opcional: mostrar error
            console.error('Error renombrando archivo', e);
        }
    };
    
    const [updateFileTags] = useMutation(UPDATE_FILE_TAGS);

    const onAddTagToFile = async (fileId: string, tag: string) => {
        // Actualización local inmediata
        const updatedFiles = files.map((file) =>
            file.id === fileId ? { ...file, tags: [tag] } : file
        );
        onFilesChange(updatedFiles);
        // Actualización backend (no bloqueante)
        try {
            await updateFileTags({ variables: { fileId, tags: [tag] } });
        } catch (e) {
            // Opcional: mostrar error o revertir local si falla
            console.error('Error updating tags in backend', e);
        }
    };

    const onFilesUploaded = (uploadedFiles: File[]) => {
        const newMockFiles = mapFilesToMockFiles(uploadedFiles, currentFolderId);
        onFilesChange([...newMockFiles, ...files]);
    };
    
    const onDeleteFile = async (fileIds: string[]) => {
        await moveFilesToTrash(fileIds);
        // Actualizar localmente
        const updatedFiles = files.map(file =>
            fileIds.includes(file.id) ? { ...file, isDeleted: true, parentId: null } : file
        );
        onFilesChange(updatedFiles);
        if (onRefresh) onRefresh();
    };
    
    const onRestoreFile = async (fileIds: string[]) => {
        await restoreFiles(fileIds);
        // Actualizar localmente
        const updatedFiles = files.map(file =>
            fileIds.includes(file.id) ? { ...file, isDeleted: false } : file
        );
        onFilesChange(updatedFiles);
        if (onRefresh) onRefresh();
    };

    const { permanentlyDeleteFiles } = usePermanentDeleteFile();
    const onPermanentDeleteFile = async (fileIds: string[]) => {
        await permanentlyDeleteFiles(fileIds);
        const updatedFiles = files.filter(file => !fileIds.includes(file.id));
        onFilesChange(updatedFiles);
        if (onRefresh) onRefresh();
    };

    const router = useRouter();
    const pathname = usePathname();
    const handleGoToTrash = () => router.push('/files/trash');
    const handleShowAllFiles = () => router.push('/files/documents');

    // Llama a onRefresh cuando cambie la ruta
    useEffect(() => {
        if (onRefresh) {
            onRefresh();
        }
    }, [ pathname]);
    
    const filteredFiles = useMemo(() => {
        console.log("activefilter", activeFilter)
        if (viewMode === 'trash') {
            return files.filter(file => file.isDeleted);
        }
        const filesInCurrentView = files.filter(
            (file) => !file.isDeleted && file.parentId === currentFolderId
        );
        if (activeFilter === "all" || !activeFilter) {
            return filesInCurrentView;
        }
        return filesInCurrentView.filter(file => {
            const fileType = file.type.toLowerCase();
            console.log("filetype", fileType)
            if (activeFilter === "folders") return fileType === "folder";
            if (activeFilter === "files") return ["ms powerpoint file", "pdf file", "ms word file", "ms excel sheet"].includes(fileType);
            if (activeFilter === "documents") return ["ms word file", "vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(fileType);
            return false;
        });
    }, [files, activeFilter, currentFolderId, viewMode]);

    console.log("filteredFiles", filteredFiles)

    return (
        <div className="flex flex-col gap-8">
            {viewMode !== 'trash' && (
            <FileActionButtons
                onFolderCreated={onFolderCreated}
                onDeleteFolder={onDeleteFolder}
                onFilesUploaded={onFilesUploaded}
                currentFolderId={currentFolderId}
                onRefresh={onRefresh}
                viewMode={viewMode}
            />
            )}
            <AllFilesSection
            files={filteredFiles}
            allFiles={files}
            filterMessage={filterMessage}
            showFilterMessage={showFilterMessage}
            currentFolderId={currentFolderId}
            onNavigate={handleNavigate}
            onDelete={onDeleteFile}
            onRename={onRenameFile}
            onAddTag={onAddTagToFile}
            onRestore={onRestoreFile}
            mode={viewMode}
            onGoToTrash={handleGoToTrash}
            onPermanentDelete={onPermanentDeleteFile}
            onShowAllFiles={handleShowAllFiles}
            customBreadcrumbs={customBreadcrumbs}
            workspaceId={workspaceId}
            />
        </div>
    );
}