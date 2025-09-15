// src/hooks/files/useDocumentReader.ts
import { useCallback } from 'react';
import mammoth from 'mammoth';

export function useDocumentReader() {
  const readDocxFile = useCallback(async (fileUrl: string): Promise<string> => {
    try {
      if (!fileUrl) {
        throw new Error('URL del archivo no válida');
      }

      console.log('Intentando cargar archivo desde:', fileUrl);
      
      // Descargar el archivo desde la URL con opciones adicionales
      const response = await fetch(fileUrl, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Accept': 'application/octet-stream',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error downloading file: ${response.status} ${response.statusText}`);
      }

      // Verificar que hay contenido para descargar
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      console.log('Content-Type:', contentType, 'Content-Length:', contentLength);
      
      if (contentLength && parseInt(contentLength) === 0) {
        throw new Error('El archivo descargado está vacío');
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('El contenido del archivo está vacío');
      }
      
      console.log('Archivo descargado correctamente, tamaño:', arrayBuffer.byteLength);
      
      // Convertir .docx a HTML usando mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      if (result.messages.length > 0) {
        console.warn('Mammoth conversion warnings:', result.messages);
      }
      
      return result.value; // HTML content
    } catch (error) {
      console.error('Error reading docx file:', error);
      throw new Error('No se pudo abrir el documento. Asegúrate de que sea un archivo .docx válido.');
    }
  }, []);

  const readDocxFromFile = useCallback(async (file: File): Promise<string> => {
    try {
      if (!file) {
        throw new Error('Archivo no válido');
      }
      
      console.log('Leyendo archivo:', file.name, 'Tamaño:', file.size);
      
      if (file.size === 0) {
        throw new Error('El archivo está vacío');
      }
      
      const arrayBuffer = await file.arrayBuffer();
      
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('El contenido del archivo está vacío');
      }
      
      console.log('Archivo cargado correctamente, tamaño:', arrayBuffer.byteLength);
      
      // Convertir .docx a HTML usando mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      if (result.messages.length > 0) {
        console.warn('Mammoth conversion warnings:', result.messages);
      }
      
      return result.value; // HTML content
    } catch (error) {
      console.error('Error reading docx file:', error);
      throw new Error('No se pudo abrir el documento. Asegúrate de que sea un archivo .docx válido.');
    }
  }, []);

  return {
    readDocxFile,
    readDocxFromFile,
  };
}
