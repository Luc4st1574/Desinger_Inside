"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CreateFolderModal from "../modals/CreateFolderModal";
import { MockFile } from "@/data/mock-files";
import { UploadingFilesModal } from "../modals/UploadingFilesModal";
import { UploadFilesModal } from "../modals/UploadFilesModal";
import { showErrorToast, showUploadSuccessToast } from "@/components/ui/toast";
import { useAppContext } from "@/context/AppContext";
import { useFileUpload } from "@/hooks/files/useFileUpload";

interface FileActionButtonsProps {
  onFolderCreated: (newFolder: MockFile) => void;
  onDeleteFolder: (folderId: string) => void;
  onFilesUploaded: (uploadedFiles: File[]) => void;
  currentFolderId: string | null;
  onRefresh?: () => void;
  viewMode: 'files' | 'trash' | 'folders' | 'documents';
}

export default function FileActionButtons({ onFolderCreated, onDeleteFolder, onFilesUploaded, currentFolderId, onRefresh, viewMode }: FileActionButtonsProps) {
  const [isCreateFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  const [isUploadFilesModalOpen, setUploadFilesModalOpen] = useState(false);
  const [isUploadingModalOpen, setIsUploadingModalOpen] = useState(false);
  const [uploadHasStarted, setUploadHasStarted] = useState(false);

  const { workspace, setEditorFileName, setEditorTags, setEditorContent, setEditingFileId, setEditingFileUrl } = useAppContext();
  const workspaceId = workspace?._id;
  const router = useRouter();

  // Usar nuestro hook de upload real
  const { 
    uploadMultipleFiles, 
    uploadingFiles, 
    removeUploadingFile, 
    clearUploadingFiles 
  } = useFileUpload();

  // Evitar warnings de props no usados
  //console.log('Props available:', { onFolderCreated, onDeleteFolder });

  const createFolderAction = () => setCreateFolderModalOpen(true);
  
  const createDocumentAction = () => {
    // Configurar el editor para un nuevo documento
    setEditorFileName("Untitled Document");
    setEditorTags([]);
    setEditorContent("");
    
    // Limpiar los datos de edición (nuevo documento)
    setEditingFileId(null);
    setEditingFileUrl(null);
    
    // Navegar directo al editor
    router.push('/files/editor');
  };
  
  const uploadFilesAction = () => {
    clearUploadingFiles();
    setUploadHasStarted(false);
    setUploadFilesModalOpen(true);
  };
  
  const handleStartUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0 || !workspaceId) return;
    
    setUploadHasStarted(true);
    
    try {
      const results = await uploadMultipleFiles({
        files: filesToUpload,
        workspaceId,
        parentId: currentFolderId || undefined,
        tags: [],
        access: ['All'],
      });
      
      // Verificar si hay errores en los resultados (para múltiples archivos)
      const errors = results.filter((result: unknown): result is { error: string; fileName: string } => 
        result !== null && typeof result === 'object' && 'error' in result
      );
      
      if (errors.length > 0 && filesToUpload.length > 1) {
        // Mostrar errores específicos para múltiples archivos
        errors.forEach((errorResult) => {
          showErrorToast(errorResult.error);
        });
      }
      
      // Los archivos se agregaron correctamente, refrescar la lista
      console.log('Upload completed:', results);
      onRefresh?.();
    } catch (error) {
      console.error('Upload error:', error);
      // Mostrar toast de error (especialmente útil para un solo archivo)
      const errorMessage = (error instanceof Error && error.message) ? error.message : 'Error uploading files';
      showErrorToast(errorMessage);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    removeUploadingFile(indexToRemove);
  };

  const handleMinimizeToToast = () => {
    setUploadFilesModalOpen(false);
    setIsUploadingModalOpen(true);
  };

  const handleUploadModalClose = () => {
    const allFinished = uploadingFiles.length > 0 && uploadingFiles.every(f => f.done || f.error);
    if (allFinished) {
      if (uploadHasStarted) {
        const doneFiles = uploadingFiles.filter(f => f.done);
        if (doneFiles.length > 0) {
          showUploadSuccessToast(doneFiles.length);
          onFilesUploaded(doneFiles.map(f => f.file));
          onRefresh?.(); // Refrescar después del upload
        }
      }
    }
    setUploadFilesModalOpen(false);
    clearUploadingFiles();
    setUploadHasStarted(false);
  };

  const handleProgressModalClose = () => {
    const doneFiles = uploadingFiles.filter(f => f.done);
    if (doneFiles.length > 0) {
      showUploadSuccessToast(doneFiles.length);
      onFilesUploaded(doneFiles.map(f => f.file));
      onRefresh?.(); // Refrescar después del upload
    }
    setIsUploadingModalOpen(false);
    clearUploadingFiles();
    setUploadHasStarted(false);
  };

  return (
    <>
      <section>
        <h2 className="text-xl font-medium mb-4">Get Started</h2>
        <div className="flex flex-col md:flex-row gap-4">
          {viewMode !== 'documents' && (
             <button type="button" onClick={createFolderAction} className="w-56 bg-white px-3 py-5 border border-gray-200 rounded-md flex flex-col items-start gap-2 text-left hover:bg-gray-50 transition-colors">
            <Image src="/assets/icons/folders.svg" alt="Create Folder" width={24} height={24} className="w-6 h-6" />
            <span className="font-medium text-gray-800 text-sm">Create Folder</span>
          </button> 
          )}
         
            {viewMode !== 'folders' && (
 <button type="button" onClick={uploadFilesAction} className="w-56 bg-white px-3 py-5 border border-gray-200 rounded-md flex flex-col items-start gap-2 text-left hover:bg-gray-50 transition-colors">
            <Image src="/assets/icons/files.svg" alt="Upload Files" width={24} height={24} className="w-6 h-6" />
            <span className="font-medium text-gray-800 text-sm">Upload Files</span>
          </button>
            )}
         
          {viewMode !== 'folders' && (
            <button
              type="button"
              onClick={createDocumentAction}
              className="w-56 bg-white px-3 py-5 border border-gray-200 rounded-md flex flex-col items-start gap-2 text-left hover:bg-gray-50 transition-colors"
            >
              <Image src="/assets/icons/docs.svg" alt="Create a Doc" width={24} height={24} className="w-6 h-6" />
              <span className="font-medium text-gray-800 text-sm">Create a Doc</span>
            </button>
          )}
        </div>
      </section>

      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setCreateFolderModalOpen(false)}
        currentFolderId={currentFolderId} 
        workspaceId={workspaceId}
        onFolderCreated={() => {
          // Refrescar los archivos después de crear carpeta
          onRefresh?.();
        }}
      />
      <UploadFilesModal
        open={isUploadFilesModalOpen}
        onClose={handleUploadModalClose}
        onUpload={handleStartUpload}
        onMinimize={handleMinimizeToToast}
        uploadingFiles={uploadingFiles}
        uploadHasStarted={uploadHasStarted}
        onRemoveFile={handleRemoveFile}
      />
      <UploadingFilesModal
        files={uploadingFiles}
        open={isUploadingModalOpen}
        onRemove={handleRemoveFile}
        onClose={handleProgressModalClose}
        onUploadMore={() => {
          setIsUploadingModalOpen(false);
          setUploadFilesModalOpen(true);
        }}
      />
    </>
  );
}