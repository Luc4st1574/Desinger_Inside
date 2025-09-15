"use client";

import { useState, useMemo, useEffect } from "react";
import clsx from "clsx";
import { MockFile } from "@/data/mock-files";
import {
  ChevronDown,
  Download,
  Trash2,
  RotateCcw,
  ShieldAlert,
  List,
  LayoutGrid,
  Folder,
} from "lucide-react";
import Link from "next/link";
import FileListTable from "./FileListTable";
import FileGrid from "./FileGrid";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { toast } from "sonner";
import FilesDeletedToast from "../ui/FilesDeletedToast";
import { showSuccessToast } from "../ui/toast";

type ViewMode = "list" | "grid";
type SectionMode = "files" | "trash" | "folders" | "documents";

interface AllFilesSectionProps {
  files: MockFile[];
  allFiles: MockFile[];
  filterMessage: string | null;
  showFilterMessage: boolean;
  currentFolderId: string | null;
  onNavigate: (folderId: string | null) => void;
  onDelete: (fileIds: string[]) => void;
  onRestore: (fileIds: string[]) => void;
  onRename: (fileId: string, newName: string) => void;
  onAddTag: (fileId: string, tag: string) => void;
  mode: SectionMode;
  onGoToTrash: () => void;
  onPermanentDelete: (fileIds: string[]) => void;
  onShowAllFiles: () => void;
  customBreadcrumbs?: { id: string | null; name: string }[];
  workspaceId?: string; // Optional workspaceId prop
}

