"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { WorkspaceFile } from "@/types/workspaceFiles";
import { useWorkspaceFiles } from "@/hooks/files/useWorkspaceFiles";
import DashboardLayout from "../../dashboard/layout/DashboardLayout";
import FileManagerMain from "@/components/file_manager/FileManagerMain";
import PermissionGuard from "@/guards/PermissionGuard";
import { PERMISSIONS } from "@/constants/permissions";

export default function TrashPage() {
  const [isClient, setIsClient] = useState(false);
  const { setIsEditorMode, setEditorFileName } = useAppContext();
  const { user } = useAppContext();
  const workspaceId = user?.workspaceSelected || "";
  const { files, loading, error, refetch } = useWorkspaceFiles({
    workspaceId: workspaceId || "",
    parentId: undefined, // Root level
    includeDeleted: true,
  });
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  console.log("TrashPage render, files:", files);
  useEffect(() => {
    setIsClient(true);
    // Asegurar que no estamos en modo editor
    setIsEditorMode(false);
    setEditorFileName("Trash");
  }, [setIsEditorMode, setEditorFileName]);

  // Convertir WorkspaceFile a MockFile para compatibilidad con FileManagerMain (igual que FilesPage)
  const convertToMockFiles = (workspaceFiles: WorkspaceFile[]) => {
    return workspaceFiles.map((file) => {
      let mockType:
        | "Folder"
        | "MS Powerpoint File"
        | "PDF File"
        | "MS Word File"
        | "MS Excel Sheet";
      if (file.type === "folder") {
        mockType = "Folder";
      } else {
        switch (file.ext?.toLowerCase()) {
          case "pdf":
            mockType = "PDF File";
            break;
          case "doc":
          case "docx":
            mockType = "MS Word File";
            break;
          case "xls":
          case "xlsx":
            mockType = "MS Excel Sheet";
            break;
          case "ppt":
          case "pptx":
            mockType = "MS Powerpoint File";
            break;
          default:
            mockType = "PDF File";
        }
      }
      return {
        id: file._id,
        name: file.name,
        type: mockType,
        tags: file.tags || [],
        access: (file.access?.[0] || "All") as "All" | "Team" | "Private",
        lastModified: new Date(file.updatedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        modifiedBy: "me",
        parentId: file.parentId || null,
        isDeleted: !!file.deletedAt,
        url: file.url,
        ext: file.ext,
        size: file.size,
      };
    });
  };

  const mockFiles = convertToMockFiles(files as WorkspaceFile[]);

  if (!isClient) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-gray-500">Loading Trash...</div>
      </DashboardLayout>
    );
  }
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-gray-500">
          Cargando archivos eliminados...
        </div>
      </DashboardLayout>
    );
  }
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-500">
          Error: {error.message}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <PermissionGuard required={PERMISSIONS.VIEW_FILES}>
      <DashboardLayout>
        <FileManagerMain
          files={mockFiles}
          onFilesChange={() => {}} // No local update
          currentFolderId={currentFolderId}
          setCurrentFolderId={setCurrentFolderId}
          onFolderCreated={() => {}} // No local update
          onDeleteFolder={() => {}} // No local update
          onRestore={() => {}} // No local update
          activeFilter="all"
          filterMessage="Showing deleted files"
          showFilterMessage={true}
          onRefresh={refetch}
          workspaceId={workspaceId}
          viewMode="trash"
             setViewMode={() => {}} // No switching needed in dedicated routes
        />
      </DashboardLayout>
    </PermissionGuard>
  );
}
