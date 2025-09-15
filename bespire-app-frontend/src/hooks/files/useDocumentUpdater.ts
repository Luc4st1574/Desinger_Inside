// src/hooks/files/useDocumentUpdater.ts
import { useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_FILE } from '@/graphql/mutations/files/files';
import { uploadImageToBackend } from '@/services/imageService';
import { convertDeltaToDocx, parseContentForDelta } from '@/utils/deltaToDocx';

interface UpdateDocumentParams {
  fileId: string;
  fileName: string;
  content: string;
  workspaceId: string;
  parentId?: string;
  tags?: string[];
}

export function useDocumentUpdater() {
  const [updateFileMutation] = useMutation(UPDATE_FILE);

  const updateDocument = useCallback(async ({
    fileId,
    fileName,
    content,
    workspaceId,
    parentId,
    tags = [],
  }: UpdateDocumentParams) => {
    console.log('Updating document with params:', {
      fileId,
      fileName,
      content,
      workspaceId,
      parentId,
      tags,
    });
    try {
      console.log('Updating document with Delta to DOCX conversion');
      
      // Parsear el contenido para obtener el Delta
      const parsedContent = parseContentForDelta(content);
      console.log('Parsed content for DOCX update:', parsedContent);
      
      let blob: Blob;
      if (parsedContent.delta) {
        // Usar Delta->DOCX con quill-to-word
        console.log('Using Delta-based conversion for update');
        blob = await convertDeltaToDocx(parsedContent.delta);
      } else {
        // Si no hay Delta, crear un documento con texto plano
        console.log('No Delta found, creating plain text document for update');
        const fallbackDelta = { ops: [{ insert: content }] };
        blob = await convertDeltaToDocx(fallbackDelta);
      }
      
      const arrayBuffer = await blob.arrayBuffer();
      const fileBuffer = new Uint8Array(arrayBuffer);
      
      // Crear un File object
      const finalFileName = fileName.endsWith('.docx') ? fileName : `${fileName}.docx`;
      const file = new File([fileBuffer], finalFileName, {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        lastModified: Date.now(),
      });

      // Subir el archivo actualizado al backend
      const formData = new FormData();
      formData.append('file', file);
      if (workspaceId) formData.append('workspaceId', workspaceId);
      if (parentId) formData.append('parentId', parentId);

      const uploadResponse = await uploadImageToBackend(formData);

      // Actualizar el archivo en la base de datos usando GraphQL
      const { data } = await updateFileMutation({
        variables: {
          fileId,
          input: {
            name: finalFileName,
            url: uploadResponse.url,
            type: 'file',
            ext: 'docx',
            size: file.size,
            workspaceId,
            parentId,
            tags,
          }
        }
      });

      return {
        success: true,
        id: data.updateFile.id,
        url: data.updateFile.url,
        fileName: finalFileName,
        message: `Document updated successfully`
      };

    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error('Failed to update document');
    }
  }, [updateFileMutation]);

  return { updateDocument };
};