export default function AllFilesSection({
  files,
  allFiles,
  filterMessage,
  showFilterMessage,
  currentFolderId,
  onNavigate,
  onDelete,
  onRestore,
  onRename,
  onAddTag,
  mode,
  onGoToTrash,
  onPermanentDelete,
  onShowAllFiles,
  customBreadcrumbs,
  workspaceId, // Added workspaceId prop
}: AllFilesSectionProps) {
  const [view, setView] = useState<ViewMode>("list");
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [filesToAction, setFilesToAction] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPermanentDeleteModalOpen, setIsPermanentDeleteModalOpen] =
    useState(false);

  const path = useMemo(() => {
    if (mode === "trash") return [{ id: null, name: "Trash" }];

    // Si tenemos breadcrumbs personalizados, úsalos
    if (customBreadcrumbs && customBreadcrumbs.length > 0) {
      return customBreadcrumbs;
    }

    // Lógica original para cuando no hay breadcrumbs personalizados
    const rootLabel = mode === "folders" ? "All Folders" : "All Files";
    const breadcrumbs: { id: string | null; name: string }[] = [
      { id: null, name: rootLabel },
    ];
    if (!currentFolderId) return breadcrumbs;
    let currentId: string | null = currentFolderId;
    const pathParts: { id: string | null; name: string }[] = [];
    while (currentId) {
      const folder = allFiles.find((f) => f.id === currentId);
      if (folder) {
        pathParts.unshift({ id: folder.id, name: folder.name });
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return [...breadcrumbs, ...pathParts];
  }, [currentFolderId, allFiles, mode, customBreadcrumbs]);

  const filesToDisplay = useMemo(() => files, [files]);

  useEffect(() => {
    setSelectedFiles([]);
  }, [currentFolderId, mode]);

  const hasSelectedFolder = useMemo(
    () =>
      selectedFiles.some(
        (id) => allFiles.find((f) => f.id === id)?.type === "Folder"
      ),
    [selectedFiles, allFiles]
  );
  const handleSelectionChange = (newSelectedIds: string[]) =>
    setSelectedFiles(newSelectedIds);

  const handleDeleteWithToast = (fileIds: string[]) => {
    if (fileIds.length === 0) return;

    onDelete(fileIds);

    toast.custom(
      (t) => (
        <FilesDeletedToast
          count={fileIds.length}
          onUndo={async () => {
            await onRestore(fileIds);
            if (typeof onRefresh === "function") onRefresh();
            toast.dismiss(t);
          }}
          onGoToTrash={() => {
            onGoToTrash();
            toast.dismiss(t);
          }}
          onClose={() => toast.dismiss(t)}
        />
      ),
      {
        duration: 5000,
      }
    );

    setSelectedFiles((current) =>
      current.filter((id) => !fileIds.includes(id))
    );
  };
  const handleDeleteSelected = () => {
    if (selectedFiles.length > 0) {
      setFilesToAction(selectedFiles);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteWithToast(filesToAction);
    setIsDeleteModalOpen(false);
    setFilesToAction([]);
  };

  const handleRestoreRequest = (fileIds: string[]) => {
    if (fileIds.length === 0) return;
    onRestore(fileIds);
    setSelectedFiles((current) =>
      current.filter((id) => !fileIds.includes(id))
    );
  };

  const handlePermanentDeleteRequest = (fileIds: string[]) => {
    if (fileIds.length > 0) {
      setFilesToAction(fileIds);
      setIsPermanentDeleteModalOpen(true);
    }
  };

  const handleConfirmPermanentDelete = () => {
    onPermanentDelete(filesToAction);
    setIsPermanentDeleteModalOpen(false);
    setSelectedFiles((current) =>
      current.filter((id) => !filesToAction.includes(id))
    );
    setFilesToAction([]);
  };

  const handleDownloadSelected = () => {
    if (hasSelectedFolder) {
      toast.error("No se pueden descargar carpetas. Selecciona solo archivos.");
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Selecciona al menos un archivo para descargar.");
      return;
    }
    // Buscar los archivos seleccionados y descargar cada uno
    const filesToDownload = selectedFiles
      .map((id) => files.find((f) => f.id === id))
      .filter((f) => f && f.type !== "Folder" && f.url);
    if (filesToDownload.length === 0) {
      toast.error("No se encontró la URL de los archivos seleccionados.");
      return;
    }
    Promise.all(
      filesToDownload.map(async (file) => {
        if (!file?.url) return;
        try {
          const response = await fetch(file.url);
          if (!response.ok) throw new Error("No se pudo descargar el archivo");
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = file.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (err) {
          toast.error(`Error descargando ${file.name}`);
        }
      })
    ).then(() => {
      showSuccessToast(
        `${filesToDownload.length} archivo(s) descargado(s) correctamente`
      );
    });
  };

  const toggleContentVisibility = () => setIsContentVisible(!isContentVisible);

  const commonViewProps = {
    onOpenFolder: onNavigate,
    onRename,
    onAddTag,
    selectedFiles,
    onSelectionChange: handleSelectionChange,
    mode,
    onDelete: handleDeleteWithToast,
    onRestore: handleRestoreRequest,
    onPermanentDelete: handlePermanentDeleteRequest,
  };

  return (
    <>
      <section>
        <div className="flex justify-between items-center mb-4">
          {selectedFiles.length > 0 ? (
            <div className="flex items-center gap-4">
              <span className="text-xl font-medium text-gray-800">
                {selectedFiles.length} Selected
              </span>
              {mode === "trash" ? (
                <>
                  <button
                    onClick={() => handleRestoreRequest(selectedFiles)}
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" /> Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDeleteRequest(selectedFiles)}
                    className="flex items-center gap-2 rounded-full border border-red-500 bg-transparent px-4 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <ShieldAlert className="h-4 w-4" /> Delete Permanently
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleDownloadSelected}
                    disabled={hasSelectedFolder}
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-4 w-4" /> Download
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 rounded-full border border-red-500 bg-transparent px-4 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              {/* Breadcrumb navigation */}
              <div className="flex items-center gap-2 text-xl font-medium text-gray-700">
                {path.map((crumb, index) => (
                  <div
                    key={crumb.id ?? "root"}
                    className="flex items-center gap-2"
                  >
                    <button
                      onClick={() => onNavigate(crumb.id)}
                      className={clsx(
                        "transition-colors",
                        index === path.length - 1 || mode === "trash"
                          ? "text-gray-900 cursor-default"
                          : "text-gray-600 hover:text-gray-900 hover:underline"
                      )}
                      disabled={index === path.length - 1 || mode === "trash"}
                    >
                      {crumb.name}
                    </button>
                    {index < path.length - 1 && (
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions separator and trash/files toggle */}
              {mode !== "trash" && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={onGoToTrash}
                    aria-label="Go to Trash"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Go to Trash"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
              {mode === "trash" && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={onShowAllFiles}
                    aria-label="Go to All Files"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Go to All Files"
                  >
                    <Folder className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-600">Filter</span>
              <button
                type="button"
                onClick={toggleContentVisibility}
                aria-label="Toggle filter visibility"
                className="text-gray-600 hover:text-gray-900 transition-transform duration-300"
              >
                {/* The transition class on the parent div handles the rotation */}
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-500 ${
                    isContentVisible ? "rotate-0" : "rotate-[-180deg]"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center bg-white rounded-full border-2 border-[#CEFFA3] p-1">
              <button
                type="button"
                onClick={() => setView("list")}
                className={`px-4 py-1 text-sm font-medium flex items-center gap-2 rounded-full transition-colors duration-200 ${
                  view === "list"
                    ? "bg-[#CEFFA3] shadow-sm text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`px-4 py-1 text-sm font-medium flex items-center gap-2 rounded-full transition-colors duration-200 ${
                  view === "grid"
                    ? "bg-[#CEFFA3] shadow-sm text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* --- MODIFICATION START --- */}
        {/* This wrapper handles the collapse animation and fade effect. */}
        <div className="relative">
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isContentVisible
                ? "max-h-[2000px] opacity-100"
                : "max-h-20 opacity-60"
            }`}
          >
            {files.length === 0 && mode === "trash" ? (
              <div className="mt-6 text-center text-gray-600">
                <p className="mb-2">The trash is empty.</p>
                <button
                  onClick={onShowAllFiles}
                  className="text-black underline"
                >
                  Back to All Files
                </button>
              </div>
            ) : view === "list" ? (
              <FileListTable
                files={filesToDisplay}
                {...commonViewProps}
                workspaceId={workspaceId}
                mode={mode}
              />
            ) : (
              <FileGrid
                files={filesToDisplay}
                {...commonViewProps}
                workspaceId={workspaceId}
                mode={mode}
              />
            )}

            {showFilterMessage && filterMessage && (
              <div className="mt-6 text-center text-gray-600">
                <p className="inline-block mr-1">{filterMessage}</p>
                <Link
                  href="/files"
                  className="text-black underline inline-block"
                >
                  File manager
                </Link>
              </div>
            )}
          </div>
          {/* This div creates the fade-out effect at the bottom when collapsed */}
          {!isContentVisible && (
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>
        {/* --- MODIFICATION END --- */}
      </section>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemCount={filesToAction.length}
        isFolder={
          filesToAction.length === 1 &&
          allFiles.find((f) => f.id === filesToAction[0])?.type === "Folder"
        }
      />
      <DeleteConfirmationModal
        isOpen={isPermanentDeleteModalOpen}
        onClose={() => setIsPermanentDeleteModalOpen(false)}
        onConfirm={handleConfirmPermanentDelete}
        itemCount={filesToAction.length}
        isPermanent={true}
        isFolder={
          filesToAction.length === 1 &&
          allFiles.find((f) => f.id === filesToAction[0])?.type === "Folder"
        }
      />
    </>
  );
}
