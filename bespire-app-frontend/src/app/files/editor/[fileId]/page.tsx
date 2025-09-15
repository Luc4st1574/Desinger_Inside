"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useAppContext } from "@/context/AppContext";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import PermissionGuard from "@/guards/PermissionGuard";
import { PERMISSIONS } from "@/constants/permissions";
import { useDocumentCreator } from "@/hooks/files/useDocumentCreator";
import { useDocumentUpdater } from "@/hooks/files/useDocumentUpdater";
import DashboardLayout from "@/app/dashboard/layout/DashboardLayout";
import { useDocumentReader } from "@/hooks/files/useDocumentReader";
import { useDocumentById } from "@/hooks/files/useDocumentById";

const DocumentEditor = dynamic(
  () => import("@/components/file_manager/DocumentEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 text-center text-gray-500">Loading Editor...</div>
    ),
  }
);

export default function EditorPage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const params = useParams();
  const fileIdFromUrl = params?.fileId as string | undefined;
  const [contentVersion, setContentVersion] = useState(0);
  const {
    setIsEditorMode,
    editorFileName,
    setEditorFileName,
    setSaveDoc,
    setCancelEdit,
    editorTags,
    setEditorTags,
    workspace,
    editorContent,
    setEditorContent,
    editingFileId,
    setEditingFileId,
    editingFileUrl,
    setEditingFileUrl,
  } = useAppContext();

  const { readDocxFile } = useDocumentReader();
  const { document, loading, error } = useDocumentById(fileIdFromUrl);

  const [currentFolderId] = useState<string | null>(null);
  const { createDocument } = useDocumentCreator();
  const { updateDocument } = useDocumentUpdater();

  const [initialContent, setInitialContent] = useState<string>("");
  const prevEditingFileIdRef = useRef<string | null>(null);

  const workspaceId = workspace?._id;

  // Debug opcional
  useEffect(() => {
    if (document || loading || error) {
      // eslint-disable-next-line no-console
      console.log(
        "Document data:",
        document,
        "Loading:",
        loading,
        "Error:",
        error
      );
    }
  }, [document, loading, error]);

  // Cargar el documento desde el backend SIN mostrar "no encontrado" hasta que loading sea false
  useEffect(() => {
    setIsClient(true);

    const loadFileData = async () => {
      if (fileIdFromUrl && document) {
        // Documento encontrado
        if (document.name.endsWith(".docx")) {
          try {
            if (!document.url)
              throw new Error("No se encontró la URL del archivo");
            const htmlContent = await readDocxFile(document.url);
            if (!htmlContent)
              throw new Error("El contenido convertido está vacío");

            setEditorFileName(document.name.replace(".docx", ""));
            setEditorTags(document.tags || []);
            setEditorContent(htmlContent);
            setInitialContent(htmlContent);
            setEditingFileId(document._id);
            setEditingFileUrl(document.url);
            setContentVersion((v) => v + 1); // 👈 fuerza remount del editor
          } catch (e) {
            console.error("Error al cargar el documento:", e);
            setEditorContent("");
            setInitialContent("");
            const errorMessage =
              e instanceof Error ? e.message : "Error desconocido";
            showErrorToast(`Error al cargar el documento: ${errorMessage}`);
          }
        } else {
          // Documento no-docx
          setEditorFileName(document.name.replace(".docx", ""));
          setEditorTags(document.tags || []);
          setEditingFileId(document._id);
          setEditingFileUrl(document.url || "");
          setEditorContent("");
          setInitialContent("");
        }
        return;
      }

      // Solo marcamos "no encontrado" cuando YA terminó de cargar y no existe el documento
      if (fileIdFromUrl && !loading && !document) {
        setEditorFileName("");
        setEditorContent("");
        setEditorTags([]);
        setInitialContent("");
        showErrorToast(`No se encontró el documento solicitado.`);
      }
    };

    // Evitamos ejecutar mientras el hook sigue cargando
    if (!fileIdFromUrl || !loading) {
      void loadFileData();
    }
  }, [
    fileIdFromUrl,
    document,
    loading,
    setEditingFileId,
    setEditorFileName,
    setEditorContent,
    setEditorTags,
    setEditingFileUrl,
    readDocxFile,
  ]);

  // Fijar initialContent cuando cambia el archivo en edición
  useEffect(() => {
    if (!initialContent || editingFileId !== prevEditingFileIdRef.current) {
      setInitialContent(editorContent || "");
      prevEditingFileIdRef.current = editingFileId;
    }
  }, [
    editorFileName,
    editorContent,
    editingFileId,
    editingFileUrl,
    initialContent,
  ]);

  const handleSaveDoc = useCallback(async () => {
    if (!editorFileName.trim()) {
      showErrorToast("El nombre del documento no puede estar vacío.");
      return;
    }
    if (!workspaceId) {
      showErrorToast("No hay un espacio de trabajo seleccionado.");
      return;
    }
    try {
      const finalName = editorFileName.endsWith(".docx")
        ? editorFileName
        : `${editorFileName}.docx`;
      const contentToSave = editorContent || "<p>Documento vacío</p>";

      if (editingFileId) {
        await updateDocument({
          fileId: editingFileId,
          fileName: finalName,
          content: contentToSave,
          workspaceId,
          parentId: currentFolderId || undefined,
          tags: editorTags,
        });
        showSuccessToast(`Document "${finalName}" was updated successfully.`);
        setEditingFileId(null);
        setEditingFileUrl(null);
      } else {
        await createDocument({
          fileName: finalName,
          content: contentToSave,
          workspaceId,
          parentId: currentFolderId || undefined,
          tags: editorTags,
          access: ["All"],
        });
        showSuccessToast(`Document "${finalName}" was created and uploaded.`);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("filesNeedRefresh", "true");
      }
      router.push("/files");
    } catch (err) {
      console.error("Error saving document:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error saving document";
      showErrorToast(errorMessage);
    }
  }, [
    editorFileName,
    workspaceId,
    editorContent,
    editorTags,
    editingFileId,
    updateDocument,
    createDocument,
    currentFolderId,
    router,
    setEditingFileId,
    setEditingFileUrl,
  ]);

  const handleCancelCreateDoc = useCallback(() => {
    router.push("/files");
  }, [router]);

  // Exponer acciones a la barra superior
  const saveDocRef = useRef(handleSaveDoc);
  const cancelEditRef = useRef(handleCancelCreateDoc);
  useEffect(() => {
    saveDocRef.current = handleSaveDoc;
    cancelEditRef.current = handleCancelCreateDoc;
  }, [handleSaveDoc, handleCancelCreateDoc]);

  // Estado inicial para documento nuevo
  useEffect(() => {
    setIsEditorMode(true);
    if (!editingFileId && !fileIdFromUrl) {
      setEditorFileName("Untitled Document");
      setEditorTags([]);
      setEditorContent("");
      setInitialContent("");
    }
    setSaveDoc(() => () => saveDocRef.current());
    setCancelEdit(() => () => cancelEditRef.current());
  }, [
    setIsEditorMode,
    setEditorFileName,
    setSaveDoc,
    setCancelEdit,
    setEditorTags,
    setEditorContent,
    editingFileId,
    fileIdFromUrl,
  ]);

  // =========================
  // Render sin "flash"
  // =========================

  // Loader mientras el documento está cargando (cuando hay fileId)
  if (!isClient || (fileIdFromUrl && loading)) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-gray-500">
          Cargando documento...
        </div>
      </DashboardLayout>
    );
  }

  // Error visible solo cuando YA terminó de cargar y no hay documento o llegó error
  if (fileIdFromUrl && !loading && (!document || error)) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-500">
          No se encontró el documento solicitado.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <PermissionGuard required={PERMISSIONS.VIEW_FILES}>
      <DashboardLayout>
        <DocumentEditor
          key={`${editingFileId || fileIdFromUrl || "new"}-${contentVersion}`}
          currentFolderId={currentFolderId}
          allFiles={[]}
          workspaceId={workspaceId}
        />
      </DashboardLayout>
    </PermissionGuard>
  );
}
