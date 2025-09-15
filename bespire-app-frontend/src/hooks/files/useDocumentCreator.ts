// src/hooks/files/useDocumentCreator.ts
import { useCallback } from 'react';
import { useFileUpload } from './useFileUpload';
import { convertDeltaToDocx, parseContentForDelta } from '@/utils/deltaToDocx';

interface CreateDocumentParams {
  fileName: string;
  content: string; // Puede ser HTML simple o JSON con delta/html
  workspaceId: string;
  parentId?: string;
  tags?: string[];
  access?: string[];
}

export function useDocumentCreator() {
  const { uploadFile } = useFileUpload();

  const createDocument = useCallback(async ({
    fileName,
    content,
    workspaceId,
    parentId,
    tags = [],
    access = ['All'],
  }: CreateDocumentParams) => {
    try {
      console.log('Creating document with Delta to DOCX conversion');
      
      // Parsear el contenido para obtener el Delta
      const parsedContent = parseContentForDelta(content);
      console.log('Parsed content for DOCX conversion:', parsedContent);
      
      let blob: Blob;
      if (parsedContent.delta) {
        // Usar Delta->DOCX con quill-to-word
        console.log('Using Delta-based conversion');
        blob = await convertDeltaToDocx(parsedContent.delta);
      } else {
        // Si no hay Delta, crear un documento con texto plano
        console.log('No Delta found, creating plain text document');
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

      // Subir usando nuestro sistema existente
      const result = await uploadFile({
        file,
        workspaceId,
        parentId,
        tags,
        access,
      });

      return result;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }, [uploadFile]);

  return { createDocument };
};
