/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { useAppContext } from "@/context/AppContext";
import { mockFiles, MockFile } from "@/data/mock-files";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import DashboardLayout from "../../dashboard/layout/DashboardLayout";
import PermissionGuard from "@/guards/PermissionGuard";
import { PERMISSIONS } from "@/constants/permissions";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDocumentCreator } from "@/hooks/files/useDocumentCreator";
import { useDocumentUpdater } from "@/hooks/files/useDocumentUpdater";

const DocumentEditor = dynamic(
    () => import('@/components/file_manager/DocumentEditor'),
    {
        ssr: false, 
        loading: () => <div className="p-8 text-center text-gray-500">Loading Editor...</div>,
    }
);

export default function EditorPage() {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
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
        setEditingFileUrl
    } = useAppContext();
    const [files, setFiles] = useLocalStorage<MockFile[]>('mockFiles', mockFiles);
    const [currentFolderId] = useState<string | null>(null);
    const { createDocument } = useDocumentCreator();
    const { updateDocument } = useDocumentUpdater();
    const [initialContent, setInitialContent] = useState<string>("");
    const prevEditingFileIdRef = useRef<string | null>(null);

    const workspaceId = workspace?._id;

    useEffect(() => {
        setIsClient(true);
        //console.log('Editor mounted. Context state:');
        //console.log('editorFileName:', editorFileName);
        //console.log('editorContent:', editorContent);
        //console.log('editingFileId:', editingFileId);
        //console.log('editingFileUrl:', editingFileUrl);
        
        // Establecer el contenido inicial solo una vez cuando se monta el componente
        // o cuando cambia el ID del archivo en edición
        if (!initialContent || editingFileId !== prevEditingFileIdRef.current) {
            //console.log('Setting initial content:', editorContent);
            setInitialContent(editorContent || "");
            prevEditingFileIdRef.current = editingFileId;
        }
    }, [editorFileName, editorContent, editingFileId, editingFileUrl, initialContent]);

    const handleSaveDoc = useCallback(async () => {
        //console.log('Saving document with name:', editorFileName);
        //console.log('Current editor content:', editorContent);
        //console.log('initialContent:', initialContent);
        //console.log('Editing file ID:', editingFileId);
        if (!editorFileName.trim()) {
            showErrorToast("El nombre del documento no puede estar vacío.");
            return;
        }
        if (!workspaceId) {
            showErrorToast("No hay un espacio de trabajo seleccionado.");
            return;
        }
        
        // Función para normalizar el contenido conservando el formato HTML
        const normalizeContent = (content: string): string => {
            try {
                // Si es JSON con delta/html, extraer el contenido
                const parsed = JSON.parse(content);
                if (parsed.html) {
                    content = parsed.html;
                } else if (parsed.delta) {
                    // Para delta, mantener el objeto delta completo para comparación
                    return JSON.stringify(parsed.delta);
                }
            } catch {
                // Si no es JSON, continuar con el contenido como HTML
            }
            
            // Normalizar el HTML quitando espacios en blanco entre tags pero manteniendo el formato
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content.trim();
            
            // Devolver el HTML normalizado
            return tempDiv.innerHTML;
        };

        // Función para detectar si hay cambios reales en el contenido
        const hasContentChanged = (): boolean => {
            // Para documentos nuevos, siempre verificar que haya contenido
            if (!editingFileId) {
                const currentContent = editorContent || "";
                try {
                    // Verificar si es JSON
                    const parsed = JSON.parse(currentContent);
                    if (parsed.html) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = parsed.html;
                        const text = tempDiv.textContent || tempDiv.innerText || '';
                        const hasText = text.trim().length > 0 && 
                                        text.trim() !== 'Untitled Document' &&
                                        text.trim() !== 'Documento vacío';
                        return hasText;
                    } else if (parsed.delta && parsed.delta.ops) {
                        // Verificar si hay contenido real en el delta
                        const hasRealContent = parsed.delta.ops.some((op: { insert?: string | object }) => {
                            if (typeof op.insert === 'string' && op.insert.trim().length > 0) {
                                return op.insert.trim() !== 'Untitled Document' && 
                                       op.insert.trim() !== 'Documento vacío';
                            }
                            return op.insert && typeof op.insert === 'object'; // Imágenes u otros objetos
                        });
                        return hasRealContent;
                    }
                } catch {
                    // Si no es JSON, comprobar el HTML directamente
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = currentContent;
                    const text = tempDiv.textContent || tempDiv.innerText || '';
                    return text.trim().length > 0 && 
                           text.trim() !== 'Untitled Document' &&
                           text.trim() !== 'Documento vacío';
                }
            }
            
            // Para actualizaciones, comparar formato y contenido
            const currentNormalized = normalizeContent(editorContent || "");
            const initialNormalized = normalizeContent(initialContent);

            //console.log('Current normalized content:', currentNormalized);
            //console.log('Initial normalized content:', initialNormalized);
            
            // Comparar el contenido completo (incluyendo formato HTML)
            return currentNormalized !== initialNormalized;
        };
        
        // Validar si hay cambios en el contenido
        if (!hasContentChanged()) {
            if (!editingFileId) {
                showErrorToast("Por favor, agrega contenido al documento antes de guardarlo.");
            } else {
                showErrorToast("No se detectaron cambios en el documento.");
            }
            return;
        }
        
        try {
            const finalName = editorFileName.endsWith('.docx') ? editorFileName : `${editorFileName}.docx`;
            const contentToSave = editorContent || "<p>Documento vacío</p>";
            //console.log('About to save document with content:', contentToSave);
            if (editingFileId) {
                // Estamos editando un archivo existente
                await updateDocument({
                    fileId: editingFileId,
                    fileName: finalName,
                    content: contentToSave,
                    workspaceId,
                    parentId: currentFolderId || undefined,
                    tags: editorTags,
                });
                showSuccessToast(`Document "${finalName}" was updated successfully.`);
                // Limpiar el estado de edición
                setEditingFileId(null);
                setEditingFileUrl(null);
            } else {
                // Crear un nuevo documento
                const result = await createDocument({
                    fileName: finalName,
                    content: contentToSave,
                    workspaceId,
                    parentId: currentFolderId || undefined,
                    tags: editorTags,
                    access: ['All'],
                });
                // También actualizar el estado local para compatibilidad con el sistema actual
                const newDoc: MockFile = {
                    //@ts-ignore
                    id: result?.id || `file_${Date.now()}_${Math.random()}`,
                    parentId: currentFolderId,
                    name: finalName,
                    type: 'MS Word File',
                    icon: finalName,
                    lastModified: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', 'year': 'numeric' }),
                    modifiedBy: "me",
                    tags: editorTags,
                    access: "All",
                    isDeleted: false,
                };
                setFiles(prevFiles => [newDoc, ...prevFiles]);
                showSuccessToast(`Document "${finalName}" was created and uploaded.`);
            }
            // Marcar que necesitamos refrescar la lista de archivos
            if (typeof window !== 'undefined') {
                localStorage.setItem('filesNeedRefresh', 'true');
            }
            router.push('/files'); // Navegar de vuelta a files
        } catch (error) {
            console.error('Error saving document:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error saving document';
            showErrorToast(errorMessage);
        }
    }, [editorFileName, workspaceId, editorContent, editorTags, editingFileId, updateDocument, createDocument, currentFolderId, setFiles, router, setEditingFileId, setEditingFileUrl, initialContent]);
    
    const handleCancelCreateDoc = useCallback(() => {
        router.push('/files'); // Navegar de vuelta a files
    }, [router]);

    const saveDocRef = useRef(handleSaveDoc);
    const cancelEditRef = useRef(handleCancelCreateDoc);

    useEffect(() => {
        saveDocRef.current = handleSaveDoc;
        cancelEditRef.current = handleCancelCreateDoc;
    }, [handleSaveDoc, handleCancelCreateDoc]);

    useEffect(() => {
        setIsEditorMode(true);
        // Solo limpiar el contenido si NO estamos editando un archivo existente
        if (!editingFileId) {
            setEditorFileName("Untitled Document");
            setEditorTags([]);
            setEditorContent("");
            setInitialContent(""); // Resetear el contenido inicial para nuevos documentos
        }
        setSaveDoc(() => () => saveDocRef.current());
        setCancelEdit(() => () => cancelEditRef.current());
    }, [setIsEditorMode, setEditorFileName, setSaveDoc, setCancelEdit, setEditorTags, setEditorContent, editingFileId]);

    if (!isClient) {
        return <DashboardLayout><div className="p-8 text-center text-gray-500">Loading Editor...</div></DashboardLayout>;
    }

    return (
        <PermissionGuard required={PERMISSIONS.VIEW_FILES}>
            <DashboardLayout>
                <DocumentEditor allFiles={files} currentFolderId={currentFolderId}
                  workspaceId={workspaceId}
                />
            </DashboardLayout>
        </PermissionGuard>
    );
}
