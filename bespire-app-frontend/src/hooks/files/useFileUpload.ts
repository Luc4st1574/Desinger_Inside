// src/hooks/files/useFileUpload.ts
import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_FILE } from '@/graphql/mutations/files/files';
import { LIST_FILES } from '@/graphql/queries/files/listFiles';
import { UploadingFile } from '@/components/modals/UploadingFilesModal';
import { uploadImageToBackend } from '@/services/imageService';

interface UploadFileParams {
  file: File;
  workspaceId: string;
  parentId?: string;
  tags?: string[];
  access?: string[];
  onProgress?: (progress: number) => void;
}

export function useFileUpload() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  
  const [createFileMutation] = useMutation(CREATE_FILE, {
    refetchQueries: [LIST_FILES],
    awaitRefetchQueries: true,
  });

  const uploadFile = useCallback(async ({
    file,
    workspaceId,
    parentId,
    tags = [],
    access = ['All'],
    onProgress,
  }: UploadFileParams) => {
    try {
      // 1. Primero subir el archivo físico a Cloudinary usando el servicio existente
      const formData = new FormData();
      formData.append('file', file);
      if (parentId) {
        formData.append('parentId', parentId);
      }
      if (tags && tags.length > 0) {
        formData.append('tags', JSON.stringify(tags));
      }
      if (access && access.length > 0) {
        formData.append('access', JSON.stringify(access));
      }
      if(workspaceId) {
        formData.append('workspaceId', workspaceId);
      }

      formData.append('status', 'linked');
      const uploadResult = await uploadImageToBackend(formData);
     // const fileUrl = uploadResult.url;

      // Simular progreso de upload
      onProgress?.(50);

      // 2. Luego crear el registro en la base de datos
    /* 
     const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      
      const createFileInput = {
        name: file.name,
        type: 'file' as const,
        url: fileUrl,
        ext: fileExtension,
        size: file.size,
        workspaceId,
        parentId: parentId || null,
        tags,
        access,
      };

      const { data } = await createFileMutation({
        variables: { input: createFileInput }
      });
    */
     

      onProgress?.(100);

      return uploadResult
    } catch (error: unknown) {
      console.error('Error uploading file:', error);
      
      // Capturar y mejorar el mensaje de error
      let errorMessage = `Error subiendo el archivo "${file.name}"`;
      
      // Type guard para error con propiedades
      const isErrorWithMessage = (e: unknown): e is { message: string } => {
        return typeof e === 'object' && e !== null && 'message' in e;
      };
      
      const isErrorWithResponse = (e: unknown): e is { response: { status: number; data?: { message?: string } } } => {
        return typeof e === 'object' && e !== null && 'response' in e;
      };
      
      const isGraphQLError = (e: unknown): e is { graphQLErrors: Array<{ message: string }> } => {
        return typeof e === 'object' && e !== null && 'graphQLErrors' in e;
      };
      
      const isNetworkError = (e: unknown): e is { name: string } => {
        return typeof e === 'object' && e !== null && 'name' in e;
      };
      
      // Si es un error de red/fetch
      if (isNetworkError(error) && (error.name === 'NetworkError' || (isErrorWithMessage(error) && error.message?.includes('fetch')))) {
        errorMessage = `Error de conexión al subir "${file.name}"`;
      }
      // Si es un error del backend con respuesta HTTP
      else if (isErrorWithResponse(error)) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          errorMessage = data?.message || `Tipo de archivo no soportado: "${file.name}"`;
        } else if (status === 413) {
          errorMessage = `El archivo "${file.name}" es demasiado grande`;
        } else if (status === 500) {
          errorMessage = data?.message || `Error del servidor al procesar "${file.name}"`;
        } else {
          errorMessage = data?.message || `Error del servidor (${status}) al subir "${file.name}"`;
        }
      }
      // Si es un error de GraphQL
      else if (isGraphQLError(error) && error.graphQLErrors?.length > 0) {
        const gqlError = error.graphQLErrors[0];
        errorMessage = gqlError.message || `Error de GraphQL al crear "${file.name}"`;
      }
      // Si es un error general con mensaje
      else if (isErrorWithMessage(error)) {
        // Verificar si es un error específico de tipo de archivo
        if (error.message.includes('not supported') || error.message.includes('no soportado')) {
          errorMessage = `Tipo de archivo no soportado: "${file.name}"`;
        } else if (error.message.includes('too large') || error.message.includes('demasiado grande')) {
          errorMessage = `El archivo "${file.name}" es demasiado grande`;
        } else {
          errorMessage = `${error.message}: "${file.name}"`;
        }
      }
      
      // Crear un error con el mensaje mejorado
      const enhancedError = new Error(errorMessage);
      Object.defineProperty(enhancedError, 'cause', { value: error, enumerable: false });
      throw enhancedError;
    }
  }, [createFileMutation]);

  const uploadMultipleFiles = useCallback(async ({
    files,
    workspaceId,
    parentId,
    tags = [],
    access = ['All'],
  }: {
    files: File[];
    workspaceId: string;
    parentId?: string;
    tags?: string[];
    access?: string[];
  }) => {
    // Inicializar el estado de archivos en upload
    const initialUploadingFiles: UploadingFile[] = files.map(file => ({
      file,
      progress: 0,
      done: false,
      error: false,
    }));
    
    setUploadingFiles(initialUploadingFiles);

    // Subir archivos uno por uno (o en paralelo si prefieres)
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        const result = await uploadFile({
          file,
          workspaceId,
          parentId,
          tags,
          access,
          onProgress: (progress) => {
            setUploadingFiles(prev => 
              prev.map((f, index) => 
                index === i ? { ...f, progress } : f
              )
            );
          },
        });

        // Marcar como completado
        setUploadingFiles(prev => 
          prev.map((f, index) => 
            index === i ? { ...f, done: true, progress: 100 } : f
          )
        );

        results.push(result);
      } catch (error) {
        // Marcar como error
        setUploadingFiles(prev => 
          prev.map((f, index) => 
            index === i ? { ...f, error: true } : f
          )
        );
        
        // Extraer el mensaje de error específico
        const errorMessage = error instanceof Error ? error.message : `Error uploading ${file.name}`;
        console.error(`Error uploading ${file.name}:`, error);
        
        // Si solo hay un archivo, propagar el error para mostrarlo en el toast
        if (files.length === 1) {
          throw new Error(errorMessage);
        }
        // Si hay múltiples archivos, almacenar el error pero continuar con el resto
        results.push({ error: errorMessage, fileName: file.name });
      }
    }

    return results;
  }, [uploadFile]);

  const removeUploadingFile = useCallback((index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearUploadingFiles = useCallback(() => {
    setUploadingFiles([]);
  }, []);

  return {
    uploadFile,
    uploadMultipleFiles,
    uploadingFiles,
    removeUploadingFile,
    clearUploadingFiles,
  };
}
